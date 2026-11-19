---
name: 台灣油價
description: 台灣每週油價與同期國際原油的價目牌式儀表板
colors:
  price-board-yellow: "oklch(85% 0.199 91.936)"
  price-board-ink: "oklch(42% 0.095 57.708)"
  price-board-yellow-deep: "color-mix(in oklab, oklch(85% 0.199 91.936) 78%, #8b5c00)"
  signal-amber: "oklch(82% 0.189 84.429)"
  signal-amber-night: "oklch(83.242% 0.139 82.95)"
  price-board-ink-night: "oklch(16.648% 0.027 82.95)"
  paper-white: "oklch(100% 0 0)"
  forecourt-gray: "oklch(97% 0 0)"
  ink: "oklch(20% 0 0)"
  night-slate: "oklch(20.768% 0.039 265.754)"
  night-deep: "oklch(19.314% 0.037 265.754)"
  night-ink: "oklch(84.153% 0.007 265.754)"
  status-green: "oklch(76% 0.177 163.223)"
  error-red: "oklch(70% 0.191 22.216)"
  browser-chrome: "#f5f5f5"
  browser-chrome-night: "#0c1425"
  fuel-92: "#e5a007"
  fuel-95: "#ee6c2f"
  fuel-98: "#c15282"
  fuel-diesel: "#358978"
  crude-wti: "#4f6fa9"
  crude-dubai: "#9a7432"
  crude-brent: "#76599a"
  fuel-92-night: "#f1b72e"
  fuel-95-night: "#ff8b55"
  fuel-98-night: "#dd78a4"
  fuel-diesel-night: "#59b9a3"
  crude-wti-night: "#7f9bdd"
  crude-dubai-night: "#d5a84d"
  crude-brent-night: "#ae8ad1"
typography:
  display:
    fontFamily: "Noto Sans TC, PingFang TC, Microsoft JhengHei, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(26px, 3.4vw, 34px)"
    fontWeight: 800
    lineHeight: 1.15
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Noto Sans TC, PingFang TC, Microsoft JhengHei, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(20px, 2.4vw, 24px)"
    fontWeight: 800
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Noto Sans TC, PingFang TC, Microsoft JhengHei, ui-sans-serif, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 700
  body:
    fontFamily: "Noto Sans TC, PingFang TC, Microsoft JhengHei, ui-sans-serif, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Noto Sans TC, PingFang TC, Microsoft JhengHei, ui-sans-serif, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 600
  item:
    fontFamily: "Noto Sans TC, PingFang TC, Microsoft JhengHei, ui-sans-serif, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 600
  micro:
    fontFamily: "Noto Sans TC, PingFang TC, Microsoft JhengHei, ui-sans-serif, system-ui, sans-serif"
    fontSize: "11px"
    fontWeight: 400
  brand:
    fontFamily: "Noto Sans TC, PingFang TC, Microsoft JhengHei, ui-sans-serif, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 800
    letterSpacing: "-0.02em"
  numeral:
    fontFamily: "SFMono-Regular, Roboto Mono, Consolas, ui-monospace, monospace"
    fontSize: "clamp(30px, 3.6vw, 42px)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.03em"
    fontFeature: "\"tnum\" 1"
  data:
    fontFamily: "SFMono-Regular, Roboto Mono, Consolas, ui-monospace, monospace"
    fontSize: "12px"
    fontWeight: 600
    fontFeature: "\"tnum\" 1"
rounded:
  field: "8px"
  control: "12px"
  panel-mobile: "14px"
  panel: "16px"
  pill: "999px"
spacing:
  page-mobile: "9px"
  page: "16px"
  section-gap: "16px"
  group-gap: "24px"
  panel-padding: "clamp(18px, 3vw, 28px)"
components:
  panel:
    backgroundColor: "color-mix(in oklab, {colors.paper-white} 82%, transparent)"
    rounded: "{rounded.panel}"
    padding: "{spacing.panel-padding}"
  button-primary:
    backgroundColor: "{colors.price-board-yellow}"
    textColor: "{colors.price-board-ink}"
    rounded: "{rounded.field}"
    height: "40px"
    padding: "0 16px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    height: "32px"
    padding: "0 12px"
  range-tabs:
    backgroundColor: "color-mix(in oklab, {colors.forecourt-gray} 70%, transparent)"
    rounded: "{rounded.control}"
    padding: "4px"
  range-tab-active:
    backgroundColor: "{colors.paper-white}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.field}"
    height: "40px"
  legend-chip:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    height: "32px"
    padding: "0 12px"
  input-date:
    backgroundColor: "color-mix(in oklab, {colors.paper-white} 91%, transparent)"
    textColor: "{colors.ink}"
    rounded: "{rounded.field}"
    height: "40px"
  price-tile:
    textColor: "{colors.ink}"
    typography: "{typography.numeral}"
