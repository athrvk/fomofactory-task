'use client';

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { updateData } from '../redux/slices/stocksSlice';
import { setIsSocketConnected } from '../redux/slices/socketSlice';
import { StockData } from '@/types';
import SocketManager from '../lib/socketManager';


const DataTable: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { currentSymbol, data } = useSelector((state: RootState) => state.stocks);
    const { isSocketConnected } = useSelector((state: RootState) => state.socket);
    const socketManager = SocketManager.getInstance();

    // Connect to socket and setup connect disconnect on component mount
    useEffect(() => {
        socketManager.connect('http://localhost:3030')
        socketManager.on('connect', () => {
            dispatch(setIsSocketConnected(true));
            console.log('[client]: Connected to server');
        });
        socketManager.on('connect_error', (error) => {
            dispatch(setIsSocketConnected(false));
            console.error('[client]: Connection error:', error);
        });
        return () => {
            console.log('[client]: Disconnected from server');
            dispatch(setIsSocketConnected(false));
            socketManager.disconnect();
        };
    }, [dispatch, socketManager]);

    // Setup socket listeners for current symbol
    useEffect(() => {
        if (!isSocketConnected) {
            console.error('[client]: Socket not connected');
            return
        };
        if (currentSymbol === "") {
            return
        }
        console.log(`[client]: Setting up socket listeners for ${currentSymbol} stock data`);
        socketManager.on('pollData', (update: { symbol: string; data: StockData[]; }) => {
            console.log(`[client]: Received data for ${update.symbol} `);
            if (update.symbol === currentSymbol) {
                dispatch(updateData(update.data));
            }
        });

        return () => {
            socketManager.off('pollData');
        };
    }, [socketManager, currentSymbol, dispatch, isSocketConnected]);


    // Handle change in current symbol stop polling for No Symbol selected else start polling for current symbol
    useEffect(() => {
        if (currentSymbol === "") {
            if (isSocketConnected) {
                console.log(`[client]: Stop polling for ${currentSymbol}`);
                socketManager.emit('pollSymbol', { symbol: currentSymbol, stop: true });
            } else {
                console.error('[client]: Socket not connected');
            }
            console.log(`[client]: Clear Data Table`);
            dispatch(updateData([]));
            return
        } else {
            if (isSocketConnected) {
                console.log(`[client]: Start polling for ${currentSymbol}`);
                socketManager.emit('pollSymbol', { symbol: currentSymbol, stop: true });
            } else {
                console.error('[client]: Socket not connected');
            }
        }
    }, [currentSymbol, socketManager, isSocketConnected, dispatch]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/stock/chart/${currentSymbol}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const newData = await response.json();
                // console.log(newData);
                dispatch(updateData(newData));
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        if ((!data || data.length === 0) && currentSymbol !== "") {
            console.log(`[client]: Fetching initial Data for : ${currentSymbol}`);
            fetchData();
            // const interval = setInterval(fetchData, 3000);

            // return () => clearInterval(interval);
        }
    }, [currentSymbol, data, dispatch]);

    if ((currentSymbol !== "") && (!data || data.length === 0)) {
        return <h3 className="text-center">Loading...</h3>;
    }

    return (
        <>
            {
                currentSymbol !== "" &&
                <h2 className="text-center mb-4 font-semibold">{currentSymbol.split('.')[0].toUpperCase()}</h2>

            }
            {
                currentSymbol && (

                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                        Timestamp
                                    </th>
                                    <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                        Open
                                    </th>
                                    <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                        Close
                                    </th>
                                    <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                        High
                                    </th>
                                    <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                        Low
                                    </th>
                                    <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                        Change
                                    </th>
                                    <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                        Change %
                                    </th>
                                    <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                        Volume
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {data && data.map((item, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 whitespace-nowrap border-b border-gray-500">
                                            {new Date(item.timestamp).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap border-b border-gray-500">
                                            ${item.open.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap border-b border-gray-500">
                                            ${item.close.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap border-b border-gray-500">
                                            ${item.high.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap border-b border-gray-500">
                                            ${item.low.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap border-b border-gray-500">
                                            ${item.change.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap border-b border-gray-500">
                                            {item.changePercent.toFixed(2)} %
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap border-b border-gray-500">
                                            {item.volume}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )
            }
        </>
    );
};

export default DataTable;