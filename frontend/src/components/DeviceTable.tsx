import React, { useState } from 'react';
import { MoreHorizontal, Search, Trash2, Pencil } from 'lucide-react';
import DeviceDetailModal from './DeviceDetailModal';
import DeviceForm from './DeviceForm';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

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

export default function DeviceTable({ devices, onEdit, onDelete }: DeviceTableProps) {
  const [selected, setSelected] = useState<any | null>(null);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editDevice, setEditDevice] = useState<any | null>(null);
  const [query, setQuery] = useState('');
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteDevice, setDeleteDevice] = useState<any | null>(null);
  const [statusFilter, setStatusFilter] = useState('Tümü');
  const router = useRouter();

  const statusOptions = ['Tümü', 'Çalışıyor', 'Bakımda', 'Arızalı'];

  const handleOpen = (device: any) => {
    setSelected(device);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setSelected(null);
  };
  const handleEdit = (device: any) => {
    setEditDevice(device);
    setEditOpen(true);
    setOpen(false);
  };
  const handleEditSubmit = async (data: any) => {
    if (editDevice) {
      await onEdit(editDevice.id, data);
    }
    setEditOpen(false);
    setEditDevice(null);
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

  const filtered = devices.filter((device) => {
    const q = query.toLowerCase();
    const statusMatch = statusFilter === 'Tümü' || device.status === statusFilter;
    return (
      statusMatch && (
        (device.name || '').toLowerCase().includes(q) ||
        (device.brand || '').toLowerCase().includes(q) ||
        (device.model || '').toLowerCase().includes(q) ||
        (device.serial || '').toLowerCase().includes(q) ||
        (device.location || '').toLowerCase().includes(q) ||
        (device.status || '').toLowerCase().includes(q)
      )
    );
  });

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center gap-2 mb-4">
        <div className="relative w-full max-w-xs">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Search size={18} />
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cihaz adı, marka, model, lokasyon, durum..."
            className="w-full pl-10 pr-3 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent transition shadow-sm"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-border bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent transition shadow-sm text-sm max-w-[140px]"
        >
          {statusOptions.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-border bg-muted/40">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-muted/60">
              <th className="px-4 py-3 text-left font-semibold">Cihaz Adı</th>
              <th className="px-4 py-3 text-left font-semibold">Marka/Model</th>
              <th className="px-4 py-3 text-left font-semibold">Seri No</th>
              <th className="px-4 py-3 text-left font-semibold">Lokasyon</th>
              <th className="px-4 py-3 text-left font-semibold">Durum</th>
              <th className="px-4 py-3 text-left font-semibold">Son Bakım</th>
              <th className="px-4 py-3 text-left font-semibold text-center">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-muted-foreground">Kriterlere uygun cihaz bulunamadı.</td>
              </tr>
            ) : (
              filtered.map((device) => (
                <tr
                  key={device.id}
                  className="hover:bg-accent/40 transition-colors"
                >
                  <td className="px-4 py-3 font-medium">{device.name}</td>
                  <td className="px-4 py-3">{device.brand} {device.model}</td>
                  <td className="px-4 py-3">{device.serial}</td>
                  <td className="px-4 py-3">{device.location}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-xl text-xs font-semibold ${statusColor[device.status]}`}>{device.status}</span>
                  </td>
                  <td className="px-4 py-3">{device.last_maintenance || ''}</td>
                  <td className="px-4 py-3 text-center flex gap-2 justify-center">
                    <motion.button
                      whileHover={{ scale: 1.18, rotate: 6 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 rounded-full hover:bg-accent/20 hover:shadow-lg transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
                      onClick={() => router.push(`/devices/${device.id}`)}
                      title="Detayları Gör"
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <Search size={18} className="text-accent group-hover:text-accent-foreground transition-colors" />
                    </motion.button>
                    <button
                      className="p-2 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-blue-600"
                      onClick={() => handleEdit(device)}
                      title="Düzenle"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-red-600"
                      onClick={() => handleDelete(device)}
                      title="Sil"
                    >
                      <Trash2 size={18} />
                    </button>
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
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-0 relative border border-zinc-200"
              initial={{ scale: 0.95, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 40, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <button
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors"
                onClick={handleEditCancel}
                aria-label="Kapat"
              >
                ×
              </button>
              <DeviceForm initial={editDevice!} onSubmit={handleEditSubmit} onCancel={handleEditCancel} />
            </motion.div>
          </motion.div>
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
      </AnimatePresence>
    </>
  );
} 