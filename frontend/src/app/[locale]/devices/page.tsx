'use client';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import DeviceTable from '@/components/DeviceTable';
import DeviceForm from '@/components/DeviceForm';
import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { fetchDevices, createDevice, updateDevice, deleteDevice } from '@/libs/api';

export default function DevicesPage() {
  const [open, setOpen] = useState(false);
  const [devices, setDevices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDevices = async () => {
    setLoading(true);
    try {
      const data = await fetchDevices();
      setDevices(data);
      setError(null);
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadDevices();
  }, []);

  const handleAdd = async (data: any) => {
    try {
      await createDevice(data);
      await loadDevices();
      setOpen(false);
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleEdit = async (id: number, data: any) => {
    try {
      await updateDevice(id, data);
      await loadDevices();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteDevice(id);
      await loadDevices();
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">Cihazlar</h1>
          <p className="text-muted-foreground text-lg">Tüm envanter cihazlarınızı görüntüleyin, arayın ve yönetin.</p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-accent-foreground font-semibold hover:bg-accent/80 transition shadow-sm"
        >
          <Plus size={18} /> Cihaz Ekle
        </button>
      </div>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {loading ? (
        <div>Yükleniyor...</div>
      ) : (
        <DeviceTable devices={devices} onEdit={handleEdit} onDelete={handleDelete} />
      )}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white shadow-2xl dark:bg-zinc-100/95 rounded-2xl w-full max-w-lg p-0 relative"
              initial={{ scale: 0.95, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 40, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <button
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors"
                onClick={() => setOpen(false)}
                aria-label="Kapat"
              >
                ×
              </button>
              <DeviceForm onSubmit={handleAdd} onCancel={() => setOpen(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
} 