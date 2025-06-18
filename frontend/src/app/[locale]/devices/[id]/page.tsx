"use client";
// Cihaz Detay Sayfası
// Bu sayfa, QR kodun yönlendirdiği ve cihazın güncel bilgilerini, notlarını ve belgelerini gösteren ana ekrandır.
// Her açılışta API'den güncel veri çeker. UI, proje kurallarına uygun olarak minimal ve modern tasarlanmıştır.

import React, { useState, useEffect } from 'react';
import { ArrowLeft, FileText, StickyNote, QrCode, Wrench, Phone, AlertTriangle, History, CalendarIcon } from 'lucide-react';
import Link from 'next/link';
import QRCodePreview from '@/components/QRCodePreview';
import { Tabs, Tab } from "@/components/Tabs";
import { Badge } from "@/components/Badge";
import { use } from 'react';
import { getDevice } from '@/services/deviceService';
import { getMaintenanceLogsForDevice } from '@/services/maintenanceLogService';
import { getFaultLogsForDevice } from '@/services/faultLogService';
import { getCalibrationLogsForDevice } from '@/services/calibrationLogService';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';

// Durum renkleri için yardımcı fonksiyon
const statusColor = (status: string) => {
  switch (status) {
    case "KULLANIMA HAZIR": return "bg-green-500 text-white";
    case "KULLANIMDA": return "bg-yellow-400 text-black";
    case "BAKIMDA": return "bg-orange-500 text-white";
    case "ARIZALI": return "bg-red-500 text-white";
    case "KALİBRASYON GEREKLİ": return "bg-blue-500 text-white";
    default: return "bg-zinc-300 text-zinc-700";
  }
};

