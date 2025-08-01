import pool from "../connection/dbConnection.js";
import { client } from "../utils/utils.js";
import { subClient } from "../utils/utils.js";

// * The API key must have one of the permissions to be allowed to call the following API endpoint.
// * For master API key: "Account Transfer", "Subaccount Transfer", "Withdrawal"

// export const createSubAccount = async (req, resp) => {
//     const { username } = req.body;
//     try {
//         const response = await client.createSubMember({
//             username: username, // required
//             memberType: 1,     // 1 - normal sub acc
//             switch: 1,        // 1 - turn on quick login, 0 - turn off quick login (default)
//         });

//         console.log('Sub-account created:', JSON.stringify(response, null, 2));



//         // Store the sub-UID in the database
//         const query = `INSERT INTO futures_sub_acc (user_name, user_id, api_key, api_secret) VALUES (?, ?, ?, ?)`;
//         await pool.query(query, [username, response.result.uid]);

//         return resp.status(200).json({
//             success: "1",
//             message: "Sub-account created successfully.",
//             data: response,
//         });
//     } catch (error) {
//         console.error('Error creating sub-account:', error?.response || error);
//         return resp.status(500).json({
//             success: "0",
//             message: "An unexpected error occurred.",
//             error: error.message,
//         });
//     }
// };

export const createSubAccount = async (req, resp) => {
    const { username } = req.body;

    try {
        const response = await client.createSubMember({
            username: username,
            memberType: 1,
            switch: 1,
        });

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

            return resp.status(500).json({
                success: "0",
                message: "An unexpected error occurred. Please try again.",
            });
        }

        const query = `
        INSERT INTO futures_sub_acc (user_name, user_id, api_key, api_secret)
        VALUES (?, ?, ?, ?)
      `;
        await pool.query(query, [username, uid, apiKey, apiSecret]);

        return resp.status(200).json({
            success: "1",
            message: "Sub-account created successfully.",
            data: {
                user_id: uid,
            }
        });

    } catch (error) {
        console.error('Unexpected Error:', error?.response?.data || error.message || error);
        return resp.status(500).json({
            success: "0",
            message: "An unexpected error occurred.",
        });
    }
};

export const getAllSubAccount = async (req, resp) => {
    try {
        const response = await client.getSubUIDList();

        if (response.retCode !== 0) {
            return resp.status(400).json({ success: "0", message: response.retMsg });
        }

        return resp.status(200).json({
            success: "1",
            data: response.result.subMembers,
        });
    } catch (error) {
        console.error('Error fetching all sub-accounts:', error);
        return resp.status(500).json({
            success: "0",
            message: "An unexpected error occurred.",
        });
    }
};

export const getAccountInfo = async (req, resp) => {
    try {
        const { user_id } = req.body;

        const rows = await pool.query(`Select api_key,api_secret from futures_sub_acc where user_id = ? AND status = 1`, [user_id]);
        
        if (rows.length === 0) {
            return resp.status(400).json({ success: "0", message: "Account freezed" });
        }
        
        const client = await subClient(rows[0].api_key, rows[0].api_secret);

        const response = await client.getAccountInfo();
        return resp.status(200).json({
            success: "1",
            message: "account information fetched successfully.",
            data: response,
        });
    } catch (error) {
        console.error('Error fetching sub-account information:', error?.response || error);
        return resp.status(500).json({
            success: "0",
            message: "An unexpected error occurred.",
            error: error.message,
        });
    }
};
