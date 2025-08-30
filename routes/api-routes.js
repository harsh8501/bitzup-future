import express from "express";
import { depositToSubAcc, getBalance, withdrawFromSubAcc } from "../controller/wallet-controller.js";
import { createSubAccount, getAllSubAccount, getMarginMode } from "../controller/account-controller.js";
import { estimateLiquidationPrice, getCurrData, getFeeRate, getFuturesCurrencies, getOrderBook, getTickers, getTrades, marketSettings } from "../controller/market-controller.js";
import { verifyToken } from "../middleware/middleware.js";
import { addIsolatedMargin, autoIsolatedMargin, cancelAllOrders, cancelOrder, closePosition, getClosedPnL, getLeverage, getOpenOrders, getOrderHistory, getPosition, getTradeHistory, modifyOrder, placeOrder, setLeverage, setTradingStop, switchMarginMode } from "../controller/trade-controller.js";
import { validateCreateSubAccount, validateGetMarginMode } from "../utils/account-validation.js";
import { validateDepositToSubAcc, validateGetBalance } from "../utils/wallet-validation.js";
import { validateAddIsolatedMargin, validateAutoIsolatedMargin, validateCancelAllOrders, validateCancelOrder, validateClosePosition, validateGetLeverage, validateGetOpenOrders, validateGetOrderHistory, validateGetPosition, validateGetTradeHistoryAndClosedPnL, validateModifyOrder, validatePlaceOrder, validateSetLeverage, validateSetTradingStop, validateSwitchMarginMode } from "../utils/trade-validation.js";
import { addIsolatedMarginLimiter10, assetTransferLimiter5, autoIsolatedMarginLimiter10, cancelAllOrderLimiter5, cancelOrderLimiter5, closedPnlLimiter40, currencyDataLimiter10, feeRateLimiter10, getMarginModeLimiter40, getPositionLimiter40, modifyOrderLimiter5, openOrdersLimiter40, orderHistoryLimiter40, placeOrderLimiter5, setLeverageLimiter10, setTradingStopLimiter10, subAccountLimiter1, subAccountLimiter10, switchMarginModeLimiter10, tradeHistoryLimiter40, walletBalanceLimiter40 } from "../middleware/rateLimiter.js";
import { validateEstLiquidatePrice } from "../utils/market-validation.js";

const route = express.Router();

// api Routes
route.get("/test", (_req, res) => {
    res.status(200).json({ success: "1", message: "API is working." });
})

// Account Api Routes
route.post("/create-sub-account",verifyToken,subAccountLimiter1,validateCreateSubAccount,createSubAccount);
route.get("/get-all-sub-acc",verifyToken,subAccountLimiter10,getAllSubAccount)
route.post("/deposit-to-sub-acc",verifyToken,assetTransferLimiter5,validateDepositToSubAcc,depositToSubAcc)
route.post("/withdraw-from-sub-acc",verifyToken,assetTransferLimiter5,validateDepositToSubAcc,withdrawFromSubAcc)
route.post("/get-margin-mode",verifyToken,getMarginModeLimiter40,validateGetMarginMode,getMarginMode)

// Trade Api Routes
route.post("/set-leverage",verifyToken,setLeverageLimiter10,validateSetLeverage,setLeverage);
route.post("/get-leverage",verifyToken,getPositionLimiter40,validateGetLeverage,getLeverage);
route.post("/switch-margin-mode",verifyToken,switchMarginModeLimiter10,validateSwitchMarginMode,switchMarginMode);
// route.post("/switch-position-mode",verifyToken,validateSwitchPositionMode,switchMarginMode);
route.post("/add-isolated-margin",verifyToken,addIsolatedMarginLimiter10,validateAddIsolatedMargin,addIsolatedMargin);
route.post("/auto-isolated-margin",verifyToken,autoIsolatedMarginLimiter10,validateAutoIsolatedMargin,autoIsolatedMargin);
route.post("/set-trading-stop",verifyToken,setTradingStopLimiter10,validateSetTradingStop,setTradingStop);  // cancel using get tpsl orders api of symbol then only modify and cancel

route.post("/get-positions",verifyToken,getPositionLimiter40,validateGetPosition,getPosition);  // done max = 50/sec
route.post("/place-order",verifyToken,placeOrderLimiter5,validatePlaceOrder,placeOrder) // done max = 10/sec
route.post("/cancel-order",verifyToken,cancelOrderLimiter5,validateCancelOrder,cancelOrder) // done max = 10/sec
route.post("/cancel-all-order",verifyToken,cancelAllOrderLimiter5,validateCancelAllOrders,cancelAllOrders) // done max = 10/sec
route.post("/modify-order",verifyToken,modifyOrderLimiter5,validateModifyOrder,modifyOrder) // done max = 10/sec
route.post("/close-position",verifyToken,placeOrderLimiter5,validateClosePosition,closePosition) // done max = 10/sec
route.post("/get-open-orders",verifyToken,openOrdersLimiter40,validateGetOpenOrders,getOpenOrders) // done max = 50/sec
route.post("/get-order-history",verifyToken,orderHistoryLimiter40,validateGetOrderHistory,getOrderHistory) //  done max = 50/sec
route.post("/get-trade-history",verifyToken,tradeHistoryLimiter40,validateGetTradeHistoryAndClosedPnL,getTradeHistory) // done max = 50/sec
route.post("/get-closed-pnl",verifyToken,closedPnlLimiter40,validateGetTradeHistoryAndClosedPnL,getClosedPnL) // done max = 50/sec

// Wallet Api Routes
route.post("/get-balance",verifyToken,walletBalanceLimiter40,validateGetBalance,getBalance); // done max = 50/sec

// Market Api Routes
route.get("/get-curr-data",verifyToken,currencyDataLimiter10,getCurrData);  // done
route.get("/get-futures-currencies",verifyToken,getFuturesCurrencies);
route.get("/market-settings",verifyToken,marketSettings);
route.get("/get-fee-rate",verifyToken,feeRateLimiter10,getFeeRate);
route.post("/estimate-liquidation-price",verifyToken,validateEstLiquidatePrice,estimateLiquidationPrice);
route.get("/get-order-book",verifyToken,getOrderBook);
route.get("/get-ticker",getTickers);
route.get("/get-trades",verifyToken,getTrades);

export default route;