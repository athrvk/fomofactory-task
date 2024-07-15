import { configureStore } from '@reduxjs/toolkit';
import stocksReducer from './slices/stocksSlice';
import socketReducer from './slices/socketSlice';

// Function to load state from localStorage
const loadState = () => {
  if (typeof window === 'undefined') {
    return undefined;
  }
  try {
    const serializedState = localStorage.getItem('stockAppState');
    if (serializedState === null) {
      return undefined;
    }
    return { stocks: JSON.parse(serializedState), socket: undefined };
  } catch (err) {
    console.error(`Failed to load state from localStorage: ${err}`);
    localStorage.removeItem('stockAppState');
    return undefined;
  }
};

// Function to save state to localStorage
const saveState = (state: RootState) => {
  if (typeof window === 'undefined') {
    return undefined;
  }
  try {
    const serializedState = JSON.stringify(state.stocks);
    localStorage.setItem('stockAppState', serializedState);
  } catch {
    console.error('Failed to save state to localStorage');
    localStorage.removeItem('stockAppState');
  }
};


export const store = configureStore({
  reducer: {
    stocks: stocksReducer,
    socket: socketReducer
  },
  preloadedState: loadState(),
});

if (typeof window !== 'undefined') {
  store.subscribe(() => {
    saveState(store.getState());
  });
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;