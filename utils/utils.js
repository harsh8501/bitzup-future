import { RestClientV5 } from "bybit-api";
import CryptoJS from "crypto-js";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, "../.env")
});

export const decrypt = (text) => {
    const bytes = CryptoJS.AES.decrypt(text, process.env.ENCRYPTION_KEY);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
};

export const client = new RestClientV5({ 
    testnet: true,   // use false for mainnet
    //demoTrading: true,   // use true for demo trading else remove
    key: decrypt(process.env.BYBIT_API_KEY.toString()),
    secret: decrypt(process.env.BYBIT_API_SECRET.toString()),
});

export const subClient = async(api_key,api_secret) => new RestClientV5({
    testnet: true,   // use false for mainnet
    //demoTrading: true,   // use true for demo trading else remove
    key: decrypt(api_key.toString()),
    secret: decrypt(api_secret.toString()),
});