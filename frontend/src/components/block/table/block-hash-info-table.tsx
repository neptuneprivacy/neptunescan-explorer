import { TimeClock } from "@/components/TimeClock";
import { useLoadingBlockInfo, useRpcBlockData } from "@/store/block/hooks";
import { useAppDispatch } from "@/store/hooks";
import { requestTransactionByHeight } from "@/store/txs/txs-slice";
import { stringConvertToTimestamp } from "@/utils/data-format";
import { numberConverTo, tokenFormat } from "@/utils/math-format";
import { timestampToDate } from "@/utils/tools";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import CopyButton from "@/components/ui/copy-button";
import { getMinerConfigByID } from "@/config/miner-config";

const FormattedNumber = ({ value }: { value: number | string | undefined }) => {
  if (value === undefined || value === null) return null;
  return <>{Number(value).toLocaleString()}</>;
};

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

export default function BlockHashInfoTable({ hash }: { hash: string }) {
  const loading = useLoadingBlockInfo();
  const disapth = useAppDispatch();
  const rpcBlock = useRpcBlockData();
  const router = useRouter();
  const [blocks, setBlocks] = useState({
    nextBlock: 0,
    previousBlock: 0,
  });
  useEffect(() => {
    if (rpcBlock) {
      if (rpcBlock.height >= 0) {
        setBlocks({
          nextBlock: rpcBlock.height + 1,
          previousBlock: rpcBlock.height - 1,
        });
      }
      disapth(
        requestTransactionByHeight({
          height: rpcBlock?.height,
        })
      );
    }
  }, [rpcBlock]);

  return (
    <Card className="shadow-sm border-muted">
      <CardHeader className="bg-muted/30 pb-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-row gap-4 items-center">
            <CardTitle className="text-2xl font-bold">
              Block{" "}
              <span className="text-muted-foreground">
                #{numberConverTo(rpcBlock?.height)}
              </span>
            </CardTitle>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={rpcBlock?.height == 0}
                onClick={() => router.push(`/block/${blocks.previousBlock}`)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => router.push(`/block/${blocks.nextBlock}`)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <LoadingOverlay visible={loading} />
        <div className="flex flex-col">
          <InfoRow
            label="Block Hash"
            value={
              <div className="flex items-center gap-2">
                <span className="font-mono">{rpcBlock?.digest}</span>
                <CopyButton value={rpcBlock?.digest ?? ""} />
              </div>
            }
          />
          <InfoRow
            label="Status"
            value={
              rpcBlock?.is_canonical ? (
                <Badge
                  variant="default"
                  className="bg-green-600 hover:bg-green-700"
                >
                  Canonical
                </Badge>
              ) : (
                <Badge variant="destructive">Non-Canonical</Badge>
              )
            }
          />
          <InfoRow
            label="Timestamp"
            value={
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <span>
                  {timestampToDate(
                    stringConvertToTimestamp(rpcBlock?.time ?? ""),
                    "YYYY-MM-DD HH:mm:ss"
                  )}
                </span>
                <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full border">
                  <Clock className="h-3 w-3" />
                  <TimeClock
                    timeStamp={stringConvertToTimestamp(rpcBlock?.time ?? "")}
                  />
                </div>
              </div>
            }
          />
          <InfoRow
            label="Transactions"
            value={
              <div className="flex gap-2">
                <Badge variant="secondary">
                  {rpcBlock?.num_inputs ?? 0} Inputs
                </Badge>
                <Badge variant="secondary">
                  {rpcBlock?.num_outputs ?? 0} Outputs
                </Badge>
              </div>
            }
          />
          <InfoRow
            label="Previous Hash"
            value={
              <div className="flex items-center gap-2">
                <span
                  className="text-[rgb(59,64,167)] cursor-pointer hover:underline font-mono"
                  onClick={() => {
                    if (rpcBlock?.height && rpcBlock.height > 0) {
                      router.push(`/block/${rpcBlock.height - 1}`);
                    }
                  }}
                >
                  {rpcBlock?.prev_block_digest}
                </span>
                <CopyButton value={rpcBlock?.prev_block_digest ?? ""} />
              </div>
            }
          />
          <InfoRow
            label="Miner ID"
            value={
              <div className="flex items-center gap-2">
                <span
                  className="text-[rgb(59,64,167)] cursor-pointer hover:underline font-mono"
                  onClick={() => {
                    if (rpcBlock?.guesser_digest) {
                      router.push(`/miner/${rpcBlock.guesser_digest}`);
                    }
                  }}
                >
                  {(() => {
                    let minerConfig = getMinerConfigByID(rpcBlock?.guesser_digest ?? "");
                    let name = minerConfig ? minerConfig.name : rpcBlock?.guesser_digest;
                    return (
                      <span className="inline-flex items-center gap-2">
                        {minerConfig ? (
                          <img
                            src={minerConfig.iconURL}
                            alt={minerConfig.name}
                            className="h-5 w-5 rounded-full object-cover"
                            loading="lazy"
                          />
                        ) : null}
                        <span className="font-mono">{name}</span>
                      </span>
                    );
                  })()}
                </span>
              </div>
            }
          />
          <InfoRow
            label="Nonce"
            value={<span className="font-mono">{rpcBlock?.nonce}</span>}
          />
          <InfoRow
            label="Difficulty"
            value={<FormattedNumber value={rpcBlock?.difficulty} />}
          />
          <InfoRow
            label="Rewards"
            value={
              <div className="flex flex-col gap-1">
                {(() => {
                  // hacky, :(
                  const coinbaseBI = BigInt(rpcBlock?.coinbase_amount ?? 0);
                  const feeBI = BigInt(rpcBlock?.fee ?? 0);
                  const feesBI = feeBI > coinbaseBI ? feeBI - coinbaseBI : BigInt(0);
                  return (
                    <>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground w-24">
                          Coinbase
                        </span>
                        <span className="font-medium">
                          {numberConverTo(tokenFormat(Number(coinbaseBI)))} XNT
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground w-24">Fees</span>
                        <span className="font-medium">
                          {numberConverTo(tokenFormat(Number(feesBI)))} XNT
                        </span>
                      </div>
                    </>
                  );
                })()}
              </div>
            }
          />

          {rpcBlock?.sibling_blocks && rpcBlock?.sibling_blocks.length > 0 && (
            <InfoRow
              label="Sibling Blocks"
              value={
                <div className="flex flex-col gap-1">
                  {rpcBlock?.sibling_blocks.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span
                        className="text-[rgb(59,64,167)] cursor-pointer hover:underline font-mono"
                        onClick={() => {
                          router.push(`/block/${item}`);
                        }}
                      >
                        {item}
                      </span>
                      <CopyButton value={item} />
                    </div>
                  ))}
                </div>
              }
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
