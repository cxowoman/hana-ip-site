# Google Sheet 報名資料庫設定

Google Sheet 已建立：

https://docs.google.com/spreadsheets/d/15RUfmIkwgZwlFfdXJ9LXaSxQZwarSdVCX9cIk0j2qFM/edit

## 一次性設定

1. 打開 Google Sheet，點選「擴充功能」→「Apps Script」。
2. 將 `google-sheet-registration-webhook.gs` 的內容完整貼到 Apps Script。
3. 把檔案上方的 `READ_TOKEN` 改成一組只有你知道的文字。
4. 點選「部署」→「新增部署作業」。
5. 類型選「網頁應用程式」。
6. 「執行身分」選「我」。
7. 「誰可以存取」選「任何人」。
8. 部署後複製結尾是 `/exec` 的 Web App URL。

## 接回網站

公開前台需要把 Apps Script Web App URL 填入：

```js
window.HANA_REGISTRATION_CONFIG = {
  googleSheetId: "15RUfmIkwgZwlFfdXJ9LXaSxQZwarSdVCX9cIk0j2qFM",
  googleSheetUrl: "https://docs.google.com/spreadsheets/d/15RUfmIkwgZwlFfdXJ9LXaSxQZwarSdVCX9cIk0j2qFM/edit",
  webhookUrl: "貼上 Apps Script Web App URL",
};
```

本機後台需要在 `outputs/config.js` 填入同一個 URL 和 `READ_TOKEN`：

```js
window.HANA_CONFIG = {
  registration: {
    googleSheetId: "15RUfmIkwgZwlFfdXJ9LXaSxQZwarSdVCX9cIk0j2qFM",
    googleSheetUrl: "https://docs.google.com/spreadsheets/d/15RUfmIkwgZwlFfdXJ9LXaSxQZwarSdVCX9cIk0j2qFM/edit",
    webhookUrl: "貼上 Apps Script Web App URL",
    readToken: "貼上 Apps Script READ_TOKEN",
  },
};
```

`outputs/config.js` 已設為本機私密檔，不會被推到 GitHub。
