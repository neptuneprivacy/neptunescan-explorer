"use client";

import { useLatestWsBlock } from "@/store/block/hooks";
import { useAppDispatch } from "@/store/hooks";
import { useLoadingOverview, useOverviewData } from "@/store/overview/hooks";
import { updateOverviewInfoData } from "@/store/overview/overview-slice";
import { stringConvertToTimestamp } from "@/utils/data-format";
import { numberConverTo, tokenFormat } from "@/utils/math-format";
import { shortenNumberUnits } from "@/utils/tools";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import {
  Info,
  Box,
  Clock,
  Coins,
  Activity,
  Cpu,
  Gauge,
  Timer,
  Hammer,
  Gift,
  Banknote,
  Wallet,
  Database,
} from "lucide-react";
import { useEffect, useState } from "react";
import { TimeClock } from "@/components/TimeClock";

export default function StatsOverview() {
  const loading = useLoadingOverview();
  const overviewData = useOverviewData();
  const wsBlock = useLatestWsBlock();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (wsBlock) {
      dispatch(updateOverviewInfoData());
    }
  }, [wsBlock]);

  function BaseCard({
    title,
    children,
    tip,
    units,
    icon: Icon,
  }: {
    title: string;
    children: React.ReactNode;
    tip?: string;
    units?: string;
    icon: any;
  }) {
    return (
      <Card className="bg-card border shadow-sm rounded-xl hover:shadow-md transition-all duration-200 hover:border-[rgb(59,64,167)]/30 group">
        <CardContent className="p-5 flex flex-col justify-between h-full gap-4">
          <div className="flex flex-row justify-between items-start">
            <div className="flex flex-col gap-1">
              <div className="flex flex-row gap-1 items-center">
                <span className="text-muted-foreground font-medium text-sm">
                  {title}
                </span>
                {tip && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info
                          size={14}
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{tip}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
              <div className="flex flex-row gap-1 items-baseline mt-1">
                {!children ? (
                  <Skeleton className="h-8 w-32" />
                ) : (
                  <>
                    <span className="text-foreground font-bold text-2xl tracking-tight">
                      {children}
                    </span>
                    {units && (
                      <span className="text-muted-foreground font-medium text-sm ml-1">
                        {units}
                      </span>
                    )}
                  </>
                )}
              </div>
            </div>
            <div className="p-2 bg-[rgb(59,64,167)]/10 rounded-lg group-hover:bg-[rgb(59,64,167)]/20 transition-colors">
              <Icon size={20} className="text-[rgb(59,64,167)]" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const [options, setOptions] = useState([] as any[]);

  useEffect(() => {
    if (overviewData) {
      handleOverviewData();
    }
  }, [overviewData]);

  function handleNptSupply() {
    let totalReward = tokenFormat(overviewData?.total_reward ?? 0);
    return numberConverTo(totalReward);
  }

  function handleOverviewData() {
    const allOptions = [
      {
        title: "Block Height",
        value: numberConverTo(overviewData?.height),
        icon: Box,
      },
      {
        title: "Latest Block",
        value: (
          <TimeClock
            timeStamp={stringConvertToTimestamp(overviewData?.timestamp ?? "")}
          ></TimeClock>
        ),
        icon: Clock,
      },
      {
        title: "Circulating Supply",
        value: handleNptSupply(),
        unit: "XNT",
        icon: Coins,
      },
      {
        title: "Tx Count",
        value: numberConverTo(overviewData?.tx_count),
        tip: "Start Block Height: 5,669",
        icon: Activity,
      },
      {
        title: "Network Hashrate",
        value: numberConverTo(
          shortenNumberUnits(overviewData?.network_speed_24h ?? "")
            .shortenNumber
        ),
        unit:
          shortenNumberUnits(overviewData?.network_speed_24h ?? "").unit + "/s",
        icon: Cpu,
      },
      {
        title: "Difficulty",
        value: numberConverTo(overviewData?.proof_target),
        icon: Gauge,
      },
      // Additional cards
      {
        title: "Avg Block Time",
        value: overviewData?.average_block_time
          ? `${overviewData.average_block_time.toFixed(2)}`
          : "--",
        unit: "s",
        icon: Timer,
      },
      {
        title: "Cumulative PoW",
        value: numberConverTo(overviewData?.cumulative_proof_of_work),
        icon: Hammer,
      },
      {
        title: "Day Reward",
        value: numberConverTo(tokenFormat(overviewData?.day_reward)),
        unit: "XNT",
        icon: Gift,
      },
      {
        title: "Day Fee",
        value: numberConverTo(tokenFormat(overviewData?.day_fee)),
        unit: "XNT",
        icon: Banknote,
      },
      {
        title: "Total Fee",
        value: numberConverTo(tokenFormat(overviewData?.total_fee)),
        unit: "XNT",
        icon: Wallet,
      },
      {
        title: "UTXO Count",
        value: numberConverTo(overviewData?.utxo_count),
        icon: Database,
      },
    ];
    setOptions(allOptions);
  }

  return (
    <div className="relative">
      <LoadingOverlay visible={loading} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {options.map((item, index) => {
          return (
            <div key={index}>
              <BaseCard
                title={item.title}
                units={item.unit}
                tip={item.tip}
                icon={item.icon}
              >
                {item.value}
              </BaseCard>
            </div>
          );
        })}
      </div>
    </div>
  );
}
