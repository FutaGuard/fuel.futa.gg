import { FuelDashboard, type FuelPriceRecord } from "./FuelDashboard";

const API_BASE_URL = "https://opendata.futa.gg";
const PAGE_SIZE = 1000;
const MAX_PAGES = 10;

function isNullableFiniteNumber(value: unknown): value is number | null {
  return value === null || (typeof value === "number" && Number.isFinite(value));
}

function isFuelPriceRecord(value: unknown): value is FuelPriceRecord {
  if (typeof value !== "object" || value === null) return false;

  const record = value as Partial<Record<keyof FuelPriceRecord, unknown>>;
  return (
    Number.isInteger(record.id) &&
    typeof record.period_start === "string" &&
    typeof record.period_end === "string" &&
    typeof record.unleaded_92 === "number" &&
    Number.isFinite(record.unleaded_92) &&
    typeof record.unleaded_95 === "number" &&
    Number.isFinite(record.unleaded_95) &&
    typeof record.unleaded_98 === "number" &&
    Number.isFinite(record.unleaded_98) &&
    typeof record.super_diesel === "number" &&
    Number.isFinite(record.super_diesel) &&
    isNullableFiniteNumber(record.west_texas) &&
    isNullableFiniteNumber(record.dubai) &&
    isNullableFiniteNumber(record.brent)
  );
}

async function fetchFuelPrices(): Promise<FuelPriceRecord[]> {
  const records: FuelPriceRecord[] = [];

  for (let page = 0; page < MAX_PAGES; page += 1) {
    const offset = page * PAGE_SIZE;
    const response = await fetch(
      `${API_BASE_URL}/fuel-prices?limit=${PAGE_SIZE}&offset=${offset}`,
      { headers: { accept: "application/json" } },
    );

    if (!response.ok) {
      throw new Error(`Fuel API returned ${response.status}`);
    }

    const payload: unknown = await response.json();
    if (!Array.isArray(payload)) {
      throw new Error("Fuel API returned an unexpected payload");
    }

    const pageRecords = payload.filter(isFuelPriceRecord);
    records.push(...pageRecords);

    if (payload.length < PAGE_SIZE) break;
  }

  const uniqueRecords = new Map<number, FuelPriceRecord>();
  records.forEach((record) => uniqueRecords.set(record.id, record));

  return [...uniqueRecords.values()].sort(
    (a, b) => Date.parse(a.period_start) - Date.parse(b.period_start),
  );
}

export default async function Home() {
  let records: FuelPriceRecord[] = [];
  let dataError: string | null = null;

  try {
    records = await fetchFuelPrices();
    if (records.length === 0) {
      dataError = "目前沒有可顯示的油價資料。";
    }
  } catch {
    dataError = "暫時無法從開放資料服務載入油價，請稍後再試。";
  }

  return (
    <FuelDashboard
      initialRecords={records}
      dataError={dataError}
      fetchedAt={new Date().toISOString()}
    />
  );
}
