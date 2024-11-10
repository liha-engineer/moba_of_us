import dotenv from "dotenv";

dotenv.config();

export const HOST = process.env.HOST || "3.39.228.15"
export const PORT = process.env.PORT || 5555;
export const CLIENT_VERSION = process.env.CLIENT_VERSION || "1.0.0";

export const DB_NAME = process.env.DB_NAME || moba_user_db;
export const DB_USER = process.env.DB_USER
export const DB_PASSWORD = process.env.DB_PASSWORD
export const DB_HOST = process.env.DB_HOST
export const DB_PORT = process.env.DB_PORT || 3306;
