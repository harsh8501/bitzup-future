import { subClient } from "../utils/utils.js";
import pool from "../connection/dbConnection.js";

export const setLeverage = async (req, resp) => {
    const { user_id, symbol, leverage } = req.body;

    try {
        const rows = await pool.query(`Select api_key,api_secret from futures_sub_acc where user_id = ? AND status = 1`, [user_id]);

        if (rows.length === 0) {
            return resp.status(400).json({ success: "0", message: "Account freezed" });
        }

        const client = await subClient(rows[0].api_key, rows[0].api_secret);

        await client.setLeverage({
            category: 'linear',
            symbol: symbol,
            buyLeverage: leverage, // In cross buy and sell leverage same in isolated can be different 
            sellLeverage: leverage,
        });

        if (response.retCode === 0) {
            return resp.status(200).json({
                success: "1", message: response.retMsg,
            });
        } else {
            return resp.status(400).json({ success: "0", message: response.retMsg });
        }
    } catch (error) {
        console.error('Error setting leverage:', error);
        return resp.status(500).json({
            success: "0",
            message: "An unexpected error occurred.",
        });
    }
};

export const getPosition = async (req, resp) => {
    const { user_id, quote_coin } = req.body;
    try {
        const rows = await pool.query(`Select api_key,api_secret from futures_sub_acc where user_id = ? AND status = 1`, [user_id]);

        if (rows.length === 0) {
            return resp.status(400).json({ success: "0", message: "Account freezed" });
        }

        const client = await subClient(rows[0].api_key, rows[0].api_secret);

        const response = await client.getPositionInfo({
            category: 'linear',
            settleCoin: quote_coin
        });

        if (response.retCode === 0) {
            return resp.status(200).json({
                success: "1", data: response.result.list,
            });
        } else {
            return resp.status(400).json({ success: "0", message: response.retMsg });
        }
    } catch (error) {
        console.error('Error fetching positions:', error);
        return resp.status(500).json({
            success: "0",
            message: "An unexpected error occurred.",
        });
    }
};

export const getLeverage = async (req, resp) => {
    const { user_id, symbol } = req.body;
    try {
        const rows = await pool.query(`Select api_key,api_secret from futures_sub_acc where user_id = ? AND status = 1`, [user_id]);

        if (rows.length === 0) {
            return resp.status(400).json({ success: "0", message: "Account freezed" });
        }

        const client = await subClient(rows[0].api_key, rows[0].api_secret);

        const response = await client.getPositionInfo({
            category: 'linear',
            symbol: symbol
        });

        if (response.retCode === 0) {
            return resp.status(200).json({
                success: "1", data: { leverage: response.result.list[0].leverage },
            });
        } else {
            return resp.status(400).json({ success: "0", message: response.retMsg });
        }
    } catch (error) {
        console.error('Error in getting leverage:', error);
        return resp.status(500).json({
            success: "0",
            message: "An unexpected error occurred.",
        });
    }
};

export const switchMarginMode = async (req, resp) => {
    const { margin_mode, user_id } = req.body;
    try {
        const rows = await pool.query(`Select api_key,api_secret from futures_sub_acc where user_id = ? AND status = 1`, [user_id]);

        if (rows.length === 0) {
            return resp.status(400).json({ success: "0", message: "Account freezed" });
        }

        const client = await subClient(rows[0].api_key, rows[0].api_secret);

        const response = await client.setMarginMode(margin_mode);

        if (response.retCode === 0) {
            return resp.status(200).json({
                success: "1", message: response.retMsg
            });
        } else {
            return resp.status(400).json({ success: "0", message: response.retMsg });
        }
    } catch (error) {
        console.error('Error switching isolated margin:', error);
        return resp.status(500).json({
            success: "0",
            message: "An unexpected error occurred.",
        });
    }
};

