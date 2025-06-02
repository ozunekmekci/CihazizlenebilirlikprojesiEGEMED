"use client";
// Cihaz Detay Sayfası
// Bu sayfa, QR kodun yönlendirdiği ve cihazın güncel bilgilerini, notlarını ve belgelerini gösteren ana ekrandır.
// Her açılışta API'den güncel veri çeker. UI, proje kurallarına uygun olarak minimal ve modern tasarlanmıştır.

import React, { useState, useEffect, useRef, use } from 'react';
import { ArrowLeft, FileText, StickyNote } from 'lucide-react';
import Link from 'next/link';
import QRCodePreview from '@/components/QRCodePreview';

// Bu sayfa salt okunur: sadece cihaz bilgisi, notlar, belgeler ve QR kod gösterilir.
export default function DeviceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [device, setDevice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDevice() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/devices/${id}/`, { cache: 'no-store' });
        if (!res.ok) throw new Error('Cihaz bulunamadı');
        const data = await res.json();
        setDevice(data);
      } catch (err: any) {
        setError(err.message || 'Bir hata oluştu');
      }
      setLoading(false);
    }
    fetchDevice();
  }, [id]);

  if (loading) return <div className="p-8 text-center text-lg">Yükleniyor...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
  if (!device) return <div className="p-8 text-center text-red-600">Cihaz bulunamadı.</div>;

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      {/* QR Kod ve cihaz kısa özeti */}
      <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
        <div className="flex flex-col items-center gap-2">
          <QRCodePreview
            url={`${process.env.NEXT_PUBLIC_PANEL_URL || 'http://localhost:3000'}/devices/${device.id}`}
            size={160}
          />
          <h1 className="text-2xl font-bold mt-2 mb-1 text-center">{device.name}</h1>
          <p className="text-zinc-500 text-center mb-1">{device.description}</p>
        </div>
        <div className="flex-1 flex flex-col items-start">
          <div className="text-sm text-zinc-500 mb-2">Bu QR kodu cihaza yapıştırın. Okutulduğunda cihazın güncel detay sayfasına yönlendirir.</div>
        </div>
      </div>

      {/* Cihaz Temel Bilgileri */}
      <div className="bg-zinc-100/90 dark:bg-zinc-200/80 rounded-2xl p-8 shadow-lg mb-8 border border-zinc-200 text-zinc-900">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-base">
          <div><span className="font-semibold">Marka:</span> {device.brand || '-'}</div>
          <div><span className="font-semibold">Model:</span> {device.model || '-'}</div>
          <div><span className="font-semibold">Seri No:</span> {device.serial || '-'}</div>
          <div><span className="font-semibold">Konum:</span> {device.location || '-'}</div>
          <div><span className="font-semibold">Durum:</span> {device.status || '-'}</div>
          <div><span className="font-semibold">Son Bakım:</span> {device.last_maintenance || '-'}</div>
        </div>
      </div>

      {/* Notlar Bölümü */}
      <section className="mb-8">
        <h2 className="flex items-center gap-2 text-2xl font-semibold mb-4"><StickyNote size={20}/> Notlar</h2>
        {device.notes && device.notes.length > 0 ? (
          <ul className="space-y-2">
            {device.notes.map((note: any) => (
              <li key={note.id} className="bg-zinc-800/80 rounded-lg p-4 text-zinc-200 border border-zinc-700">
                <div className="text-base">{note.note}</div>
                <div className="text-xs text-zinc-400 mt-1">{new Date(note.created_at).toLocaleString()}</div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-zinc-500">Henüz not eklenmemiş.</div>
        )}
      </section>

      {/* Belgeler Bölümü */}
      <section>
        <h2 className="flex items-center gap-2 text-2xl font-semibold mb-4"><FileText size={20}/> Belgeler</h2>
        {device.documents && device.documents.length > 0 ? (
          <ul className="space-y-2">
            {device.documents.map((doc: any) => (
              <li key={doc.id} className="bg-zinc-800/80 rounded-lg p-4 flex items-center gap-4 border border-zinc-700">
                <a href={doc.file} target="_blank" rel="noopener noreferrer" className="text-accent underline font-medium">
                  {doc.description || doc.file.split('/').pop()}
                </a>
                <span className="text-xs text-zinc-400 ml-auto">{new Date(doc.uploaded_at).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-zinc-500">Henüz belge eklenmemiş.</div>
        )}
      </section>
    </div>
  );
} 