---

# Design System: 台灣油價

## Overview

**Creative North Star: "加油站價目牌"**

這套設計以油站門口的價目立牌為藍本：數字最大、最先被看到，其餘東西都退到後面當配角。品項名稱、單位、漲跌像立牌上的小字，排得整齊、看得清楚，但不跟數字搶位置。訪客不管是路過瞄一眼的駕駛，還是要引用數字的記者，第一眼拿到的都是「這週多少錢」。

氣質是明亮溫暖，但克制。暖黃（價目牌黃）是品牌的記憶點，只用在品牌標誌、主要按鈕和背景右上角的一層淡淡光暈，不鋪滿畫面。版面要讓一般駕駛覺得親切，不能像金融終端機；數字的排版、對齊和出處又要精準到可以放心引用。裝飾越少越好，每個元素都要回答「它幫訪客看懂數字了嗎」。

密度屬於中等：資料面板寬鬆，表格緊湊。亮色主題（bumblebee）是預設，深色主題（night）跟隨系統或由訪客切換，兩套主題共用同一組結構，只換顏色。

**Key Characteristics:**
- 價格用等寬粗體大字，是每個畫面上最大的字。
- 七條資料線各有固定顏色，色點、圖例、線條、浮動提示全部同色。
- 面板平貼，用 1px 細框分層，不用陰影。
- 暖黃只是點綴，不拿來大面積鋪色。
- 單位每組只說一次，缺值顯示「—」。

## Colors

整體是中性的紙白與墨黑，加上一抹價目牌黃；七個系列色是唯一大量出現的彩色，而且每個顏色都代表特定的資料線。

