import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const statusOptions = ['Çalışıyor', 'Bakımda', 'Arızalı'];
const locationOptions = [
  'Yoğun Bakım',
  'Acil Servis',
  'Ameliyathane',
  'Radyoloji',
  'Servis 1',
  'Servis 2',
];

interface DeviceFormProps {
  initial?: {
    id: number;
    name: string;
    brand: string;
    model: string;
    serial: string;
    location: string;
    status: string;
  };
  onSubmit: (data: any) => void;
  onCancel?: () => void;
}

export default function DeviceForm({ initial, onSubmit, onCancel }: DeviceFormProps) {
  const [form, setForm] = useState(
    initial || {
      name: '',
      brand: '',
      model: '',
      serial: '',
      location: '',
      status: statusOptions[0],
    }
  );
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [noteInput, setNoteInput] = useState('');
  const [docFile, setDocFile] = useState<File | null>(null);
  const [docDesc, setDocDesc] = useState('');
  const [noteLoading, setNoteLoading] = useState(false);
  const [docLoading, setDocLoading] = useState(false);

  useEffect(() => {
    if (!initial) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/devicenotes/?device=${initial.id}`)
      .then(res => res.json())
      .then(data => setNotes(data));
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/devicedocuments/?device=${initial.id}`)
      .then(res => res.json())
      .then(data => setDocuments(data));
  }, [initial]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.brand || !form.model || !form.serial || !form.location || !form.status) {
      setError('Lütfen tüm alanları doldurun.');
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800)); // Simüle submit
    setLoading(false);
    onSubmit(form);
  };

  async function handleAddNote(e: React.FormEvent) {
    e.preventDefault();
    if (!noteInput.trim() || !initial) return;
    setNoteLoading(true);
    await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/devicenotes/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ device: initial.id, note: noteInput }),
    });
    setNoteInput('');
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/devicenotes/?device=${initial.id}`);
    setNotes(await res.json());
    setNoteLoading(false);
  }

  async function handleDeleteNote(id: number) {
    if (!initial) return;
    await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/devicenotes/${id}/`, { method: 'DELETE' });
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/devicenotes/?device=${initial.id}`);
    setNotes(await res.json());
  }

  async function handleAddDoc(e: React.FormEvent) {
    e.preventDefault();
    if (!docFile) {
      alert("Lütfen bir dosya seçin.");
      return;
    }
    if (!initial || !initial.id) {
      alert("Cihaz ID'si bulunamadı! Lütfen önce cihazı kaydedin veya seçin.");
      return;
    }
    setDocLoading(true);
    const formData = new FormData();
    formData.append('device', String(initial.id));
    formData.append('file', docFile);
    formData.append('description', docDesc);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/devicedocuments/`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Belge eklenemedi!');
      }
      setDocFile(null);
      setDocDesc('');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/devicedocuments/?device=${initial.id}`);
      setDocuments(await res.json());
    } catch (error: any) {
      alert(error.message);
    }
    setDocLoading(false);
  }

  async function handleDeleteDoc(id: number) {
    if (!initial) return;
    const confirmDelete = window.confirm("Bu belgeyi silmek istediğinize emin misiniz? Bu işlem geri alınamaz.");
    if (!confirmDelete) return;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/devicedocuments/${id}/`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Belge silinemedi!');
      }
      alert('Belge başarıyla silindi.');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/devicedocuments/?device=${initial.id}`);
      setDocuments(await res.json());
    } catch (error: any) {
      alert(error.message);
    }
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="w-full max-w-lg md:max-w-2xl mx-auto space-y-6 p-4 md:p-8 rounded-2xl border border-border bg-muted/40 shadow-xl"
    >
      <h2 className="text-2xl md:text-3xl font-bold mb-6 tracking-tight text-center">Cihaz {initial ? 'Güncelle' : 'Ekle'}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="flex flex-col gap-2">
          <label className="block text-base font-semibold text-foreground">Cihaz Adı</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full rounded-xl border border-zinc-300 bg-white text-zinc-900 px-4 py-3 text-base font-semibold focus:outline-none focus:ring-2 focus:ring-accent placeholder:text-zinc-400 transition shadow-sm"
            placeholder="Örn. Defibrilatör"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="block text-base font-semibold text-foreground">Marka</label>
          <input
            name="brand"
            value={form.brand}
            onChange={handleChange}
            className="w-full rounded-xl border border-zinc-300 bg-white text-zinc-900 px-4 py-3 text-base font-semibold focus:outline-none focus:ring-2 focus:ring-accent placeholder:text-zinc-400 transition shadow-sm"
            placeholder="Örn. Philips"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="block text-base font-semibold text-foreground">Model</label>
          <input
            name="model"
            value={form.model}
            onChange={handleChange}
            className="w-full rounded-xl border border-zinc-300 bg-white text-zinc-900 px-4 py-3 text-base font-semibold focus:outline-none focus:ring-2 focus:ring-accent placeholder:text-zinc-400 transition shadow-sm"
            placeholder="Örn. HeartStart XL"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="block text-base font-semibold text-foreground">Seri No</label>
          <input
            name="serial"
            value={form.serial}
            onChange={handleChange}
            className="w-full rounded-xl border border-zinc-300 bg-white text-zinc-900 px-4 py-3 text-base font-semibold focus:outline-none focus:ring-2 focus:ring-accent placeholder:text-zinc-400 transition shadow-sm"
            placeholder="Örn. SN123456"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="block text-base font-semibold text-foreground">Bulunduğu Bölüm</label>
          <select
            name="location"
            value={form.location}
            onChange={handleChange}
            className="w-full rounded-xl border border-zinc-300 bg-white text-zinc-900 px-4 py-3 text-base font-semibold focus:outline-none focus:ring-2 focus:ring-accent placeholder:text-zinc-400 transition shadow-sm"
            required
          >
            <option value="">Bölüm seçiniz</option>
            {locationOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="block text-base font-semibold text-foreground">Durum</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full rounded-xl border border-zinc-300 bg-white text-zinc-900 px-4 py-3 text-base font-semibold focus:outline-none focus:ring-2 focus:ring-accent placeholder:text-zinc-400 transition shadow-sm"
          >
            {statusOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      </div>
      {initial && (
        <>
          <div className="mt-8">
            <h3 className="text-lg font-bold mb-2">Notlar</h3>
            <div className="flex flex-col md:flex-row gap-2 mb-2 w-full items-center">
              <input
                type="text"
                value={noteInput}
                onChange={e => setNoteInput(e.target.value)}
                className="md:w-4/5 w-full rounded border border-zinc-300 px-3 py-2 text-sm focus:ring-2 focus:ring-accent"
                placeholder="Yeni not..."
                disabled={noteLoading}
              />
              <button
                type="button"
                onClick={handleAddNote}
                className="md:w-1/5 w-full px-4 py-2 rounded bg-accent text-accent-foreground font-semibold text-sm hover:bg-accent/80 transition shadow-sm whitespace-nowrap border border-accent"
                disabled={noteLoading || !noteInput.trim()}
              >
                Ekle
              </button>
            </div>
            <ul className="space-y-1">
              {notes.map(note => (
                <li key={note.id} className="flex items-center justify-between bg-zinc-100 rounded px-3 py-2">
                  <span>{note.note}</span>
                  <button type="button" onClick={() => handleDeleteNote(note.id)} className="text-red-600 text-xs ml-2">Sil</button>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-8">
            <h3 className="text-lg font-bold mb-2">Belgeler</h3>
            <div className="flex flex-col md:flex-row gap-2 mb-2 w-full items-center">
              <input
                type="file"
                onChange={e => setDocFile(e.target.files?.[0] || null)}
                className="md:w-1/4 w-full rounded border border-zinc-300 px-3 py-2 text-sm focus:ring-2 focus:ring-accent"
                disabled={docLoading}
              />
              <input
                type="text"
                value={docDesc}
                onChange={e => setDocDesc(e.target.value)}
                className="md:w-2/4 w-full rounded border border-zinc-300 px-3 py-2 text-sm focus:ring-2 focus:ring-accent"
                placeholder="Açıklama (isteğe bağlı)"
                disabled={docLoading}
              />
              <button
                type="button"
                onClick={handleAddDoc}
                className="md:w-1/6 w-full px-4 py-2 rounded bg-accent text-accent-foreground font-semibold text-sm hover:bg-accent/80 transition shadow-sm whitespace-nowrap border border-accent"
                disabled={docLoading || !docFile}
              >
                Ekle
              </button>
            </div>
            <ul className="space-y-1">
              {documents.map(doc => (
                <li key={doc.id} className="flex items-center justify-between bg-zinc-100 rounded px-3 py-2">
                  <a href={doc.file} target="_blank" rel="noopener noreferrer" className="underline text-blue-600">{doc.description || doc.file.split('/').pop()}</a>
                  <button type="button" onClick={() => handleDeleteDoc(doc.id)} className="text-red-600 text-xs ml-2">Sil</button>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
      {error && <div className="text-red-600 text-base mt-2">{error}</div>}
      <div className="flex gap-2 mt-6 justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2 rounded-xl bg-muted text-foreground hover:bg-muted/70 transition text-base"
          >
            İptal
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="px-7 py-2 rounded-xl bg-accent text-accent-foreground font-semibold hover:bg-accent/80 transition shadow-sm disabled:opacity-60 text-base"
        >
          {loading ? 'Kaydediliyor...' : initial ? 'Güncelle' : 'Ekle'}
        </button>
      </div>
    </motion.form>
  );
} 