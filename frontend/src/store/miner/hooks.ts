import { useSelector } from "react-redux";
import { RootState } from "../index";

export const useMinerStatData = () => {
  return useSelector((state: RootState) => state.miner.minerStatData);
};

export const useLoadingMinerStatData = () => {
  return useSelector((state: RootState) => state.miner.loadingMinerStatData);
};

export const useMinerBlocks = () => {
  return useSelector((state: RootState) => state.miner.minerBlocks);
};

export const useMinerBlocksPage = () => {
  return useSelector((state: RootState) => state.miner.minerBlocksPage);
};

export const useMinerBlocksTotalPage = () => {
  return useSelector((state: RootState) => state.miner.minerBlocksTotalPage ?? 0);
};

export const useLoadingMinerBlocks = () => {
  return useSelector((state: RootState) => state.miner.loadingMinerBlocks);
};