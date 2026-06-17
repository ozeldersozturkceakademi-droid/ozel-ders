// ====================================================
// SUPABASE YAPILANDIRMASI
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

  // Yanıt gövdesini metin olarak oku (boş olabilir)
  const rawText = await response.text();

  if (!response.ok) {
    throw new Error(`Supabase isteği başarısız (${response.status}): ${rawText}`);
  }

  // Gövde boşsa (204 No Content veya Prefer header olmadan yapılan POST/PATCH/DELETE)
  // JSON.parse denemeden boş dön
  if (!rawText) return null;

  try {
    return JSON.parse(rawText);
  } catch (e) {
    // Beklenmeyen şekilde JSON olmayan ama hatasız bir yanıt geldiyse sessizce null dön
    return null;
  }
}
