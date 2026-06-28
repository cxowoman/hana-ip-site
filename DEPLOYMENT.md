# 涵捺 Hana 個人 IP 網站正式部署

這個網站不建議只放 GitHub Pages，因為後台需要登入、儲存內容、改寫公開資料。正式部署請使用可執行 Python 伺服器並可掛載永久磁碟的平台，例如 Render、Railway 或 VPS。

## 建議方案：Render Web Service

1. 將整個 `ip-banner-2` 資料夾建立成 GitHub repo。
2. 到 Render 建立新的 Blueprint 或 Web Service，連接該 GitHub repo。
3. Render 設定可以使用本專案的 `render.yaml`。
4. 請確認服務設定：
   - Service type: `Web Service`
   - Runtime: `Python`
   - Plan: `Starter`
   - Region: `Singapore`
   - Build command: `python -m py_compile site_server.py`
   - Start command: `python site_server.py --host 0.0.0.0 --port $PORT`
5. 請確認環境變數：
   - `HANA_ADMIN_USER`: `hana31923`
   - `HANA_ADMIN_PASSWORD`: 後台密碼，請在 Render 後台手動填入，不要寫進 GitHub。
   - `HANA_DATA_DIR`: `/var/data`
6. 請確認有掛載永久磁碟：
   - Mount path: `/var/data`
   - Size: `1 GB` 即可
7. 部署完成後會得到固定網址，例如：
   - 首頁：`https://你的-render網址.onrender.com`
   - 後台：`https://你的-render網址.onrender.com/admin.html`

## 為什麼需要永久磁碟

後台按下儲存後，系統會把資料寫入 `published-data.js`。正式主機如果沒有永久磁碟，重新部署或主機重啟後資料可能回到舊版本。

本專案已支援 `HANA_DATA_DIR`，正式環境會把後台儲存資料寫到 `/var/data`，避免部署後內容消失。

第一次部署時，`/var/data` 會是空的。伺服器啟動時會自動把目前網站內的 `outputs/published-data.js` 與 `outputs/published-data.json` 複製成初始正式資料；之後只要後台按下儲存，就會更新永久磁碟裡的資料，不會被下一次重新部署覆蓋。

## 本機測試

```bash
python site_server.py --host 127.0.0.1 --port 8088
```

開啟：

- 首頁：http://127.0.0.1:8088
- 後台：http://127.0.0.1:8088/admin.html

## 自訂網域

正式部署完成後，可以在平台後台新增自訂網域，例如：

- `hana31923.com.tw`
- `www.hana31923.com.tw`

接著依平台提供的 DNS 記錄，到網域商後台設定 CNAME 或 A record。

## 注意事項

- `trycloudflare.com` 只是臨時測試網址，不適合正式使用。
- 不要把 `.hana-admin-secret`、`.env`、`backups/` 上傳到 GitHub。
- 報名名單不會寫入公開資料檔，避免公開學員資料。
