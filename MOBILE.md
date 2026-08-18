# 手機 App 打包說明（Capacitor）

將《離島旅程》網頁版包成 Android／iOS App。

> Capacitor 本身**免費**。上架 Google Play／App Store 才需要平台開發者費用。

---

## 你需要準備

| 項目 | Android | iOS |
|------|---------|-----|
| Node.js（建議 18+） | ✅ | ✅ |
| Android Studio | ✅ | — |
| Mac + Xcode | — | ✅ |
| 開發者帳號 | 自己試玩免費；上架約 USD 25（一次） | 上架每年約 USD 99 |

---

## 第一次設定（只需做一次）

在專案根目錄（有 `package.json` 同 `capacitor.config.json` 嗰層）執行：

```bash
# 1. 安裝依賴
npm install

# 2. 加入 Android 平台（產生 android/ 資料夾）
npx cap add android

# 3.（可選）加入 iOS —— 一定要喺 Mac
npx cap add ios

# 4. 把 output/ 網頁同步入原生專案
npx cap sync
```

---

## 日常更新流程

每次改完遊戲網頁（`output/`）之後：

```bash
npx cap sync
npx cap open android    # 或：npx cap open ios
```

然後在 Android Studio／Xcode 按 Run，裝去手機或模擬器。

---

## 輸出 APK（自己分發／試玩）

1. `npx cap open android`
2. 在 Android Studio：`Build` → `Build Bundle(s) / APK(s)` → `Build APK(s)`
3. 完成後會有 `.apk`，傳到 Android 手機安裝即可

（正式上架建議用 Signed Bundle／AAB。）

---

## 專案裡相關檔案

| 檔案 | 作用 |
|------|------|
| `capacitor.config.json` | App 名稱、ID、網頁目錄（`webDir: output`） |
| `package.json` | Capacitor 依賴同快捷指令 |
| `output/` | 真正被包進 App 的網頁內容 |
| `android/`、`ios/` | 執行 `cap add` 後先會出現（已加入 `.gitignore`） |

---

## 注意事項（同本遊戲有關）

1. **網絡**：而家劇情／後台仍可能依賴 Firebase。手機有網時可正常玩；要**完全離線**，需要之後做「本地 JSON + 本地素材」。
2. **後台 CMS**：建議繼續用瀏覽器開，**唔使**包進玩家 App。
3. **橫向遊戲**：可在 Android Manifest／iOS 設定鎖定橫向（需要時再改）。
4. **App ID**：而家係 `com.hkrgb.islandjourney`，上架前如要改，改 `capacitor.config.json` 的 `appId` 後重新 `cap sync`。

---

## 快捷 npm 指令

```bash
npm run cap:sync         # 同步網頁到原生專案
npm run cap:android      # 用 Android Studio 開啟
npm run cap:ios          # 用 Xcode 開啟（Mac）
```
