import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { OverviewState } from "../types";
import { queryOverviewData } from "@/utils/api/apis";
import { Overview } from "@/utils/api/types";

const initialState: OverviewState = {
    loadingOverview: false,
    overviewData: null
}

const overviewSlice = createSlice({
    name: "overview",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(requestOverviewInfoData.pending, (state, action) => {
            state.loadingOverview = true;
        });
        builder.addCase(requestOverviewInfoData.rejected, (state, action) => {
            state.loadingOverview = false;
            state.overviewData = null;
        });
        builder.addCase(requestOverviewInfoData.fulfilled, (state, action) => {
            state.loadingOverview = false;
            state.overviewData = action.payload.data;
        });

        builder.addCase(updateOverviewInfoData.fulfilled, (state, action) => {
            state.overviewData = action.payload.data;
        });
    }
})

export const requestOverviewInfoData = createAsyncThunk<
    { data: Overview }
>(
    '/api/overview/requestOverviewInfoData',
    async () => {
        const res = await queryOverviewData();
        const data = res.data.overview;
        return {
            data
        }
    }
)


export const updateOverviewInfoData = createAsyncThunk<
    { data: Overview }
>(
    '/api/overview/updateOverviewInfoData',
    async () => {
        const res = await queryOverviewData();
        const data = res.data.overview;
        return {
            data
        }
    }
)

export const {
} = overviewSlice.actions;

export default overviewSlice.reducer;