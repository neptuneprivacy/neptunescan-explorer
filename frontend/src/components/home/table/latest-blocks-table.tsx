import NavTextLink from "@/components/base/nav-text-link";
import { TimeClock } from "@/components/TimeClock";
import { updateLatestBlocks } from "@/store/block/block-slice";
import { useLatestBlocks, useLatestWsBlock } from "@/store/block/hooks";
import { useAppDispatch } from "@/store/hooks";
import { stringConvertToTimestamp } from "@/utils/data-format";
import { numberConverTo } from "@/utils/math-format";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Box } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LatestBlocksTable() {
  const latestBlocks = useLatestBlocks();
  const wsBlock = useLatestWsBlock();
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (wsBlock) {
      dispatch(updateLatestBlocks());
    }
  }, [wsBlock]);
  const router = useRouter();

  return (
    <div className="flex flex-col gap-2">
      {latestBlocks &&
        latestBlocks.map((item, index) => {
          let data = stringConvertToTimestamp(item.time);
          return (
            <Card key={item.block} className="p-2">
              <CardContent className="flex flex-col gap-2 p-0">
                <div className="flex flex-row justify-between items-center">
                  <div className="flex flex-row items-center gap-4">
                    <Box size={18} />
                    <NavTextLink
                      style={{ fontSize: "18px" }}
                      href={`/block?h=${item.block}`}
                    >
                      {numberConverTo(item.block)}
                    </NavTextLink>
                  </div>
                  <TimeClock
                    timeStamp={data}
                    style={{ fontSize: "14px", color: "#858585" }}
                  />
                </div>
                <div className="flex flex-row gap-2">
                  <span className="text-sm text-[#332526]">Outputs</span>
                  <span className="text-sm text-[#858585]">{item.outputs}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
    </div>
  );
}
