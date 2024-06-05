import "dotenv/config"

export const HOST = process.env.HOST || "0.0.0.0"
export const PORT = Number(process.env.PORT) || 4550

