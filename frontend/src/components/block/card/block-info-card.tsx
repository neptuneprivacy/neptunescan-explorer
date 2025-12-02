import { TimeClock } from "@/components/TimeClock";
import {
  useBlockInfo,
  useLoadingBlockInfo,
  useRpcBlockData,
} from "@/store/block/hooks";
import { stringConvertToTimestamp } from "@/utils/data-format";
import { ellipsis } from "@/utils/ellipsis-format";
import { numberConverTo, tokenFormat } from "@/utils/math-format";
import { timestampToDate } from "@/utils/tools";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingOverlay } from "@/components/ui/loading-overlay";

const FormattedNumber = ({ value }: { value: number | string | undefined }) => {
  if (value === undefined || value === null) return null;
  return <>{Number(value).toLocaleString()}</>;
};

export default function BlockInfoCard() {
  const loading = useLoadingBlockInfo();
  const blockInfo = useBlockInfo();
  const rpcBlock = useRpcBlockData();

  return (
    <div className="relative">
      <LoadingOverlay visible={loading} />
      <Card className="shadow-sm">
        <CardHeader className="py-3 border-b">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base font-medium">{`Block #${numberConverTo(
              blockInfo?.block
            )}`}</CardTitle>
            <TimeClock
              style={{ fontSize: "12px", color: "#1D8282" }}
              timeStamp={stringConvertToTimestamp(blockInfo?.time ?? "")}
            ></TimeClock>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 mt-4">
          <div className="flex flex-row gap-4 items-center">
            <span className="text-sm font-medium min-w-[120px]">
              Block Hash:
            </span>
            <span className="text-sm text-muted-foreground hidden sm:block">
              {blockInfo?.block_hash}
            </span>
            <span className="text-sm text-muted-foreground sm:hidden">
              {ellipsis(blockInfo?.block_hash)}
            </span>
          </div>
          <div className="flex flex-row gap-4 items-center">
            <span className="text-sm font-medium min-w-[120px]">
              Create Time:
            </span>
            <span className="text-sm text-muted-foreground hidden sm:block">
              {timestampToDate(
                stringConvertToTimestamp(blockInfo?.time ?? ""),
                "YYYY-MM-DD HH:mm:ss"
              )}
            </span>
            <span className="text-sm text-muted-foreground sm:hidden">
              {ellipsis(blockInfo?.block_hash)}
            </span>
          </div>
          <div className="flex flex-row gap-4 items-center">
            <span className="text-sm font-medium min-w-[120px]">
              Difficulty:
            </span>
            <span className="text-sm text-muted-foreground">
              <FormattedNumber value={blockInfo?.target} />
            </span>
          </div>
          <div className="flex flex-row gap-4 items-center">
            <span className="text-sm font-medium min-w-[120px]">Inputs:</span>
            <span className="text-sm text-muted-foreground">
              <FormattedNumber value={rpcBlock?.num_inputs} />
            </span>
          </div>
          <div className="flex flex-row gap-4 items-center">
            <span className="text-sm font-medium min-w-[120px]">Outputs:</span>
            <span className="text-sm text-muted-foreground">
              <FormattedNumber value={rpcBlock?.num_outputs} />
            </span>
          </div>
          <div className="flex flex-row gap-4 items-center">
            <span className="text-sm font-medium min-w-[120px]">
              Coinbase Reward:
            </span>
            <span className="text-sm text-muted-foreground">
              {numberConverTo(tokenFormat(blockInfo?.block_coinbase_reward))}
            </span>
          </div>

          <div className="flex flex-row gap-4 items-center">
            <span className="text-sm font-medium min-w-[120px]">
              Miner Reward:
            </span>
            <span className="text-sm text-muted-foreground">
              <FormattedNumber value={tokenFormat(blockInfo?.block_gas)} />
            </span>
          </div>
          <div className="flex flex-row gap-4 items-center">
            <span className="text-sm font-medium min-w-[120px]">Nonce:</span>
            <span className="text-sm text-muted-foreground">
              {rpcBlock?.nonce}
            </span>
          </div>
          <div className="flex flex-row gap-4 items-center">
            <span className="text-sm font-medium min-w-[120px]">
              Canonical:
            </span>
            <span className="text-sm text-muted-foreground">
              {blockInfo?.is_canonical
                ? "Yes. This block is in the canonical blockchain."
                : ""}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
