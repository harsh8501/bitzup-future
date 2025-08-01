import express from "express";
import { depositToSubAcc, getBalance, withdrawFromSubAcc } from "../controller/wallet-controller.js";
import { createSubAccount, getAccountInfo, getAllSubAccount } from "../controller/account-controller.js";
import { getFuturesCurrencies, getOrderBook, getTickers, getTrades } from "../controller/market-controller.js";
import { verifyToken } from "../middleware/middleware.js";
import { addIsolatedMargin, autoIsolatedMargin, cancelAllOrders, cancelOrder, closePosition, getClosedPnL, getLeverage, getOpenOrders, getOrderHistory, getPosition, getTradeHistory, modifyOrder, placeOrder, setLeverage, setTradingStop, switchMarginMode } from "../controller/trade-controller.js";
import { validateCreateSubAccount } from "../utils/account-validation.js";
import { validateDepositToSubAcc, validateGetBalance } from "../utils/wallet-validation.js";
import { validateAddIsolatedMargin, validateAutoIsolatedMargin, validateCancelAllOrders, validateCancelOrder, validateClosePosition, validateGetLeverage, validateGetOpenOrders, validateGetOrderHistory, validateGetPosition, validateGetTradeHistoryAndClosedPnL, validateModifyOrder, validatePlaceOrder, validateSetLeverage, validateSetTradingStop, validateSwitchMarginMode } from "../utils/trade-validation.js";
import { assetTransferLimiter5, positionLimiter10, positionLimiter50, subAccountLimiter10, subAccountLimiter5 } from "../middleware/rateLimiter.js";

const route = express.Router();

// api Routes
route.get("/test", (_req, res) => {
    res.status(200).json({ success: "1", message: "API is working." });
})

// Account Api Routes
route.post("/create-sub-account",verifyToken,subAccountLimiter5,validateCreateSubAccount,createSubAccount);
route.get("/get-all-sub-acc",verifyToken,subAccountLimiter10,getAllSubAccount)
route.post("/deposit-to-sub-acc",verifyToken,assetTransferLimiter5,validateDepositToSubAcc,depositToSubAcc)
route.post("/withdraw-from-sub-acc",verifyToken,assetTransferLimiter5,validateDepositToSubAcc,withdrawFromSubAcc)
route.post("/get-acc-info",verifyToken,getAccountInfo)

// Trade Api Routes
route.post("/set-leverage",verifyToken,positionLimiter10,validateSetLeverage,setLeverage);
route.post("/get-leverage",verifyToken,positionLimiter50,validateGetLeverage,getLeverage);
route.post("/switch-margin-mode",verifyToken,validateSwitchMarginMode,switchMarginMode);
// route.post("/switch-position-mode",verifyToken,validateSwitchPositionMode,switchMarginMode);
route.post("/add-isolated-margin",verifyToken,validateAddIsolatedMargin,addIsolatedMargin);
route.post("/auto-isolated-margin",verifyToken,validateAutoIsolatedMargin,autoIsolatedMargin);
route.post("/set-trading-stop",verifyToken,validateSetTradingStop,setTradingStop);  //cancel using get tpsl orders api of symbol then only modify and cancel
route.post("/get-positions",verifyToken,validateGetPosition,getPosition);
route.post("/place-order",verifyToken,validatePlaceOrder,placeOrder)
route.post("/cancel-order",verifyToken,validateCancelOrder,cancelOrder)
route.post("/cancel-all-order",verifyToken,validateCancelAllOrders,cancelAllOrders)
route.post("/modify-order",verifyToken,validateModifyOrder,modifyOrder)
route.post("/close-position",verifyToken,validateClosePosition,closePosition)
route.post("/get-open-orders",verifyToken,validateGetOpenOrders,getOpenOrders)
route.post("/get-order-history",verifyToken,validateGetOrderHistory,getOrderHistory)
route.post("/get-trade-history",verifyToken,validateGetTradeHistoryAndClosedPnL,getTradeHistory)
route.post("/get-closed-pnl",verifyToken,positionLimiter50,validateGetTradeHistoryAndClosedPnL,getClosedPnL)

// Wallet Api Routes
route.post("/get-balance",verifyToken,validateGetBalance,getBalance);

// Market Api Routes
route.get("/get-futures-currencies",verifyToken,getFuturesCurrencies);
route.get("/get-order-book",verifyToken,getOrderBook);
route.get("/get-ticker",verifyToken,getTickers);
route.get("/get-trades",verifyToken,getTrades);

export default route;