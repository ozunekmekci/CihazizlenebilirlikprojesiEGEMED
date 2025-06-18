# Cihaz İzlenebilirlik Projesi (EGEMED)

## 1. Projenin Genel Amacı ve Kapsamı

**Cihaz İzlenebilirlik Projesi**, hastane ve sağlık kuruluşlarındaki tıbbi cihazların dijital ve merkezi olarak yönetilmesini amaçlar. QR kod ile cihaz takibi, bakım, arıza ve kalibrasyon geçmişinin merkezi panelden izlenmesi, kağıt/Excel tabanlı süreçlerin dijitalleştirilmesi ve şeffaf, hızlı, güvenli bir envanter yönetimi sağlar.

- **Hedef Kitle:** Biyomedikal mühendisleri, teknik ekipler, hastane yöneticileri, sağlık kuruluşları.
- **Vizyon:** Tüm cihazların yaşam döngüsünü tek panelden yönetmek, modüler ve ölçeklenebilir altyapı sunmak, gelecekte yapay zeka destekli akıllı bakım ve arıza tahmini eklemek.
- **Sektör:** Sağlık sektörü, tıbbi cihaz yönetimi, bakım hizmetleri.

---

## 2. Projenin Mimari Yapısı ve Temel Bileşenleri

- **Frontend:** Next.js tabanlı modern web paneli (React, TypeScript, Tailwind CSS, Shadcn UI, Framer Motion).
- **Backend:** Django + Django REST Framework ile API-first mimari.
- **Veritabanı:** MySQL (prod), SQLite (geliştirme/demo).
- **Dosya Depolama:** Lokal (media/ klasörü).

### Ana Sorumluluklar
- **Frontend:** Kullanıcı arayüzü, cihaz listesi, detay, filtreleme, arama, QR kod, formlar, raporlar.
- **Backend:** İş kuralları, veri doğrulama, API endpoint'leri, dosya yükleme, loglama, güvenlik.
- **Veritabanı:** Cihazlar, departmanlar, bakım/arıza/kalibrasyon logları, kullanıcılar, dökümanlar.

### Veri Modeli (Özet)
- **Device:** name, brand, model, serial, department, location, status, last_maintenance, image, qr_url, ...
- **Department:** name
- **MaintenanceLog, FaultLog, CalibrationLog:** ilgili cihaz, tarih, açıklama, sonuç, sertifika, ...
- **Document:** cihaz, dosya, açıklama, tip, yüklenme tarihi

### Veri Akışı
- Kullanıcı arayüzünden gelen istekler (REST API) → Django backend → Veritabanı
- Backend'den frontend'e JSON veri dönüşü
- Dosya yükleme ve erişim için media/ klasörü

### API
- **RESTful API:** CRUD işlemleri, log ekleme, cihaz arama, filtreleme, dosya yükleme
- Standart HTTP metodları (GET, POST, PUT, DELETE)
- Yetkilendirme gerektiren endpoint'ler

---

## 3. Kullanılan Teknolojiler

### Ön Yüz (Front-End)
- **Next.js (React tabanlı)**
- **Tailwind CSS**
- **Shadcn UI / Radix UI**
- **Framer Motion**
- **Lucide/Tabler Icons**
- **TypeScript**

### UI/UX
- Minimal, bol boşluklu, tipografi odaklı, Apple/Notion/Linear esintili
- Responsive ve mobile-first
- Sidebar navigation, sticky ve daraltılabilir
- Temiz, filtrelenebilir, hover efektli tablolar

### Arka Yüz (Back-End)
- **Python 3.x**
- **Django 5.x**
- **Django REST Framework**
- **MySQL** (prod), **SQLite** (geliştirme/demo)

### Diğer Destekleyici Teknolojiler
- **Git & GitHub**
- **npm, pip**
- **.env dosyaları**
- **JWT veya Session tabanlı kimlik doğrulama**
- **CORS, CSRF, HTTPS**
- **Testler:** Django test framework'ü, Next.js için jest/test runner (isteğe bağlı)
- **CI/CD:** GitHub Actions (isteğe bağlı)
- **Docker:** (isteğe bağlı, kolayca eklenebilir)

---

## 4. Projenin İş Akışları ve Ana Görevleri

