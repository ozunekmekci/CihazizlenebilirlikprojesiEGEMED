import React, { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, Search, Trash2, Pencil, Eye, Shield, AlertTriangle, Wrench, FileText, Activity } from 'lucide-react';
import DeviceDetailModal from './DeviceDetailModal';
import DeviceForm from './DeviceForm';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import { getDevice } from '../services/deviceService';
import { addMaintenanceLog } from '../services/maintenanceLogService';
import { addFaultLog } from '../services/faultLogService';
import { addCalibrationLog } from '../services/calibrationLogService';
import { getDocumentsForDevice, addDocument, deleteDocument } from '@/services/documentService';

const statusColor: Record<string, string> = {
  'Çalışıyor': 'bg-green-100 text-green-800',
  'Bakımda': 'bg-yellow-100 text-yellow-800',
  'Arızalı': 'bg-red-100 text-red-800',
};

interface DeviceTableProps {
  devices: any[];
  onEdit: (id: number, data: any) => void;
  onDelete: (id: number) => void;
}

// Cihaz tipini belirle (örnek, kendi propenden al)
type DeviceType = {
  name: string;
  brand: string;
  model: string;
  serial: string;
  location: string;
  status: string;
  last_maintenance: string;
  [key: string]: string | undefined;
};

export default function DeviceTable({ devices, onEdit, onDelete }: DeviceTableProps) {
  const [selected, setSelected] = useState<any | null>(null);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editDevice, setEditDevice] = useState<any | null>(null);
  const [query, setQuery] = useState('');
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteDevice, setDeleteDevice] = useState<any | null>(null);
  const [statusFilter, setStatusFilter] = useState('Tümü');
  const [warrantyOpen, setWarrantyOpen] = useState(false);
  const [faultOpen, setFaultOpen] = useState(false);
  const [maintenanceOpen, setMaintenanceOpen] = useState(false);
  const [calibrationOpen, setCalibrationOpen] = useState(false);
  const [documentOpen, setDocumentOpen] = useState(false);
  const [documents, setDocuments] = useState<any[]>([]);
  const [docLoading, setDocLoading] = useState(false);
  const [docError, setDocError] = useState<string | null>(null);
  const [docSuccess, setDocSuccess] = useState<string | null>(null);
  const [docFile, setDocFile] = useState<File | null>(null);
  const [docType, setDocType] = useState('');
  const [docDesc, setDocDesc] = useState('');
  const [docUploading, setDocUploading] = useState(false);
  const [docDeleteId, setDocDeleteId] = useState<number | null>(null);
  const router = useRouter();

  const statusOptions = ['Tümü', 'Çalışıyor', 'Bakımda', 'Arızalı'];

  const [editForm, setEditForm] = useState({
    name: '',
    brand: '',
    model: '',
    serial: '',
    department: '',
    category: '',
    inventoryNo: '',
    image: null as File | null,
    imagePreview: '',
    notes: '',
  });
  const [editErrors, setEditErrors] = useState<any>({});
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const departmentOptions = ['Acil Servis', 'Yoğun Bakım', 'Radyoloji', 'Ameliyathane'];
  const categoryOptions = ['Monitör', 'Ventilatör', 'Defibrilatör', 'Diğer'];

  const [maintenanceForm, setMaintenanceForm] = useState({
    date: '',
    by: '',
    actions: '',
    parts: '',
    nextDate: '',
  });
  const [maintenanceErrors, setMaintenanceErrors] = useState<any>({});
  const [maintenanceLoading, setMaintenanceLoading] = useState(false);
  const [maintenanceError, setMaintenanceError] = useState<string | null>(null);

  const [faultForm, setFaultForm] = useState({
    fault_date: new Date().toISOString().slice(0, 10),
    reported_by: '',
    description: '',
    status: 'Bildirildi',
  });
  const [faultLoading, setFaultLoading] = useState(false);
  const [faultError, setFaultError] = useState<string | null>(null);

  const [calibrationForm, setCalibrationForm] = useState({
    date: '',
    by: '',
    result: '',
    nextDate: '',
    notes: '',
  });
  const [calibrationErrors, setCalibrationErrors] = useState<any>({});
  const [calibrationLoading, setCalibrationLoading] = useState(false);
  const [calibrationError, setCalibrationError] = useState<string | null>(null);

  const [sortKey, setSortKey] = useState('location');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const initialLocation = devices.length > 0 ? devices[0].location || '' : '';
  const [filters, setFilters] = useState<{ [key: string]: string }>({
    name: '',
    brand: '',
    model: '',
    serial: '',
    location: '',
    status: '',
    last_maintenance: '',
  });

  const handleOpen = (device: any) => {
    setSelected(device);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setSelected(null);
  };
  const handleEdit = async (device: any) => {
    setEditDevice(device);
    setEditLoading(true);
    setEditError(null);
    try {
      const response = await getDevice(device.id);
      const data = response.data;
      setEditForm({
        name: data.name || '',
        brand: data.brand || '',
        model: data.model || '',
        serial: data.serial || '',
        department: data.department || '',
        category: data.category || '',
        inventoryNo: data.inventoryNo || '',
        image: null,
        imagePreview: data.imageUrl || '',
        notes: data.notes || '',
      });
    } catch (err: any) {
      setEditError('Cihaz bilgileri alınamadı.');
    } finally {
      setEditLoading(false);
      setEditErrors({});
      setEditOpen(true);
      setOpen(false);
    }
  };
  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setEditForm((prev) => ({ ...prev, image: file }));
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setEditForm((prev) => ({ ...prev, imagePreview: ev.target?.result as string }));
      reader.readAsDataURL(file);
    } else {
      setEditForm((prev) => ({ ...prev, imagePreview: '' }));
    }
  };
  const validateEditForm = () => {
    const errors: any = {};
    if (!editForm.name.trim()) errors.name = 'Cihaz adı zorunlu';
    if (!editForm.serial.trim()) errors.serial = 'Seri No zorunlu';
    return errors;
  };
  const handleEditFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateEditForm();
    setEditErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setEditLoading(true);
    setEditError(null);

    try {
      const formData = new FormData();
      formData.append('name', editForm.name);
      formData.append('brand', editForm.brand);
      formData.append('model', editForm.model);
      formData.append('serial', editForm.serial);
      formData.append('department', editForm.department);
      formData.append('category', editForm.category);
      formData.append('inventoryNo', editForm.inventoryNo);
      formData.append('notes', editForm.notes);
      if (editForm.image) {
        formData.append('image', editForm.image);
      }
      await onEdit(editDevice.id, formData);
      setEditOpen(false);
      setEditDevice(null);
    } catch (err: any) {
      setEditError('Cihaz güncellenirken bir hata oluştu.');
    } finally {
      setEditLoading(false);
    }
  };
  const handleEditCancel = () => {
    setEditOpen(false);
    setEditDevice(null);
  };
  const handleDelete = (device: any) => {
    setDeleteDevice(device);
    setDeleteOpen(true);
  };
  const handleDeleteConfirm = async () => {
    if (deleteDevice) {
      await onDelete(deleteDevice.id);
    }
    setDeleteOpen(false);
    setDeleteDevice(null);
  };
  const handleDeleteCancel = () => {
    setDeleteOpen(false);
    setDeleteDevice(null);
  };

  const handleOpenMaintenance = (device: any) => {
    setSelected(device);
    setMaintenanceForm({
      date: '',
      by: '',
      actions: '',
      parts: '',
      nextDate: '',
    });
    setMaintenanceErrors({});
    setMaintenanceOpen(true);
  };

  const handleMaintenanceFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMaintenanceForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateMaintenanceForm = () => {
    const errors: any = {};
    if (!maintenanceForm.date) errors.date = 'Bakım tarihi zorunlu';
    if (!maintenanceForm.actions.trim()) errors.actions = 'Yapılan işlemler zorunlu';
    return errors;
  };

  const handleMaintenanceFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) {
      setMaintenanceError('Cihaz seçili değil. Lütfen işlemi tekrar başlatın.');
      return;
    }
    const errors = validateMaintenanceForm();
    setMaintenanceErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setMaintenanceLoading(true);
    setMaintenanceError(null);

    try {
      const logData = {
        maintenance_date: maintenanceForm.date,
        performed_by: maintenanceForm.by,
        description: maintenanceForm.actions,
        parts_used: maintenanceForm.parts,
        next_planned_maintenance_date: maintenanceForm.nextDate,
      };
      await addMaintenanceLog(selected.id, logData);
      alert('Bakım kaydı başarıyla eklendi.');
      setMaintenanceOpen(false);
    } catch (err: any) {
      console.error('Bakım kaydı eklenirken hata:', err);
      const msg = err?.response?.data?.detail || err?.response?.data?.error || 'Bakım kaydı eklenirken bir hata oluştu.';
      setMaintenanceError(msg);
    } finally {
      setMaintenanceLoading(false);
    }
  };

  const handleView = (device: any) => {
    router.push(`/devices/${device.id}`);
  };

  const handleOpenFault = (device: any) => {
    setSelected(device);
    setFaultForm({
      fault_date: new Date().toISOString().slice(0, 10),
      reported_by: '',
      description: '',
      status: 'Bildirildi',
    });
    setFaultError(null);
    setFaultOpen(true);
  };

  const handleFaultFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFaultForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateFaultForm = () => {
    const errors: any = {};
    if (!faultForm.fault_date) errors.fault_date = 'Arıza tarihi zorunlu';
    if (!faultForm.description.trim()) errors.description = 'Açıklama zorunlu';
    return errors;
  };

  const handleFaultFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) {
      setFaultError('Cihaz seçili değil. Lütfen işlemi tekrar başlatın.');
      return;
    }
    const errors = validateFaultForm();
    setFaultError(Object.values(errors)[0] ? String(Object.values(errors)[0]) : null);
    if (Object.keys(errors).length > 0) return;
    setFaultLoading(true);
    setFaultError(null);
    try {
      await addFaultLog(selected.id, faultForm);
      alert('Arıza kaydı başarıyla eklendi.');
      setFaultOpen(false);
    } catch (err: any) {
      console.error('Arıza kaydı eklenirken hata:', err);
      const msg = err?.response?.data?.detail || err?.response?.data?.error || 'Arıza kaydı eklenirken bir hata oluştu.';
      setFaultError(msg);
    } finally {
      setFaultLoading(false);
    }
  };

  const handleOpenCalibration = (device: any) => {
    setSelected(device);
    setCalibrationForm({
      date: '',
      by: '',
      result: '',
      nextDate: '',
      notes: '',
    });
    setCalibrationErrors({});
    setCalibrationError(null);
    setCalibrationOpen(true);
  };

  const handleCalibrationFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCalibrationForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateCalibrationForm = () => {
    const errors: any = {};
    if (!calibrationForm.date) errors.date = 'Kalibrasyon tarihi zorunlu';
    if (!calibrationForm.result.trim()) errors.result = 'Sonuç zorunlu';
    return errors;
  };

  const handleCalibrationFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) {
      setCalibrationError('Cihaz seçili değil. Lütfen işlemi tekrar başlatın.');
      return;
    }
    const errors = validateCalibrationForm();
    setCalibrationErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setCalibrationLoading(true);
    setCalibrationError(null);
    try {
      const logData = {
        date: calibrationForm.date,
        by: calibrationForm.by,
        result: calibrationForm.result,
        nextDate: calibrationForm.nextDate,
        notes: calibrationForm.notes,
      };
      await addCalibrationLog(selected.id, logData);
      alert('Kalibrasyon kaydı başarıyla eklendi.');
      setCalibrationOpen(false);
    } catch (err: any) {
      setCalibrationError('Kalibrasyon kaydı eklenirken bir hata oluştu.');
    } finally {
      setCalibrationLoading(false);
    }
  };

  const handleDocUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) {
      setDocError('Cihaz seçili değil. Lütfen işlemi tekrar başlatın.');
      return;
    }
    if (!docFile || !docType) {
      setDocError('Döküman tipi ve dosya zorunludur.');
      return;
    }
    setDocUploading(true);
    setDocError(null);
    setDocSuccess(null);
    const formData = new FormData();
    formData.append('file', docFile);
    formData.append('description', docDesc);
    formData.append('device', selected.id);
    formData.append('document_type', docType);
    try {
      await addDocument(selected.id, formData);
      setDocSuccess('Döküman başarıyla yüklendi.');
      setDocFile(null); setDocType(''); setDocDesc('');
      // Listeyi güncelle
      const res = await getDocumentsForDevice(selected.id);
      setDocuments(res.data);
    } catch {
      setDocError('Döküman yüklenemedi.');
    }
    setDocUploading(false);
  };

  const handleDocDelete = async (id: number) => {
    setDocDeleteId(id);
    setDocError(null);
    setDocSuccess(null);
    try {
      await deleteDocument(id);
      setDocSuccess('Döküman silindi.');
      setDocuments(docs => docs.filter(doc => doc.id !== id));
    } catch {
      setDocError('Döküman silinemedi.');
    }
    setDocDeleteId(null);
  };

  const handleOpenDocument = (device: any) => {
    setSelected(device);
    setDocumentOpen(true);
  };

  const [sortedDevices, setSortedDevices] = useState<DeviceType[]>([]);

  // Varsayılan sıralama: lokasyon A-Z, ardından cihaz adı A-Z
  const defaultSort = (a: DeviceType, b: DeviceType) => {
    const locA = (a.location || '').toLocaleLowerCase('tr-TR');
    const locB = (b.location || '').toLocaleLowerCase('tr-TR');
    if (locA < locB) return -1;
    if (locA > locB) return 1;
    const nameA = (a.name || '').toLocaleLowerCase('tr-TR');
    const nameB = (b.name || '').toLocaleLowerCase('tr-TR');
    if (nameA < nameB) return -1;
    if (nameA > nameB) return 1;
    return 0;
  };

  // Sıralama fonksiyonu: Kullanıcı sıralama seçerse ona göre, yoksa default
  const getSortedDevices = () => {
    if (sortKey === 'location') {
      // Lokasyon sıralaması seçildiyse, cihaz adı ile ikincil sıralama
      return [...devices].sort((a, b) => {
        const locA = (a.location || '').toLocaleLowerCase('tr-TR');
        const locB = (b.location || '').toLocaleLowerCase('tr-TR');
        if (locA < locB) return sortDir === 'asc' ? -1 : 1;
        if (locA > locB) return sortDir === 'asc' ? 1 : -1;
        // Lokasyon eşitse cihaz adına bakılır
        const nameA = (a.name || '').toLocaleLowerCase('tr-TR');
        const nameB = (b.name || '').toLocaleLowerCase('tr-TR');
        if (nameA < nameB) return sortDir === 'asc' ? -1 : 1;
        if (nameA > nameB) return sortDir === 'asc' ? 1 : -1;
        return 0;
      });
    } else if (sortKey === 'name') {
      // Cihaz adı sıralaması seçildiyse, lokasyon ile ikincil sıralama
      return [...devices].sort((a, b) => {
        const nameA = (a.name || '').toLocaleLowerCase('tr-TR');
        const nameB = (b.name || '').toLocaleLowerCase('tr-TR');
        if (nameA < nameB) return sortDir === 'asc' ? -1 : 1;
        if (nameA > nameB) return sortDir === 'asc' ? 1 : -1;
        // Cihaz adı eşitse lokasyona bakılır
        const locA = (a.location || '').toLocaleLowerCase('tr-TR');
        const locB = (b.location || '').toLocaleLowerCase('tr-TR');
        if (locA < locB) return sortDir === 'asc' ? -1 : 1;
        if (locA > locB) return sortDir === 'asc' ? 1 : -1;
        return 0;
      });
    } else {
      // Diğer alanlarda tekil sıralama
      return [...devices].sort((a, b) => {
        const valA = (a[sortKey] || '').toLocaleLowerCase('tr-TR');
        const valB = (b[sortKey] || '').toLocaleLowerCase('tr-TR');
        if (valA < valB) return sortDir === 'asc' ? -1 : 1;
        if (valA > valB) return sortDir === 'asc' ? 1 : -1;
        return 0;
      });
    }
  };

  // useEffect ile ilk renderda cihazları default sıralama ile sırala
  useEffect(() => {
    setSortedDevices([...devices].sort(defaultSort));
  }, [devices]);

  // Kullanıcı sıralama seçerse güncelle
  useEffect(() => {
    setSortedDevices(getSortedDevices());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortKey, sortDir]);

  const filtered = sortedDevices.filter((device) => {
    return Object.entries(filters).every(([key, value]) => {
      if (!value) return true;
      return (device[key] || '').toLowerCase().includes(value.toLowerCase());
    });
  });

  const columns = [
    { key: 'name', label: 'Cihaz Adı' },
    { key: 'brand', label: 'Marka' },
    { key: 'model', label: 'Model' },
    { key: 'serial', label: 'Seri No' },
    { key: 'location', label: 'Lokasyon' },
    { key: 'status', label: 'Durum' },
    { key: 'last_maintenance', label: 'Son Bakım' },
  ];

  useEffect(() => {
    if (documentOpen && selected) {
      setDocLoading(true);
      setDocError(null);
      getDocumentsForDevice(selected.id)
        .then(res => setDocuments(res.data))
        .catch(() => setDocError('Dökümanlar alınamadı.'))
        .finally(() => setDocLoading(false));
    }
  }, [documentOpen, selected]);

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-muted/60">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-left font-semibold cursor-pointer select-none hover:text-blue-600"
                  onClick={() => {
                    if (sortKey === col.key) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
                    else { setSortKey(col.key); setSortDir('asc'); }
                  }}
                >
                  {col.label}
                  {sortKey === col.key && (sortDir === 'asc' ? ' ▲' : ' ▼')}
                </th>
              ))}
              <th className="px-4 py-3 text-left font-semibold text-center">İşlemler</th>
            </tr>
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-2">
                  <input
                    type="text"
                    value={filters[col.key]}
                    onChange={e => setFilters(f => ({ ...f, [col.key]: e.target.value }))}
                    placeholder={`${col.label} filtrele`}
                    className="w-full px-2 py-1 rounded border border-border bg-background text-xs"
                  />
                </th>
              ))}
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="text-center py-8 text-muted-foreground">Kriterlere uygun cihaz bulunamadı.</td>
              </tr>
            ) : (
              filtered.map((device) => (
                <tr
                  key={device.id}
                  className="hover:bg-accent/40 transition-colors"
                >
                  <td className="px-4 py-3 font-medium">{device.name}</td>
                  <td className="px-4 py-3">{device.brand}</td>
                  <td className="px-4 py-3">{device.model}</td>
                  <td className="px-4 py-3">{device.serial}</td>
                  <td className="px-4 py-3">{device.location}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-xl text-xs font-semibold ${statusColor[device.status]}`}>{device.status}</span>
                  </td>
                  <td className="px-4 py-3">{device.last_maintenance || ''}</td>
                  <td className="px-4 py-3 text-center">
                    <ActionsDropdown
                      onView={() => handleView(device)}
                      onEdit={() => handleEdit(device)}
                      onDelete={() => handleDelete(device)}
                      onWarranty={() => setWarrantyOpen(true)}
                      onFault={() => handleOpenFault(device)}
                      onMaintenance={() => handleOpenMaintenance(device)}
                      onCalibration={() => handleOpenCalibration(device)}
                      onDocument={() => handleOpenDocument(device)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <DeviceDetailModal open={open} onClose={handleClose} device={selected} onEdit={handleEdit} />
      <AnimatePresence>
        {editOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <form
              onSubmit={handleEditFormSubmit}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 flex flex-col gap-4 relative"
            >
              <button
                type="button"
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors"
                onClick={handleEditCancel}
                aria-label="Kapat"
              >
                ×
              </button>
              <h2 className="text-2xl font-bold mb-2">Cihaz Ana Bilgilerini Düzenle</h2>
              {editLoading && <div className="text-blue-600 mb-2">Yükleniyor...</div>}
              {editError && <div className="text-red-600 mb-2">{editError}</div>}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Cihaz Adı *</label>
                  <input
                    name="name"
                    value={editForm.name}
                    onChange={handleEditFormChange}
                    className="w-full rounded-lg border px-3 py-2"
                    required
                  />
                  {editErrors.name && <div className="text-red-500 text-xs mt-1">{editErrors.name}</div>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Marka</label>
                  <input
                    name="brand"
                    value={editForm.brand}
                    onChange={handleEditFormChange}
                    className="w-full rounded-lg border px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Model</label>
                  <input
                    name="model"
                    value={editForm.model}
                    onChange={handleEditFormChange}
                    className="w-full rounded-lg border px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Seri No *</label>
                  <input
                    name="serial"
                    value={editForm.serial}
                    onChange={handleEditFormChange}
                    className="w-full rounded-lg border px-3 py-2"
                    required
                  />
                  {editErrors.serial && <div className="text-red-500 text-xs mt-1">{editErrors.serial}</div>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Bulunduğu Bölüm</label>
                  <select
                    name="department"
                    value={editForm.department}
                    onChange={handleEditFormChange}
                    className="w-full rounded-lg border px-3 py-2"
                  >
                    <option value="">Seçiniz</option>
                    {departmentOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Kategori</label>
                  <select
                    name="category"
                    value={editForm.category}
                    onChange={handleEditFormChange}
                    className="w-full rounded-lg border px-3 py-2"
                  >
                    <option value="">Seçiniz</option>
                    {categoryOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Hastane Envanter No</label>
                  <input
                    name="inventoryNo"
                    value={editForm.inventoryNo}
                    onChange={handleEditFormChange}
                    className="w-full rounded-lg border px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Cihaz Görseli</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleEditImageChange}
                    className="w-full"
                  />
                  {editForm.imagePreview && (
                    <img src={editForm.imagePreview} alt="Cihaz Görseli" className="mt-2 rounded-lg border max-h-24" />
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Genel Notlar</label>
                <textarea
                  name="notes"
                  value={editForm.notes}
                  onChange={handleEditFormChange}
                  className="w-full rounded-lg border px-3 py-2 min-h-[60px]"
                />
              </div>
              <div className="flex gap-2 justify-end mt-4">
                <button
                  type="button"
                  onClick={handleEditCancel}
                  className="px-4 py-2 rounded-lg bg-muted text-foreground hover:bg-muted/70 transition"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                >
                  Güncelle
                </button>
              </div>
            </form>
          </div>
        )}
        {deleteOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-background rounded-2xl shadow-2xl w-full max-w-sm p-0 relative"
              initial={{ scale: 0.95, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 40, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className="p-6">
                <h3 className="text-lg font-bold mb-2">Cihazı Sil</h3>
                <p className="mb-4 text-muted-foreground">{deleteDevice?.name} cihazını silmek istediğinize emin misiniz?</p>
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={handleDeleteCancel}
                    className="px-4 py-2 rounded-xl bg-muted text-foreground hover:bg-muted/70 transition"
                  >
                    İptal
                  </button>
                  <button
                    onClick={handleDeleteConfirm}
                    className="px-4 py-2 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition"
                  >
                    Sil
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
        {maintenanceOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <form
              onSubmit={handleMaintenanceFormSubmit}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 flex flex-col gap-4 relative"
            >
              <button
                type="button"
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors"
                onClick={() => setMaintenanceOpen(false)}
                aria-label="Kapat"
              >
                ×
              </button>
              <h2 className="text-2xl font-bold mb-2">Bakım Kaydı Ekle</h2>
              {maintenanceLoading && <div className="text-blue-600 mb-2">Yükleniyor...</div>}
              {maintenanceError && <div className="text-red-600 mb-2">{maintenanceError}</div>}
              <div>
                <label className="block text-sm font-medium mb-1">Bakım Tarihi *</label>
                <input
                  type="date"
                  name="date"
                  value={maintenanceForm.date}
                  onChange={handleMaintenanceFormChange}
                  className="w-full rounded-lg border px-3 py-2"
                  required
                />
                {maintenanceErrors.date && <div className="text-red-500 text-xs mt-1">{maintenanceErrors.date}</div>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Bakımı Yapan Kişi/Firma</label>
                <input
                  name="by"
                  value={maintenanceForm.by}
                  onChange={handleMaintenanceFormChange}
                  className="w-full rounded-lg border px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Yapılan İşlemler *</label>
                <textarea
                  name="actions"
                  value={maintenanceForm.actions}
                  onChange={handleMaintenanceFormChange}
                  className="w-full rounded-lg border px-3 py-2 min-h-[60px]"
                  required
                />
                {maintenanceErrors.actions && <div className="text-red-500 text-xs mt-1">{maintenanceErrors.actions}</div>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Kullanılan Parçalar (Opsiyonel)</label>
                <textarea
                  name="parts"
                  value={maintenanceForm.parts}
                  onChange={handleMaintenanceFormChange}
                  className="w-full rounded-lg border px-3 py-2 min-h-[40px]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Bir Sonraki Planlı Bakım Tarihi (Opsiyonel)</label>
                <input
                  type="date"
                  name="nextDate"
                  value={maintenanceForm.nextDate}
                  onChange={handleMaintenanceFormChange}
                  className="w-full rounded-lg border px-3 py-2"
                />
              </div>
              <div className="flex gap-2 justify-end mt-4">
                <button
                  type="button"
                  onClick={() => setMaintenanceOpen(false)}
                  className="px-4 py-2 rounded-lg bg-muted text-foreground hover:bg-muted/70 transition"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                >
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        )}
        {faultOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <form
              onSubmit={handleFaultFormSubmit}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 flex flex-col gap-4 relative"
            >
              <button
                type="button"
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors"
                onClick={() => setFaultOpen(false)}
                aria-label="Kapat"
              >
                ×
              </button>
              <h2 className="text-2xl font-bold mb-2">Arıza Kaydı Ekle</h2>
              {faultLoading && <div className="text-blue-600 mb-2">Yükleniyor...</div>}
              {faultError && <div className="text-red-600 mb-2">{faultError}</div>}
              <div>
                <label className="block text-sm font-medium mb-1">Arıza Tarihi *</label>
                <input
                  type="date"
                  name="fault_date"
                  value={faultForm.fault_date}
                  onChange={handleFaultFormChange}
                  className="w-full rounded-lg border px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Bildiren Kişi/Departman</label>
                <input
                  name="reported_by"
                  value={faultForm.reported_by}
                  onChange={handleFaultFormChange}
                  className="w-full rounded-lg border px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Açıklama *</label>
                <textarea
                  name="description"
                  value={faultForm.description}
                  onChange={handleFaultFormChange}
                  className="w-full rounded-lg border px-3 py-2 min-h-[60px]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Durum</label>
                <select
                  name="status"
                  value={faultForm.status}
                  onChange={handleFaultFormChange}
                  className="w-full rounded-lg border px-3 py-2"
                >
                  <option value="Bildirildi">Bildirildi</option>
                  <option value="İnceleniyor">İnceleniyor</option>
                  <option value="Çözüldü">Çözüldü</option>
                </select>
              </div>
              <div className="flex gap-2 justify-end mt-4">
                <button
                  type="button"
                  onClick={() => setFaultOpen(false)}
                  className="px-4 py-2 rounded-lg bg-muted text-foreground hover:bg-muted/70 transition"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition"
                >
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        )}
        {calibrationOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <form
              onSubmit={handleCalibrationFormSubmit}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 flex flex-col gap-4 relative"
            >
              <button
                type="button"
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors"
                onClick={() => setCalibrationOpen(false)}
                aria-label="Kapat"
              >
                ×
              </button>
              <h2 className="text-2xl font-bold mb-2">Kalibrasyon Kaydı Ekle</h2>
              {calibrationLoading && <div className="text-blue-600 mb-2">Yükleniyor...</div>}
              {calibrationError && <div className="text-red-600 mb-2">{calibrationError}</div>}
              <div>
                <label className="block text-sm font-medium mb-1">Kalibrasyon Tarihi *</label>
                <input
                  type="date"
                  name="date"
                  value={calibrationForm.date}
                  onChange={handleCalibrationFormChange}
                  className="w-full rounded-lg border px-3 py-2"
                  required
                />
                {calibrationErrors.date && <div className="text-red-500 text-xs mt-1">{calibrationErrors.date}</div>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Kalibrasyonu Yapan Kişi/Firma</label>
                <input
                  name="by"
                  value={calibrationForm.by}
                  onChange={handleCalibrationFormChange}
                  className="w-full rounded-lg border px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Sonuç *</label>
                <textarea
                  name="result"
                  value={calibrationForm.result}
                  onChange={handleCalibrationFormChange}
                  className="w-full rounded-lg border px-3 py-2 min-h-[60px]"
                  required
                />
                {calibrationErrors.result && <div className="text-red-500 text-xs mt-1">{calibrationErrors.result}</div>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Bir Sonraki Kalibrasyon Tarihi (Opsiyonel)</label>
                <input
                  type="date"
                  name="nextDate"
                  value={calibrationForm.nextDate}
                  onChange={handleCalibrationFormChange}
                  className="w-full rounded-lg border px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Notlar (Opsiyonel)</label>
                <textarea
                  name="notes"
                  value={calibrationForm.notes}
                  onChange={handleCalibrationFormChange}
                  className="w-full rounded-lg border px-3 py-2 min-h-[40px]"
                />
              </div>
              <div className="flex gap-2 justify-end mt-4">
                <button
                  type="button"
                  onClick={() => setCalibrationOpen(false)}
                  className="px-4 py-2 rounded-lg bg-muted text-foreground hover:bg-muted/70 transition"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-teal-600 text-white font-semibold hover:bg-teal-700 transition"
                >
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        )}
      </AnimatePresence>
      {warrantyOpen && <div className="modal">Garanti Bilgisi Modal (placeholder) <button onClick={()=>setWarrantyOpen(false)}>Kapat</button></div>}
      {documentOpen && selected && (
        <div className="modal">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg mx-auto relative">
            <h2 className="text-xl font-bold mb-4">Döküman Yönetimi</h2>
            <form onSubmit={handleDocUpload} className="mb-4 space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Döküman Tipi *</label>
                <select value={docType} onChange={e => setDocType(e.target.value)} className="w-full rounded-lg border px-3 py-2" required>
                  <option value="">Seçiniz</option>
                  <option value="Kullanım Kılavuzu">Kullanım Kılavuzu</option>
                  <option value="Teknik Şartname">Teknik Şartname</option>
                  <option value="Sertifika">Sertifika</option>
                  <option value="Diğer">Diğer</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Açıklama</label>
                <input type="text" value={docDesc} onChange={e => setDocDesc(e.target.value)} className="w-full rounded-lg border px-3 py-2" placeholder="Opsiyonel" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Dosya *</label>
                <input type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" onChange={e => setDocFile(e.target.files?.[0] || null)} className="w-full" required />
              </div>
              <div className="flex gap-2 justify-end mt-2">
                <button type="button" onClick={()=>setDocumentOpen(false)} className="px-4 py-2 rounded-lg bg-muted text-foreground hover:bg-muted/70 transition">Kapat</button>
                <button type="submit" className="px-6 py-2 rounded-lg bg-teal-600 text-white font-semibold hover:bg-teal-700 transition" disabled={docUploading}>{docUploading ? 'Yükleniyor...' : 'Yükle'}</button>
              </div>
              {docError && <div className="text-red-500 text-sm mt-2">{docError}</div>}
              {docSuccess && <div className="text-green-600 text-sm mt-2">{docSuccess}</div>}
            </form>
            <h3 className="font-semibold mb-2">Mevcut Dökümanlar</h3>
            {docLoading ? (
              <div className="text-zinc-500">Yükleniyor...</div>
            ) : documents.length > 0 ? (
              <ul className="space-y-2">
                {documents.map(doc => (
                  <li key={doc.id} className="flex items-center gap-3 bg-zinc-100 rounded-lg px-3 py-2 border border-zinc-200">
                    <a href={doc.file} target="_blank" rel="noopener noreferrer" className="text-accent underline font-medium flex-1">
                      {doc.description || doc.file.split('/').pop()}
                    </a>
                    <span className="text-xs text-zinc-500">{doc.document_type}</span>
                    <span className="text-xs text-zinc-400">{new Date(doc.uploaded_at).toLocaleString()}</span>
                    <button onClick={()=>handleDocDelete(doc.id)} className="ml-2 text-red-600 hover:text-red-800 text-xs" disabled={docDeleteId===doc.id}>{docDeleteId===doc.id ? 'Siliniyor...' : 'Sil'}</button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-zinc-500">Henüz döküman yok.</div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

// DropdownPortal fonksiyonunu klasik fonksiyon olarak tanımla, children opsiyonel
function DropdownPortal({ open, anchorRef, menuRef, children }: {
  open: boolean;
  anchorRef: React.RefObject<HTMLButtonElement | null>;
  menuRef: React.RefObject<HTMLDivElement | null>;
  children?: React.ReactNode;
}) {
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  useEffect(() => {
    if (open && anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      setCoords({ top: rect.bottom + 4, left: rect.right - 180 });
    }
  }, [open, anchorRef]);
  if (!open) return null;
  return createPortal(
    <div
      ref={menuRef}
      style={{
        position: 'fixed',
        top: coords.top,
        left: coords.left,
        zIndex: 1000,
        width: 180,
      }}
      className="origin-top-right rounded-xl bg-white shadow-lg ring-1 ring-black/5 focus:outline-none animate-fade-in"
    >
      {children}
    </div>,
    document.body
  );
}

function ActionsDropdown({
  onView, onEdit, onDelete,
  onWarranty, onFault, onMaintenance, onCalibration, onDocument
}: {
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onWarranty: () => void;
  onFault: () => void;
  onMaintenance: () => void;
  onCalibration: () => void;
  onDocument: () => void;
}) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        btnRef.current &&
        !btnRef.current.contains(e.target as Node) &&
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const actions = [
    { label: 'Görüntüle', icon: <Eye size={18} className="mr-2" />, onClick: onView },
    { label: 'Düzenle', icon: <Pencil size={18} className="mr-2" />, onClick: onEdit },
    { label: 'Garanti Bilgisi', icon: <Shield size={18} className="mr-2" />, onClick: onWarranty },
    { label: 'Arıza Kaydı', icon: <AlertTriangle size={18} className="mr-2" />, onClick: onFault },
    { label: 'Bakım Kaydı', icon: <Wrench size={18} className="mr-2" />, onClick: onMaintenance },
    { label: 'Kalibrasyon Kaydı', icon: <Activity size={18} className="mr-2" />, onClick: onCalibration },
    { label: 'Döküman Yönetimi', icon: <FileText size={18} className="mr-2" />, onClick: onDocument },
    { label: 'Sil', icon: <Trash2 size={18} className="mr-2" />, onClick: onDelete, danger: true },
  ];

  return (
    <div className="relative inline-block text-left">
      <button
        ref={btnRef}
        className="p-2 rounded-full hover:bg-zinc-100 transition"
        onClick={() => setOpen((v) => !v)}
        aria-label="İşlemler"
      >
        <MoreHorizontal size={20} />
      </button>
      <DropdownPortal open={open} anchorRef={btnRef} menuRef={menuRef}>
        {actions.map((action) => (
          <button
            key={action.label}
            onClick={() => {
              setOpen(false);
              setTimeout(() => action.onClick(), 0);
            }}
            className={`flex items-center w-full px-4 py-2 text-sm font-medium text-left hover:bg-zinc-100 transition rounded-xl ${action.danger ? 'text-red-600 hover:bg-red-50' : 'text-zinc-700'}`}
            type="button"
          >
            {action.icon}
            {action.label}
          </button>
        ))}
      </DropdownPortal>
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.18s cubic-bezier(0.4,0,0.2,1);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
} 