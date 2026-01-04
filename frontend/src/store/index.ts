import { configureStore } from "@reduxjs/toolkit";

import blockSlice from "./block/block-slice";
import overviewSlice from "./overview/overview-slice";
import statsSlice from "./stats/stats-slice";
import utxoSlice from "./utxo/utxo-slice";
import transactionsSlice from "./txs/txs-slice";
import minerSlice from "./miner/miner-slice";

export const store = configureStore({
    reducer: {
        block: blockSlice,
        overview: overviewSlice,
        stats: statsSlice,
        utxo: utxoSlice,
        txs: transactionsSlice,
        miner: minerSlice
    }
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
