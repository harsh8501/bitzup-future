import { RestClientV5 } from "bybit-api";
import dotenv from "dotenv";

dotenv.config();

export const client = new RestClientV5({
    testnet: true,   // use false for mainnet
    //demoTrading: true,   // use true for demo trading else remove
    key: process.env.BYBIT_API_KEY,
    secret: process.env.BYBIT_API_SECRET,
});

export const subClient = async(api_key,api_secret) => new RestClientV5({
    testnet: true,   // use false for mainnet
    //demoTrading: true,   // use true for demo trading else remove
    key: api_key,
    secret: api_secret,
});