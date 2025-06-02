import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, QrCode } from 'lucide-react';
import QRCodePreview from './QRCodePreview';

interface DeviceDetailModalProps {
  open: boolean;
  onClose: () => void;
  device: {
    id: string;
    name: string;
    brand: string;
    model: string;
    serial: string;
    location: string;
    status: string;
    lastMaintenance: string;
    qrUrl: string;
    history: { date: string; type: 'Bakım' | 'Arıza'; note: string }[];
  } | null;
  onEdit?: (device: any) => void;
}

export default function DeviceDetailModal({ open, onClose, device, onEdit }: DeviceDetailModalProps) {
  if (!device) return null;
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white shadow-2xl dark:bg-zinc-100/95 rounded-2xl w-full max-w-xl p-8 relative flex flex-col gap-6"
            initial={{ scale: 0.95, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 40, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <button
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors"
              onClick={onClose}
              aria-label="Kapat"
            >
              <X size={20} />
            </button>
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex flex-col items-center gap-2 min-w-[100px]">
                <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-muted mb-2">
                  <QrCode size={32} />
                </div>
                <QRCodePreview url={device.qrUrl} size={100} />
                <a
                  href={device.qrUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 underline text-xs mt-1"
                >
                  Cihaz Sayfasını Aç
                </a>
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight mr-2">{device.name}</h2>
                  {onEdit && (
                    <button
                      className="ml-auto px-3 py-1 rounded-xl bg-accent text-accent-foreground text-xs font-semibold hover:bg-accent/80 transition shadow-sm"
                      onClick={() => onEdit(device)}
                    >
                      Düzenle
                    </button>
                  )}
                </div>
                <div className="text-base text-muted-foreground font-medium mb-1">{device.brand} {device.model}</div>
                <div className="text-sm text-muted-foreground mb-2">Seri No: <span className="font-mono">{device.serial}</span></div>
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="px-2 py-1 rounded-xl text-xs font-semibold bg-muted">{device.location}</span>
                  <span className="px-2 py-1 rounded-xl text-xs font-semibold bg-accent text-accent-foreground">{device.status}</span>
                  <span className="px-2 py-1 rounded-xl text-xs font-semibold bg-muted">Son Bakım: {device.lastMaintenance}</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3 text-lg border-b border-border pb-1">Geçmiş Bakım/Arıza Kayıtları</h3>
              <ul className="space-y-2 max-h-40 overflow-y-auto pr-2">
                {(device.history ?? []).map((h, i) => (
                  <li key={i} className="text-sm flex gap-2 items-center">
                    <span className="font-mono text-muted-foreground w-[90px]">{h.date}</span>
                    <span className={`px-2 py-0.5 rounded text-white text-xs ${h.type === 'Bakım' ? 'bg-green-500' : 'bg-red-500'}`}>{h.type}</span>
                    <span className="text-foreground">{h.note}</span>
                  </li>
                ))}
                {(!device.history || device.history.length === 0) && (
                  <li className="text-muted-foreground text-sm">Kayıt yok.</li>
                )}
              </ul>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 