export const placeOrder = async (req, resp) => {
    const {
        user_id,
        symbol,
        side,
        type,
        qty,
        price,
        client_order_id,
        reduce_only,
        take_profit,
        stop_loss,
        time_in_force
    } = req.body;

    try {
        const rows = await pool.query(`Select api_key,api_secret from futures_sub_acc where user_id = ? AND status = 1`, [user_id]);

        if (rows.length === 0) {
            return resp.status(400).json({ success: "0", message: "Account freezed" });
        }

        const client = await subClient(rows[0].api_key, rows[0].api_secret);

        const orderPayload = {
            category: 'linear',
            symbol,
            side,
            orderType: type,
            qty: qty.toString(),
        };

        if (type === 'Limit') {
            orderPayload.price = price.toString();
        }

        if (time_in_force !== undefined) {
            orderPayload.timeInForce = time_in_force;
        }

        if (reduce_only !== undefined) {
            orderPayload.reduceOnly = reduce_only;  //the order only reduces the position (won’t open a new one).
        }

        if (client_order_id) {
            orderPayload.orderLinkId = client_order_id;
        }

        if (take_profit !== undefined) {
            orderPayload.takeProfit = take_profit.toString();
        }
        if (stop_loss !== undefined) {
            orderPayload.stopLoss = stop_loss.toString();
        }

        const response = await client.submitOrder(orderPayload);

        if (response.retCode === 0) {
            return resp.status(200).json({
                success: "1", data: {
                    order_id: response.result.orderId,
                    client_order_id: response.result.orderLinkId
                }
            });
        } else {
            return resp.status(400).json({ success: "0", message: response.retMsg });
        }

    } catch (error) {
        console.error("Error placing order:", error);
        resp.status(500).json({
            success: "0",
            message: "Failed to place order.",
        });
    }
};

export const cancelOrder = async (req, resp) => {
    const { user_id, symbol, order_id } = req.body;

    try {
        const rows = await pool.query(`Select api_key,api_secret from futures_sub_acc where user_id = ? AND status = 1`, [user_id]);

        if (rows.length === 0) {
            return resp.status(400).json({ success: "0", message: "Account freezed" });
        }

        const client = await subClient(rows[0].api_key, rows[0].api_secret);

        const response = await client.cancelOrder({
            category: 'linear',
            symbol: symbol,
            orderId: order_id,
        });

        if (response.retCode === 0) {
            return resp.status(200).json({
                success: "1", message: response.result,
            });
        } else {
            return resp.status(400).json({ success: "0", message: response.retMsg });
        }
    } catch (error) {
        console.error("Error canceling order:", error);
        resp.status(500).json({
            success: "0",
            message: "Failed to cancel order.",
        });
    }
};

export const cancelAllOrders = async (req, resp) => {
    const { user_id, quote_coin, order_type } = req.body;

    try {
        const rows = await pool.query(`Select api_key,api_secret from futures_sub_acc where user_id = ? AND status = 1`, [user_id]);

        if (rows.length === 0) {
            return resp.status(400).json({ success: "0", message: "Account freezed" });
        }

        const client = await subClient(rows[0].api_key, rows[0].api_secret);

        const response = await client.cancelAllOrders({
            category: 'linear',
            settleCoin: quote_coin,
            orderFilter: order_type
        });

        if (response.retCode === 0) {
            return resp.status(200).json({
                success: "1", message: response.result,
            });
        } else {
            return resp.status(400).json({ success: "0", message: response.retMsg });
        }
    } catch (error) {
        console.error("Error canceling All order:", error);
        resp.status(500).json({
            success: "0",
            message: "Failed to cancel order.",
        });
    }
};

