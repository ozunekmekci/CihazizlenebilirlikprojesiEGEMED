# 🚦 CURSOR RULES – Proje Yol Haritası ve Kurallar Kitapçığı

## 1. Proje Amacı
- Hastane cihaz envanterini QR kod ile dijital ve merkezi olarak yönetmek.
- QR kodlar sabit, içerik web panelden güncellenebilir.
- Kullanıcı dostu, modern, Apple/Notion/Linear esintili bir dashboard.

## 2. Temel Teknolojiler
- **Frontend:** Next.js (App Router), Tailwind CSS, Shadcn UI/Radix UI, Framer Motion, Lucide/Tabler Icons
- **Backend:** Django + Django REST Framework
- **Veritabanı:** MySQL (prod), SQLite (demo/dev)
- **Dosya Depolama:** Lokal (media/)
- **Tasarım:** Figma, Apple/Notion/Linear referans alınacak

## 3. UI/UX Kuralları
- Minimal, sade, bol boşluklu, tipografi odaklı
- Soft geçiş animasyonları (Framer Motion)
- Responsive ve mobile-first
- açık tema varsayılan,
- Büyük başlıklar, net ikonografi, yüksek kontrast
- Dikkat dağıtmayan renkler, 1 ana accent (mavi/yeşil/teal)
- Sidebar navigation, sticky ve daraltılabilir
- Dashboard: özet kartlar, istatistikler, hızlı aksiyonlar
- Cihaz detay: görsel, temel bilgiler, QR önizleme, geçmiş kayıtlar
- Formlar: Apple tarzı inputlar, animasyonlu geçişler
- Tablolar: temiz, filtrelenebilir, hover efektli

## 4. Geliştirme Prensipleri
- Kod okunabilirliği ve sürdürülebilirliği ön planda
- Component bazlı, tekrar kullanılabilir yapı
- API-first backend, frontend ile RESTful entegrasyon
- Dosya yükleme ve erişim güvenliği
- Yetkilendirme: Panelde sadece yetkili kullanıcılar işlem yapabilir
- Audit log: Kim, ne zaman, hangi değişikliği yaptı izlenebilir olmalı

## 5. Ekstra Özellikler (Opsiyonel)
- Bildirim sistemi (e-posta/SMS)
- Lokasyon geçmişi
- Toplu veri içe/dışa aktarma (CSV/Excel)
- Yapay zeka destekli arıza analizi (gelecekte)
- İstatistik ve raporlama ekranları

## 6. İlham Kaynakları
- [Apple System Apps](https://www.apple.com/macos/ventura/)
- [Linear.app](https://linear.app/)
- [Notion.so](https://notion.so)
- [Superlist](https://superlist.com/)

---

> **Bu dosya, proje boyunca tüm ekip için referans alınacaktır. Her yeni özellik veya değişiklikte bu kurallara sadık kalınmalıdır.** 