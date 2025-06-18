import React, { useState } from "react";

// Mock marka verisi
const initialBrands = [
  { id: 1, name: "GE Healthcare" },
  { id: 2, name: "Dräger" },
  { id: 3, name: "Philips" },
  { id: 4, name: "Zoll" },
];

export default function BrandListPage() {
  const [brands, setBrands] = useState(initialBrands);
  const [filter, setFilter] = useState("");
  const [newBrand, setNewBrand] = useState("");

  // Marka ekleme
  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newBrand.trim()) return;
    setBrands(brs => [...brs, { id: Date.now(), name: newBrand.trim() }]);
    setNewBrand("");
  }

  // Filtrelenmiş markalar
  const filtered = brands.filter(brand => brand.name.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 tracking-tight">Markalar</h1>
      {/* Ekleme formu */}
      <form onSubmit={handleAdd} className="flex gap-2 mb-6">
        <input className="input flex-1" placeholder="Yeni marka adı" value={newBrand} onChange={e => setNewBrand(e.target.value)} />
        <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">Ekle</button>
      </form>
      {/* Filtre alanı */}
      <input className="input mb-4 w-full" placeholder="Marka ara..." value={filter} onChange={e => setFilter(e.target.value)} />
      {/* Marka listesi */}
      <div className="bg-white rounded-2xl shadow p-4">
        <ul className="divide-y divide-zinc-100">
          {filtered.map(brand => (
            <li key={brand.id} className="py-3 px-2 flex items-center justify-between">
              <span>{brand.name}</span>
              {/* Silme/düzenleme butonları ileride eklenebilir */}
            </li>
          ))}
          {filtered.length === 0 && <li className="py-3 text-zinc-400 text-center">Marka bulunamadı.</li>}
        </ul>
      </div>
      {/* Açıklama: Bu sayfa, marka/model yönetimi için modern ve kullanıcı dostu bir arayüz sunar. İleride silme/düzenleme, toplu işlem gibi gelişmiş özellikler eklenebilir. */}
    </div>
  );
}
// .input className için Tailwind: px-4 py-2 rounded-lg border border-zinc-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 transition 