from django.urls import path
from .views import generate_qr_pdf, get_departments, get_device_types

urlpatterns = [
    path('generate-pdf/', generate_qr_pdf, name='generate_qr_pdf'),
    path('departments/', get_departments, name='get_departments'),
    path('device-types/', get_device_types, name='get_device_types'),
] 