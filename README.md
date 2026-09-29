# fuel.futa.gg

台灣油品價格歷史視覺化。以 Next.js 相容的 vinext、React、Tailwind CSS、daisyUI 與 Recharts 建置，資料來自 `opendata.futa.gg`。

## 功能

- 92、95、98 無鉛汽油與超級柴油的每週價格
- 西德州、杜拜與布蘭特原油的每週美元價格
- 3 個月到 10 年、全部期間與自訂日期範圍
- 可切換國內油品與國際原油圖表線條
- 平滑曲線呈現價格趨勢
- 歷史價格表格
- 亮色、深色與跟隨系統主題

國內油價與原油資料可分開更新。同一週尚未取得的原油價格會顯示「—」與「本期尚無資料」，不影響國內油價、圖表及歷史紀錄；頁首顯示國內油價的資料截止日期。爬蟲的同步邏輯位於 [SunsetRollercoaster](https://github.com/FutaGuard/SunsetRollercoaster)。

## 本機開發

```bash
npm install
npm run dev
```

## Cloudflare Pages 部署

專案使用 Pages Advanced Mode，在本機整理靜態資源與 vinext Worker 後，由 Wrangler 直接部署：

```bash
npm run deploy:pages
```

部署後可檢查首頁引用的 CSS、JavaScript 與圖片是否都能正常載入：

```bash
npm run check:deployment -- https://fuel.futa.gg/
```

也可用本機 Chrome 模擬常見手機寬度，檢查主要卡片與圖表容器是否超出畫面：

```bash
npm run check:mobile-layout -- https://fuel.futa.gg/
```

## 驗證

```bash
npm run build
npm test
```
