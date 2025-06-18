import csv
import os
import django
from datetime import datetime
import random
import string

# Django ayarlarını yükle (script backend kökünden çalıştırılmalı)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from devices.models import Device, Department, CalibrationLog

# ---
# Bu script, envanter.csv dosyasındaki cihazları toplu olarak veritabanına ekler.
# Önce tüm eski cihazları siler, sonra CSV'deki cihazları ekler.
# Eksik alanları '-' ile doldurur, department yoksa otomatik oluşturur.
# Her cihaz için CalibrationLog da ekler.
# Kullanım: python import_envanter.py
# ---

CSV_PATH = os.path.join(os.path.dirname(__file__), 'envanter.csv')

def get_or_create_department(dept_name):
    if not dept_name or dept_name.strip() == '':
        dept_name = '-'
    dept, _ = Department.objects.get_or_create(name=dept_name)
    return dept

def parse_date(date_str):
    # Tarih formatı: '11/2024' gibi ise ay/yıl, '2024-11-01' gibi ise yıl-ay-gün
    if not date_str or date_str.strip() == '':
        return None
    for fmt in ('%m/%Y', '%Y-%m-%d', '%d/%m/%Y'):
        try:
            return datetime.strptime(date_str, fmt).date()
        except ValueError:
            continue
    return None

def generate_inventory_no(serial, department, row_idx):
    # Benzersiz inventory_no üretir. İleride formatı değiştirmek kolay olsun diye fonksiyonlaştırıldı.
    serial_part = serial if serial and serial != '-' else ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
    dept_part = department.replace(' ', '_') if department else '-'
    return f"{serial_part}_{dept_part}_{row_idx}"

def main():
    # --- Tüm eski cihazları sil ---
    Device.objects.all().delete()
    print('Tüm eski cihazlar silindi.')

    with open(CSV_PATH, encoding='utf-8') as f:
        reader = csv.DictReader(f, delimiter=';')
        for idx, row in enumerate(reader):
            # Alanları eşleştir ve eksikleri '-' yap
            name = row.get('name', '-') or '-'
            # Eğer cihaz adı boş veya '-' ise, bu satırı atla (veri kalitesi için)
            if not name or name.strip() == '-' or name.strip() == '':
                continue
            brand = row.get('brand', '-') or '-'
            model = row.get('model', '-') or '-'
            serial = row.get('serial_number', '-') or '-'
            department_name = row.get('department', '-') or '-'
            kurum = row.get('KURUM', '-') or '-'
            kurum_kodu = row.get('KURUM KODU', '-') or '-'
            kalibrasyon_no = row.get('kalibrasyon_sertifika_numarası', '-') or '-'
            kalibrasyon_tarihi = row.get('Kalibrasyon Tarihi', '-') or '-'

            # Department FK
            department = get_or_create_department(department_name)

            # Benzersiz inventory_no üret
            inventory_no = generate_inventory_no(serial, department_name, idx)

            # Eğer location alanı boşsa, department bilgisini lokasyon olarak kullan
            location = department_name if department_name and department_name != '-' else '-'

            # Cihazı oluştur
            device = Device.objects.create(
                name=name,
                brand=brand,
                model=model,
                serial=serial,
                department=department,
                inventory_no=inventory_no,
                description=f'Kurum: {kurum} / Kod: {kurum_kodu}',
                location=location,
                device_type=None,
                status='-',
                last_maintenance=None,
                purchase_date=None,
                warranty_end=None,
                supplier='-',
                image=None,
                qr_url='',
                qr_printed=False,
            )
            # Her cihaz için CalibrationLog ekle
            if kalibrasyon_tarihi != '-' or kalibrasyon_no != '-':
                CalibrationLog.objects.create(
                    device=device,
                    calibration_date=parse_date(kalibrasyon_tarihi) or datetime.now().date(),
                    performed_by='-',
                    result='-',
                    certificate_no=kalibrasyon_no,
                    next_calibration_date=None
                )
            print(f"{device.name} ({device.serial}) eklendi. | Inventory No: {inventory_no}")

if __name__ == '__main__':
    main() 