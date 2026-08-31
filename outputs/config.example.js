window.HANA_CONFIG = {
  // 如果之後仍要使用 Supabase，才需要填入這兩個值。
  supabaseUrl: "https://your-project.supabase.co",
  supabaseAnonKey: "your-supabase-anon-key",

  // Google Sheet 報名資料庫設定。
  // webhookUrl 是 Apps Script Web App 部署後拿到的 /exec 網址。
  // readToken 只放在本機後台使用，不要放進公開頁。
  registration: {
    googleSheetId: "15RUfmIkwgZwlFfdXJ9LXaSxQZwarSdVCX9cIk0j2qFM",
    googleSheetUrl: "https://docs.google.com/spreadsheets/d/15RUfmIkwgZwlFfdXJ9LXaSxQZwarSdVCX9cIk0j2qFM/edit",
    webhookUrl: "https://script.google.com/macros/s/你的部署ID/exec",
    readToken: "你在 Apps Script READ_TOKEN 設定的文字",
  },
};
