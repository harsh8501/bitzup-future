import pool from "../connection/dbConnection.js";
import CryptoJS from "crypto-js";
//import { client } from "../utils/utils.js";
import { subClient } from "../utils/utils.js";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, "../.env")
});

// * The API key must have one of the permissions to be allowed to call the following API endpoint.
// * For master API key: "Account Transfer", "Subaccount Transfer", "Withdrawal"

export const createSubAccount = async (req, resp) => {
    const { user_id } = req.body;

    try {
        const rows = await pool.query(`Select user_id from futures_sub_acc where user_id = ?`, [user_id]);

        if (rows.length > 0) {
            return resp.status(200).json({ success: "1", message: "Account already exists" });
        }

        const response = await client.createSubMember({
            username: user_id,
            memberType: 1,
            switch: 1,
        });

        if (response.retCode !== 0) {
            return resp.status(200).json({ success: "0", message: response.retMsg });
        }

        const uid = response.result.uid;

        let apiKey, apiSecret;
        try {
            const apiKeyResponse = await client.createSubUIDAPIKey({
                subuid: uid,
                readOnly: 0,   // 0 - read-write, 1 - read-only
                permissions: {
                    Wallet: ['AccountTransfer', 'SubMemberTransferList'],
                    ContractTrade: ["Order", "Position"],
                    Options: ['OptionsTrade'],
                    Exchange: ["ExchangeHistory"],
                    Spot: ["SpotTrade"]
                },
            });

            ({ apiKey, apiSecret } = apiKeyResponse.result);
        } catch (apiKeyErr) {
            console.error(`API Key Creation Failed for sub-account ${uid}:`, apiKeyErr?.response?.data || apiKeyErr.message);

            // Clean up: delete the sub-account if API key creation failed
            try {
                await client.deleteSubMember({ subMemberId: uid });
                console.log(`Sub-account ${uid} deleted due to API key failure.`);
            } catch (deleteErr) {
                console.error(`Failed to delete sub-account ${uid}:`, deleteErr?.response?.data || deleteErr.message);
            }

            return resp.status(200).json({
                success: "0",
                message: "An unexpected error occurred. Please try again.",
            });
        }

        const encryptedSecret = CryptoJS.AES.encrypt(apiSecret, process.env.ENCRYPTION_KEY).toString();
        const encryptedKey = CryptoJS.AES.encrypt(apiKey, process.env.ENCRYPTION_KEY).toString();

        const query = `
            INSERT INTO futures_sub_acc (user_id, account_id, api_key, api_secret)
            VALUES (?, ?, ?, ?)
          `;
        await pool.query(query, [user_id, uid, encryptedKey, encryptedSecret]);

        return resp.status(200).json({
            success: "1",
            message: "Account created successfully.",
        });

    } catch (error) {
        console.error('Error creating sub-account:', error);
        return resp.status(200).json({
            success: "0",
            message: "An unexpected error occurred.",
        });
    }
};

export const getAllSubAccount = async (req, resp) => {
    try {
        const response = await client.getSubUIDList();

        if (response.retCode !== 0) {
            return resp.status(200).json({ success: "0", message: response.retMsg });
        }

        return resp.status(200).json({
            success: "1",
            data: response.result.subMembers,
        });
    } catch (error) {
        console.error('Error fetching all sub-accounts:', error);
        return resp.status(200).json({
            success: "0",
            message: "An unexpected error occurred.",
        });
    }
};

export const getMarginMode = async (req, resp) => {
    try {
        const { user_id } = req.body;

        const rows = await pool.query(`Select api_key,api_secret from futures_sub_acc where user_id = ? AND status = 1`, [user_id]);

        if (rows.length === 0) {
            return resp.status(200).json({ success: "0", message: "Account freezed or not found" });
        }

        const client = await subClient(rows[0].api_key, rows[0].api_secret);

        const response = await client.getAccountInfo();

        if (response.retCode !== 0) {
            return resp.status(200).json({ success: "0", message: response.retMsg });
        }

        return resp.status(200).json({
            success: "1",
            message: "Margin mode fetched successfully.",
            data: response.result.marginMode,
        });
    } catch (error) {
        console.error('Error fetching margin mode:', error);
        return resp.status(200).json({
            success: "0",
            message: "An unexpected error occurred.",
            error: error.message,
        });
    }
};