export const modifyOrder = async (req, resp) => {
    const { user_id, symbol, order_id, price, client_order_id, tp_trigger_by, sl_trigger_by, take_profit, stop_loss, qty } = req.body;

    try {
        const rows = await pool.query(`Select api_key,api_secret from futures_sub_acc where user_id = ? AND status = 1`, [user_id]);

        if (rows.length === 0) {
            return resp.status(400).json({ success: "0", message: "Account freezed" });
        }

        const client = await subClient(rows[0].api_key, rows[0].api_secret);

        const orderPayload = {
            category: 'linear',
            symbol,
            orderId: order_id,
        };

        if (price) {
            orderPayload.price = price.toString();
        }
        if (take_profit || take_profit == 0) {
            orderPayload.takeProfit = take_profit == 0 ? '0' : take_profit.toString();
        }

        if (tp_trigger_by) {
            orderPayload.tpTriggerBy = tp_trigger_by;
        }

        if (stop_loss || stop_loss == 0) {
            orderPayload.stopLoss = stop_loss == 0 ? '0' : stop_loss.toString();
        }

        if (sl_trigger_by) {
            orderPayload.slTriggerBy = sl_trigger_by;
        }

        if (client_order_id) {
            orderPayload.orderLinkId = client_order_id;
        }
        if (qty) {
            orderPayload.qty = qty.toString();
        }

        const response = await client.amendOrder(orderPayload);

        if (response.retCode === 0) {
            return resp.status(200).json({
                success: "1", data: response.result
            });
        } else {
            return resp.status(400).json({ success: "0", message: response.retMsg });
        }
    } catch (error) {
        console.error("Error modifying order:", error);
        resp.status(500).json({
            success: "0",
            message: "Failed to modify order.",
        });
    }
};

export const closePosition = async (req, resp) => {
    const { user_id, symbol, qty, side } = req.body;

    try {
        const rows = await pool.query(`Select api_key,api_secret from futures_sub_acc where user_id = ? AND status = 1`, [user_id]);

        if (rows.length === 0) {
            return resp.status(400).json({ success: "0", message: "Account freezed" });
        }

        const client = await subClient(rows[0].api_key, rows[0].api_secret);

        const response = await client.submitOrder({
            category: 'linear',
            symbol,
            side: side,  // opposite side of current position
            orderType: 'Market',
            qty: qty.toString(),
            reduceOnly: true,
        });

        console.log('Position closed:', JSON.stringify(response, null, 2));

        if (response.retCode === 0) {
            return resp.status(200).json({
                success: "1", data: response.result
            });
        } else {
            return resp.status(400).json({ success: "0", message: response.retMsg });
        }
    } catch (error) {
        console.error("Error closing position:", error);
        resp.status(500).json({
            success: "0",
            message: "Failed to close position.",
        });
    }
};

function getTradeType(order) {
    const { side, reduceOnly, createType } = order;

    if (side === "Buy" && !reduceOnly && createType === "CreateByUser") {
        return "Open Long";
    }

    if (side === "Sell" && reduceOnly && createType === "CreateByClosing") {
        return "Close Long";
    }

    if (side === "Sell" && !reduceOnly && createType === "CreateByUser") {
        return "Open Short";
    }

    if (side === "Buy" && reduceOnly && createType === "CreateByClosing") {
        return "Close Short";
    }

    if (side === "Buy" && reduceOnly && createType === "CreateByUser") {
        return "Close Short";
    }

    if (side === "Sell" && reduceOnly && createType === "CreateByUser") {
        return "Close Long";
    }

    return "Unknown";
}

function getTpSlTradeType(order) {
    const { side, reduceOnly } = order;

    if (side === 'Buy' && reduceOnly === false) return 'Open Long';
    if (side === 'Sell' && reduceOnly === false) return 'Open Short';
    if (side === 'Sell' && reduceOnly === true) return 'Close Long';
    if (side === 'Buy' && reduceOnly === true) return 'Close Short';

    return 'Unknown';
}

function getTradeHistTradeType(order) {
    const { side, createType, closedSize } = order;
    if (!side || !createType) return "Unknown";

    const isClosing = parseFloat(closedSize) > 0;

    if (side === "Buy") {
        return isClosing ? "Close Short" : "Open Long";
    }

    if (side === "Sell") {
        return isClosing ? "Close Long" : "Open Short";
    }

    return "Unknown";
}

