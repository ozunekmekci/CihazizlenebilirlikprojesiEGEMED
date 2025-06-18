import React, { useState } from "react";

// Mock departman/konum verisi
const initialDepartments = [
  { id: 1, name: "Kardiyoloji" },
  { id: 2, name: "Yoğun Bakım" },
  { id: 3, name: "Acil" },
  { id: 4, name: "Radyoloji" },
];

export default function DepartmentListPage() {
  const [departments, setDepartments] = useState(initialDepartments);
  const [filter, setFilter] = useState("");
  const [newDep, setNewDep] = useState("");

  // Departman ekleme
  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newDep.trim()) return;
    setDepartments(deps => [...deps, { id: Date.now(), name: newDep.trim() }]);
    setNewDep("");
  }

  // Filtrelenmiş departmanlar
  const filtered = departments.filter(dep => dep.name.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 tracking-tight">Departmanlar / Konumlar</h1>
      {/* Ekleme formu */}
      <form onSubmit={handleAdd} className="flex gap-2 mb-6">
        <input className="input flex-1" placeholder="Yeni departman veya konum adı" value={newDep} onChange={e => setNewDep(e.target.value)} />
        <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">Ekle</button>
      </form>
      {/* Filtre alanı */}
      <input className="input mb-4 w-full" placeholder="Departman/konum ara..." value={filter} onChange={e => setFilter(e.target.value)} />
      {/* Departman listesi */}
      <div className="bg-white rounded-2xl shadow p-4">
        <ul className="divide-y divide-zinc-100">
          {filtered.map(dep => (
            <li key={dep.id} className="py-3 px-2 flex items-center justify-between">
              <span>{dep.name}</span>
              {/* Silme/düzenleme butonları ileride eklenebilir */}
            </li>
          ))}
          {filtered.length === 0 && <li className="py-3 text-zinc-400 text-center">Departman/konum bulunamadı.</li>}
        </ul>
      </div>
      {/* Açıklama: Bu sayfa, departman/konum yönetimi için modern ve kullanıcı dostu bir arayüz sunar. İleride silme/düzenleme, toplu işlem gibi gelişmiş özellikler eklenebilir. */}
    </div>
  );
}
// .input className için Tailwind: px-4 py-2 rounded-lg border border-zinc-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 transition 