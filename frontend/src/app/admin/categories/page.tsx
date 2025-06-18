import React, { useState } from "react";

// Mock kategori verisi
const initialCategories = [
  { id: 1, name: "Görüntüleme Cihazı" },
  { id: 2, name: "Yaşam Destek Ünitesi" },
  { id: 3, name: "Monitör" },
  { id: 4, name: "Ventilatör" },
];

export default function CategoryListPage() {
  const [categories, setCategories] = useState(initialCategories);
  const [filter, setFilter] = useState("");
  const [newCat, setNewCat] = useState("");

  // Kategori ekleme
  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newCat.trim()) return;
    setCategories(cats => [...cats, { id: Date.now(), name: newCat.trim() }]);
    setNewCat("");
  }

  // Filtrelenmiş kategoriler
  const filtered = categories.filter(cat => cat.name.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 tracking-tight">Kategoriler</h1>
      {/* Ekleme formu */}
      <form onSubmit={handleAdd} className="flex gap-2 mb-6">
        <input className="input flex-1" placeholder="Yeni kategori adı" value={newCat} onChange={e => setNewCat(e.target.value)} />
        <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">Ekle</button>
      </form>
      {/* Filtre alanı */}
      <input className="input mb-4 w-full" placeholder="Kategori ara..." value={filter} onChange={e => setFilter(e.target.value)} />
      {/* Kategori listesi */}
      <div className="bg-white rounded-2xl shadow p-4">
        <ul className="divide-y divide-zinc-100">
          {filtered.map(cat => (
            <li key={cat.id} className="py-3 px-2 flex items-center justify-between">
              <span>{cat.name}</span>
              {/* Silme/düzenleme butonları ileride eklenebilir */}
            </li>
          ))}
          {filtered.length === 0 && <li className="py-3 text-zinc-400 text-center">Kategori bulunamadı.</li>}
        </ul>
      </div>
      {/* Açıklama: Bu sayfa, kategori yönetimi için modern ve kullanıcı dostu bir arayüz sunar. İleride silme/düzenleme, toplu işlem gibi gelişmiş özellikler eklenebilir. */}
    </div>
  );
}
// .input className için Tailwind: px-4 py-2 rounded-lg border border-zinc-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 transition 