export const getOpenOrders = async (req, resp) => {
    const { user_id, symbol, quote_coin, order_type } = req.body;

    try {
        const rows = await pool.query(`Select api_key,api_secret from futures_sub_acc where user_id = ? AND status = 1`, [user_id]);

        if (rows.length === 0) {
            return resp.status(400).json({ success: "0", message: "Account freezed" });
        }

        const client = await subClient(rows[0].api_key, rows[0].api_secret);

        const orderPayload = {
            category: 'linear',
        };

        if (order_type.toUpperCase() === "ORDER") {
            orderPayload.orderFilter = order_type;
        }

        if (symbol) {
            orderPayload.symbol = symbol;
        }

        if (quote_coin) {
            orderPayload.settleCoin = quote_coin;
        }

        const response = await client.getActiveOrders(orderPayload);

        let transformedOrders = [];

        if (order_type.toUpperCase() === "ORDER") {
            transformedOrders = response?.result?.list?.map(order => ({
                order_id: order.orderId,
                symbol: order.symbol,
                order_type: order.orderType,
                client_order_id: order.orderLinkId,
                side: order.side,
                order_price: order.price,
                qty: order.qty,
                filled_qty: order.cumExecQty,
                stop_order_type: order.stopOrderType,
                order_value: order.leavesValue,
                order_status: order.orderStatus,
                tpsl_mode: order.tpslMode,
                take_profit: order.takeProfit,
                stop_loss: order.stopLoss,
                time: order.createdTime,
                reduce_only: order.reduceOnly,
                trade_type: getTradeType(order)
            }));
        } else if(order_type.toUpperCase() === "tpslOrder") {
            transformedOrders = response?.result?.list
                .filter(order =>
                    order.orderType === "Market" &&
                    (order.stopOrderType === "StopLoss" || order.stopOrderType === "TakeProfit" || order.stopOrderType === "PartialTakeProfit" || order.stopOrderType === "PartialStopLoss")
                )
                .map(order => ({
                    order_id: order.orderId,
                    symbol: order.symbol,
                    order_type: order.orderType,
                    client_order_id: order.orderLinkId,
                    side: order.side,
                    order_price: order.triggerPrice,
                    qty: order.qty,
                    filled_qty: order.cumExecQty,
                    stopOrderType: order.stopOrderType,
                    order_value: order.leavesValue,
                    order_status: order.orderStatus,
                    tpsl_mode: order.tpslMode,
                    take_profit: order.takeProfit,
                    stop_loss: order.stopLoss,
                    time: order.createdTime,
                    reduce_only: order.reduceOnly,
                    trade_type: getTradeType(order)
                }));
        } else if(order_type.toUpperCase() === "trailingStopOrder") {
            transformedOrders = response?.result?.list
                .filter(order =>
                    order.orderType === "Market" &&
                    order.stopOrderType === "TrailingStop"
                )
                .map(order => ({
                    order_id: order.orderId,
                    symbol: order.symbol,
                    order_type: order.orderType,
                    client_order_id: order.orderLinkId,
                    side: order.side,
                    order_price: order.triggerPrice,
                    qty: order.qty,
                    filled_qty: order.cumExecQty,
                    stopOrderType: order.stopOrderType,
                    order_value: order.leavesValue,
                    order_status: order.orderStatus,
                    tpsl_mode: order.tpslMode,
                    take_profit: order.takeProfit,
                    stop_loss: order.stopLoss,
                    time: order.createdTime,
                    reduce_only: order.reduceOnly,
                    trade_type: getTpSlTradeType(order)
                }))
        }

        if (response.retCode === 0) {
            return resp.status(200).json({
                success: "1", data: transformedOrders
            });
        } else {
            return resp.status(400).json({ success: "0", message: response.retMsg });
        }
    } catch (error) {
        console.error("Error getting all orders:", error);
        resp.status(500).json({
            success: "0",
            message: "Failed to get all orders.",
        });
    }
};

