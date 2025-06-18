import React, { useState } from "react";

// Mock bakım/kalibrasyon verisi
const initialMaintenances = [
  { id: 1, device: "EKG Cihazı - Model X", type: "Bakım", date: "2023-12-01", by: "Teknisyen Ali Veli", note: "Periyodik filtre değişimi" },
  { id: 2, device: "Ventilatör - Alpha", type: "Kalibrasyon", date: "2023-11-20", by: "Servis", note: "Sensör kalibrasyonu" },
  { id: 3, device: "Monitör - Beta", type: "Bakım", date: "2023-10-15", by: "Teknisyen Mehmet Can", note: "Batarya değişimi" },
];

export default function MaintenanceListPage() {
  const [maintenances, setMaintenances] = useState(initialMaintenances);
  const [filter, setFilter] = useState("");
  const [newItem, setNewItem] = useState({ device: "", type: "Bakım", date: "", by: "", note: "" });

  // Bakım/kalibrasyon ekleme
  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newItem.device.trim() || !newItem.date) return;
    setMaintenances(list => [...list, { id: Date.now(), ...newItem }]);
    setNewItem({ device: "", type: "Bakım", date: "", by: "", note: "" });
  }

  // Filtrelenmiş kayıtlar
  const filtered = maintenances.filter(m =>
    m.device.toLowerCase().includes(filter.toLowerCase()) ||
    m.type.toLowerCase().includes(filter.toLowerCase()) ||
    m.by.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 tracking-tight">Bakım & Kalibrasyon</h1>
      {/* Ekleme formu */}
      <form onSubmit={handleAdd} className="flex flex-wrap gap-2 mb-6 items-end">
        <input className="input flex-1 min-w-[120px]" placeholder="Cihaz adı" value={newItem.device} onChange={e => setNewItem(i => ({ ...i, device: e.target.value }))} />
        <select className="input" value={newItem.type} onChange={e => setNewItem(i => ({ ...i, type: e.target.value }))}>
          <option>Bakım</option>
          <option>Kalibrasyon</option>
        </select>
        <input className="input" type="date" value={newItem.date} onChange={e => setNewItem(i => ({ ...i, date: e.target.value }))} />
        <input className="input flex-1 min-w-[120px]" placeholder="Yapan kişi/firma" value={newItem.by} onChange={e => setNewItem(i => ({ ...i, by: e.target.value }))} />
        <input className="input flex-1 min-w-[120px]" placeholder="Not" value={newItem.note} onChange={e => setNewItem(i => ({ ...i, note: e.target.value }))} />
        <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">Ekle</button>
      </form>
      {/* Filtre alanı */}
      <input className="input mb-4 w-full" placeholder="Cihaz, tür veya yapan kişi ara..." value={filter} onChange={e => setFilter(e.target.value)} />
      {/* Bakım/kalibrasyon listesi */}
      <div className="bg-white rounded-2xl shadow p-4 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Cihaz</th>
              <th className="px-4 py-2 text-left">Tür</th>
              <th className="px-4 py-2 text-left">Tarih</th>
              <th className="px-4 py-2 text-left">Yapan</th>
              <th className="px-4 py-2 text-left">Not</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(m => (
              <tr key={m.id} className="border-t border-zinc-100 hover:bg-zinc-50 transition">
                <td className="px-4 py-2">{m.device}</td>
                <td className="px-4 py-2">{m.type}</td>
                <td className="px-4 py-2">{m.date}</td>
                <td className="px-4 py-2">{m.by}</td>
                <td className="px-4 py-2">{m.note}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="py-4 text-zinc-400 text-center">Kayıt bulunamadı.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Açıklama: Bu sayfa, bakım & kalibrasyon yönetimi için modern ve kullanıcı dostu bir arayüz sunar. İleride takvim görünümü, silme/düzenleme gibi gelişmiş özellikler eklenebilir. */}
    </div>
  );
}
// .input className için Tailwind: px-4 py-2 rounded-lg border border-zinc-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 transition 