### Primary
- **價目牌黃** (oklch(85% 0.199 91.936))：亮色主題的 primary，品牌圖示的底色、「套用區間」主要按鈕。只能當底色，不當淺色背景上的字色。
- **價目牌墨** (oklch(42% 0.095 57.708))：放在價目牌黃上的文字與圖示顏色。
- **深價目牌黃** (color-mix(in oklab, 價目牌黃 78%, #8b5c00))：亮色主題中需要黃色調文字時使用，例如品牌字「台灣**油價**」裡的「油價」（品牌字樣不適用對比規範）。深色主題改用訊號琥珀（夜）。
- **深色主題的 primary**：覆寫 daisyUI night 預設的天藍，改用訊號琥珀（夜）當底色、**價目牌墨（夜）** (oklch(16.648% 0.027 82.95)) 當上面的字色，品牌圖示和主要按鈕在兩種主題都是黃色系。

### Secondary
- **訊號琥珀** (oklch(82% 0.189 84.429))：背景右上角的暖色光暈（24% 透明度混色）、文字選取底色、資料離線時的狀態點。
- **訊號琥珀（夜）** (oklch(83.242% 0.139 82.95))：深色主題中黃色調文字的顏色，取代深價目牌黃。

### Tertiary：資料系列色
每個系列在亮色與深色各有一個值，深色版提高明度以維持對比。

- **92 無鉛**：金黃（#e5a007／夜 #f1b72e）
- **95 無鉛**：橘紅（#ee6c2f／夜 #ff8b55）
- **98 無鉛**：莓紅（#c15282／夜 #dd78a4）
- **超級柴油**：油綠（#358978／夜 #59b9a3）
- **西德州原油**：鋼藍（#4f6fa9／夜 #7f9bdd）
- **杜拜原油**：沙金（#9a7432／夜 #d5a84d）
- **布蘭特原油**：葡萄紫（#76599a／夜 #ae8ad1）

漲跌文字借用系列色並混入文字色以達到 4.5:1 對比：上漲是 95 橘紅 72% 混文字色、下跌是柴油綠 82% 混文字色，而且一定搭配上升或下降圖示，不能只靠顏色傳達。

### Neutral
- **紙白** (oklch(100% 0 0))：亮色面板底色，以 82% 不透明度疊在背景上。
- **前庭灰** (oklch(97% 0 0))：亮色頁面背景。瀏覽器網址列顏色用它的 sRGB 等值 **瀏覽器框色** (#f5f5f5)；深色為夜深藍的等值 (#0c1425)。
- **墨黑** (oklch(20% 0 0))：亮色主文字。次要文字用墨黑 66% 混色；細框和分隔線用墨黑 12%。
- **夜板岩** (oklch(20.768% 0.039 265.754))：深色面板底色（78% 不透明度）。
- **夜深藍** (oklch(19.314% 0.037 265.754))：深色頁面背景。
- **夜墨** (oklch(84.153% 0.007 265.754))：深色主文字，次要文字和細框的混色比例與亮色相同。
- **狀態綠** (oklch(76% 0.177 163.223))：頁首「資料截至」的同步狀態點。
- **錯誤紅** (oklch(70% 0.191 22.216))：自訂日期區間的錯誤訊息，以 72% 混入文字色後使用，維持 4.5:1 對比。

### Named Rules
**一線一色法則。** 系列色只用來指認它所代表的那條資料線：價格旁的色點、圖例晶片、圖表線條、浮動提示的色塊，四處同色。系列色不拿來當裝飾、標題色或背景色。

**黃不當字法則。** 價目牌黃在白底上的對比不夠，永遠不直接當文字色。亮色要黃色調文字就用深價目牌黃，深色主題用訊號琥珀（夜）。

## Typography

**Display / Body Font:** Noto Sans TC（備援 PingFang TC、Microsoft JhengHei、系統無襯線字體）
**Numeral / Data Font:** SFMono-Regular（備援 Roboto Mono、Consolas、ui-monospace）

**Character:** 中文用端正的黑體，好讀不張揚；所有價格和表格數字用等寬字，數字逐位對齊，像價目牌上的字卡。

字體透過 `next/font/google` 在 build 時下載並跟網站一起部署（字型切片放在 `/_next/static/_vinext_fonts/`），瀏覽器依 unicode-range 只抓頁面用到的字，執行時不連到 Google。

### Hierarchy
- **Display** (800, clamp(26px, 3.4vw, 34px), 1.15)：頁面唯一的 h1「最新油價」。
- **Headline** (800, clamp(20px, 2.4vw, 24px))：面板標題，如「價格走勢」「區間內最近紀錄」。
- **Title** (700, 14px)：面板內的分組標題，如「國內油品」「國際原油」，單位以 12px、500 字重的次要色接在後面。
- **Body** (400, 16px, 1.5)：基準字級；實際介面多數文字是 11–13px 的標籤。
- **Brand** (800, 18px, -0.02em)：頁首「台灣油價」字樣，手機縮為 16px。
- **Item** (600, 13px)：價格格的品項名稱、週期日期、圖表空狀態。
- **Label** (600, 12px)：漲跌、按鈕、晶片、時間範圍分頁、表單標籤。
- **Micro** (400, 11px)：圖表刻度、浮動提示的單位行、表格分組表頭、品牌下方的等寬網域。
- **Numeral** (800, clamp(30px, 3.6vw, 42px), 1, 等寬、tabular-nums)：最新價格。手機上縮為 clamp(26px, 8.5vw, 34px)。
- **Data** (600, 12px, 等寬、tabular-nums)：表格數字、日期區間、頁首日期。

### Named Rules
**價目牌法則。** 價格永遠是畫面上最大的字。任何標題、圖示或裝飾都不能比最新價格更大或更搶眼。

**等寬只給數字法則。** 等寬字只用在價格、日期、表格數值等需要對齊的資料上，不拿來營造「科技感」。

**字距底線法則。** 字距最緊到 -0.03em，不再更緊。

## Layout

單欄縱向流動，內容最寬 1280px 並置中。頁面外距 16px（手機 9px），面板之間間距 16px（手機 10px）。

頁面順序固定：固定頁首、最新油價面板、價格走勢面板、歷史紀錄面板、純文字頁尾。

- **最新油價面板：** 標題「最新油價」靠左，週期日期靠右對齊在同一條基線上。下方分兩組（國內油品、國際原油），每組先一行分組標題加單位，再一列價格。價格網格固定 4 欄，原油只有 3 項時第 4 欄留空，讓兩組上下對齊。兩組之間用 1px 細線和 22px 上距分開。
- **價格走勢面板：** 標題和目前日期區間在左、時間範圍分頁在右；選「自訂」時日期表單靠右出現在分頁下方。兩張圖（國內、原油）各有一行標題加圖例，圖之間用細線分開。圖高 360px（手機 300px）。
- **歷史紀錄：** 表格最小寬 940px，窄螢幕在容器內橫向捲動；第一欄日期固定在左側，捲動時不會跟著移走。

斷點：
- **900px 以下：** 價格網格改 2 欄，走勢標題與分頁改上下堆疊。
- **680px 以下：** 縮小外距與圓角；頁首只留品牌、狀態點加日期、主題按鈕圖示；時間範圍分頁改成 4 欄 × 2 列，八個選項全部可見。

## Elevation & Depth

這套系統是平貼的。面板不用陰影，靠半透明底色加 1px 細框（文字色 12–13% 混色）和背景分層。只有真的浮在內容上方的東西才有深度。

### Shadow Vocabulary
- **浮動提示** (`box-shadow: 0 10px 30px rgb(0 0 0 / 16%)`)：圖表滑過時的資料提示框，搭配 16px 背景模糊。
- **固定頁首模糊** (`backdrop-filter: blur(16px)`)：頁首捲動時蓋在內容上方，模糊讓下方內容退後。不加陰影。

### Named Rules
**平貼法則。** 平面元素一律不加陰影，也不做背景模糊。陰影和模糊只給真的疊在其他內容上方的元素（浮動提示、固定頁首）。細框和陰影不同時出現在同一個面板上。

## Shapes

圓角分四級：
- **面板：** 16px（手機 14px），是最大的容器圓角，不再更大。
- **控制項容器：** 12px，用於時間分頁外框、品牌圖示、表格外框、圖表空狀態和浮動提示。
- **輸入框、主要按鈕、時間分頁中的選中分頁：** 8px。
- **膠囊：** 小型控制項（圖例晶片、主題切換、幽靈按鈕）用 999px。

色點是 9px 圓形。邊框統一 1px。不用一側色條、斜切角或任何裝飾性幾何。

## Components

### Buttons
輕巧安靜：底色少、細節精準。
- **Shape:** 主要按鈕微圓角 (8px)；幽靈按鈕膠囊形 (999px)。
- **Primary:** 價目牌黃底、價目牌墨字，高 40px。整頁只出現在自訂區間表單的「套用區間」；日期不完整或起訖顛倒時停用。
- **Ghost:** 透明底、文字色，高 32px，用於頁首的主題切換（圖示加「跟隨系統／亮色模式／深色模式」，手機只剩 38px 圓形圖示）。

### Chips（圖例晶片）
圖表上方的圖例同時也是線條開關。
- **Style:** 透明底、1px 細框、12px 600 字、高 32px、左側 9px 系列色點。
- **State:**
  - 顯示中：系列色 10% 淡底、邊框混入 40% 系列色、實心色點。
  - 已隱藏：文字轉次要色、色點變成 1.5px 系列色空心圈。
- **互動：** 滑過時邊框加深到 65% 系列色；鍵盤聚焦是 2px 系列色外框、2px 間距。每張圖至少保留一條線，最後一條按了不會隱藏。用 `aria-pressed` 傳達狀態。

### Range Tabs（時間範圍分頁）
- **Style:** daisyUI 盒狀分頁，外框 12px 圓角、4px 內距、70% 前庭灰底。選項為 3 個月、6 個月、1 年、3 年、5 年、10 年、全部、自訂。未選中的分頁用次要文字色（66%），滑過時轉為主文字色。
- **Active:** 紙白底、8px 圓角、輕微浮起（daisyUI 內建的 1–6px 柔和陰影，這是平貼法則唯一的例外）。
- **手機：** 4 欄 × 2 列網格，八個選項一次全部看得到，不靠橫向捲動。

### Cards / Containers（面板）
- **Corner Style:** 16px（手機 14px）。
- **Background:** 紙白 82%（深色為夜板岩 78%）。
- **Shadow Strategy:** 無，見「平貼法則」。
- **Border:** 1px 細框。
- **Internal Padding:** clamp(18px, 3vw, 28px)，手機 18px 14px。
- **不巢狀：** 面板裡不再放卡片。分組靠標題、間距和細線，不靠另一層容器。

### Inputs / Fields
- **Style:** daisyUI 有框輸入框，8px 圓角，背景為 91% 紙白，原生日期選擇器。
- **Label:** 輸入框上方 12px 600 次要色標籤（開始日期、結束日期）。
- **Error:** 表單下方 12px 錯誤文字（錯誤紅 72% 混文字色），寫明問題（「請選擇完整的起訖日期。」「開始日期不能晚於結束日期。」），同時停用套用按鈕。

### Navigation（頁首）
- **Style:** 固定在頂端 16px（手機 9px），1px 細框、16px 圓角、91% 不透明底加 16px 模糊。
- **內容：** 左邊是品牌（40px 價目牌黃方塊圖示 + 「台灣油價」18px 800 字 + 等寬小字網域），右邊是資料狀態（脈動的狀態綠點 + 「資料截至」+ 等寬日期）和主題切換。
- **手機：** 隱藏網域小字、「資料截至」字樣和主題文字，只保留圖示、狀態點和日期。
- 狀態點的脈動在 `prefers-reduced-motion` 下關閉。

### Price Tile（價格格，招牌元件）
價目牌意象的核心。由上而下三行：
1. 色點加品項名稱（13px 600 次要色）。
2. 價格（Numeral 字級）。
3. 漲跌（12px 600）：上漲／下跌圖示加「較上週 +0.01」，持平是減號加「與上週持平」，沒資料是「暫無上週資料」或「本期尚無資料」。

沒有邊框、底色、陰影，純靠網格間距排列。價格格是純資料展示，不可點擊。缺值顯示「—」。

### Trend Chart（趨勢圖）
Recharts 折線圖：
- **格線與座標：** 只有水平虛線格線（13% 文字色，4 7 虛線），座標軸不畫軸線和刻度線，刻度字 11px 次要色。
- **Y 軸刻度：** 依目前顯示的線條自動算出約 5 個整齊刻度，間距取 1、2、4、5、10 乘上數量級（例如 24／28／32／36／40），最高的線上方至少留一成間距。隱藏線條時刻度跟著重算。
- **線條：** 2.5px 圓角平滑曲線（monotone），不畫資料點；滑過時出現 4px 實心點。
- **缺值：** 國內油價連接缺值；原油不連接，缺的週次直接斷線，不替缺值補線。
- **浮動提示：** 列出日期、各系列色塊、名稱、等寬數值，最後一行是單位。

### Data Table（歷史紀錄表）
- daisyUI 斑馬紋表格，外包 1px 細框、12px 圓角容器。
- 表頭兩層：第一層是分組加單位，第二層是品項短名。
- 第一欄日期靠左（列標題、固定在左側），其餘數值靠右，用 Data 字級對齊。缺值顯示「—」。

## Do's and Don'ts

### Do:
- **Do** 讓最新價格保持全頁最大字：clamp(30px, 3.6vw, 42px)、800、等寬。
- **Do** 每個系列在色點、圖例、線條、提示四處使用同一個系列色，深色主題換成對應的夜版色值。
- **Do** 單位只在分組標題說一次（「國內油品 元／公升」），不要每個價格後面都重複。
- **Do** 缺值一律顯示「—」，原油圖遇缺值斷線，絕不補值或估算。
- **Do** 漲跌顏色一定搭配上升、下降或持平圖示。
- **Do** 面板用 1px 細框加 16px 圓角，靠間距和細線分組。
- **Do** 數字一律開 tabular-nums。

### Don't:
- **Don't** 在標題上方加小標籤或分類字（eyebrow／kicker），標題本身就夠了。
- **Don't** 用漸層文字、裝飾光圈、漂浮色塊；背景只保留右上角那一層訊號琥珀光暈。
- **Don't** 在面板裡再放卡片，也不要在平面元素上加陰影或背景模糊。
- **Don't** 重複顯示同一個數字或同一段日期區間（例如把 95 無鉛同時放成主視覺大數字和價格格）。
- **Don't** 把價目牌黃直接當淺色背景上的文字色。
- **Don't** 讓 daisyUI 主題預設色蓋過品牌色；主題的 primary 一律覆寫成價目牌黃系。
- **Don't** 用一側色條（只有一邊的邊框或偽元素）標示狀態；改用整圈細框、淡底色或色點。
- **Don't** 字距緊於 -0.03em，也不要把等寬字用在非數字的文字上。
