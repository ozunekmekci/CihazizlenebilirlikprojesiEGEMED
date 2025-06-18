from django.contrib import admin
from .models import Device, DeviceNote, DeviceDocument, MaintenanceLog, FaultLog, CalibrationLog, Department, DeviceType, AuditLog

# Register your models here.
admin.site.register(Device)
admin.site.register(DeviceNote)  # Cihaz notlarını admin panelinden yönetmek için
admin.site.register(DeviceDocument)  # Cihaz belgelerini admin panelinden yönetmek için
admin.site.register(MaintenanceLog)
admin.site.register(FaultLog)
admin.site.register(CalibrationLog)
admin.site.register(Department)
admin.site.register(DeviceType)
admin.site.register(AuditLog)
