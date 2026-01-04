import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { MinerStatData, MinerState } from "../types";
import { queryMinerBlocks, queryMinerStat } from "@/utils/api/apis";
import { Block } from "@/utils/api/types";

const initialState: MinerState = {
  loadingMinerStatData: false,
  minerStatData: null,
  loadingMinerBlocks: false,
  minerBlocks: [],

  minerBlocksPage: 1,
  minerBlocksTotalPage: 0
};

const minerSlice = createSlice({
  name: "miner",
  initialState,
  reducers: {
    setMinerBlocksPage: (state, action) => {
      state.minerBlocksPage = action.payload;
    },

  },
  extraReducers: (builder) => {
    builder.addCase(requestMinerStatData.pending, (state, action) => {
      state.loadingMinerStatData = true;
    });
    builder.addCase(requestMinerStatData.rejected, (state, action) => {
      state.loadingMinerStatData = false;
      state.minerStatData = null;
    });
    builder.addCase(requestMinerStatData.fulfilled, (state, action) => {
      state.loadingMinerStatData = false;
      state.minerStatData = action.payload.data;
    })

    builder.addCase(requestMinerBlocks.pending, (state, action) => {
      state.loadingMinerBlocks = true;
    });
    builder.addCase(requestMinerBlocks.rejected, (state, action) => {
      state.loadingMinerBlocks = false;
      state.minerBlocks = [];
    });
    builder.addCase(requestMinerBlocks.fulfilled, (state, action) => {
      state.loadingMinerBlocks = false;
      state.minerBlocks = action.payload.data;
      state.minerBlocksTotalPage = action.payload.total
    });
  },
});


export const requestMinerStatData = createAsyncThunk<
  { data: MinerStatData },
  { digest: string }
>("/api/miner/stat/requestMinerStatData", async ({ digest }) => {
  const res = await queryMinerStat({
    digest
  });
  const data = res.data;
  return {
    data,
  };
});

export const requestMinerBlocks = createAsyncThunk<
  { data: Block[], total: number },
  { digest: string, page: number, size?: number }
>("/api/miner/stat/requestMinerBlocks", async ({ digest, page, size = 10 }) => {
  const res = await queryMinerBlocks({
    digest,
    page,
    size
  });
  const data = res.data.data;
  const total = res.data.total as number;
  return {
    data,
    total,
  };
});



export const { setMinerBlocksPage } = minerSlice.actions;
export default minerSlice.reducer;