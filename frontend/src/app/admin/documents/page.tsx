import React, { useState, useRef } from "react";

// Mock döküman verisi
const initialDocuments = [
  { id: 1, name: "Kullanım Kılavuzu.pdf", device: "EKG Cihazı - Model X", uploaded: "2023-12-01" },
  { id: 2, name: "Teknik Şartname.pdf", device: "Ventilatör - Alpha", uploaded: "2023-11-20" },
  { id: 3, name: "Bakım Talimatı.pdf", device: "Monitör - Beta", uploaded: "2023-10-15" },
];

export default function DocumentListPage() {
  const [documents, setDocuments] = useState(initialDocuments);
  const [filter, setFilter] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);

  // Döküman ekleme (mock)
  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const files = fileInput.current?.files;
    if (!files || files.length === 0) return;
    const newDocs = Array.from(files).map(f => ({
      id: Date.now() + Math.random(),
      name: f.name,
      device: "-", // İleride cihaz seçimi eklenebilir
      uploaded: new Date().toISOString().slice(0, 10),
    }));
    setDocuments(docs => [...docs, ...newDocs]);
    if (fileInput.current) fileInput.current.value = "";
  }

  // Sürükle-bırak yükleme
  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;
    const newDocs = Array.from(files).map(f => ({
      id: Date.now() + Math.random(),
      name: f.name,
      device: "-",
      uploaded: new Date().toISOString().slice(0, 10),
    }));
    setDocuments(docs => [...docs, ...newDocs]);
  }

  // Filtrelenmiş dökümanlar
  const filtered = documents.filter(doc =>
    doc.name.toLowerCase().includes(filter.toLowerCase()) ||
    doc.device.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 tracking-tight">Dökümanlar</h1>
      {/* Yükleme formu */}
      <form onSubmit={handleAdd} className="flex gap-2 mb-6" onDragOver={e => e.preventDefault()} onDrop={handleDrop}>
        <input type="file" multiple ref={fileInput} className="input flex-1" />
        <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">Yükle</button>
      </form>
      <div className="text-xs text-zinc-500 mb-4">Dosyaları buraya sürükleyip bırakabilirsiniz.</div>
      {/* Filtre alanı */}
      <input className="input mb-4 w-full" placeholder="Döküman veya cihaz ara..." value={filter} onChange={e => setFilter(e.target.value)} />
      {/* Döküman listesi */}
      <div className="bg-white rounded-2xl shadow p-4 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Döküman</th>
              <th className="px-4 py-2 text-left">Cihaz</th>
              <th className="px-4 py-2 text-left">Yüklenme Tarihi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(doc => (
              <tr key={doc.id} className="border-t border-zinc-100 hover:bg-zinc-50 transition">
                <td className="px-4 py-2">{doc.name}</td>
                <td className="px-4 py-2">{doc.device}</td>
                <td className="px-4 py-2">{doc.uploaded}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={3} className="py-4 text-zinc-400 text-center">Döküman bulunamadı.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Açıklama: Bu sayfa, döküman yönetimi için modern ve kullanıcı dostu bir arayüz sunar. Sürükle-bırak yükleme, filtreleme ve tablo görünümü ile kolay yönetim sağlar. İleride cihaz ilişkilendirme, silme/düzenleme gibi gelişmiş özellikler eklenebilir. */}
    </div>
  );
}
// .input className için Tailwind: px-4 py-2 rounded-lg border border-zinc-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 transition 