import CryptoJS from "crypto-js";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, "../.env")
});

export const encrypt = (text) => {
    const encrypted = CryptoJS.AES.encrypt(text, process.env.ENCRYPTION_KEY).toString();
    return encrypted;
};

export const decrypt = (text) => {
    const bytes = CryptoJS.AES.decrypt(text, process.env.ENCRYPTION_KEY);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
};

// BiNYWrK4YmCxJ5mV0H
// I44NYGRt2lhdwZd5eJY6LJvlQQ8i84z4tTMM


//console.log(encrypt("I44NYGRt2lhdwZd5eJY6LJvlQQ8i84z4tTMM"));
console.log(decrypt("U2FsdGVkX1/0tAlPW5Y1yHV1mX2Q2NPkPCRF29hoMtRThLLS7DHs+H/vaqAFwF9H"));
console.log(decrypt("U2FsdGVkX1+81BWShGzr49yM71Pnqpe1xWaFwgm3aZNrQQMzH2vLJX1tDy+h+jABGt6ZmhskbZP0y+5jaVJ59A=="));
