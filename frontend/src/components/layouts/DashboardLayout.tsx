import React from 'react';
import { Home, List, QrCode, BarChart2, Settings } from 'lucide-react';

const sidebarItems = [
  { icon: <Home size={20} />, label: 'Dashboard', href: '/dashboard' },
  { icon: <List size={20} />, label: 'Devices', href: '/devices' },
  { icon: <QrCode size={20} />, label: 'QR Codes', href: '/qr-codes' },
  { icon: <BarChart2 size={20} />, label: 'Reports', href: '/reports' },
  { icon: <Settings size={20} />, label: 'Settings', href: '/settings' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className="sticky top-0 h-screen w-20 md:w-64 flex flex-col gap-2 border-r border-border bg-muted/40 px-2 py-4 transition-all duration-300">
        <div className="flex items-center justify-center md:justify-start gap-2 px-2 mb-8">
          <span className="font-bold text-xl tracking-tight">CihazQR</span>
        </div>
        <nav className="flex flex-col gap-2">
          {sidebarItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-base font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              {item.icon}
              <span className="hidden md:inline">{item.label}</span>
            </a>
          ))}
        </nav>
        <div className="flex-1" />
        {/* Profil/ayarlar alanı eklenebilir */}
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
} 