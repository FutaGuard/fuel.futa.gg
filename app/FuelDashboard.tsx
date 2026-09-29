"use client";

import {
  CalendarRange,
  Check,
  Database,
  ExternalLink,
  Flame,
  Fuel,
  Minus,
  Monitor,
  Moon,
  RotateCcw,
  Sun,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type FormEvent,
} from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipContentProps,
} from "recharts";

export interface FuelPriceRecord {
  id: number;
  period_start: string;
  period_end: string;
  unleaded_92: number;
  unleaded_95: number;
  unleaded_98: number;
  super_diesel: number;
  west_texas: number | null;
  dubai: number | null;
  brent: number | null;
}

type FuelKey =
  | "unleaded_92"
  | "unleaded_95"
  | "unleaded_98"
  | "super_diesel";
type CrudeKey = "west_texas" | "dubai" | "brent";
type RangePreset = "3m" | "6m" | "1y" | "3y" | "5y" | "10y" | "all" | "custom";
type ThemeMode = "system" | "light" | "dark";
type ChartRecord = FuelPriceRecord & { date: string };

const SERIES = [
  { key: "unleaded_92", label: "92 無鉛", shortLabel: "92", color: "var(--fuel-92)" },
  { key: "unleaded_95", label: "95 無鉛", shortLabel: "95", color: "var(--fuel-95)" },
  { key: "unleaded_98", label: "98 無鉛", shortLabel: "98", color: "var(--fuel-98)" },
  { key: "super_diesel", label: "超級柴油", shortLabel: "柴油", color: "var(--fuel-diesel)" },
] as const;

const CRUDE_SERIES = [
  {
    key: "west_texas",
    label: "西德州原油",
    shortLabel: "WTI",
    color: "var(--crude-wti)",
  },
  {
    key: "dubai",
    label: "杜拜原油",
    shortLabel: "Dubai",
    color: "var(--crude-dubai)",
  },
  {
    key: "brent",
    label: "布蘭特原油",
    shortLabel: "Brent",
    color: "var(--crude-brent)",
  },
] as const;

const ALL_SERIES = [...SERIES, ...CRUDE_SERIES] as const;

const RANGE_OPTIONS: ReadonlyArray<{
  id: RangePreset;
  label: string;
  months?: number;
}> = [
  { id: "3m", label: "3 個月", months: 3 },
  { id: "6m", label: "6 個月", months: 6 },
  { id: "1y", label: "1 年", months: 12 },
  { id: "3y", label: "3 年", months: 36 },
  { id: "5y", label: "5 年", months: 60 },
  { id: "10y", label: "10 年", months: 120 },
  { id: "all", label: "全部" },
  { id: "custom", label: "自訂" },
];

const fullDateFormatter = new Intl.DateTimeFormat("zh-TW", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  timeZone: "UTC",
});

const shortDateFormatter = new Intl.DateTimeFormat("zh-TW", {
  month: "2-digit",
  day: "2-digit",
  timeZone: "UTC",
});

function toTaipeiDate(iso: string) {
  const parts = new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Asia/Taipei",
  }).formatToParts(new Date(iso));
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function parseDate(date: string) {
  return new Date(`${date}T00:00:00Z`);
}

function subtractMonths(date: string, months: number) {
  const source = parseDate(date);
  const day = source.getUTCDate();
  const target = new Date(
    Date.UTC(source.getUTCFullYear(), source.getUTCMonth() - months, 1),
  );
  const lastDay = new Date(
    Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0),
  ).getUTCDate();
  target.setUTCDate(Math.min(day, lastDay));
  return target.toISOString().slice(0, 10);
}

function formatDate(date: string) {
  return fullDateFormatter.format(parseDate(date));
}

function formatShortDate(date: string) {
  return shortDateFormatter.format(parseDate(date));
}

function formatAxisDate(date: string, spanInDays: number) {
  if (spanInDays > 365 * 3) return date.slice(0, 4);
  if (spanInDays > 365) return `${date.slice(0, 4)}/${date.slice(5, 7)}`;
  return `${date.slice(5, 7)}/${date.slice(8, 10)}`;
}

function formatPrice(value: number) {
  return value.toFixed(2);
}

function formatOptionalPrice(value: number | null) {
  return value === null ? "—" : formatPrice(value);
}

function roundedChange(value: number) {
  return Math.round(value * 100) / 100;
}

