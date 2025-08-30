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

// const storeFuturesCurrencies = async () => {
//     try {
//         const symbol = "ETHUSDT";
//         const [instrumentRes, tickerRes] = await Promise.all([
//             client.getInstrumentsInfo({ category: "linear", symbol }),
//             client.getTickers({ category: "linear", symbol }),
//         ]);

//         const instrument = instrumentRes.result.list[0];
//         const ticker = tickerRes.result.list[0];
//         const price_decimal = getDecimalPlaces(instruments.priceFilter.tickSize) || 0;
//         const qty_decimal = getDecimalPlaces(instruments.lotSizeFilter.qtyStep) || 0;

//         if (!instrument || !ticker) {
//             console.log(`No data for symbol: ${symbol}`);
//             return;
//         }

//         const data = {
//             symbol: instrument.symbol,
//             base_coin: instrument.baseCoin,
//             quote_coin: instrument.quoteCoin,
//             last_price: parseFloat(ticker.lastPrice),
//             volume_24h: parseFloat(ticker.volume24h),
//             change_24h: parseFloat(ticker.price24hPcnt),
//             max_leverage: parseFloat(instrument.leverageFilter?.maxLeverage) || 0,
//             price_decimal: parseInt(price_decimal),
//             qty_decimal: parseInt(qty_decimal),
//         };

//         const query = `
//           INSERT INTO futures_currencies
//             (symbol, base_coin, quote_coin, last_price, volume_24h, change_24h, max_leverage, price_decimal, qty_decimal)    
//           VALUES (?, ?, ?, ?, ?, ?, ?)
//           ON DUPLICATE KEY UPDATE
//             base_coin = VALUES(base_coin),
//             quote_coin = VALUES(quote_coin),
//             last_price = VALUES(last_price),
//             volume_24h = VALUES(volume_24h),
//             change_24h = VALUES(change_24h),
//             max_leverage = VALUES(max_leverage),
//             price_decimal = VALUES(price_decimal),
//             qty_decimal = VALUES(qty_decimal)
//         `;

//         await pool.query(query, [
//             data.symbol,
//             data.base_coin,
//             data.quote_coin,
//             data.last_price,
//             data.volume_24h,
//             data.change_24h,
//             data.max_leverage,
//             data.price_decimal,
//             data.qty_decimal,
//         ]);

//         console.log(`Stored data for ${symbol}`);
//     } catch (err) {
//         console.error("Error:", err);
//     }
//     finally {
//         await pool.end();
//     }

// }

export const getCurrData = async (req, resp) => {
    const { symbol } = req.query;
    try {
        const query = "SELECT symbol,last_price FROM futures_currencies where symbol = ? and status = 1";
        const rows = await pool.query(query, [symbol.toUpperCase()]);

        return resp.status(200).json({
            success: "1",
            data: rows[0],
        });
    } catch (error) {
        console.error('Error fetching futures currencies:', error);
        return resp.status(200).json({
            success: "0",
            message: "An unexpected error occurred.",
        });
    }
}

export const getFuturesCurrencies = async (_req, resp) => {
    try {
        const query = "SELECT symbol, base_coin, icon,last_price,volume_24h,change_24h,max_leverage,price_decimal,qty_decimal,qty_step FROM futures_currencies where status = 1";
        const rows = await pool.query(query);

        return resp.status(200).json({
            success: "1",
            data: rows,
        });
    } catch (error) {
        console.error('Error fetching futures currencies:', error);
        return resp.status(200).json({
            success: "0",
            message: "An unexpected error occurred.",
        });
    }
}

export const marketSettings = async (req, resp) => {
    const { symbol } = req.query;
    try {
        const query = "SELECT max_leverage,price_decimal,qty_decimal,qty_step FROM futures_currencies where symbol = ? and status = 1";
        const rows = await pool.query(query, [symbol.toUpperCase()]);

        return resp.status(200).json({
            success: "1",
            data: rows[0],
        });
    } catch (error) {
        console.error('Error fetching market settings:', error);
        return resp.status(200).json({
            success: "0",
            message: "An unexpected error occurred.",
        });
    }
}

export const getOrderBook = async (req, resp) => {
    const { symbol, limit } = req.query;
    try {
        const response = await client.getOrderbook({
            category: 'linear',
            symbol: symbol.toUpperCase(),
            limit: limit
        });

        return resp.status(200).json({
            success: "1",
            data: {
                a: response.result.a,
                b: response.result.b
            },
        });
    } catch (error) {
        console.error('Error fetching Order Book:', error);
        return resp.status(200).json({
            success: "0",
            message: "An unexpected error occurred.",
        });
    }
}

export const getTickers = async (req, resp) => {
    const { symbol } = req.query;
    try {
        const response = await client.getTickers({
            category: 'linear',
            symbol: symbol.toUpperCase(),
        });

        return resp.status(200).json({
            success: "1",
            data: {
                last_price: response.result.list[0].lastPrice,
                index_price: response.result.list[0].indexPrice,
                mark_price: response.result.list[0].markPrice,
                prev_price_24h: response.result.list[0].prevPrice24h,
                change_24h: response.result.list[0].price24hPcnt,
                high_price_24h: response.result.list[0].highPrice24h,
                low_price_24h: response.result.list[0].lowPrice24h,
                prev_price_1h: response.result.list[0].prevPrice1h,
                open_interest: response.result.list[0].openInterest,
                open_interest_value: response.result.list[0].openInterestValue,
                turn_over_24h: response.result.list[0].turnover24h,
                volume_24h: response.result.list[0].volume24h
            },
        });
    } catch (error) {
        console.error('Error fetching Ticker:', error);
        return resp.status(200).json({
            success: "0",
            message: "An unexpected error occurred.",
        });
    }
}

