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

設定好後，網址通常會是：

`https://你的-github-帳號.github.io/hana-ip-site/`

## 之後更新

GitHub remote 設定完成後，只要在本機後台按儲存，系統就會自動推送更新。
GitHub Pages 通常需要 1-2 分鐘才會反映到公開網站。
