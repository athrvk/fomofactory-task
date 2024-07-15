
export interface StockData {
    symbol: string,
    open: number,
    high: number,
    low: number,
    close: number,
    volume: number,
    change: number,
    changePercent: number,
    timestamp: Date
}

export interface DataState {
    currentSymbol: string;
    stocksToPoll: string[];
    data: StockData[];
    isModalOpen: boolean;
}

export interface SocketState {
    isSocketConnected: boolean;
}