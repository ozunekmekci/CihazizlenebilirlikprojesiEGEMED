import os
import django

# Django ayarlarını yükle (script backend kökünden çalıştırılmalı)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from devices.models import Device

# ---
# Bu script, lokasyon alanı boş veya '-' olan tüm cihazların lokasyonunu, department adı ile günceller.
# Kullanım: python update_device_locations.py
# ---

def main():
    updated = 0
    for device in Device.objects.all():
        dept = device.department.name if device.department else None
        if (not device.location or device.location == '-' or device.location.strip() == '') and dept and dept != '-':
            device.location = dept
            device.save()
            updated += 1
            print(f"Güncellendi: {device.name} -> {device.location}")
    print(f"Toplam güncellenen cihaz: {updated}")

if __name__ == '__main__':
    main() 