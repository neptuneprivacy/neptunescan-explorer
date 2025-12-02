"use client";
import OverviewCard from "@/components/home/card/overview-card";
import HomeSearch from "@/components/home/home-search";
import LastestBlocksContent from "@/components/home/latest-blocks-content";
import LatestTxsContent from "@/components/home/latest-txs-content";
import { requestLatestBlocks } from "@/store/block/block-slice";
import { useAppDispatch } from "@/store/hooks";
import { requestOverviewInfoData } from "@/store/overview/overview-slice";
import { requestLatestTxs } from "@/store/txs/txs-slice";
import { requestLatestUtxos } from "@/store/utxo/utxo-slice";
import { useEffect } from "react";

export default function Home() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(requestOverviewInfoData());
    dispatch(requestLatestBlocks());
    dispatch(requestLatestUtxos());
    dispatch(requestLatestTxs());
  }, [dispatch]);

  useEffect(() => {
    document.title = `Home - Neptune Privacy Explorer`;
  }, []);

  return (
    <main className="container mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-12">
      <HomeSearch />

      <div className="space-y-8">
        <OverviewCard />

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div className="space-y-4">
            <LastestBlocksContent />
          </div>
          <div className="space-y-4">
            <LatestTxsContent />
          </div>
        </div>
      </div>
    </main>
  );
}
