import { DataState, StockData } from '@/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: DataState = {
  currentSymbol: '',
  data: [],
  isModalOpen: false,
  stocksToPoll: [],
};


const stocksSlice = createSlice({
  name: 'stocks',
  initialState,
  reducers: {
    setCurrentSymbol: (state: DataState, action: PayloadAction<string>) => {
      state.currentSymbol = action.payload;
    },
    updateData: (state: DataState, action: PayloadAction<StockData[]>) => {
      state.data = action.payload;
    },
    setIsModalOpen: (state: DataState, action: PayloadAction<boolean>) => {
      state.isModalOpen = action.payload;
    },
    setStocksToPoll: (state: DataState, action: PayloadAction<string[]>) => {
      state.stocksToPoll = action.payload;
    },
  },
});

export const { setCurrentSymbol, updateData, setIsModalOpen, setStocksToPoll } = stocksSlice.actions;
export default stocksSlice.reducer;