from django.shortcuts import render
from rest_framework import viewsets
from .models import Device, DeviceNote, DeviceDocument, MaintenanceLog, FaultLog, CalibrationLog, Department, DeviceType, AuditLog
from .serializers import DeviceSerializer, DeviceNoteSerializer, DeviceDocumentSerializer, MaintenanceLogSerializer, FaultLogSerializer, CalibrationLogSerializer
from datetime import datetime

# Create your views here.

class DeviceViewSet(viewsets.ModelViewSet):
    queryset = Device.objects.all()
    serializer_class = DeviceSerializer

    def get_queryset(self):
        queryset = Device.objects.all()

        department_id = self.request.query_params.get('department_id')
        if department_id:
            queryset = queryset.filter(department_id=department_id)

        device_type_id = self.request.query_params.get('device_type_id')
        if device_type_id:
            queryset = queryset.filter(device_type_id=device_type_id)

        start_date_str = self.request.query_params.get('start_date')
        if start_date_str:
            start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
            queryset = queryset.filter(created_at__gte=start_date)

        end_date_str = self.request.query_params.get('end_date')
        if end_date_str:
            end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date()
            queryset = queryset.filter(created_at__lte=end_date)

        qr_printed_param = self.request.query_params.get('qr_printed')
        if qr_printed_param is not None:
            # Frontend'den gelen 'false' stringini boolean False'a çevir
            qr_printed_bool = qr_printed_param.lower() == 'true'
            queryset = queryset.filter(qr_printed=qr_printed_bool)

        return queryset.order_by('-created_at') # En yeni cihazlar üstte olsun

    def perform_update(self, serializer):
        old_instance = self.get_object()
        super().perform_update(serializer)
        new_instance = serializer.instance

        # Durum değişikliğini logla
        if old_instance.status != new_instance.status:
            AuditLog.objects.create(
                device=new_instance,
                user=self.request.user.username if self.request.user.is_authenticated else 'Anonim',
                action='Durum Güncellendi',
                detail=f"Cihaz durumu '{old_instance.status}' değerinden '{new_instance.status}' değerine güncellendi."
            )
        # Diğer önemli alan değişikliklerini de burada loglayabilirsiniz
        # Örn: if old_instance.location != new_instance.location:

class DeviceNoteViewSet(viewsets.ModelViewSet):
    serializer_class = DeviceNoteSerializer

    def get_queryset(self):
        print("DeviceNoteViewSet kwargs:", self.kwargs)  # DEBUG
        device_pk = self.kwargs.get('device_pk')
        if device_pk:
            return DeviceNote.objects.filter(device_id=device_pk)
        return DeviceNote.objects.none()

    def perform_create(self, serializer):
        device_pk = self.kwargs.get('device_pk')
        device_instance = Device.objects.get(pk=device_pk)
        serializer.save(device=device_instance)
        AuditLog.objects.create(
            device=device_instance,
            user=self.request.user.username if self.request.user.is_authenticated else 'Anonim',
            action='Not Eklendi',
            detail=f"Cihaza yeni bir not eklendi: {serializer.instance.note[:100]}..."
        )

class DeviceDocumentViewSet(viewsets.ModelViewSet):
    serializer_class = DeviceDocumentSerializer

    def get_queryset(self):
        print("DeviceDocumentViewSet kwargs:", self.kwargs)  # DEBUG
        device_pk = self.kwargs.get('device_pk')
        if device_pk:
            return DeviceDocument.objects.filter(device_id=device_pk)
        return DeviceDocument.objects.none()

    def perform_create(self, serializer):
        device_pk = self.kwargs.get('device_pk')
        device_instance = Device.objects.get(pk=device_pk)
        serializer.save(device=device_instance)
        AuditLog.objects.create(
            device=device_instance,
            user=self.request.user.username if self.request.user.is_authenticated else 'Anonim',
            action='Belge Eklendi',
            detail=f"Cihaza yeni bir belge yüklendi: {serializer.instance.description or serializer.instance.file.name}"
        )

class MaintenanceLogViewSet(viewsets.ModelViewSet):
    serializer_class = MaintenanceLogSerializer

    def get_queryset(self):
        print('MaintenanceLogViewSet kwargs:', self.kwargs)  # DEBUG: kwargs anahtarlarını görmek için
        device_pk = self.kwargs.get('device_pk')
        if device_pk:
            return MaintenanceLog.objects.filter(device_id=device_pk)
        return MaintenanceLog.objects.none()

    def perform_create(self, serializer):
        device_pk = self.kwargs.get('device_pk')
        device_instance = Device.objects.get(pk=device_pk)
        serializer.save(device=device_instance)
        AuditLog.objects.create(
            device=device_instance,
            user=self.request.user.username if self.request.user.is_authenticated else 'Anonim',
            action='Bakım Kaydı Eklendi',
            detail=f"Cihaza yeni bakım kaydı eklendi. Tarih: {serializer.instance.maintenance_date}, Açıklama: {serializer.instance.description[:100]}..."
        )

class FaultLogViewSet(viewsets.ModelViewSet):
    serializer_class = FaultLogSerializer

    def get_queryset(self):
        print('FaultLogViewSet kwargs:', self.kwargs)  # DEBUG
        device_pk = self.kwargs.get('device_pk')
        if device_pk:
            return FaultLog.objects.filter(device_id=device_pk)
        return FaultLog.objects.none()

    def perform_create(self, serializer):
        device_pk = self.kwargs.get('device_pk')
        device_instance = Device.objects.get(pk=device_pk)
        serializer.save(device=device_instance)
        AuditLog.objects.create(
            device=device_instance,
            user=self.request.user.username if self.request.user.is_authenticated else 'Anonim',
            action='Arıza Kaydı Eklendi',
            detail=f"Cihaza yeni arıza kaydı eklendi. Tarih: {serializer.instance.fault_date}, Açıklama: {serializer.instance.description[:100]}..."
        )

class CalibrationLogViewSet(viewsets.ModelViewSet):
    serializer_class = CalibrationLogSerializer

    def get_queryset(self):
        print('CalibrationLogViewSet kwargs:', self.kwargs)  # DEBUG
        device_pk = self.kwargs.get('device_pk')
        if device_pk:
            return CalibrationLog.objects.filter(device_id=device_pk)
        return CalibrationLog.objects.none()

    def perform_create(self, serializer):
        device_pk = self.kwargs.get('device_pk')
        device_instance = Device.objects.get(pk=device_pk)
        serializer.save(device=device_instance)
        AuditLog.objects.create(
            device=device_instance,
            user=self.request.user.username if self.request.user.is_authenticated else 'Anonim',
            action='Kalibrasyon Kaydı Eklendi',
            detail=f"Cihaza yeni kalibrasyon kaydı eklendi. Tarih: {serializer.instance.calibration_date}, Sonuç: {serializer.instance.result[:100]}..."
        )