function formatChange(value: number) {
  const rounded = roundedChange(value);
  if (rounded > 0) return `+${rounded.toFixed(2)}`;
  if (rounded < 0) return `−${Math.abs(rounded).toFixed(2)}`;
  return "0.00";
}

function rangeSpanInDays(records: ChartRecord[]) {
  if (records.length < 2) return 0;
  return Math.round(
    (parseDate(records[records.length - 1].date).getTime() -
      parseDate(records[0].date).getTime()) /
      86_400_000,
  );
}

function getSeries(key: unknown) {
  return ALL_SERIES.find((series) => series.key === key);
}

function isCrudeKey(key: unknown): key is CrudeKey {
  return CRUDE_SERIES.some((series) => series.key === key);
}

function ChartTooltip({
  active,
  label,
  payload,
}: TooltipContentProps) {
  if (!active || !payload?.length) return null;

  return (
    <div className="chart-tooltip">
      <p>{formatDate(String(label))}</p>
      <ul>
        {payload.map((item) => {
          const series = getSeries(item.dataKey);
          if (!series || typeof item.value !== "number") return null;
          return (
            <li key={series.key}>
              <span
                className="chart-tooltip-swatch"
                style={{ backgroundColor: series.color }}
              />
              <span>{series.label}</span>
              <strong>{formatPrice(item.value)}</strong>
            </li>
          );
        })}
      </ul>
      <small>{payload.some((item) => isCrudeKey(item.dataKey)) ? "美元／桶" : "元／公升"}</small>
    </div>
  );
}

function ThemeToggle() {
  const mode = useSyncExternalStore<ThemeMode>(
    (onStoreChange) => {
      const handleChange = () => onStoreChange();
      window.addEventListener("storage", handleChange);
      window.addEventListener("fuel-theme-mode-change", handleChange);
      return () => {
        window.removeEventListener("storage", handleChange);
        window.removeEventListener("fuel-theme-mode-change", handleChange);
      };
    },
    () => {
      const stored = window.localStorage.getItem("fuel-theme-mode");
      return stored === "light" || stored === "dark" || stored === "system"
        ? stored
        : "system";
    },
    () => "system",
  );

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const applyTheme = () => {
      const resolved = mode === "system" ? (media.matches ? "dark" : "light") : mode;
      const root = document.documentElement;
      root.dataset.theme = resolved === "dark" ? "night" : "bumblebee";
      root.dataset.themeMode = mode;
      root.style.colorScheme = resolved;
    };

    applyTheme();
    if (mode === "system") media.addEventListener("change", applyTheme);
    return () => media.removeEventListener("change", applyTheme);
  }, [mode]);

  const nextMode: Record<ThemeMode, ThemeMode> = {
    system: "light",
    light: "dark",
    dark: "system",
  };
  const labels: Record<ThemeMode, string> = {
    system: "跟隨系統",
    light: "亮色模式",
    dark: "深色模式",
  };
  const Icon = mode === "light" ? Sun : mode === "dark" ? Moon : Monitor;

  return (
    <button
      type="button"
      className="btn btn-sm btn-ghost theme-toggle"
      aria-label={`${labels[mode]}，切換顯示模式`}
      onClick={() => {
        window.localStorage.setItem("fuel-theme-mode", nextMode[mode]);
        window.dispatchEvent(new Event("fuel-theme-mode-change"));
      }}
    >
      <Icon size={17} aria-hidden="true" />
      <span className="theme-toggle-label">{labels[mode]}</span>
    </button>
  );
}

function SiteHeader({
  latestPeriodEnd,
}: {
  latestPeriodEnd: string | null;
}) {
  const latestDate = latestPeriodEnd ? toTaipeiDate(latestPeriodEnd) : null;
  const hasData = latestDate !== null;
  const dataLabel = latestDate ? formatDate(latestDate) : null;

  return (
    <header className="site-header glass-panel">
      <a className="brand" href="#top" aria-label="回到台灣油價首頁頂端">
        <span className="brand-mark">
          <Fuel size={21} strokeWidth={2.2} aria-hidden="true" />
        </span>
        <span className="brand-copy">
          <strong>
            台灣<span>油價</span>
          </strong>
          <small>fuel.futa.gg</small>
        </span>
      </a>

      <div className="header-actions">
        <div className="sync-status" aria-label={dataLabel ? `國內油價資料截至 ${dataLabel}` : "目前無法取得油價資料"}>
          <span
            className={`sync-status-indicator ${hasData ? "is-synced" : "is-offline"}`}
            aria-hidden="true"
          >
            {hasData ? <span className="sync-status-pulse" /> : null}
            <span className="sync-status-dot" />
          </span>
          <span>{hasData ? "資料截至" : "暫無資料"}</span>
          {latestDate ? <time dateTime={latestDate}>{dataLabel}</time> : null}
        </div>
        <ThemeToggle />
        <a
          href="https://github.com/FutaGuard/SunsetRollercoaster"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-sm btn-ghost header-api-link"
          aria-label="前往 SunsetRollercoaster API GitHub 專案"
        >
          API <ExternalLink size={15} aria-hidden="true" />
        </a>
      </div>
    </header>
  );
}