export const getOrderHistory = async (req, resp) => {
    const { user_id, symbol, quote_coin, order_type, start_time, end_time, limit } = req.body;

    try {
        const rows = await pool.query(`Select api_key,api_secret from futures_sub_acc where user_id = ? AND status = 1`, [user_id]);

        if (rows.length === 0) {
            return resp.status(400).json({ success: "0", message: "Account freezed" });
        }

        const client = await subClient(rows[0].api_key, rows[0].api_secret);

        const orderPayload = {
            category: 'linear',
            limit: limit
        };

        if (order_type.toUpperCase() === "ORDER") {
            orderPayload.orderFilter = order_type;
        }

        if (symbol) {
            orderPayload.symbol = symbol;
        }

        if (quote_coin) {
            orderPayload.settleCoin = quote_coin;
        }

        const now = Date.now();
        const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

        let start = null;
        let end = null;

        if (!start_time && !end_time) {
            end = now;
            start = end - SEVEN_DAYS;
        } else if (start_time && !end_time) {
            start = start_time;
            end = start_time + SEVEN_DAYS;
        } else if (!start_time && end_time) {
            end = end_time;
            start = end_time - SEVEN_DAYS;
        } else {
            if (end_time - start_time > SEVEN_DAYS) {
                return resp.status(400).json({ success: "0", message: "The difference between startTime and endTime must be ≤ 7 days." });
            }
            start = start_time;
            end = end_time;
        }

        orderPayload.startTime = start;
        orderPayload.endTime = end;

        const response = await client.getHistoricOrders(orderPayload);

        let extracted = [];

        if (order_type.toUpperCase() === "ORDER") {
            extracted = response?.result?.list.map(order => ({
                order_id: order.orderId,
                symbol: order.symbol,
                order_type: order.orderType,
                client_order_id: order.orderLinkId,
                avg_price: order.avgPrice,
                stop_order_type: order.stopOrderType,
                order_status: order.orderStatus,
                filled_qty: order.cumExecQty,
                qty: order.qty,
                filled_value: order.cumExecValue,
                order_value: order.price * order.qty,
                side: order.side,
                fee: order.cumExecFee,
                time: order.createdTime,
                reduce_only: order.reduceOnly,
                order_price: order.price,
                trigger_price: order.triggerPrice,
                trade_type: getTradeType(order)
            }));
        } else {
            extracted = response?.result?.list
                .filter(order =>
                    order.orderType === "Market" &&
                    (order.stopOrderType === "StopLoss" || order.stopOrderType === "TakeProfit" || order.stopOrderType === "PartialTakeProfit" || order.stopOrderType === "PartialStopLoss")
                )
                .map(order => ({
                    order_id: order.orderId,
                    symbol: order.symbol,
                    order_type: order.orderType,
                    client_order_id: order.orderLinkId,
                    avg_price: order.avgPrice,
                    stop_order_type: order.stopOrderType,
                    order_status: order.orderStatus,
                    filled_qty: order.cumExecQty,
                    qty: order.qty,
                    filled_value: order.cumExecValue,
                    order_value: order.price * order.qty,
                    side: order.side,
                    fee: order.cumExecFee,
                    time: order.createdTime,
                    reduce_only: order.reduceOnly,
                    order_price: order.price,
                    trigger_price: order.triggerPrice,
                    trade_type: getTpSlTradeType(order)
                }));
        }


        if (response.retCode === 0) {
            return resp.status(200).json({
                success: "1", data: extracted
            });
        } else {
            return resp.status(400).json({ success: "0", message: response.retMsg });
        }
    } catch (error) {
        console.error("Error getting order history:", error);
        resp.status(500).json({
            success: "0",
            message: "Failed to get order history.",
        });
    }
};

export const getTradeHistory = async (req, resp) => {
    const { user_id, symbol, start_time, end_time, limit } = req.body;

    try {
        const rows = await pool.query(`Select api_key,api_secret from futures_sub_acc where user_id = ? AND status = 1`, [user_id]);

        if (rows.length === 0) {
            return resp.status(400).json({ success: "0", message: "Account freezed" });
        }

        const client = await subClient(rows[0].api_key, rows[0].api_secret);

        const orderPayload = {
            category: 'linear',
            limit: limit
        };

        if (symbol) {
            orderPayload.symbol = symbol;
        }

        const now = Date.now();
        const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

        let start = null;
        let end = null;

        if (!start_time && !end_time) {
            end = now;
            start = end - SEVEN_DAYS;
        } else if (start_time && !end_time) {
            start = start_time;
            end = start_time + SEVEN_DAYS;
        } else if (!start_time && end_time) {
            end = end_time;
            start = end_time - SEVEN_DAYS;
        } else {
            if (end_time - start_time > SEVEN_DAYS) {
                return resp.status(400).json({ success: "0", message: "The difference between startTime and endTime must be ≤ 7 days." });
            }
            start = start_time;
            end = end_time;
        }

        orderPayload.startTime = start;
        orderPayload.endTime = end;

        const response = await client.getExecutionList(orderPayload);

        const transformed = response?.result?.list.map(order => ({
            symbol: order.symbol,
            order_type: order.orderType,
            client_order_id: order.orderLinkId,
            side: order.side,
            trade_type: getTradeHistTradeType(order),
            order_id: order.orderId,
            tx_id: order.execId,
            filled_value: order.execValue,
            filled_price: order.execPrice,
            filled_qty: order.execQty,
            filled_type: order.execType,
            fee: order.execFee,
            fee_rate: order.feeRate * 100,
            order_price: order.orderPrice,
            order_qty: order.orderQty,
            time: order.execTime,
        }));


        if (response.retCode === 0) {
            return resp.status(200).json({
                success: "1", data: transformed
            });
        } else {
            return resp.status(400).json({ success: "0", message: response.retMsg });
        }
    } catch (error) {
        console.error("Error getting trade history:", error);
        resp.status(500).json({
            success: "0",
            message: "Failed to get trade history.",
        });
    }
};

