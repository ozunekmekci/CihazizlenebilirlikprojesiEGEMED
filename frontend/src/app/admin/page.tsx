import React from "react";
import Link from "next/link";

// Dashboard özet verileri (mock)
const stats = [
  { label: "Toplam Cihaz", value: 128, color: "bg-blue-100 text-blue-700" },
  { label: "Aktif", value: 97, color: "bg-green-100 text-green-700" },
  { label: "Bakımda", value: 12, color: "bg-orange-100 text-orange-700" },
  { label: "Arızalı", value: 7, color: "bg-red-100 text-red-700" },
  { label: "Yaklaşan Bakımlar", value: 4, color: "bg-yellow-100 text-yellow-700" },
];

// Admin modülleri için hızlı erişim menüsü
type AdminMenuItem = { label: string; href: string; icon: string; desc: string };
const menu: AdminMenuItem[] = [
  { label: "Cihazlar", href: "/admin/devices", icon: "🩺", desc: "Tüm cihazları yönet, ekle, düzenle" },
  { label: "Kategoriler", href: "/admin/categories", icon: "🏷️", desc: "Cihaz kategorilerini yönet" },
  { label: "Markalar", href: "/admin/brands", icon: "🏢", desc: "Marka/model yönetimi" },
  { label: "Departmanlar", href: "/admin/departments", icon: "🏥", desc: "Departman ve konum yönetimi" },
  { label: "Bakım & Kalibrasyon", href: "/admin/maintenance", icon: "🛠️", desc: "Bakım ve kalibrasyon kayıtları" },
  { label: "Dökümanlar", href: "/admin/documents", icon: "📄", desc: "Döküman yükle ve yönet" },
];

export default function AdminDashboardPage() {
  return (
    <div className="max-w-5xl mx-auto">
      {/* Dashboard başlık */}
      <h1 className="text-3xl font-bold mb-6 tracking-tight">Dashboard</h1>
      {/* Özet kartlar */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-10">
        {stats.map((stat) => (
          <div key={stat.label} className={`rounded-2xl p-6 shadow-sm ${stat.color} flex flex-col items-center justify-center`}>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-sm font-medium mt-2">{stat.label}</div>
          </div>
        ))}
      </div>
      {/* Hızlı erişim menüsü */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {menu.map((item) => (
          <Link key={item.href} href={item.href} className="rounded-2xl p-6 bg-white shadow border border-zinc-100 flex flex-col gap-2 hover:bg-blue-50 transition">
            <div className="text-3xl mb-2">{item.icon}</div>
            <div className="font-semibold text-lg">{item.label}</div>
            <div className="text-zinc-500 text-sm">{item.desc}</div>
          </Link>
        ))}
      </div>
      {/* Son aktivite akışı (opsiyonel) */}
      <div className="bg-white rounded-2xl p-6 shadow border border-zinc-100">
        <div className="font-semibold text-zinc-700 mb-4">Son Aktiviteler</div>
        <ul className="space-y-2 text-sm">
          <li><span className="font-bold">Zeynep Kaya</span> yeni bir cihaz ekledi. <span className="text-zinc-400">2dk önce</span></li>
          <li><span className="font-bold">Ali Veli</span> bir cihazı bakımda olarak işaretledi. <span className="text-zinc-400">10dk önce</span></li>
          <li><span className="font-bold">Sistem</span> 3 cihaz için bakım zamanı uyarısı gönderdi. <span className="text-zinc-400">1 saat önce</span></li>
        </ul>
      </div>
    </div>
  );
}
// Açıklama: Bu sayfa, admin panelinin ana dashboard ekranıdır. Tüm modüllere hızlı erişim sağlar ve kullanıcıyı yönlendirir. 