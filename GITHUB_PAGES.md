# Hana IP Site - GitHub Pages Free Deployment

這個版本改走 GitHub Pages 免費上線。

## 使用方式

1. 本機後台：
   - 打開 `http://127.0.0.1:8088/admin.html`
   - 使用既有管理員帳號登入
   - 編輯課程、內容分享、相關經歷、見證、陪跑方案

2. 儲存後會自動做三件事：
   - 更新本機伺服器使用的 `published-data.js` / `published-data.json`
   - 更新公開網站資料夾 `docs/`
   - 如果 GitHub remote 已設定，會自動 commit 並 push 到 GitHub Pages

3. 公開網站：
   - GitHub Pages 只發布 `docs/`
   - `docs/` 不包含 `admin.html`、`admin.js`、`admin.css`
   - 公開訪客只能看網站，不能進後台修改

## 第一次上線需要設定

第一次需要建立 GitHub repo，並在 GitHub Pages 設定：

- Source: `Deploy from a branch`
- Branch: `main`
- Folder: `/docs`

目前公開網址：

`https://cxowoman.github.io/hana-ip-site/`

正式品牌網域預計使用：

`https://hana31923.com.tw/`

`scripts/build_github_pages.py` 每次建置都會在 `docs/CNAME` 寫入 `hana31923.com.tw`，避免後台儲存後覆蓋正式網域設定。

## 自訂網域 DNS

`hana31923.com.tw` 目前名稱伺服器在 Cloudflare，因此 DNS 紀錄要到 Cloudflare 修改，不是在 GoDaddy 修改。

Cloudflare DNS 需要設定：

| 類型 | 名稱 | 內容 |
| --- | --- | --- |
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | cxowoman.github.io |

若 Cloudflare 有 Proxy 狀態，GitHub Pages 建議先設為 DNS only，等 GitHub Pages 驗證與 HTTPS 生效後再評估是否開啟 Proxy。

## 之後更新

GitHub remote 設定完成後，只要在本機後台按儲存，系統就會自動推送更新。
GitHub Pages 通常需要 1-2 分鐘才會反映到公開網站。
