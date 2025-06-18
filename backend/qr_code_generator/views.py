from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import HttpResponse
from devices.models import Device, Department, DeviceType
from django.template.loader import render_to_string
import qrcode
import qrcode.image.svg
import io
from weasyprint import HTML
import base64
from django.conf import settings # MEDIA_ROOT ve diğer ayarlara erişmek için
import os

# Toplu QR Kod Üretimi ve Yazdırma için API görünümü
# Frontend'den gelen device_ids listesine göre QR kodları oluşturur ve bir PDF içinde döndürür.
@api_view(['POST'])
def generate_qr_pdf(request):
    device_ids = request.data.get('device_ids', [])
    if not device_ids:
        return Response({'error': "Cihaz ID'leri sağlanmadı."}, status=400)

    devices = Device.objects.filter(id__in=device_ids)
    
    qr_codes_data = []
    for device in devices:
        # Cihaz detay sayfası için URL oluştur
        # Frontend URL yapısına göre bu linki güncelleyin.
        device_url = f"{settings.BASE_FRONTEND_URL}/devices/{device.id}" 

        # QR kodu SVG olarak hafızada oluştur
        factory = qrcode.image.svg.SvgPathImage
        qr_img = qrcode.make(device_url, image_factory=factory, box_size=10)
        
        img_buffer = io.BytesIO()
        qr_img.save(img_buffer)
        img_buffer.seek(0)
        
        # Base64 olarak kodla (HTML şablonunda gömülü resim için)
        qr_base64 = base64.b64encode(img_buffer.getvalue()).decode('utf-8')

        qr_codes_data.append({
            'qr_code_base64': qr_base64,
            'institution_name': 'Acıbadem Hastanesi', # Kurum adını buradan veya ayarlardan çekebilirsiniz.
            'device_name': device.name,
            'asset_id': device.serial if device.serial else device.id, # Demirbaş No / ID
            'department': device.department.name if device.department else 'Belirtilmemiş',
        })
        
        # QR kodu basıldı olarak işaretle
        device.qr_printed = True
        device.save()

    # HTML şablonunu render et
    # Şablon: backend/qr_code_generator/templates/qr_code_generator/qr_labels.html
    html_string = render_to_string('qr_code_generator/qr_labels.html', {'qr_codes_data': qr_codes_data})

    # PDF oluştur ve geri döndür
    pdf_file = io.BytesIO()
    HTML(string=html_string, base_url=request.build_absolute_uri()).write_pdf(pdf_file)
    pdf_file.seek(0)

    response = HttpResponse(pdf_file.getvalue(), content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="qr_codes.pdf"'
    return response

# Tüm departmanları döndüren API görünümü
# Frontend'deki filtreleme için kullanılır.
@api_view(['GET'])
def get_departments(request):
    departments = Department.objects.all().order_by('name')
    data = [{'id': dept.id, 'name': dept.name} for dept in departments]
    return Response(data)

# Tüm cihaz türlerini döndüren API görünümü
# Frontend'deki filtreleme için kullanılır.
@api_view(['GET'])
def get_device_types(request):
    device_types = DeviceType.objects.all().order_by('name')
    data = [{'id': dt.id, 'name': dt.name} for dt in device_types]
    return Response(data) 