// Bu sayfa salt okunur: sadece cihaz bilgisi, notlar, belgeler ve QR kod gösterilir.
export default function DeviceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // use() hook'u en üstte ve koşulsuz
  const { id } = use(params);

  // useState hook'ları her zaman aynı sırada
  const [device, setDevice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [maintenanceLogs, setMaintenanceLogs] = useState<any[]>([]); // Bakım logları
  const [faultLogs, setFaultLogs] = useState<any[]>([]); // Arıza logları
  const [calibrationLogs, setCalibrationLogs] = useState<any[]>([]); // Kalibrasyon logları
  const [calibrationLoading, setCalibrationLoading] = useState(false);
  const [calibrationError, setCalibrationError] = useState<string | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // useEffect her zaman aynı sırada ve koşulsuz
  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      setLoading(true);
      setError(null);
      setCalibrationLoading(true);
      setCalibrationError(null);
      try {
        // Cihaz bilgisi, bakım, arıza ve kalibrasyon loglarını paralel çek
        const [deviceRes, logsRes, faultRes, calibrationRes] = await Promise.all([
          getDevice(id),
          getMaintenanceLogsForDevice(id),
          getFaultLogsForDevice(id),
          getCalibrationLogsForDevice(id)
        ]);
        if (isMounted) {
          setDevice(deviceRes.data);
          setMaintenanceLogs(logsRes.data);
          setFaultLogs(faultRes.data);
          setCalibrationLogs(calibrationRes.data);
        }
      } catch (err: any) {
        setError('Cihaz veya log kayıtları alınamadı.');
      }
      if (isMounted) setLoading(false);
      setCalibrationLoading(false);
    }
    fetchData();
    return () => { isMounted = false; };
  }, [id]);

  // Sekme durumu
  const [tab, setTab] = useState("temel");

  // API çağrıları için yardımcı fonksiyon
  const refreshDeviceData = async () => {
    try {
      const [deviceRes, logsRes, faultRes, calibrationRes] = await Promise.all([
        getDevice(id),
        getMaintenanceLogsForDevice(id),
        getFaultLogsForDevice(id),
        getCalibrationLogsForDevice(id)
      ]);
      setDevice(deviceRes.data);
      setMaintenanceLogs(logsRes.data);
      setFaultLogs(faultRes.data);
      setCalibrationLogs(calibrationRes.data);
      toast.success('Cihaz verileri güncellendi.');
    } catch (err) {
      toast.error('Cihaz verileri güncellenirken hata oluştu.');
      console.error('Error refreshing device data:', err);
    }
  };

  if (loading) return <div className="p-8 text-center text-lg">Yükleniyor...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
  if (!device) return <div className="p-8 text-center text-red-600">Cihaz bulunamadı.</div>;

  return (
    <>
      <div className="container mx-auto py-8 px-4">
        {/* Üst Kısım: Cihaz görseli, adı, marka/model, seri no, durum, konum */}
        {/* Bu blok, cihazın en kritik özet bilgilerini ve görselini sunar. */}
        <div className="flex flex-col items-center gap-4 mb-8">
          {/* Cihaz Görseli */}
          {/* Yüksek kaliteli cihaz fotoğrafı, yoksa placeholder gösterilir. */}
          <div className="w-40 h-40 rounded-2xl overflow-hidden bg-zinc-200 flex items-center justify-center border border-zinc-300">
            {device.image ? (
              <img src={device.image} alt="Cihaz Görseli" className="object-cover w-full h-full" />
            ) : (
              <QrCode size={64} className="text-zinc-400" />
            )}
          </div>
          {/* Cihaz Adı */}
          <h1 className="text-2xl font-bold text-center">{device.name || "Cihaz Adı Yok"}</h1>
          {/* Marka / Model */}
          <div className="text-zinc-500 text-center text-base">{device.brand} / {device.model}</div>
          {/* Seri No ve Konum */}
          <div className="flex flex-wrap gap-4 justify-center text-sm text-zinc-600">
            <span><span className="font-semibold">Seri No:</span> {device.serial || '-'}</span>
            <span><span className="font-semibold">Konum:</span> {device.location || '-'}</span>
          </div>
          {/* Mevcut Durum: Renkli badge ile */}
          <div className="mt-2">
            <Badge color={statusColor(device.status)}>{device.status || '-'}</Badge>
          </div>
        </div>

        {/* Sekmeli Yapı: Temel Bilgiler, Bakım/Kalibrasyon, Dökümanlar, Hareket Geçmişi */}
        {/* Kullanıcı dostu, modern ve bol boşluklu bir kart yapısı ile */}
        <div className="bg-white rounded-2xl shadow-lg border border-zinc-200 mb-8">
          <Tabs value={tab} onValueChange={setTab} className="px-4 pt-4">
            <Tab value="temel" label={<span><QrCode size={16}/> Temel Bilgiler</span>} />
            <Tab value="bakim" label={<span><Wrench size={16}/> Bakım & Kalibrasyon</span>} />
            <Tab value="ariza" label={<span><AlertTriangle size={16}/> Arıza Geçmişi</span>} />
            <Tab value="dokuman" label={<span><FileText size={16}/> Dökümanlar</span>} />
            <Tab value="log" label={<span><History size={16}/> Hareket Geçmişi</span>} />
          </Tabs>
          <div className="p-6">
            {tab === "temel" && (
              // Temel Bilgiler Sekmesi
              // QR kod, envanter no, kategori, departman, satın alma, garanti, tedarikçi
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-base">
                <div><span className="font-semibold">QR Kod:</span> <QRCodePreview url={`${process.env.NEXT_PUBLIC_PANEL_URL || 'http://localhost:3000'}/devices/${device.id}`} size={64} /></div>
                <div><span className="font-semibold">Envanter No:</span> {device.inventory_no || '-'}</div>
                <div><span className="font-semibold">Kategori:</span> {device.device_type?.name || '-'}</div>
                <div><span className="font-semibold">Departman:</span> {device.department || '-'}</div>
                <div><span className="font-semibold">Satın Alma Tarihi:</span> {device.purchase_date || '-'}</div>
                <div><span className="font-semibold">Garanti Bitiş:</span> {device.warranty_end ? <span className="text-red-500 font-bold">{device.warranty_end}</span> : '-'}</div>
                <div><span className="font-semibold">Tedarikçi:</span> {device.supplier || '-'}</div>
              </div>
            )}
            {tab === "bakim" && (
              // Bakım & Kalibrasyon Sekmesi
              <div className="grid md:grid-cols-2 gap-8">
                {/* Bakım Geçmişi */}
                <div>
                  <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><Wrench size={18}/> Bakım Geçmişi</h3>
                  {maintenanceLogs.length > 0 ? (
                    <ul className="space-y-4">
                      {maintenanceLogs.sort((a, b) => new Date(b.maintenance_date).getTime() - new Date(a.maintenance_date).getTime()).map((log: any) => (
                        <li key={log.id} className="bg-zinc-100 rounded-lg p-4 border border-zinc-200">
                          <div className="flex flex-col md:flex-row md:items-center md:gap-6 gap-2">
                            <div><span className="font-semibold">Bakım Tarihi:</span> {log.maintenance_date}</div>
                            <div><span className="font-semibold">Bakımı Yapan:</span> {log.performed_by || '-'}</div>
                            <div><span className="font-semibold">Yapılan İşlemler:</span> {log.description}</div>
                            {log.parts_used && <div><span className="font-semibold">Kullanılan Parçalar:</span> {log.parts_used}</div>}
                            {log.next_planned_maintenance_date && <div><span className="font-semibold">Sonraki Planlı Bakım:</span> {log.next_planned_maintenance_date}</div>}
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-zinc-500">Bu cihaz için henüz bakım kaydı bulunmamaktadır.</div>
                  )}
                </div>
                {/* Kalibrasyon Geçmişi */}
                <div>
                  <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><History size={18}/> Kalibrasyon Geçmişi</h3>
                  {calibrationLoading ? (
                    <div className="text-zinc-500">Kalibrasyon kayıtları yükleniyor...</div>
                  ) : calibrationError ? (
                    <div className="text-red-500">Kalibrasyon kayıtları alınamadı.</div>
                  ) : calibrationLogs.length > 0 ? (
                    <ul className="space-y-4">
                      {calibrationLogs.sort((a, b) => new Date(b.calibration_date).getTime() - new Date(a.calibration_date).getTime()).map((log: any) => (
                        <li key={log.id} className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                          <div className="flex flex-col md:flex-row md:items-center md:gap-6 gap-2">
                            <div><span className="font-semibold">Kalibrasyon Tarihi:</span> {log.calibration_date}</div>
                            <div><span className="font-semibold">Yapan:</span> {log.performed_by || '-'}</div>
                            <div><span className="font-semibold">Sonuç:</span> {log.result || '-'}</div>
                            {log.certificate_no && <div><span className="font-semibold">Sertifika No:</span> {log.certificate_no}</div>}
                            {log.next_calibration_date && <div><span className="font-semibold">Sonraki Planlı Kalibrasyon:</span> {log.next_calibration_date}</div>}
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-zinc-500">Bu cihaz için henüz kalibrasyon kaydı bulunmamaktadır.</div>
                  )}
                </div>
              </div>
            )}
            {tab === "ariza" && (
              // Arıza Geçmişi Sekmesi
              <div>
                {faultLogs.length > 0 ? (
                  <ul className="space-y-4">
                    {faultLogs.sort((a, b) => new Date(b.fault_date).getTime() - new Date(a.fault_date).getTime()).map((log: any) => (
                      <li key={log.id} className="bg-red-50 rounded-lg p-4 border border-red-200">
                        <div className="flex flex-col md:flex-row md:items-center md:gap-6 gap-2">
                          <div><span className="font-semibold">Arıza Tarihi:</span> {log.fault_date}</div>
                          <div><span className="font-semibold">Bildiren:</span> {log.reported_by || '-'}</div>
                          <div><span className="font-semibold">Açıklama:</span> {log.description}</div>
                          <div><span className="font-semibold">Durum:</span> {log.status}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-zinc-500">Bu cihaz için henüz arıza kaydı bulunmamaktadır.</div>
                )}
              </div>
            )}
            {tab === "dokuman" && (
              // Dökümanlar Sekmesi
              <div>
                {device.documents && device.documents.length > 0 ? (
                  <ul className="space-y-2">
                    {device.documents.map((doc: any) => (
                      <li key={doc.id} className="bg-zinc-100 rounded-lg p-4 flex items-center gap-4 border border-zinc-200">
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
              </div>
            )}
            {tab === "log" && (
              // Hareket Geçmişi (Audit Log) Sekmesi
              <div>
                {device.audit_log && device.audit_log.length > 0 ? (
                  <ul className="space-y-2">
                    {device.audit_log.map((log: any) => (
                      <li key={log.id} className="bg-zinc-100 rounded-lg p-4 flex flex-col border border-zinc-200">
                        <div className="flex gap-2 text-sm mb-1">
                          <span className="font-semibold">{new Date(log.date).toLocaleString()}</span>
                          <span className="text-zinc-500">| {log.action}</span>
                          <span className="text-zinc-500">| {log.user}</span>
                        </div>
                        <div className="text-zinc-700 text-base">{log.detail}</div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-zinc-500">Henüz hareket kaydı yok.</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
} 