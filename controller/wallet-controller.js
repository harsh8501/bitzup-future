import { client } from "../utils/utils.js";
import pool from "../connection/dbConnection.js";
import { v4 as uuidv4 } from 'uuid';
import { subClient } from "../utils/utils.js";
import dotenv from "dotenv";

dotenv.config();

export const getBalance = async (req, resp) => {
    const { coin, user_id } = req.body;

    const modifiedCoin = coin?.toUpperCase();

    try {
        const rows = await pool.query(`Select api_key,api_secret from futures_sub_acc where user_id = ? AND status = 1`, [user_id]);

        if (rows.length === 0) {
            return resp.status(400).json({ success: "0", message: "Account freezed" });
        }

        const client = await subClient(rows[0].api_key, rows[0].api_secret);

        const response = await client.getWalletBalance({
            accountType: 'UNIFIED',
            ...(modifiedCoin !== 'ALL' && { coin: modifiedCoin }),
        });

        if (response.retCode === 0) {
            const walletData = response.result?.list?.[0];

            const summary = {
                totalUsdBalance: walletData?.totalEquity,
                coins: walletData.coin.map(c => ({
                    coin: c.coin,
                    walletBalance: c.walletBalance,
                })),
                totalMarginBalance: walletData?.totalMarginBalance,
                totalAvailableBalance: walletData?.totalAvailableBalance,
                totalWalletBalance: walletData?.totalWalletBalance
            };

            return resp.status(200).json({
                success: "1",
                data: summary,
            })
        } else {
            return resp.status(400).json({ success: "0", message: response.retMsg });
        }
    } catch (error) {
        console.error('Error fetching wallet balance:', error);
        return resp.status(500).json({
            success: "0",
            message: "An unexpected error occurred.",
        });
    }
};

export const depositToSubAcc = async (req, res) => {
    const { coin, amount, user_id } = req.body;

    const transfer_id = uuidv4();

    try {
        const response = await client.createUniversalTransfer({
            transferId: transfer_id,
            coin: coin,
            amount: amount,
            fromMemberId: process.env.MASTER_UID,
            toMemberId: user_id,
            fromAccountType: "UNIFIED",
            toAccountType: "UNIFIED",
        });

        if (response.retCode !== 0) {
            return res.status(400).json({ success: "0", message: response.retMsg });
        }

        const status = response.result.status

        const query = `
            INSERT INTO futures_deposit_withdrawl
                (transfer_id, coin, amount, from_member_id, to_member_id, type, status)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        await pool.query(query, [transfer_id, coin, amount, process.env.MASTER_UID, user_id, 'DEPOSIT', status]);

        return res.status(200).json({
            success: "1",
            message: "Deposit to account successful.",
            data: {
                transferId: response.result.transferId,
                status: response.result.status
            },
        });
    } catch (error) {
        console.error('Error depositing to sub-account:', error);
        return res.status(500).json({
            success: "0",
            message: "An unexpected error occurred.",
        });
    }
};

export const withdrawFromSubAcc = async (req, res) => {
    const { coin, amount, user_id } = req.body;

    const transfer_id = uuidv4();

    try {
        const response = await client.createUniversalTransfer({
            transferId: transfer_id,
            coin: coin,
            amount: amount,
            fromMemberId: user_id,
            toMemberId: process.env.MASTER_UID,
            fromAccountType: "UNIFIED",
            toAccountType: "UNIFIED",
        });

        if (response.retCode !== 0) {
            return res.status(400).json({ success: "0", message: response.retMsg });
        }

        const status = response.result.status

        const query = `
            INSERT INTO futures_deposit_withdrawl
                (transfer_id, coin, amount, from_member_id, to_member_id, type, status)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        await pool.query(query, [transfer_id, coin, amount, user_id, process.env.MASTER_UID, 'WITHDRAW', status]);

        return res.status(200).json({
            success: "1",
            message: "Deposit to account successful.",
            data: {
                transferId: response.result.transferId,
                status: response.result.status
            },
        });
    } catch (error) {
        console.error('Error depositing to sub-account:', error);
        return res.status(500).json({
            success: "0",
            message: "An unexpected error occurred.",
        });
    }
};