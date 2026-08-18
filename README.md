# 離島旅程 · Visual Novel

《離島旅程》16:9 網頁視覺小說。

## 網站

- GitHub Pages 開發版：https://hkrgb.github.io/island-journey-visual-novel/
- Firebase 舊測試版：https://island-journey-rgb.web.app
- Firebase project：`island-journey-rgb`（Authentication／Firestore）

## 發布

`main` 分支更新後，GitHub Actions 會自動發布 `output/` 到免費 GitHub Pages。
Firebase 保留作免費 Google 登入及 Firestore database，不使用需要 Blaze 的 Storage。

## 手機 App（Capacitor）

可以用 **Capacitor** 把 `output/` 網頁包成 Android／iOS App（工具本身免費）。

詳細步驟見：**[MOBILE.md](./MOBILE.md)**

```bash
npm install
npx cap add android
npx cap sync
npx cap open android
```

## 素材

遊戲使用的公開素材位於 `output/assets/`。小說原稿、工作檔、原始短片及臨時檔由 `.gitignore` 排除，只保留在本機。
