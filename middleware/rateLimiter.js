import rateLimit from "express-rate-limit";

export const orderLimiter20 = rateLimit({
  windowMs: 1000, // 1 second
  max: 20,
  message: "Too many order requests",
});

export const openOrdersLimiter40 = rateLimit({
  windowMs: 1000, // 1 second
  max: 40,
  message: "Too many open orders requests",
});

export const orderHistoryLimiter40 = rateLimit({
  windowMs: 1000, // 1 second
  max: 40,
  message: "Too many order history requests",
});

export const tradeHistoryLimiter40 = rateLimit({
  windowMs: 1000, 
  max: 40,
  message: "Too many trade history requests",
});

export const closedPnlLimiter40 = rateLimit({
  windowMs: 1000, 
  max: 40,
  message: "Too many closed pnl requests",
});

export const walletBalanceLimiter40 = rateLimit({
  windowMs: 1000, 
  max: 40,
  message: "Too many wallet balance requests",
});

export const placeOrderLimiter5 = rateLimit({
  windowMs: 1000,
  max: 5,
  message: "Too many order requests",
});

export const cancelOrderLimiter5 = rateLimit({
  windowMs: 1000,
  max: 5,
  message: "Too many order requests",
});

export const cancelAllOrderLimiter5 = rateLimit({
  windowMs: 1000,
  max: 5,
  message: "Too many order requests",
});

export const modifyOrderLimiter5 = rateLimit({
  windowMs: 1000,
  max: 5,
  message: "Too many order requests",
});

export const closePositionLimiter5 = rateLimit({
  windowMs: 1000,
  max: 5,
  message: "Too many order requests",
});

export const currencyDataLimiter10 = rateLimit({
  windowMs: 1000,
  max: 10,
  message: "Too many currency requests",
});

export const feeRateLimiter10 = rateLimit({
  windowMs: 1000,
  max: 10,
  message: "Too many fee requests",
});

export const getPositionLimiter40 = rateLimit({
  windowMs: 1000,
  max: 40,
  message: "Too many position requests",
});

export const addIsolatedMarginLimiter10 = rateLimit({
  windowMs: 1000,
  max: 10,
  message: "Too many add isolated margin requests",
});

export const autoIsolatedMarginLimiter10 = rateLimit({
  windowMs: 1000,
  max: 10,
  message: "Too many auto isolated margin requests",
});

export const setTradingStopLimiter10 = rateLimit({
  windowMs: 1000,
  max: 10,
  message: "Too many trading stop requests",
});

export const switchMarginModeLimiter10 = rateLimit({
  windowMs: 1000,
  max: 10,
  message: "Too many switch margin mode requests",
});

export const setLeverageLimiter10 = rateLimit({
  windowMs: 1000,
  max: 10,
  message: "Too many leverage requests",
});

export const getMarginModeLimiter40 = rateLimit({
  windowMs: 1000,
  max: 40,
  message: "Too many margin mode requests",
});

export const accountLimiter20 = rateLimit({
  windowMs: 1000,
  max: 20,
  message: "Too many account requests",
});

export const accountLimiter10 = rateLimit({
  windowMs: 1000,
  max: 10,
  message: "Too many account requests",
});

export const subAccountLimiter1 = rateLimit({
  windowMs: 1000,
  max: 1,
  message: "Too many sub-account actions",
});

export const assetTransferLimiter5 = rateLimit({
    windowMs: 1000,
    max: 5,
    message: "Too many asset transfer requests.",
  });

export const subAccountLimiter10 = rateLimit({
  windowMs: 1000,
  max: 10,
  message: "Too many sub-account queries",
});
