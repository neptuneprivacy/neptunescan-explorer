"use client";

import { useAppDispatch } from "@/store/hooks";
import { useLoadingReward, useRewardChartDatas } from "@/store/stats/hooks";
import { requestRewardChartData } from "@/store/stats/stats-slice";
import { bigNumberMinus, bigNumberPlus, bigNumberTimes } from "@/utils/common";
import { stringConvertToTimestamp } from "@/utils/data-format";
import { numberConverTo, tokenFormat } from "@/utils/math-format";
import { shortenNumber, timestampToDate } from "@/utils/tools";
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ComposedChart,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingOverlay } from "@/components/ui/loading-overlay";

const chartConfig = {
  totalReward: {
    label: "Total Reward",
    color: "rgb(59, 64, 167)",
  },
  guesserReward: {
    label: "Guesser's Reward",
    color: "rgb(120, 140, 200)",
  },
} satisfies ChartConfig;

export const RewardChartFilters = [
  { label: "All", value: "all" },
  { label: "Month", value: "month" },
  { label: "Week", value: "week" },
  { label: "Day", value: "day" },
];

export default function RewardChart() {
  const loading = useLoadingReward();
  const rewardChatDatas = useRewardChartDatas();
  const [viewData, setViewData] = useState<any>([]);
  const [rewardChartFilter, setRewardChartFilter] = useState("all");
  const showTimeLabels = ["week", "day"];
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (rewardChatDatas) {
      handleViewData();
    }
  }, [rewardChatDatas]);

  useEffect(() => {
    if (rewardChartFilter) {
      dispatch(
        requestRewardChartData({
          duration: rewardChartFilter,
        })
      );
    }
  }, [rewardChartFilter, dispatch]);

  function handleViewData() {
    let datas = [] as any[];
    let newArray = rewardChatDatas;
    if (
      !showTimeLabels.includes(rewardChartFilter) &&
      rewardChatDatas &&
      rewardChatDatas.length > 1
    ) {
      newArray = rewardChatDatas.slice(0, -1);
    }
    newArray &&
      newArray.length > 0 &&
      newArray.forEach((item) => {
        let timestamp = stringConvertToTimestamp(item.interv);
        datas.push({
          name: item.interv,
          totalReward: tokenFormat(item.value),
          guesserReward: tokenFormat(item.fee),
          height: item.height,
          date: showTimeLabels.includes(rewardChartFilter)
            ? timestampToDate(timestamp, "YYYY-MM-DD HH:mm")
            : timestampToDate(timestamp, "YYYY-MM-DD"),
        });
      });
    setViewData(datas);
  }

  const [domain, setDomain] = useState([] as any[]);
  useEffect(() => {
    if (rewardChatDatas) {
      finMaxAndMin();
    }
  }, [rewardChatDatas]);

  function finMaxAndMin() {
    if (rewardChatDatas) {
      const max = Math.max.apply(
        Math,
        rewardChatDatas.map(function (f: any) {
          return tokenFormat(f.value);
        })
      );
      const min = Math.min.apply(
        Math,
        rewardChatDatas.map(function (f: any) {
          return tokenFormat(f.value);
        })
      );
      let minValue =
        bigNumberMinus(min, bigNumberMinus(bigNumberMinus(max, min), 0.1)) > 0
          ? bigNumberMinus(min, bigNumberMinus(bigNumberMinus(max, min), 0.1))
          : 0;

      let maxValue = bigNumberPlus(
        max,
        bigNumberTimes(bigNumberMinus(max, min), 0.1)
      );

      let roundedMin = Math.floor(minValue);
      let roundedMax = Math.ceil(maxValue);
      if (roundedMin === roundedMax) {
        if (roundedMax === 0) {
          setDomain([]);
        } else {
          setDomain([roundedMin, roundedMax]);
        }
      } else {
        setDomain([roundedMin, roundedMax]);
      }
    }
  }

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-base font-medium">Reward Chart</CardTitle>
          <CardDescription>Block rewards distribution</CardDescription>
        </div>
        <Tabs
          value={rewardChartFilter}
          onValueChange={setRewardChartFilter}
          className="w-auto"
        >
          <TabsList className="grid w-full grid-cols-4 h-8">
            {RewardChartFilters.map((item) => (
              <TabsTrigger
                key={item.value}
                value={item.value}
                className="text-xs px-2 h-6"
              >
                {item.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="flex-1 pb-4 relative min-h-[300px]">
        <LoadingOverlay visible={loading} />
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <AreaChart
            data={viewData}
            margin={{
              left: 12,
              right: 12,
              top: 12,
              bottom: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              fontSize={12}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={domain}
              tickFormatter={(value) => shortenNumber(value)}
              fontSize={12}
              width={40}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="totalReward"
              type="monotone"
              fill="var(--color-totalReward)"
              fillOpacity={0.4}
              stroke="var(--color-totalReward)"
              stackId="a"
            />
            <Area
              dataKey="guesserReward"
              type="monotone"
              fill="var(--color-guesserReward)"
              fillOpacity={0.4}
              stroke="var(--color-guesserReward)"
              stackId="b"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
