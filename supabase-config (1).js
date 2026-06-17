// ====================================================
// SUPABASE YAPILANDIRMASI
// ====================================================
// Bu dosyadaki iki değeri Supabase projenden alıp buraya yapıştır:
// 1. SUPABASE_URL  -> Settings > API > Project URL
// 2. SUPABASE_ANON_KEY -> Settings > API > Project API keys > anon public
//
// Bilgiler gelene kadar site tasarım olarak tam çalışır,
// sadece form gönderme ve blog listeleme veritabanına bağlanamaz.
// ====================================================

const SUPABASE_URL = "https://cqrvrblrdfrudmxowzdh.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_axW0yeWpU2TtVYumltNMTw_kQxJk6Ev";

// Supabase REST API'sine istek atmak için ortak yardımcı fonksiyon
async function supabaseRequest(table, options = {}) {
  const {
    method = "GET",
    query = "",
    body = null,
    headers = {},
  } = options;

  const url = `${SUPABASE_URL}/rest/v1/${table}${query}`;

  const fetchOptions = {
    method,
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      ...headers,
    },
  };

  if (body) {
    fetchOptions.body = JSON.stringify(body);
  }

  const response = await fetch(url, fetchOptions);

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Supabase isteği başarısız (${response.status}): ${errText}`);
  }

  // 204 No Content (silme/güncelleme sonrası) durumunda boş dön
  if (response.status === 204) return null;

  return response.json();
}
