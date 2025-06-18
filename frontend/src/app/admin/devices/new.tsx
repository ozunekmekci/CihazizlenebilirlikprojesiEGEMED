import React, { useState } from "react";

// Adım adım cihaz ekleme formu (wizard)
// Her adımda ilgili alanlar gösterilir, ileri/geri ile geçiş yapılır
const steps = [
  { label: "Temel Bilgiler" },
  { label: "Konum & Kategori" },
  { label: "Garanti & Tedarikçi" },
  { label: "Döküman Yükle" },
  { label: "Onayla" },
];

export default function DeviceNewPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: "",
    brand: "",
    model: "",
    serial: "",
    status: "KULLANIMA HAZIR",
    location: "",
    category: "",
    department: "",
    purchase_date: "",
    warranty_end: "",
    supplier: "",
    documents: [] as File[],
  });
  const [submitted, setSubmitted] = useState(false);

  // Form alanı güncelleme
  function updateField(key: string, value: any) {
    setForm(f => ({ ...f, [key]: value }));
  }

  // Mock submit
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setStep(0), 2000);
  }

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 tracking-tight">Yeni Cihaz Ekle</h1>
      {/* Adım göstergesi */}
      <div className="flex gap-2 mb-8">
        {steps.map((s, i) => (
          <div key={s.label} className={`flex-1 h-2 rounded-full ${i <= step ? "bg-blue-600" : "bg-zinc-200"}`}></div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow p-8 flex flex-col gap-6">
        {/* Adım 1: Temel Bilgiler */}
        {step === 0 && (
          <>
            <div className="flex flex-col gap-4">
              <input className="input" placeholder="Cihaz Adı" value={form.name} onChange={e => updateField("name", e.target.value)} required />
              <input className="input" placeholder="Marka" value={form.brand} onChange={e => updateField("brand", e.target.value)} required />
              <input className="input" placeholder="Model" value={form.model} onChange={e => updateField("model", e.target.value)} required />
              <input className="input" placeholder="Seri No" value={form.serial} onChange={e => updateField("serial", e.target.value)} required />
              <select className="input" value={form.status} onChange={e => updateField("status", e.target.value)}>
                <option>KULLANIMA HAZIR</option>
                <option>KULLANIMDA</option>
                <option>BAKIMDA</option>
                <option>ARIZALI</option>
              </select>
            </div>
          </>
        )}
        {/* Adım 2: Konum & Kategori */}
        {step === 1 && (
          <>
            <div className="flex flex-col gap-4">
              <input className="input" placeholder="Konum (ör: Kardiyoloji, Oda 305)" value={form.location} onChange={e => updateField("location", e.target.value)} required />
              <input className="input" placeholder="Kategori (ör: Görüntüleme Cihazı)" value={form.category} onChange={e => updateField("category", e.target.value)} required />
              <input className="input" placeholder="Departman" value={form.department} onChange={e => updateField("department", e.target.value)} required />
            </div>
          </>
        )}
        {/* Adım 3: Garanti & Tedarikçi */}
        {step === 2 && (
          <>
            <div className="flex flex-col gap-4">
              <input className="input" type="date" placeholder="Satın Alma Tarihi" value={form.purchase_date} onChange={e => updateField("purchase_date", e.target.value)} required />
              <input className="input" type="date" placeholder="Garanti Bitiş Tarihi" value={form.warranty_end} onChange={e => updateField("warranty_end", e.target.value)} />
              <input className="input" placeholder="Tedarikçi Firma" value={form.supplier} onChange={e => updateField("supplier", e.target.value)} />
            </div>
          </>
        )}
        {/* Adım 4: Döküman Yükle */}
        {step === 3 && (
          <>
            <div className="flex flex-col gap-4">
              <input className="input" type="file" multiple onChange={e => updateField("documents", Array.from(e.target.files || []))} />
              <div className="text-xs text-zinc-500">PDF, JPG, PNG desteklenir.</div>
            </div>
          </>
        )}
        {/* Adım 5: Onayla */}
        {step === 4 && (
          <div className="text-center">
            <div className="text-lg font-semibold mb-2">Tüm bilgiler doğru mu?</div>
            <div className="text-zinc-500 mb-4">Kaydettiğinizde cihaz sisteme eklenecek.</div>
            <button type="submit" className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition">Kaydet</button>
          </div>
        )}
        {/* Adım butonları */}
        <div className="flex gap-2 justify-between mt-4">
          <button type="button" className="px-4 py-2 rounded-lg bg-zinc-200 text-zinc-700 font-semibold hover:bg-zinc-300 transition" disabled={step === 0} onClick={() => setStep(s => Math.max(0, s - 1))}>Geri</button>
          {step < steps.length - 1 && (
            <button type="button" className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition" onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))}>İleri</button>
          )}
        </div>
        {/* Başarı mesajı */}
        {submitted && <div className="text-green-600 text-center font-semibold mt-4">Cihaz başarıyla eklendi!</div>}
      </form>
      {/* Açıklama: Bu form, cihaz ekleme işlemini adım adım ve kullanıcı dostu şekilde yönetir. Her adımda sadece ilgili alanlar gösterilir. */}
    </div>
  );
}
// .input className için Tailwind: px-4 py-2 rounded-lg border border-zinc-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 transition 