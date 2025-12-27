import { useAppSelector } from "@/store/hooks";
export const useLoadingBlockInfo = () => {
    return useAppSelector(state => state.block.loadingBlockInfo);
}
export const useBlockInfo = () => {
    return useAppSelector(state => state.block.blockInfo);
}

export const useLoadingLeastBlocks = () => {
    return useAppSelector(state => state.block.loadingLatestBlocks);
}

export const useLatestBlocks = () => {
    return useAppSelector(state => state.block.latestBlocks);
}
export const useLoadingBlocks = () => {
    return useAppSelector(state => state.block.loadingBlocks);
}
export const useBlocks = () => {
    return useAppSelector(state => state.block.blocks);
}

export const useBlocksPage = () => {
    return useAppSelector(state => state.block.blocksPage);
}
export const useBlocksTotalPage = () => {
    return useAppSelector(state => state.block.blocksTotalPage);
}

export const useLoadingOrphaned = () => {
    return useAppSelector(state => state.block.loadingOrphanedList);
}
export const useOrphaned = () => {
    return useAppSelector(state => state.block.orphanedList);
}

export const useOrphanedPage = () => {
    return useAppSelector(state => state.block.orphanedPage);
}
export const useOrphanedTotalPage = () => {
    return useAppSelector(state => state.block.orphanedTotalPage);
}


export const useLatestWsBlock = () => {
    return useAppSelector(state => state.block.wsClientBlockData);
}
export const useRpcBlockData = () => {
    return useAppSelector(state => state.block.rpcBlockData);
}
