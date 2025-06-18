import React from "react";

// Tabs componenti: Sekmeli yapı için ana container
// Kullanımı: <Tabs value={tab} onValueChange={setTab}> ... <Tab value="..." label="..." /> ... </Tabs>
// value: aktif sekme anahtarı, onValueChange: sekme değişince çağrılır
export function Tabs({ value, onValueChange, children, className = "" }: {
  value: string;
  onValueChange: (v: string) => void;
  children: React.ReactNode;
  className?: string;
}) {
  // Tab başlıklarını bul
  const tabs = React.Children.toArray(children).filter(
    (child: any) => child.type && child.type.displayName === "Tab"
  );
  return (
    <div className={className}>
      <div className="flex gap-2 border-b border-zinc-200 mb-4">
        {tabs.map((tab: any) => (
          <button
            key={tab.props.value}
            className={`px-4 py-2 rounded-t-lg font-medium text-sm transition-all
              ${value === tab.props.value
                ? "bg-white border-x border-t border-zinc-200 text-zinc-900 shadow-sm -mb-px"
                : "text-zinc-500 hover:text-zinc-700"}
            `}
            onClick={() => onValueChange(tab.props.value)}
            type="button"
          >
            {tab.props.label}
          </button>
        ))}
      </div>
      {/* Aktif sekmenin içeriği aşağıda gösterilir */}
      {tabs.find((tab: any) => tab.props.value === value)?.props.children}
    </div>
  );
}

// Tab componenti: Sadece Tabs içinde kullanılır
// label: Sekme başlığı, value: anahtar, children: sekme içeriği
export function Tab({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
Tab.displayName = "Tab";

// Açıklama: Bu componentler, cihaz detay sayfasında modern ve erişilebilir sekmeli yapı sağlar. 