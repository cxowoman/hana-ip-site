# 涵捺 Hana 課程報名信件設定

這個網站已經接好和女創俱樂部專案相同的報名信件流程：

1. 報名後馬上寄出確認信
2. 報名後 48 小時寄出第二封
3. 課程前三天寄出提醒信
4. 課程前一天寄出行前信

## 前台設定

複製 `config.example.js` 的內容到 `config.js`，填入 Supabase 專案：

```js
window.HANA_CONFIG = {
  supabaseUrl: "https://your-project.supabase.co",
  supabaseAnonKey: "your-supabase-anon-key",
};
```

## Supabase Secrets

部署 `outputs/supabase/functions` 後，需要設定這些 secrets：

```bash
supabase secrets set GMAIL_SENDER_NAME="涵捺 Hana"
supabase secrets set GMAIL_SENDER_EMAIL="你的 Gmail 地址"
supabase secrets set GMAIL_CLIENT_ID="..."
supabase secrets set GMAIL_CLIENT_SECRET="..."
supabase secrets set GMAIL_REFRESH_TOKEN="..."
supabase secrets set CRON_SECRET="自訂一組安全字串"
supabase secrets set ADMIN_NOTIFICATION_EMAIL="你要收到副本通知的 Email"
```

`GMAIL_SENDER_NAME` 必須是 `涵捺 Hana`，這樣學員收信時寄件人就不會顯示 CXO WOMAN。

## 資料庫與排程

依序套用 `outputs/supabase/migrations` 內的 SQL。接著設定排程定期呼叫：

```text
POST /functions/v1/process-email-reminders
Header: x-cron-secret: 你的 CRON_SECRET
```

立即確認信會在報名時主動觸發；後續三封信需要靠排程定期處理 pending jobs。
