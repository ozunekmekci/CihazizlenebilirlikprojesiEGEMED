import React, { useState } from "react";

// Mock cihaz verisi
const mockDevices = [
  { id: 1, name: "EKG Cihazı - Model X", brand: "GE Healthcare", model: "MAC 2000", status: "KULLANIMA HAZIR", location: "Kardiyoloji, Oda 305", last_maintenance: "2023-12-01" },
  { id: 2, name: "Ventilatör - Alpha", brand: "Dräger", model: "Evita 4", status: "ARIZALI", location: "Yoğun Bakım, Oda 102", last_maintenance: "2023-11-15" },
  { id: 3, name: "Monitör - Beta", brand: "Philips", model: "IntelliVue", status: "BAKIMDA", location: "Acil, Oda 12", last_maintenance: "2023-10-20" },
  { id: 4, name: "Defibrilatör - Zeta", brand: "Zoll", model: "R Series", status: "KULLANIMDA", location: "Kardiyoloji, Oda 301", last_maintenance: "2023-09-10" },
];

// Filtreleme için durumlar
const statusOptions = ["Tümü", "KULLANIMA HAZIR", "KULLANIMDA", "BAKIMDA", "ARIZALI"];

export default function DeviceListPage() {
  // Filtre ve sıralama state'leri
  const [statusFilter, setStatusFilter] = useState("Tümü");
  const [sortKey, setSortKey] = useState("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  // Filtrelenmiş ve sıralanmış cihazlar
  const filtered = mockDevices.filter(d => statusFilter === "Tümü" || d.status === statusFilter);
  const sorted = [...filtered].sort((a, b) => {
    if (a[sortKey] < b[sortKey]) return sortDir === "asc" ? -1 : 1;
    if (a[sortKey] > b[sortKey]) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  // Sütunlar: Özelleştirilebilir (ileride kullanıcı seçebilir)
  const columns = [
    { key: "name", label: "Cihaz Adı" },
    { key: "brand", label: "Marka" },
    { key: "model", label: "Model" },
    { key: "status", label: "Durum" },
    { key: "location", label: "Konum" },
    { key: "last_maintenance", label: "Son Bakım" },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Cihazlar</h1>
        {/* Filtre */}
        <div className="flex gap-2 items-center">
          <span className="text-sm text-zinc-500">Durum:</span>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2 rounded-lg border border-zinc-200 bg-white text-sm">
            {statusOptions.map(opt => <option key={opt}>{opt}</option>)}
          </select>
        </div>
      </div>
      {/* Tablo */}
      <div className="overflow-x-auto bg-white rounded-2xl shadow border border-zinc-100">
        <table className="min-w-full text-sm">
          <thead>
            <tr>
              {columns.map(col => (
                <th key={col.key} className="px-4 py-3 text-left font-semibold text-zinc-600 cursor-pointer select-none hover:text-blue-600"
                  onClick={() => {
                    if (sortKey === col.key) setSortDir(sortDir === "asc" ? "desc" : "asc");
                    else { setSortKey(col.key); setSortDir("asc"); }
                  }}>
                  {col.label}
                  {sortKey === col.key && (sortDir === "asc" ? " ▲" : " ▼")}
                </th>
              ))}
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(device => (
              <tr key={device.id} className="border-t border-zinc-100 hover:bg-zinc-50 transition">
                {columns.map(col => (
                  <td key={col.key} className="px-4 py-3">{device[col.key]}</td>
                ))}
                <td className="px-4 py-3 text-right">
                  <button className="px-3 py-1 rounded-lg bg-blue-100 text-blue-700 font-semibold text-xs hover:bg-blue-200 transition">Düzenle</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Açıklama: Bu tablo, cihaz yönetimi için filtrelenebilir, sıralanabilir ve modern bir arayüz sunar. İleride inline editing, toplu işlem, özelleştirilebilir sütun gibi gelişmiş özellikler eklenebilir. */}
    </div>
  );
} 