function getClosingDirPnL(closedPnl, side) {
    if (side === "Buy" && Number(closedPnl) >= 0) return "Close Short";
    if (side === "Sell" && Number(closedPnl) >= 0) return "Close Long";
    if (side === "Buy") return "Close Short";
    if (side === "Sell") return "Close Long";
}

export const getClosedPnL = async (req, resp) => {
    const { user_id, symbol, start_time, end_time, limit } = req.body;

    try {
        const rows = await pool.query(`Select api_key,api_secret from futures_sub_acc where user_id = ? AND status = 1`, [user_id]);

        if (rows.length === 0) {
            return resp.status(400).json({ success: "0", message: "Account freezed" });
        }

        const client = await subClient(rows[0].api_key, rows[0].api_secret);

        const orderPayload = {
            category: 'linear',
            limit: limit
        };

        if (symbol) {
            orderPayload.symbol = symbol;
        }

        const now = Date.now();
        const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

        let start = null;
        let end = null;

        if (!start_time && !end_time) {
            end = now;
            start = end - SEVEN_DAYS;
        } else if (start_time && !end_time) {
            start = start_time;
            end = start_time + SEVEN_DAYS;
        } else if (!start_time && end_time) {
            end = end_time;
            start = end_time - SEVEN_DAYS;
        } else {
            if (end_time - start_time > SEVEN_DAYS) {
                return resp.status(400).json({ success: "0", message: "The difference between startTime and endTime must be ≤ 7 days." });
            }
            start = start_time;
            end = end_time;
        }

        orderPayload.startTime = start;
        orderPayload.endTime = end;

        const response = await client.getClosedPnL(orderPayload);

        const transformed = response?.result?.list.map(order => ({
            symbol: order.symbol,
            order_type: order.orderType,
            side: order.side,
            order_id: order.orderId,
            closed_pnl: order.closedPnl,
            open_fee: order.openFee,
            close_fee: order.closeFee,
            entry_price: order.avgEntryPrice,
            qty: order.qty,
            exit_price: order.avgExitPrice,
            filled_type: order.execType,
            closing_direction: getClosingDirPnL(order.closedPnl, order.side),
            time: order.createdTime,
        }));


        if (response.retCode === 0) {
            return resp.status(200).json({
                success: "1", data: transformed
            });
        } else {
            return resp.status(400).json({ success: "0", message: response.retMsg });
        }
    } catch (error) {
        console.error("Error getting trade history:", error);
        resp.status(500).json({
            success: "0",
            message: "Failed to get trade history.",
        });
    }
};

