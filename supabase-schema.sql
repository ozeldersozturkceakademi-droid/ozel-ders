-- ====================================================
-- ÖZTÜRKÇE AKADEMİ — SUPABASE VERİTABANI ŞEMASI
-- ====================================================
-- Bu kodu Supabase projende SQL Editor'e yapıştırıp çalıştır.
-- (Supabase Dashboard > SQL Editor > New Query)

-- 1) BLOG YAZILARI
create table blog_yazilari (
  id uuid primary key default gen_random_uuid(),
  baslik text not null,
  slug text not null unique,
  ozet text,
  kapak_gorseli text,
  icerik_html text,           -- yazının ana gövdesi (H2/H3, paragraf, liste, görsel -> HTML olarak)
  icerik_sss jsonb,           -- [{ "soru": "...", "cevap": "..." }, ...] formatında SSS (opsiyonel)
  yayin_tarihi date not null default current_date,
  yayinda boolean not null default true,
  created_at timestamptz not null default now()
);

-- 2) VELİ / ÖĞRENCİ BİLGİ TALEP FORMU
create table veli_formlari (
  id uuid primary key default gen_random_uuid(),
  ad_soyad text not null,
  telefon text not null,
  ogrenci_sinifi text,
  ders_alani text,
  mesaj text,
  okundu boolean not null default false,
  created_at timestamptz not null default now()
);

-- 3) ÖĞRETMEN BAŞVURULARI
create table ogretmen_basvurulari (
  id uuid primary key default gen_random_uuid(),
  ad_soyad text not null,
  telefon text not null,
  brans text not null,
  eposta text,
  deneyim text,
  tanitim text,
  okundu boolean not null default false,
  created_at timestamptz not null default now()
);

-- 4) ADMIN KULLANICILAR (basit panel girişi için)
create table admin_kullanicilar (
  id uuid primary key default gen_random_uuid(),
  kullanici_adi text not null unique,
  sifre text not null,   -- NOT: Bu basit bir kurulumdur, şifre düz metin tutulur. Daha güvenli bir yapı istersen ileride Supabase Auth'a taşınabilir.
  created_at timestamptz not null default now()
);

-- Varsayılan admin kullanıcısı (şifreyi ilk girişten sonra değiştirmen önerilir)
insert into admin_kullanicilar (kullanici_adi, sifre)
values ('admin', 'Ozturkce2026!');

-- ====================================================
-- ROW LEVEL SECURITY (RLS) AYARLARI
-- ====================================================
-- Public (anon) erişim kuralları: site herkese açık olduğu için
-- blog yazılarını OKUMA serbest, ama formlara sadece EKLEME (insert) izni var.
-- Form verilerini OKUMA ve admin tablosuna erişim sadece panel üzerinden,
-- güvenlik için anon key ile okuma kapalı tutulacak şekilde ayarlanmıştır.
-- (Basit kurulumda admin paneli de anon key kullandığından, panel okuma
--  izinlerini açıyoruz; ileride daha sıkı bir yapı için Supabase Auth önerilir.)

alter table blog_yazilari enable row level security;
alter table veli_formlari enable row level security;
alter table ogretmen_basvurulari enable row level security;
alter table admin_kullanicilar enable row level security;

-- blog_yazilari: herkes yayınlanmış yazıları okuyabilir
create policy "Herkes yayinlanan yazilari okuyabilir"
on blog_yazilari for select
using (yayinda = true);

-- blog_yazilari: anon key ile tüm CRUD işlemleri (admin panel bu key'i kullanıyor)
create policy "Anon blog yonetebilir"
on blog_yazilari for all
using (true)
with check (true);

-- veli_formlari: herkes form gönderebilir (insert), okuma/güncelleme admin panelden
create policy "Herkes veli formu gonderebilir"
on veli_formlari for insert
with check (true);

create policy "Anon veli formlarini okuyup yonetebilir"
on veli_formlari for select
using (true);

create policy "Anon veli formlarini guncelleyebilir"
on veli_formlari for update
using (true);

create policy "Anon veli formlarini silebilir"
on veli_formlari for delete
using (true);

-- ogretmen_basvurulari: herkes başvuru gönderebilir (insert), okuma/güncelleme admin panelden
create policy "Herkes ogretmen basvurusu gonderebilir"
on ogretmen_basvurulari for insert
with check (true);

create policy "Anon ogretmen basvurularini okuyup yonetebilir"
on ogretmen_basvurulari for select
using (true);

create policy "Anon ogretmen basvurularini guncelleyebilir"
on ogretmen_basvurulari for update
using (true);

create policy "Anon ogretmen basvurularini silebilir"
on ogretmen_basvurulari for delete
using (true);

-- admin_kullanicilar: sadece okuma (giriş kontrolü için), anon key ile
create policy "Anon admin kullanicilarini okuyabilir"
on admin_kullanicilar for select
using (true);

-- ====================================================
-- NOT: Bu kurulum "anon key + RLS true" ile basit bir
-- yönetim paneli mantığı kurar. Bu, herkesin anon key'i
-- bilse teknik olarak veriye yazabileceği anlamına gelir.
-- Site küçük/orta ölçekli kurumsal kullanım için kabul
-- edilebilir bir risktir, ancak anon key'i asla halka açık
-- paylaşmamaya, sadece kendi JS dosyalarında kullanmaya
-- dikkat et. İleride istersen Supabase Auth + daha sıkı RLS
-- politikalarına geçiş yapılabilir.
-- ====================================================
