'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { setCurrentSymbol, setIsModalOpen, setStocksToPoll } from '../redux/slices/stocksSlice';

const StockSelectorModal: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { currentSymbol, isModalOpen, stocksToPoll } = useSelector((state: RootState) => state.stocks);

    useEffect(() => {
        try {
            const fetchData = async () => {
                const response = await fetch('/api/stocks');
                if (!response.ok) {
                    throw new Error('Failed to fetch stocks to poll');
                }
                const data = await response.json();
                dispatch(setStocksToPoll(data.stocksToPoll));
            };
            fetchData();
        } catch (error) {
            console.error('Error fetching stocks to poll:', error);
        }
    }, [dispatch]);

    const handleSelectStock = (symbol: string) => {
        dispatch(setCurrentSymbol(symbol));
        dispatch(setIsModalOpen(false));
    };

    const handleClearStock = () => {
        dispatch(setCurrentSymbol(""));
        dispatch(setIsModalOpen(false));
    };

    return stocksToPoll.length > 0 && (
        <>
            <span className='flex justify-center'>
                <button
                    onClick={() => dispatch(setIsModalOpen(true))}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                    {currentSymbol === "" ? "Select Stock" : "Change Stock"}
                </button>

                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center">
                        <div className="bg-white rounded-lg p-8 max-w-sm w-full">
                            <h2 className="text-2xl font-bold mb-4">Select a Stock</h2>
                            <div className="space-y-2">
                                {stocksToPoll.map((stock) => (
                                    <button
                                        key={stock}
                                        onClick={() => handleSelectStock(stock)}
                                        className={`w-full px-4 py-2 rounded transition-colors ${currentSymbol === stock
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                            }`}
                                    >
                                        {stock}
                                    </button>
                                ))}
                            </div>
                            <span className='flex justify-around'>
                                <button
                                    onClick={() => handleClearStock()}
                                    className='mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors'
                                >
                                    Clear
                                </button>
                                <button
                                    onClick={() => dispatch(setIsModalOpen(false))}
                                    className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                                >
                                    Close
                                </button>
                            </span>
                        </div>
                    </div>
                )}
            </span>
        </>
    );
};

export default StockSelectorModal;