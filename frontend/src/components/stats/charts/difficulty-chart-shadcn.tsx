"use client";

import { useAppDispatch } from "@/store/hooks";
import { useLoadingTarget, useTargetChartDatas } from "@/store/stats/hooks";
import { requestTargetChartData } from "@/store/stats/stats-slice";
import { bigNumberMinus, bigNumberPlus, bigNumberTimes } from "@/utils/common";
import { stringConvertToTimestamp } from "@/utils/data-format";
import { numberConverTo } from "@/utils/math-format";
import { shortenNumber, timestampToDate } from "@/utils/tools";
import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
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
} from "@/components/ui/chart";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingOverlay } from "@/components/ui/loading-overlay";

const chartConfig = {
  difficulty: {
    label: "Difficulty",
    color: "rgb(59, 64, 167)",
  },
} satisfies ChartConfig;

export const TargetChartFilters = [
  { label: "All", value: "all" },
  { label: "Month", value: "month" },
  { label: "Week", value: "week" },
  { label: "Day", value: "day" },
];

export default function DifficultyChart() {
  const loading = useLoadingTarget();
  const targetChatDatas = useTargetChartDatas();
  const [viewData, setViewData] = useState<any>([]);
  const [targetChartFilter, setTargetChartFilter] = useState("all");
  const dispatch = useAppDispatch();
  const showTimeLabels = ["week", "day"];

  useEffect(() => {
    if (targetChatDatas) {
      handleViewData();
    }
  }, [targetChatDatas]);

  useEffect(() => {
    if (targetChartFilter) {
      dispatch(
        requestTargetChartData({
          duration: targetChartFilter,
        })
      );
    }
  }, [targetChartFilter, dispatch]);

  function handleViewData() {
    let datas = [] as any[];
    let newArray = targetChatDatas;
    if (
      !showTimeLabels.includes(targetChartFilter) &&
      targetChatDatas &&
      targetChatDatas.length > 1
    ) {
      newArray = targetChatDatas.slice(0, -1);
    }
    newArray &&
      newArray.length > 0 &&
      newArray.forEach((item) => {
        let timestamp = stringConvertToTimestamp(item.interv);
        datas.push({
          name: item.interv,
          difficulty: item.value,
          height: item.height,
          date: showTimeLabels.includes(targetChartFilter)
            ? timestampToDate(timestamp, "YYYY-MM-DD HH:mm")
            : timestampToDate(timestamp, "YYYY-MM-DD"),
        });
      });
    setViewData(datas);
  }

  const [domain, setDomain] = useState([] as any[]);
  useEffect(() => {
    if (targetChatDatas) {
      finMaxAndMin();
    }
  }, [targetChatDatas]);

  function finMaxAndMin() {
    if (targetChatDatas) {
      const max = Math.max.apply(
        Math,
        targetChatDatas.map(function (f: any) {
          return f.value;
        })
      );
      const min = Math.min.apply(
        Math,
        targetChatDatas.map(function (f: any) {
          return f.value;
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
          <CardTitle className="text-base font-medium">
            Difficulty Chart
          </CardTitle>
          <CardDescription>Network difficulty over time</CardDescription>
        </div>
        <Tabs
          value={targetChartFilter}
          onValueChange={setTargetChartFilter}
          className="w-auto"
        >
          <TabsList className="grid w-full grid-cols-4 h-8">
            {TargetChartFilters.map((item) => (
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
              content={
                <ChartTooltipContent
                  indicator="dot"
                  labelFormatter={(value) => value}
                  formatter={(value, name) => (
                    <div className="flex min-w-[130px] items-center gap-2 text-xs text-muted-foreground">
                      Difficulty
                      <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                        {numberConverTo(value as number)}
                      </div>
                    </div>
                  )}
                />
              }
            />
            <Area
              dataKey="difficulty"
              type="monotone"
              fill="var(--color-difficulty)"
              fillOpacity={0.4}
              stroke="var(--color-difficulty)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
