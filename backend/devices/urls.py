from django.urls import path, include
from rest_framework_nested import routers
from .views import DeviceViewSet, DeviceNoteViewSet, DeviceDocumentViewSet, MaintenanceLogViewSet, FaultLogViewSet, CalibrationLogViewSet

router = routers.DefaultRouter()
router.register(r'devices', DeviceViewSet, basename='device')

# Nested router: /api/devices/{device_pk}/...
devices_router = routers.NestedSimpleRouter(router, r'devices', lookup='device')
devices_router.register(r'notes', DeviceNoteViewSet, basename='device-notes')
devices_router.register(r'documents', DeviceDocumentViewSet, basename='device-documents')
devices_router.register(r'maintenancelogs', MaintenanceLogViewSet, basename='device-maintenancelogs')
devices_router.register(r'faultlogs', FaultLogViewSet, basename='device-faultlogs')
devices_router.register(r'calibrationlogs', CalibrationLogViewSet, basename='device-calibrationlogs')

urlpatterns = [
    path('', include(router.urls)),
    path('', include(devices_router.urls)),
] 