function PriceDelta({
  value,
  emptyLabel = "暫無上週資料",
}: {
  value: number | null;
  emptyLabel?: string;
}) {
  if (value === null) {
    return (
      <span className="price-delta is-flat">
        <Minus size={13} aria-hidden="true" />
        {emptyLabel}
      </span>
    );
  }

  const rounded = roundedChange(value);
  const Icon = rounded > 0 ? TrendingUp : rounded < 0 ? TrendingDown : Minus;
  const label = rounded === 0 ? "與上週持平" : `較上週 ${formatChange(rounded)}`;

  return (
    <span className={`price-delta ${rounded > 0 ? "is-up" : rounded < 0 ? "is-down" : "is-flat"}`}>
      <Icon size={13} aria-hidden="true" />
      {label}
    </span>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <section className="empty-state glass-panel" role="status">
      <span className="empty-state-icon"><Database size={26} aria-hidden="true" /></span>
      <div>
        <h1>目前無法顯示油價資料</h1>
        <p>{message}</p>
      </div>
    </section>
  );
}

function DashboardContent({ records }: { records: FuelPriceRecord[] }) {
  const chartRecords = useMemo<ChartRecord[]>(
    () => records.map((record) => ({ ...record, date: toTaipeiDate(record.period_start) })),
    [records],
  );
  const latest = chartRecords[chartRecords.length - 1];
  const previous = chartRecords[chartRecords.length - 2];
  const earliestDate = chartRecords[0].date;
  const latestDate = latest.date;
  const latestEndDate = toTaipeiDate(latest.period_end);

  const [range, setRange] = useState<RangePreset>("1y");
  const [customDraft, setCustomDraft] = useState(() => ({
    start: subtractMonths(latestDate, 12),
    end: latestDate,
  }));
  const [customRange, setCustomRange] = useState(customDraft);
  const [visibleSeries, setVisibleSeries] = useState<Set<FuelKey>>(
    () => new Set(SERIES.map((series) => series.key)),
  );
  const [visibleCrudeSeries, setVisibleCrudeSeries] = useState<Set<CrudeKey>>(
    () => new Set(CRUDE_SERIES.map((series) => series.key)),
  );

  const selectedRange = useMemo(() => {
    if (range === "all") return { start: earliestDate, end: latestDate };
    if (range === "custom") return customRange;
    const option = RANGE_OPTIONS.find((item) => item.id === range);
    return {
      start: subtractMonths(latestDate, option?.months ?? 12),
      end: latestDate,
    };
  }, [customRange, earliestDate, latestDate, range]);

  const visibleRecords = useMemo(
    () =>
      chartRecords.filter(
        (record) => record.date >= selectedRange.start && record.date <= selectedRange.end,
      ),
    [chartRecords, selectedRange],
  );
  const recentRecords = useMemo(
    () => [...visibleRecords].reverse().slice(0, 12),
    [visibleRecords],
  );
  const crudeRecordCount = visibleRecords.filter((record) =>
    CRUDE_SERIES.some((series) => record[series.key] !== null),
  ).length;
  const spanInDays = rangeSpanInDays(visibleRecords);
  const customError =
    !customDraft.start || !customDraft.end
      ? "請選擇完整的起訖日期。"
      : customDraft.start > customDraft.end
        ? "開始日期不能晚於結束日期。"
        : null;

  const toggleSeries = (key: FuelKey) => {
    setVisibleSeries((current) => {
      if (current.has(key) && current.size === 1) return current;
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const toggleCrudeSeries = (key: CrudeKey) => {
    setVisibleCrudeSeries((current) => {
      if (current.has(key) && current.size === 1) return current;
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const applyCustomRange = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (customError) return;
    setCustomRange(customDraft);
    setRange("custom");
  };

  const resetCustomRange = () => {
    const next = { start: earliestDate, end: latestDate };
    setCustomDraft(next);
    setCustomRange(next);
  };

  return (
    <>
      <section className="hero-card glass-panel" aria-labelledby="hero-title">
        <div className="hero-decoration" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="status status-warning status-xs" />
            {formatShortDate(latestDate)} — {formatShortDate(latestEndDate)}
          </div>
          <h1 id="hero-title">
            最新全台<span>油價</span>
          </h1>
          <p>一次掌握 4 種國內油品與 3 大國際原油的最新價格，並自由探索超過 20 年的歷史趨勢。</p>
        </div>
        <div className="hero-highlight">
          <span>95 無鉛汽油</span>
          <strong>{formatPrice(latest.unleaded_95)}</strong>
          <small>元／公升 · <PriceDelta value={previous ? latest.unleaded_95 - previous.unleaded_95 : null} /></small>
        </div>
      </section>

      <section className="price-grid" aria-label="最新各油品價格，可切換圖表線條">
        {SERIES.map((series) => {
          const isVisible = visibleSeries.has(series.key);
          return (
            <button
              key={series.key}
              type="button"
              className={`card glass-panel price-card ${isVisible ? "is-active" : "is-muted"}`}
              style={{ "--series-color": series.color } as CSSProperties}
              aria-pressed={isVisible}
              onClick={() => toggleSeries(series.key)}
            >
              <span className="price-card-header">
                <span>{series.label}</span>
                <span className="series-dot" />
              </span>
              <span className="price-value">
                {formatPrice(latest[series.key])}<small>元／L</small>
              </span>
              <PriceDelta value={previous ? latest[series.key] - previous[series.key] : null} />
              <span className="series-state">
                {isVisible ? <Check size={12} aria-hidden="true" /> : null}
                {isVisible ? "圖表顯示中" : "已從圖表隱藏"}
              </span>
            </button>
          );
        })}
      </section>

      <section className="chart-card glass-panel" aria-labelledby="trend-title">
        <div className="chart-heading">
          <div>
            <span className="section-kicker"><CalendarRange size={15} aria-hidden="true" />歷史趨勢</span>
            <h2 id="trend-title">油品價格走勢</h2>
            <p>點選上方油品卡可顯示或隱藏線條。</p>
          </div>
          <div className="range-summary">
            <strong>{visibleRecords.length.toLocaleString("zh-TW")}</strong>
            <span>週資料</span>
          </div>
        </div>

        <div className="range-toolbar">
          <div className="tabs tabs-box range-tabs" role="group" aria-label="選擇圖表時間範圍">
            {RANGE_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                className={`tab ${range === option.id ? "tab-active" : ""}`}
                aria-pressed={range === option.id}
                onClick={() => setRange(option.id)}
              >
                {option.label}
              </button>
            ))}
          </div>
          <p className="selected-range" aria-live="polite">
            {visibleRecords.length > 0
              ? `${formatDate(visibleRecords[0].date)} — ${formatDate(visibleRecords[visibleRecords.length - 1].date)}`
              : `${formatDate(selectedRange.start)} — ${formatDate(selectedRange.end)}`}
          </p>
        </div>

        {range === "custom" ? (
          <form className="custom-range" onSubmit={applyCustomRange}>
            <label className="form-control">
              <span className="label-text">開始日期</span>
              <input
                type="date"
                className="input input-bordered"
                min={earliestDate}
                max={customDraft.end || latestDate}
                value={customDraft.start}
                onChange={(event) =>
                  setCustomDraft((current) => ({ ...current, start: event.target.value }))
                }
              />
            </label>
            <label className="form-control">
              <span className="label-text">結束日期</span>
              <input
                type="date"
                className="input input-bordered"
                min={customDraft.start || earliestDate}
                max={latestDate}
                value={customDraft.end}
                onChange={(event) =>
                  setCustomDraft((current) => ({ ...current, end: event.target.value }))
                }
              />
            </label>
            <div className="custom-range-actions">
              <button type="submit" className="btn btn-primary" disabled={Boolean(customError)}>
                套用區間
              </button>
              <button type="button" className="btn btn-ghost" onClick={resetCustomRange}>
                <RotateCcw size={15} aria-hidden="true" />
                全部期間
              </button>
            </div>
            {customError ? <p className="custom-error">{customError}</p> : null}
          </form>
        ) : null}

        {visibleRecords.length > 0 ? (
          <div
            className="chart-canvas"
            role="img"
            aria-label={`${formatDate(visibleRecords[0].date)}至${formatDate(visibleRecords[visibleRecords.length - 1].date)}，四種油品每週價格趨勢圖`}
          >
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <LineChart data={visibleRecords} margin={{ top: 16, right: 8, bottom: 4, left: 0 }}>
                <CartesianGrid stroke="var(--chart-grid)" strokeDasharray="4 7" vertical={false} />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  minTickGap={52}
                  tick={{ fill: "var(--chart-muted)", fontSize: 11 }}
                  tickFormatter={(date: string) => formatAxisDate(date, spanInDays)}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  width={42}
                  domain={["dataMin - 1", "dataMax + 1"]}
                  tick={{ fill: "var(--chart-muted)", fontSize: 11 }}
                  tickFormatter={(value: number) => value.toFixed(0)}
                />
                <Tooltip
                  content={ChartTooltip}
                  cursor={{ stroke: "var(--chart-cursor)", strokeDasharray: "4 4" }}
                  isAnimationActive={false}
                />
                {SERIES.map((series) =>
                  visibleSeries.has(series.key) ? (
                    <Line
                      key={series.key}
                      type="monotone"
                      dataKey={series.key}
                      name={series.label}
                      stroke={series.color}
                      strokeWidth={2.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      dot={false}
                      activeDot={{ r: 4, strokeWidth: 2, fill: series.color }}
                      connectNulls
                      animationDuration={260}
                    />
                  ) : null,
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="chart-empty" role="status">
            <CalendarRange size={22} aria-hidden="true" />
            <span>這個日期區間沒有週油價資料，請調整起訖日期。</span>
          </div>
        )}
      </section>

      <section className="crude-section glass-panel" aria-labelledby="crude-overview-title">
        <div className="crude-heading">
          <div>
            <span className="section-kicker"><Flame size={15} aria-hidden="true" />國際原油</span>
            <h2 id="crude-overview-title">同期原油均價</h2>
            <p>與國內油價相同週期的原油均價，尚未取得的價格以「—」表示；點選卡片可切換下方圖表線條。</p>
          </div>
          <span className="badge badge-ghost">USD／桶</span>
        </div>

        <div className="crude-grid" aria-label="同期國際原油價格，可切換圖表線條">
          {CRUDE_SERIES.map((series) => {
            const isVisible = visibleCrudeSeries.has(series.key);
            const currentValue = latest[series.key];
            const previousValue = previous?.[series.key] ?? null;
            const change =
              currentValue === null || previousValue === null
                ? null
                : currentValue - previousValue;

            return (
              <button
                key={series.key}
                type="button"
                className={`card glass-panel price-card crude-price-card ${isVisible ? "is-active" : "is-muted"}`}
                style={{ "--series-color": series.color } as CSSProperties}
                aria-pressed={isVisible}
                onClick={() => toggleCrudeSeries(series.key)}
              >
                <span className="price-card-header">
                  <span>{series.label}</span>
                  <span className="series-dot" />
                </span>
                <span className="price-value">
                  {formatOptionalPrice(currentValue)}<small>USD／桶</small>
                </span>
                <PriceDelta
                  value={change}
                  emptyLabel={currentValue === null ? "本期尚無資料" : "暫無上週資料"}
                />
                <span className="series-state">
                  {isVisible ? <Check size={12} aria-hidden="true" /> : null}
                  {isVisible ? "圖表顯示中" : "已從圖表隱藏"}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="chart-card glass-panel" aria-labelledby="crude-trend-title">
        <div className="chart-heading">
          <div>
            <span className="section-kicker"><CalendarRange size={15} aria-hidden="true" />國際行情</span>
            <h2 id="crude-trend-title">原油價格走勢</h2>
            <p>沿用上方選擇的時間範圍，方便對照國內油價與國際行情。</p>
          </div>
          <div className="range-summary">
            <strong>{crudeRecordCount.toLocaleString("zh-TW")}</strong>
            <span>週資料</span>
          </div>
        </div>

        <div className="linked-range">
          <span className="badge badge-outline">同步時間範圍</span>
          <p className="selected-range" aria-live="polite">
            {visibleRecords.length > 0
              ? `${formatDate(visibleRecords[0].date)} — ${formatDate(visibleRecords[visibleRecords.length - 1].date)}`
              : `${formatDate(selectedRange.start)} — ${formatDate(selectedRange.end)}`}
          </p>
        </div>

        {crudeRecordCount > 0 ? (
          <div
            className="chart-canvas"
            role="img"
            aria-label={`${formatDate(visibleRecords[0].date)}至${formatDate(visibleRecords[visibleRecords.length - 1].date)}，三種國際原油每週平均價格趨勢圖`}
          >
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <LineChart data={visibleRecords} margin={{ top: 16, right: 8, bottom: 4, left: 0 }}>
                <CartesianGrid stroke="var(--chart-grid)" strokeDasharray="4 7" vertical={false} />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  minTickGap={52}
                  tick={{ fill: "var(--chart-muted)", fontSize: 11 }}
                  tickFormatter={(date: string) => formatAxisDate(date, spanInDays)}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  width={42}
                  domain={["dataMin - 5", "dataMax + 5"]}
                  tick={{ fill: "var(--chart-muted)", fontSize: 11 }}
                  tickFormatter={(value: number) => value.toFixed(0)}
                />
                <Tooltip
                  content={ChartTooltip}
                  cursor={{ stroke: "var(--chart-cursor)", strokeDasharray: "4 4" }}
                  isAnimationActive={false}
                />
                {CRUDE_SERIES.map((series) =>
                  visibleCrudeSeries.has(series.key) ? (
                    <Line
                      key={series.key}
                      type="monotone"
                      dataKey={series.key}
                      name={series.label}
                      stroke={series.color}
                      strokeWidth={2.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      dot={false}
                      activeDot={{ r: 4, strokeWidth: 2, fill: series.color }}
                      connectNulls={false}
                      animationDuration={260}
                    />
                  ) : null,
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="chart-empty" role="status">
            <CalendarRange size={22} aria-hidden="true" />
            <span>{visibleRecords.length > 0
              ? "這個日期區間尚無原油資料，國內油價仍正常顯示。"
              : "這個日期區間沒有原油資料，請調整起訖日期。"}</span>
          </div>
        )}
      </section>

      <section className="history-card glass-panel" aria-labelledby="history-title">
        <div className="history-heading">
          <div>
            <span className="section-kicker"><Database size={15} aria-hidden="true" />歷史資料</span>
            <h2 id="history-title">區間內最近紀錄</h2>
          </div>
          <span className="badge badge-ghost">最多顯示 12 筆</span>
        </div>

        {recentRecords.length > 0 ? (
          <div className="table-wrap">
            <table className="table table-zebra fuel-table">
              <thead>
                <tr>
                  <th rowSpan={2}>週期起始</th>
                  <th className="table-group" colSpan={SERIES.length}>國內油價（元／L）</th>
                  <th className="table-group" colSpan={CRUDE_SERIES.length}>國際原油（USD／桶）</th>
                </tr>
                <tr>
                  {SERIES.map((series) => <th key={series.key}>{series.shortLabel}</th>)}
                  {CRUDE_SERIES.map((series) => <th key={series.key}>{series.shortLabel}</th>)}
                </tr>
              </thead>
              <tbody>
                {recentRecords.map((record) => (
                  <tr key={record.id}>
                    <th>{formatDate(record.date)}</th>
                    {SERIES.map((series) => (
                      <td key={series.key}>{formatPrice(record[series.key])}</td>
                    ))}
                    {CRUDE_SERIES.map((series) => (
                      <td key={series.key}>{formatOptionalPrice(record[series.key])}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="history-empty">此區間沒有可列出的資料。</p>
        )}
      </section>
    </>
  );
}

export function FuelDashboard({
  initialRecords,
  dataError,
}: {
  initialRecords: FuelPriceRecord[];
  dataError: string | null;
}) {
  const hasData = initialRecords.length > 0;

  return (
    <div className="fuel-app" id="top">
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />
      <SiteHeader latestPeriodEnd={initialRecords[initialRecords.length - 1]?.period_end ?? null} />
      <main className="site-main">
        {hasData ? (
          <DashboardContent records={initialRecords} />
        ) : (
          <EmptyState message={dataError ?? "目前沒有可顯示的油價資料。"} />
        )}
      </main>
      <footer className="site-footer glass-panel">
        <p>全國油品與國際原油週平均價格 · 時區 Asia/Taipei</p>
        <nav aria-label="資料來源">
          <a href="https://opendata.futa.gg/swagger-ui#/fuel-prices/list_fuel_prices" target="_blank" rel="noreferrer">
            API 文件 <ExternalLink size={13} aria-hidden="true" />
          </a>
          <a href="https://opendata.futa.gg" target="_blank" rel="noreferrer">
            opendata.futa.gg <ExternalLink size={13} aria-hidden="true" />
          </a>
        </nav>
      </footer>
    </div>
  );
}
