import React from "react";
import Link from "next/link";

// Admin paneli ana layout'u. Sticky sidebar ve üst bar içerir.
// Sidebar: Navigasyon menüsü (dashboard, cihazlar, bakım, dökümanlar, kullanıcılar, ayarlar)
// Üst bar: Profil, bildirim, tema switcher
// Tasarım: Minimal, bol boşluklu, modern ve responsive
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // Sidebar menü öğeleri
  const menu = [
    { label: "Dashboard", href: "/admin", icon: "🏠" },
    { label: "Cihazlar", href: "/admin/devices", icon: "🩺" },
    { label: "Bakım & Kalibrasyon", href: "/admin/maintenance", icon: "🛠️" },
    { label: "Dökümanlar", href: "/admin/documents", icon: "📄" },
    { label: "Kullanıcılar", href: "/admin/users", icon: "👤" },
    { label: "Ayarlar", href: "/admin/settings", icon: "⚙️" },
  ];
  return (
    <div className="min-h-screen flex bg-zinc-50">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 bg-white border-r border-zinc-200 flex flex-col py-6 px-4 sticky top-0 h-screen z-20">
        <div className="text-2xl font-bold mb-8 tracking-tight">Cihaz Paneli</div>
        <nav className="flex-1 flex flex-col gap-2">
          {menu.map((item) => (
            <Link key={item.href} href={item.href} className="flex items-center gap-3 px-3 py-2 rounded-lg text-zinc-700 font-medium hover:bg-zinc-100 transition">
              <span className="text-lg">{item.icon}</span> {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto text-xs text-zinc-400">v1.0.0</div>
      </aside>
      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Üst bar */}
        <header className="h-16 flex items-center justify-between px-8 border-b border-zinc-200 bg-white sticky top-0 z-10">
          <div className="font-semibold text-zinc-700">Admin Panel</div>
          <div className="flex items-center gap-4">
            {/* Bildirim, tema switcher, profil */}
            <button className="w-9 h-9 rounded-full bg-zinc-100 flex items-center justify-center hover:bg-zinc-200 transition" title="Bildirimler">🔔</button>
            <button className="w-9 h-9 rounded-full bg-zinc-100 flex items-center justify-center hover:bg-zinc-200 transition" title="Tema">🌓</button>
            <button className="w-9 h-9 rounded-full bg-zinc-100 flex items-center justify-center hover:bg-zinc-200 transition" title="Profil">👤</button>
          </div>
        </header>
        {/* Sayfa içeriği */}
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
// Açıklama: Bu layout, admin panelinin tüm sayfalarında kullanılacak temel iskeleti sağlar. Sidebar ve üst bar sticky'dir, modern ve bol boşlukludur. 