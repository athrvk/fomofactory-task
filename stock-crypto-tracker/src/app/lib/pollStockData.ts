// import { MongoClient } from "mongodb"
// import { COLLECTION_NAME, DB_NAME, STOCKS_TO_POLL } from "./constants"
// import { StockData } from "@/types"
// import clientPromise from "./mongodb"

// const POLL_INTERVAL = Number(process.env.POLL_INTERVAL) || 5000

// export async function pollStockData(symbol: string, client: MongoClient) {
//     try {
//         const stockApi = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1m&range=1d`
//         const response = await fetch(stockApi)
//         const responseJson = await response.json()
//         const result = responseJson.chart.result[0]

//         if (!result) {
//             console.error(`No data received for symbol: ${symbol}`)
//             return
//         }

//         console.log('Polling for symbol:', symbol)

//         const quote = result.indicators.quote[0];
//         const latestIndex = quote.close.length - 1;

//         const stockData: StockData = {
//             symbol: symbol,
//             open: quote.open[latestIndex],
//             high: quote.high[latestIndex],
//             low: quote.low[latestIndex],
//             close: quote.close[latestIndex],
//             volume: quote.volume[latestIndex],
//             change: quote.close[latestIndex] - result.meta.previousClose,
//             changePercent: ((quote.close[latestIndex] - result.meta.previousClose) / result.meta.previousClose) * 100,
//             timestamp: new Date(result.timestamp[latestIndex] * 1000), // Convert UNIX timestamp to Date
//         };

//         // console.log(stockData)

//         // const stockData = {
//         //     symbol: data["01. symbol"],
//         //     open: data["02. open"],
//         //     high: data["03. high"],
//         //     low: data["04. low"],
//         //     price: data["05. price"],
//         //     volume: data["06. volume"],
//         //     change: data["10. change"],
//         //     changePercent: data["09. change percent"]
//         // }

//         const db = client.db(DB_NAME)
//         const collection = db.collection(COLLECTION_NAME)
//         await collection.insertOne(stockData)
//     } catch (error) {
//         console.error(`Error polling data for ${symbol}:`, error)
//     }

// }

// async function initializePolling(_clientPromise: Promise<MongoClient> = clientPromise) {
//     try {
//         const client = await _clientPromise
//         STOCKS_TO_POLL.forEach(symbol => {
//             setInterval(() => pollStockData(symbol, client), POLL_INTERVAL);
//         });
//     } catch (error) {
//         console.error('Error polling all stocks:', error);
//     }
// }

// module.exports = { initializePolling }