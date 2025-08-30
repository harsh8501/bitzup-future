import cron from "node-cron";
import { client } from "../utils/utils.js";
import pool from "../connection/dbConnection.js";

import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, "../.env")
});

// const getDecimalPlaces = (value) => {
//   if (!value || typeof value !== "string") return 0;
//   const parts = value.split(".");
//   return parts[1] ? parts[1].length : 0;
// };

async function getBybitTickers() {
  try {
    const res = await client.getTickers({ category: "linear" });
    return res.result.list || [];
  } catch (err) {
    console.error("Error fetching Bybit tickers:", err.message);
    return [];
  }
}

async function updateTickers(tickers) {
  if (!tickers.length) return;

  const rows = await pool.query(`
    SELECT symbol, last_price, volume_24h, change_24h
    FROM futures_currencies
    WHERE status = 1
  `);

  const dbMap = Object.fromEntries(
    rows.map(row => [
      row.symbol,
      {
        last_price: parseFloat(row.last_price),
        volume_24h: parseFloat(row.volume_24h),
        change_24h: parseFloat(row.change_24h)
      }
    ])
  );

  // updates for only changed rows
  const updates = [];
  for (const ticker of tickers) {
    const symbol = ticker.symbol;
    const price = parseFloat(ticker.lastPrice);
    const volume = parseFloat(ticker.volume24h);
    const change = (parseFloat(ticker.price24hPcnt) * 100).toFixed(2);

    const dbData = dbMap[symbol];
    if (!dbData) continue;

    if (
      dbData.last_price !== price ||
      dbData.volume_24h !== volume ||
      dbData.change_24h !== change
    ) {
      updates.push([symbol, price, volume, change]);
    }
  }

  if (updates.length) {
    // const sql = `
    //   UPDATE futures_currencies
    //   SET last_price = ?, volume_24h = ?, change_24h = ?
    //   WHERE symbol = ?
    // `;
    // for (const upd of updates) {
    //   await pool.query(sql, upd);
    // }
    const sql = `
      INSERT INTO futures_currencies (symbol, last_price, volume_24h, change_24h)
      VALUES ?
      ON DUPLICATE KEY UPDATE
        last_price = VALUES(last_price),
        volume_24h = VALUES(volume_24h),
        change_24h = VALUES(change_24h)
    `;
    await pool.query(sql, [updates]);
    console.log(`Updated ${updates.length} tickers`);
  }
}

// Cron job: every 5 seconds
cron.schedule("*/5 * * * * *", async () => {
  console.log("Fetching tickers...");
  const tickers = await getBybitTickers();
  await updateTickers(tickers);
});