export const getTrades = async (req, resp) => {
    const { symbol, limit } = req.query;
    try {
        const response = await client.getPublicTradingHistory({
            category: 'linear',
            symbol: symbol.toUpperCase(),
            limit: limit
        });

        const trades = response.result.list.map((trade) => ({
            price: trade.price,
            size: trade.size,
            side: trade.side,
            time: trade.time
        }))

        return resp.status(200).json({
            success: "1",
            data: trades,
        });
    } catch (error) {
        console.error('Error fetching Ticker:', error);
        return resp.status(200).json({
            success: "0",
            message: "An unexpected error occurred.",
        });
    }
}

function findMMR(riskTiers, positionSizeUSD) {
    for (const tier of riskTiers) {
        if (positionSizeUSD <= parseFloat(tier.riskLimitValue)) {
            return parseFloat(tier.maintenanceMargin);
        }
    }
    // Return highest tier's MMR if no match
    return parseFloat(riskTiers[riskTiers.length - 1].maintenanceMargin);
}

export const estimateLiquidationPrice = async (req, resp) => {
    const { symbol, side, price, qty, leverage } = req.body;
    try {
        const response = await client.getRiskLimit({
            category: 'linear',
            symbol: symbol.toUpperCase(),
        });

        const positionValueUSD = price * qty;
        const MMR = findMMR(response.result.list, positionValueUSD);

        const oneOverLeverage = 1 / leverage;

        let liquidationPrice;

        if(side.toUpperCase() === "BUY") {
            liquidationPrice = price * (1 - oneOverLeverage + MMR);
        } else {
            liquidationPrice = price * (1 + oneOverLeverage - MMR);
        }

        return resp.status(200).json({
            success: "1",
            data: {
                liquidation_price: liquidationPrice
            },
        });
    } catch (error) {
        console.error('Error getting liquidation price:', error);
        return resp.status(200).json({
            success: "0",
            message: "An unexpected error occurred.",
        });
    }
}

export const getFeeRate = async (req, resp) => {
    const { symbol } = req.query;
    try {
        const response = await client.getFeeRate({
            category: 'linear',
            symbol: symbol.toUpperCase(),
        });

        return resp.status(200).json({
            success: "1",
            data: response,
        });
    } catch (error) {
        console.error('Error fetching Order Book:', error);
        return resp.status(200).json({
            success: "0",
            message: "An unexpected error occurred.",
        });
    }
}

// function getDecimalPlaces(value) {
//     if (!value || isNaN(value)) return 0;
//     return value.toString().split('.')[1]?.length || 0;
//   }

// const storeFuturesCurrencies = async () => {
//     try {
//         const [instrumentRes, tickerRes] = await Promise.all([
//             client.getInstrumentsInfo({ category: "linear" }),
//             client.getTickers({ category: "linear" }),
//         ]);

//         const instruments = instrumentRes.result.list;
//         const tickers = tickerRes.result.list;
//         const price_decimal = getDecimalPlaces(instruments.priceFilter.tickSize) || 0;
//         const qty_decimal = getDecimalPlaces(instruments.lotSizeFilter.qtyStep) || 0;

//         const tickerMap = new Map();
//         for (const t of tickers) {
//             tickerMap.set(t.symbol, t);
//         }

//         const values = [];
//         const placeholders = [];

//         for (const instrument of instruments) {
//             const ticker = tickerMap.get(instrument.symbol);
//             if (!ticker) continue;

//             const data = [
//                 instrument.symbol,
//                 instrument.baseCoin,
//                 instrument.quoteCoin,
//                 parseFloat(ticker.lastPrice),
//                 parseFloat(ticker.volume24h),
//                 parseFloat(ticker.price24hPcnt),
//                 parseFloat(instrument.leverageFilter?.maxLeverage) || 0,
//                 parseInt(price_decimal),
//                 parseInt(qty_decimal),
//             ];

//             values.push(...data);
//             placeholders.push('(?, ?, ?, ?, ?, ?, ?)');
//         }

//         if (!values.length) {
//             console.log("No matching instruments/tickers found");
//             return;
//         }

//         const query = `
//           INSERT INTO futures_currencies 
//             (symbol, base_coin, quote_coin, last_price, volume_24h, change_24h, max_leverage, price_decimal, qty_decimal)
//           VALUES ${placeholders.join(', ')}
//           ON DUPLICATE KEY UPDATE
//             base_coin = VALUES(base_coin),
//             quote_coin = VALUES(quote_coin),
//             last_price = VALUES(last_price),
//             volume_24h = VALUES(volume_24h),
//             change_24h = VALUES(change_24h),
//             max_leverage = VALUES(max_leverage)
//             price_decimal = VALUES(price_decimal),
//             qty_decimal = VALUES(qty_decimal)
//         `;

//         await pool.query(query, values);

//         console.log(`Stored ${placeholders.length} futures symbols`);
//     } catch (err) {
//         console.error("Error:", err);
//     } finally {
//         await pool.end();
//     }
// };

// storeFuturesCurrencies();