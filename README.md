# fomofactory-task

This repo contains the code for the Fomofactory task.

## Backend

An Express server with websocket is used to communicate with the frontend.
The backend polls Yahoo Finance for stock data. at every POLL_INTERVAL (can be set in .env.local or .env, by default 5 seconds). The whole codebase is built using TypeScript.

Yahoo Finance API: `https://query1.finance.yahoo.com/v8/finance/chart/{symbol}?interval=1m&range=1d`

To Add new stocks to poll add them to `constants.ts` in `STOCKS_TO_POLL` array

It stores the polled data in MongoDB Cloud

It serves two APIs `api/stocks` and `api/stock/chart/{symbol}`

It opens a websocket connection which listens on `pollSymbol` and emits data every half seconds on `pollData`

It connects to MongoDB Cloud on using its connection URI, its username and password are set in .env file, its db name and collection name are set in `constants.ts`

Backend is served at `http://localhost:3030` ; PORT = 3030

First Step to start the server is to install the dependencies

```bash
cd backend
npm install
```

To start the server in dev mode, run (in a separate terminal)

```bash
cd backend
npm run dev
```

To run the server in production mode, run (in a separate terminal)

```bash
cd backend
npm run build
npm run start
```

## Frontend

Next.js is used for the frontend.

Its bootstrapped using create next app with TypeScript template

Frontend is served at `http://localhost:3000` ; PORT = 3000

First Step to start the frontend is to install the dependencies

```bash
cd stock-crypto-tracker
npm install
```

To start the frontend in dev mode, run (in a separate terminal)

```bash
cd stock-crypto-tracker
npm run dev
```

This should open the browser and navigate to `http://localhost:3000`

To run the frontend in production mode, run (in a separate terminal)

```bash
cd stock-crypto-tracker
npm run build
npm run start
```
