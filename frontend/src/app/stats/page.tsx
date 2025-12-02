"use client";

import DifficultyChart from "@/components/stats/charts/difficulty-chart-shadcn";
import RewardChart from "@/components/stats/charts/reward-chart-shadcn";
import StatsOverview from "@/components/stats/stats-overview";
import { useAppDispatch } from "@/store/hooks";
import { requestOverviewInfoData } from "@/store/overview/overview-slice";
import { useEffect } from "react";

const Stats = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    document.title = `Charts & Stats - Neptune Privacy Explorer`;
  }, []);

  useEffect(() => {
    dispatch(requestOverviewInfoData());
  }, [dispatch]);

  return (
    <div className="w-full p-5 space-y-8">
      <StatsOverview />

      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Charts & Stats</h2>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <DifficultyChart />
          <RewardChart />
        </div>
      </div>
    </div>
  );
};

export default Stats;