### Tipik Kullanıcı Akışı
1. **Giriş:** Yetkili kullanıcı login olur.
2. **Cihaz Listesi:** Tüm cihazlar, filtrelenebilir ve sıralanabilir şekilde listelenir.
3. **Cihaz Detay:** Cihazın geçmişi, QR kodu, bakım/arıza/kalibrasyon logları ve dökümanları görüntülenir.
4. **Kayıt Ekleme:** (Sadece panelden) Yeni cihaz, bakım, arıza, kalibrasyon veya döküman eklenebilir.
5. **Arama & Filtreleme:** Cihaz adı, marka, model, lokasyon, durum gibi alanlarda hızlı arama ve filtreleme.
6. **Raporlama:** (Opsiyonel) Cihaz istatistikleri, bakım geçmişi, arıza oranları gibi raporlar alınabilir.

### CRUD Operasyonları
- **Device:** Ekle, listele, güncelle, sil
- **Loglar:** (Bakım, arıza, kalibrasyon) Ekle, listele, sil
- **Document:** Ekle, listele, sil
- **Department, DeviceType:** Ekle, güncelle, sil

### Arka Plan Görevleri
- Dosya yükleme ve saklama
- (Opsiyonel) E-posta bildirimleri, otomatik bakım hatırlatıcıları
- (Opsiyonel) Audit log: Kim, ne zaman, hangi değişikliği yaptı

### Hata Yönetimi & Loglama
- Django'nun hata yönetimi ve logging altyapısı
- Frontend'de kullanıcıya açıklayıcı hata mesajları

---

## 5. Projenin Özellikleri ve Fonksiyonları

### Ana Özellikler
- **Cihaz Envanteri Yönetimi:** Tüm cihazlar merkezi panelde listelenir ve yönetilir.
- **QR Kod ile Takip:** Her cihaz için QR kod üretilir ve cihaz detayında gösterilir.
- **Bakım, Arıza, Kalibrasyon Logları:** Cihaz geçmişi detaylı şekilde tutulur.
- **Döküman Yönetimi:** Cihazlara ait kullanım kılavuzu, sertifika vb. dosyalar yüklenebilir ve görüntülenebilir.
- **Filtreleme & Sıralama:** Tüm alanlarda hızlı filtreleme ve A-Z sıralama.
- **Yetkilendirme:** Sadece yetkili kullanıcılar işlem yapabilir.
- **Audit Log:** (Opsiyonel) Tüm değişiklikler izlenebilir.
- **Responsive ve Modern UI:** Her cihazdan erişilebilir, sade ve hızlı arayüz.

### Benzersiz Satış Noktaları (USP)
- QR kod ile cihaz takibi ve hızlı erişim
- Modern, Apple/Notion/Linear esintili arayüz
- Tüm cihaz geçmişinin merkezi ve şeffaf yönetimi
- Kolay toplu veri aktarımı (CSV ile)
- Gelişmiş filtreleme ve raporlama altyapısı

### Ölçeklenebilirlik & Performans
- MySQL ile büyük veri setlerine uygun
- API-first mimari ile kolay entegrasyon ve genişletilebilirlik
- Docker ile kolay taşınabilirlik ve deployment

---

## 6. Gelecek Planları ve Potansiyel Gelişmeler

### Yol Haritası
- **Kısa Vadeli:**
  - Bildirim sistemi (e-posta/SMS)
  - Toplu veri içe/dışa aktarma (CSV/Excel)
  - Audit log ve gelişmiş kullanıcı yönetimi
- **Orta Vadeli:**
  - Lokasyon geçmişi ve cihaz hareket takibi
  - Gelişmiş istatistik ve raporlama ekranları
  - Mobil uygulama veya PWA desteği
- **Uzun Vadeli:**
  - Yapay zeka destekli arıza tahmini ve bakım önerileri
  - Diğer hastane yazılımları ile entegrasyon (HBYS, SAP vb.)
  - Çoklu kurum desteği ve SaaS altyapısı

### Performans ve Ölçeklenebilirlik
- API caching, arka plan task queue (Celery, Redis) ile yük dengeleme
- Docker/Kubernetes ile yatayda kolay ölçeklenebilirlik
- Gelişmiş loglama ve monitoring altyapısı

### Potansiyel Entegrasyonlar
- Diğer sağlık yazılımları ve cihaz üreticileri ile API entegrasyonu
- Otomatik yedekleme ve felaket kurtarma sistemleri
- Gelişmiş kimlik doğrulama (LDAP, SSO, OAuth2)

---

## Katkı ve Lisans

Her türlü katkıya ve geri bildirime açıktır. Lütfen issue veya pull request açmaktan çekinmeyin.

---

**Proje Sorumlusu:** ozunekmekci  
**Repo:** [CihazizlenebilirlikprojesiEGEMED](https://github.com/ozunekmekci/CihazizlenebilirlikprojesiEGEMED.git) 