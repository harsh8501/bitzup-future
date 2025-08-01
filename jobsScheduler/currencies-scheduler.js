import cron from "node-cron";

const getDecimalPlaces = (value) => {
  if (!value || typeof value !== "string") return 0;
  const parts = value.split(".");
  return parts[1] ? parts[1].length : 0;
};

const storeFuturesCurrencies = async () => {
  try {
    const [instrumentRes, tickerRes] = await Promise.all([
      client.getInstrumentsInfo({ category: "linear", limit: 1000 }),
      client.getTickers({ category: "linear" }),
    ]);

    const instruments = instrumentRes.result.list;
    const tickers = tickerRes.result.list;

    if (!instruments?.length || !tickers?.length) {
      console.log("No instruments or tickers data");
      return;
    }

    const tickerMap = new Map();
    tickers.forEach((t) => tickerMap.set(t.symbol, t));

    const values = [];

    for (const instrument of instruments) {
      const ticker = tickerMap.get(instrument.symbol);
      if (!ticker) continue;

      const price_decimal = getDecimalPlaces(instrument.priceFilter.tickSize);
      const qty_decimal = getDecimalPlaces(instrument.lotSizeFilter.qtyStep);

      values.push([
        instrument.symbol,
        instrument.baseCoin,
        instrument.quoteCoin,
        parseFloat(ticker.lastPrice),
        parseFloat(ticker.volume24h),
        parseFloat(ticker.price24hPcnt),
        parseFloat(instrument.leverageFilter?.maxLeverage || 0),
        parseInt(price_decimal),
        parseInt(qty_decimal),
      ]);
    }

    const query = `
      INSERT INTO futures_currencies 
        (symbol, base_coin, quote_coin, last_price, volume_24h, change_24h, max_leverage, price_decimal, qty_decimal)
      VALUES ?
      ON DUPLICATE KEY UPDATE
        base_coin = VALUES(base_coin),
        quote_coin = VALUES(quote_coin),
        last_price = VALUES(last_price),
        volume_24h = VALUES(volume_24h),
        change_24h = VALUES(change_24h),
        max_leverage = VALUES(max_leverage),
        price_decimal = VALUES(price_decimal),
        qty_decimal = VALUES(qty_decimal)
    `;

    if (values.length > 0) {
      await pool.query(query, [values]);
      console.log(`Upserted ${values.length} futures instruments`);
    }
  } catch (err) {
    console.error("Error storing futures currencies:", err.message || err);
  }
};


cron.schedule("*/3 * * * *", () => {
  console.log("Running futures currency sync...");
  storeFuturesCurrencies();
});
