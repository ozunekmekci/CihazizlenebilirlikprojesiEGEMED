import React from "react";

// Badge componenti: Durum, etiket veya kısa bilgi göstermek için kullanılır.
// Kullanımı: <Badge color="bg-green-500 text-white">KULLANIMA HAZIR</Badge>
export function Badge({ color = "bg-zinc-300 text-zinc-700", children, className = "" }: {
  color?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${color} ${className}`}>
      {children}
    </span>
  );
}
// Açıklama: Bu component, cihaz detay sayfasında durumları renkli ve okunaklı şekilde göstermek için kullanılır. 