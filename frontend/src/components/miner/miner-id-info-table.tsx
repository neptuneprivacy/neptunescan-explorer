import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { useLoadingMinerStatData, useMinerStatData } from "@/store/miner/hooks";
import { shortenNumberUnits } from "@/utils/tools";
import { bigNumberDiv } from "@/utils/common";
import MinerLabel from "./miner-label";
import { Badge } from "@/components/ui/badge";
const InfoRow = ({
  label,
  value,
  className,
}: {
  label: string;
  value: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`grid grid-cols-1 md:grid-cols-12 gap-2 py-3 border-b last:border-0 ${className}`}
  >
    <div className="md:col-span-3 font-medium text-muted-foreground flex items-center">
      {label}
    </div>
    <div className="md:col-span-9 flex items-center break-all">{value}</div>
  </div>
);

const FormattedNumber = ({ value }: { value: number | string | undefined | null; }) => {
  if (value === undefined || value === null) return 0;
  const { shortenNumber: shortVal, unit } = shortenNumberUnits(value);
  const base = shortVal !== "" ? shortVal.toLocaleString() : Number(value).toLocaleString();
  return <>{unit ? `${base} ${unit}` : base}</>;
};

export default function MinerIdInfoTable({ minerID }: { minerID: string }) {
  const loading = useLoadingMinerStatData();
  const minerStatData = useMinerStatData();
  return (
    <Card className="shadow-sm border-muted">
      <CardHeader className="bg-muted/30 pb-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-row gap-4 items-center">
            <CardTitle className="text-2xl font-bold">
              Miner Details
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {
          loading ? <LoadingOverlay visible={loading} /> : minerStatData ? <div className="flex flex-col">
            <InfoRow
              label="Miner ID"
              value={
                <div className="flex items-center gap-2">
                  <MinerLabel minerID={minerID} />
                </div>
              }
            />
            <InfoRow
              label="24H Counts"
              value={
                <div className="w-full min-w-[120px] break-all">
                  <div className="flex flex-row items-center font-medium ">
                    <FormattedNumber value={minerStatData.count_24h ?? 0} />
                  </div>
                </div>}
            />
            <InfoRow
              label="Estimated Speed"
              value={<div className="flex flex-col gap-1">
                {(() => {
                  const work_4h = minerStatData.work_4h ?? 0;
                  const work_24h = minerStatData.work_24h ?? 0;
                  const speed4H = FormattedNumber({ value: bigNumberDiv(work_4h, 4 * 3600) });
                  const speed24H = FormattedNumber({ value: bigNumberDiv(work_24h, 24 * 3600) });
                  return (
                    <>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground w-24">
                          4H
                        </span>
                        <Badge variant="default" className="flex justify-center bg-green-100 text-green-800 hover:bg-green-200 min-w-[80px]">
                          {speed4H}/s
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground w-24">24H</span>
                        <Badge variant="default" className="flex justify-center bg-green-100 text-green-800 text-center hover:bg-green-200 min-w-[80px]">
                          {speed24H}/s
                        </Badge>
                      </div>
                    </>
                  );
                })()}
              </div>}
            />
          </div> : null
        }
      </CardContent>
    </Card>
  );
}
