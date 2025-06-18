from rest_framework import serializers
from .models import Device, DeviceNote, DeviceDocument, MaintenanceLog, FaultLog, CalibrationLog, Department, DeviceType, AuditLog

class DeviceNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeviceNote
        fields = ['id', 'device', 'note', 'created_at']
        # Bu serializer, cihaz notlarını API'de göstermek için kullanılır.

class DeviceDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeviceDocument
        fields = ['id', 'device', 'file', 'description', 'uploaded_at']
        # device alanı eklendi! Böylece belge eklerken cihaz id'si de işlenir ve NOT NULL hatası alınmaz.

class MaintenanceLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = MaintenanceLog
        fields = '__all__'
        read_only_fields = ('device',)

# Bu dosyada cihaz logları için serializer'lar tanımlanır. device alanı sadece backend tarafından atanır, dışarıdan değiştirilemez.
# Bu, güvenlik ve tutarlılık için önerilir.
class FaultLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = FaultLog
        fields = '__all__'
        read_only_fields = ('device',)

class CalibrationLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = CalibrationLog
        fields = '__all__'
        read_only_fields = ('device',)

class AuditLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuditLog
        fields = '__all__'
        read_only_fields = ('device',)

class DeviceSerializer(serializers.ModelSerializer):
    notes = DeviceNoteSerializer(many=True, read_only=True)
    documents = DeviceDocumentSerializer(many=True, read_only=True)
    maintenance_logs = MaintenanceLogSerializer(many=True, read_only=True)
    fault_logs = FaultLogSerializer(many=True, read_only=True)
    calibration_logs = CalibrationLogSerializer(many=True, read_only=True)
    audit_logs = AuditLogSerializer(many=True, read_only=True)
    department = serializers.CharField(source='department.name', read_only=True)
    device_type = serializers.CharField(source='device_type.name', read_only=True)
    class Meta:
        model = Device
        fields = '__all__'
        # notes ve documents alanları, cihaz detayında ilişkili not ve belgeleri göstermek için eklendi. 