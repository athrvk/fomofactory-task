import { MongoClient } from "mongodb"
import { StockData, YahooFinanceResponse } from "../types/types"
import { STOCKS_TO_POLL } from "./constants"

const POLL_INTERVAL = Number(process.env.POLL_INTERVAL) || 5000
const DB_NAME = process.env.MONGODB_DB_NAME || "stock-tracker"
const COLLECTION_NAME = process.env.MONGODB_COLLECTION_NAME || "stocks"

async function pollStockData(symbol: string, client: MongoClient) {
    try {
        const stockApi = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1m&range=1d`
        const response = await fetch(stockApi)
        const responseJson = await response.json()

        if (!responseJson) {
            console.error(`No data received for symbol: ${symbol}`)
            return
        }

        console.log('Polling for stock: ', symbol, ' at ', new Date().toLocaleTimeString())
        const latestStockData = transformLatestYahooFinanceData(responseJson);

        const db = client.db(DB_NAME)
        const collection = db.collection(COLLECTION_NAME)
        await collection.insertOne(latestStockData)

    } catch (error) {
        console.error(`Error polling data for ${symbol}:`, error);
    }

}

async function initializePolling(client: MongoClient) {
    console.log('Polling stocks:', STOCKS_TO_POLL)
    try {
        STOCKS_TO_POLL.forEach(symbol => {
            setInterval(() => pollStockData(symbol, client), POLL_INTERVAL);
        });
    } catch (error) {
        console.error('Error polling stocks:', error);
    }
}

export function transformLatestYahooFinanceData(data: YahooFinanceResponse): StockData {
    const result = data.chart.result[0];
    const quote = result.indicators.quote[0];
    const meta = result.meta;

    const lastIndex = result.timestamp.length - 1;

    const close = quote.close[lastIndex];
    const previousClose = meta.previousClose;
    const change = close - previousClose;
    const changePercent = (change / previousClose) * 100;
    return {
        symbol: meta.symbol,
        open: quote.open[lastIndex],
        high: quote.high[lastIndex],
        low: quote.low[lastIndex],
        close: close,
        volume: quote.volume[lastIndex - 2], // because last value is always 0 and second last is empty(null)
        change: parseFloat(change.toFixed(2)),
        changePercent: parseFloat(changePercent.toFixed(2)),
        timestamp: new Date(result.timestamp[lastIndex] * 1000)
    };
}

export default initializePolling