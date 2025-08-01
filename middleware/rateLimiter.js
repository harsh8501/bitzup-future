import rateLimit from "express-rate-limit";

export const orderLimiter20 = rateLimit({
  windowMs: 1000, // 1 second
  max: 20,
  message: "Too many order requests. Try again later.",
});

export const orderLimiter10 = rateLimit({
  windowMs: 1000,
  max: 10,
  message: "Too many modify order requests.",
});

export const positionLimiter10 = rateLimit({
  windowMs: 1000,
  max: 10,
  message: "Too many position requests.",
});

export const positionLimiter50 = rateLimit({
  windowMs: 1000,
  max: 50,
  message: "Too many position requests.",
});

export const accountLimiter20 = rateLimit({
  windowMs: 1000,
  max: 20,
  message: "Too many balance/account requests.",
});

export const accountLimiter10 = rateLimit({
  windowMs: 1000,
  max: 10,
  message: "Too many account requests.",
});

export const subAccountLimiter5 = rateLimit({
  windowMs: 1000,
  max: 5,
  message: "Too many sub-account actions.",
});

export const assetTransferLimiter5 = rateLimit({
    windowMs: 1000,
    max: 5,
    message: "Too many asset transfer requests.",
  });

export const subAccountLimiter10 = rateLimit({
  windowMs: 1000,
  max: 10,
  message: "Too many sub-account queries.",
});
