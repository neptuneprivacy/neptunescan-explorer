'use client';
import MinerBlockTable from "@/components/miner/miner-block-table";
import MinerIdInfoTable from "@/components/miner/miner-id-info-table";
import { useAppDispatch } from "@/store/hooks";
import { requestMinerStatData } from "@/store/miner/miner-slice";
import { useParams } from "next/navigation";
import { useEffect } from "react";
export default function MinerDetailPage() {
    const params = useParams();
    const minerId = params.minerId as string;
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (minerId) {
            dispatch(requestMinerStatData({ digest: minerId }));
        }
    }, [minerId]);

    return (
        <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-8">
                <MinerIdInfoTable minerID={minerId} />
                <MinerBlockTable minerID={minerId}  />
            </div>
        </div>
    );
}