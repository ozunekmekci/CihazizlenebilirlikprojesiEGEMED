from django.db import models
import os
from django.dispatch import receiver
from django.db.models.signals import post_delete
from django.utils.text import slugify
from datetime import datetime

# Create your models here.

class Department(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
    
    # Bu model, hastanenin farklı departmanlarını veya birimlerini tanımlar.
    # Cihazlar bu departmanlara atanabilir.

class DeviceType(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
    
    # Bu model, cihazların türlerini (örn. EKG, Ventilatör) tanımlar.
    # Cihazlar bu türlere atanabilir.

class Device(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    brand = models.CharField(max_length=255, blank=True)
    model = models.CharField(max_length=255, blank=True)
    serial = models.CharField(max_length=255, blank=True)
    inventory_no = models.CharField(max_length=255, blank=True, unique=True)
    location = models.CharField(max_length=255, blank=True)
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True, related_name='devices')
    device_type = models.ForeignKey(DeviceType, on_delete=models.SET_NULL, null=True, blank=True, related_name='devices')
    status = models.CharField(max_length=50, blank=True)
    last_maintenance = models.DateField(null=True, blank=True)
    purchase_date = models.DateField(null=True, blank=True)
    warranty_end = models.DateField(null=True, blank=True)
    supplier = models.CharField(max_length=255, blank=True)
    image = models.ImageField(upload_to='device_images/', blank=True, null=True)
    qr_url = models.URLField(blank=True)
    qr_printed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.serial}) - {self.department.name if self.department else 'Yok'}"

class DeviceNote(models.Model):
    device = models.ForeignKey(Device, on_delete=models.CASCADE, related_name='notes')
    note = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Not: {self.note[:30]}... (Cihaz: {self.device.name})"

    # Bu model, cihazlara serbest formatta not eklemek için kullanılır.
    # Notlar cihaz detayında listelenir ve cihazdan silinirse notlar da silinir.

def device_document_upload_to(instance, filename):
    # Dosya adını cihaz adı, tarih ve rastgele bir ek ile oluşturur
    base, ext = os.path.splitext(filename)
    device_name = slugify(instance.device.name)
    now = datetime.now().strftime('%Y%m%d_%H%M%S')
    return f"device_documents/{device_name}_{now}{ext}"

class DeviceDocument(models.Model):
    device = models.ForeignKey(Device, on_delete=models.CASCADE, related_name='documents')
    file = models.FileField(upload_to=device_document_upload_to)
    description = models.CharField(max_length=255, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Belge: {self.file.name} (Cihaz: {self.device.name})"

    # Bu model, cihazlara belge (PDF, resim, vs.) eklemek için kullanılır.
    # Belgeler cihaz detayında listelenir ve cihazdan silinirse belgeler de silinir.

# --- Dosya silindiğinde fiziksel dosyayı da silen sinyal ---
@receiver(post_delete, sender=DeviceDocument)
def delete_file_on_document_delete(sender, instance, **kwargs):
    # Belge silindiğinde dosya da fiziksel olarak silinir
    if instance.file:
        if os.path.isfile(instance.file.path):
            os.remove(instance.file.path)

class MaintenanceLog(models.Model):
    device = models.ForeignKey(Device, on_delete=models.CASCADE, related_name='maintenance_logs')
    maintenance_date = models.DateField()
    performed_by = models.CharField(max_length=255, blank=True)
    description = models.TextField()
    parts_used = models.TextField(blank=True)
    next_planned_maintenance_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.device.name} - {self.maintenance_date}"

    # Bu model, cihazlara ait bakım kayıtlarını tutar. Her kayıt bir cihaza bağlıdır ve bakım detaylarını içerir.

class FaultLog(models.Model):
    device = models.ForeignKey(Device, on_delete=models.CASCADE, related_name='fault_logs')
    fault_date = models.DateField()
    reported_by = models.CharField(max_length=255, blank=True)
    description = models.TextField()
    status = models.CharField(max_length=50, blank=True)  # Örn: Açık, Çözüldü, Beklemede
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.device.name} - {self.fault_date} - {self.status}"

class CalibrationLog(models.Model):
    device = models.ForeignKey(Device, on_delete=models.CASCADE, related_name='calibration_logs')
    calibration_date = models.DateField()
    performed_by = models.CharField(max_length=255, blank=True)
    result = models.TextField(blank=True)
    certificate_no = models.CharField(max_length=100, blank=True)
    next_calibration_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.device.name} - {self.calibration_date}"

class AuditLog(models.Model):
    device = models.ForeignKey(Device, on_delete=models.CASCADE, related_name='audit_logs')
    user = models.CharField(max_length=255)
    action = models.CharField(max_length=255)
    detail = models.TextField(blank=True)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.date}: {self.user} {self.action} on {self.device.name}"
    
    # Bu model, cihaz üzerindeki her türlü önemli değişikliği (oluşturma, güncelleme, silme, durum değişimi) kaydeder.
    # Kimin, ne zaman, hangi değişikliği yaptığını izlemek için kullanılır.