export const addIsolatedMargin = async (req, resp) => {
    const { user_id, symbol, margin } = req.body;
    try {
        const rows = await pool.query(`Select api_key,api_secret from futures_sub_acc where user_id = ? AND status = 1`, [user_id]);

        if (rows.length === 0) {
            return resp.status(400).json({ success: "0", message: "Account freezed" });
        }

        const client = await subClient(rows[0].api_key, rows[0].api_secret);

        const response = await client.addOrReduceMargin({
            category: 'linear',
            symbol: symbol.toUpperCase(),
            margin: margin.toString()
        });

        //console.log('addIsolatedMargin', JSON.stringify(response, null, 2));

        if (response.retCode === 0) {
            return resp.status(200).json({
                success: "1", message: response.retMsg
            });
        } else {
            return resp.status(400).json({ success: "0", message: response.retMsg });
        }
    } catch (error) {
        console.error('Error switching isolated margin:', error);
        return resp.status(500).json({
            success: "0",
            message: "An unexpected error occurred.",
        });
    }
};

export const autoIsolatedMargin = async (req, resp) => {
    const { user_id, symbol, auto_margin } = req.body;
    try {
        const rows = await pool.query(`Select api_key,api_secret from futures_sub_acc where user_id = ? AND status = 1`, [user_id]);

        if (rows.length === 0) {
            return resp.status(400).json({ success: "0", message: "Account freezed" });
        }

        const client = await subClient(rows[0].api_key, rows[0].api_secret);

        const response = await client.setAutoAddMargin({
            category: 'linear',
            symbol: symbol.toUpperCase(),
            autoAddMargin: auto_margin
        });

        console.log('autoIsolatedMargin', JSON.stringify(response, null, 2));

        if (response.retCode === 0) {
            return resp.status(200).json({
                success: "1", message: response.retMsg
            });
        } else {
            return resp.status(400).json({ success: "0", message: response.retMsg });
        }
    } catch (error) {
        console.error('Error switching isolated margin:', error);
        return resp.status(500).json({
            success: "0",
            message: "An unexpected error occurred.",
        });
    }
};

export const setTradingStop = async (req, resp) => {
    const { user_id, symbol, tp_sl_mode, take_profit, tp_trigger_by, stop_loss, sl_trigger_by, qty, tp_order_type, sl_order_type, tp_limit_price, sl_limit_price, trailing_stop, active_price } = req.body;

    try {
        const rows = await pool.query(`Select api_key,api_secret from futures_sub_acc where user_id = ? AND status = 1`, [user_id]);

        if (rows.length === 0) {
            return resp.status(400).json({ success: "0", message: "Account freezed" });
        }

        const client = await subClient(rows[0].api_key, rows[0].api_secret);

        const orderPayload = {
            category: 'linear',
            symbol: symbol.toUpperCase(),
            positionIdx: 0,
        };

        if (tp_sl_mode) {
            orderPayload.tpslMode = tp_sl_mode;

            if (take_profit !== undefined) {
                orderPayload.takeProfit = take_profit.toString();
                if (tp_trigger_by) orderPayload.tpTriggerBy = tp_trigger_by;
            }

            if (stop_loss !== undefined) {
                orderPayload.stopLoss = stop_loss.toString();
                if (sl_trigger_by) orderPayload.slTriggerBy = sl_trigger_by;
            }

            if (tp_sl_mode === "Partial") {
                if(qty !== undefined) {
                    orderPayload.tpSize = qty.toString();
                    orderPayload.slSize = qty.toString();
                }

                if (tp_order_type) orderPayload.tpOrderType = tp_order_type;
                if (sl_order_type) orderPayload.slOrderType = sl_order_type;
                if (tp_limit_price) orderPayload.tpLimitPrice = tp_limit_price.toString();
                if (sl_limit_price) orderPayload.slLimitPrice = sl_limit_price.toString();
            }
        } else if (trailing_stop !== undefined) {
            orderPayload.trailingStop = trailing_stop.toString();
            if (active_price !== undefined) {
                orderPayload.activePrice = active_price.toString();
            }
        }

        console.log('orderPayload', JSON.stringify(orderPayload, null, 2));

        const response = await client.setTradingStop(orderPayload);

        console.log('setTradingStop', JSON.stringify(response, null, 2));

        if (response.retCode === 0) {
            return resp.status(200).json({
                success: "1", data: response.result
            });
        } else {
            return resp.status(400).json({ success: "0", message: response.retMsg });
        }
    } catch (error) {
        console.error("Error in setTradingStop", error);
        resp.status(500).json({
            success: "0",
            message: "Failed to set trading stop.",
        });
    }
};