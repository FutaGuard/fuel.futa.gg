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
