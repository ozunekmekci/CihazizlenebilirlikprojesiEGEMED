"use client";
import React, { useEffect, useState } from 'react';
import { fetchDevices } from '@/libs/api';

function StatCard({ title, value, accent }: { title: string; value: string; accent?: string }) {
  return (
    <div className={`rounded-2xl bg-muted/60 p-6 shadow-sm flex flex-col gap-2 border border-border min-w-[180px] ${accent ?? ''}`}>
      <span className="text-lg font-semibold text-muted-foreground">{title}</span>
      <span className="text-3xl font-bold tracking-tight">{value}</span>
    </div>
  );
}

export default function DashboardPage() {
  const [devices, setDevices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDevices()
      .then((data) => {
        setDevices(data);
        setError(null);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const total = devices.length;
  const arizali = devices.filter((d) => d.status === 'Arızalı').length;
  const bakimda = devices.filter((d) => d.status === 'Bakımda').length;

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-lg">Cihaz envanterinizin genel durumu ve hızlı aksiyonlar</p>
      </div>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {loading ? (
        <div>Yükleniyor...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard title="Toplam Cihaz" value={total.toString()} />
          <StatCard title="Arızalı" value={arizali.toString()} accent="bg-red-100 dark:bg-red-900/30" />
          <StatCard title="Bakımda" value={bakimda.toString()} accent="bg-yellow-100 dark:bg-yellow-900/30" />
        </div>
      )}
      {/* Buraya istatistik grafikleri ve hızlı aksiyonlar eklenecek */}
    </>
  );
} 