import NavTextLink from "@/components/base/nav-text-link";
import { useLoadingTxDetail, useTxDetail } from "@/store/txs/hooks";
import { stringConvertToTimestamp } from "@/utils/data-format";
import { numberConverTo, tokenFormat } from "@/utils/math-format";
import { timestampToDate } from "@/utils/tools";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { Badge } from "@/components/ui/badge";
import CopyButton from "@/components/ui/copy-button";
import { Separator } from "@/components/ui/separator";
import { ArrowRightLeft, Box, Clock } from "lucide-react";
import { TimeClock } from "@/components/TimeClock";

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

export default function TxDetailInfoTable() {
  const loading = useLoadingTxDetail();
  const txDetail = useTxDetail();
  const router = useRouter();

  return (
    <Card className="shadow-sm border-muted">
      <CardHeader className="bg-muted/30 pb-4">
        <div className="flex flex-row items-center gap-2">
          <ArrowRightLeft className="h-5 w-5 text-muted-foreground" />
          <CardTitle className="text-xl font-bold">
            Transaction Details
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6 relative">
        <LoadingOverlay visible={loading} />
        {txDetail && (
          <div className="flex flex-col">
            <InfoRow
              label="Transaction ID"
              value={
                <div className="flex items-center gap-2">
                  <span className="font-mono font-medium">{txDetail.id}</span>
                  <CopyButton value={txDetail.id} />
                </div>
              }
            />
            <InfoRow
              label="Block Height"
              value={
                txDetail.height ? (
                  <div className="flex items-center gap-2">
                    <Box className="h-4 w-4 text-muted-foreground" />
                    <NavTextLink
                      href={`/block?h=${txDetail.height}`}
                      className="text-[rgb(59,64,167)] font-medium hover:underline"
                    >
                      <FormattedNumber value={txDetail.height} />
                    </NavTextLink>
                  </div>
                ) : (
                  <Badge variant="outline">Pending</Badge>
                )
              }
            />
            <InfoRow
              label="Timestamp"
              value={
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span>
                    {timestampToDate(
                      stringConvertToTimestamp(txDetail?.time ?? ""),
                      "YYYY-MM-DD HH:mm:ss"
                    )}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full border">
                    <Clock className="h-3 w-3" />
                    <TimeClock
                      timeStamp={stringConvertToTimestamp(txDetail?.time ?? "")}
                    />
                  </div>
                </div>
              }
            />
            <InfoRow
              label="Transaction Fee"
              value={
                <span className="font-medium">
                  <FormattedNumber value={tokenFormat(txDetail?.fee)} /> XNT
                </span>
              }
            />
            <InfoRow
              label="Proof Type"
              value={<Badge variant="secondary">{txDetail?.proof_type}</Badge>}
            />

            <Separator className="my-4" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-2">
              <div className="space-y-3">
                <h3 className="font-semibold text-muted-foreground flex items-center gap-2">
                  Inputs{" "}
                  <Badge variant="outline">
                    {txDetail?.inputs?.length || 0}
                  </Badge>
                </h3>
                <div className="bg-muted/20 rounded-lg p-4 space-y-2 max-h-[300px] overflow-y-auto border">
                  {txDetail?.inputs?.map((input, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between text-sm p-2 bg-background rounded border shadow-sm"
                    >
                      <span
                        className="font-mono truncate max-w-[200px] sm:max-w-full"
                        title={input}
                      >
                        {input}
                      </span>
                      <CopyButton value={input} className="h-6 w-6" />
                    </div>
                  ))}
                  {(!txDetail?.inputs || txDetail.inputs.length === 0) && (
                    <span className="text-muted-foreground text-sm italic">
                      No inputs
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-muted-foreground flex items-center gap-2">
                  Outputs{" "}
                  <Badge variant="outline">
                    {txDetail?.outputs?.length || 0}
                  </Badge>
                </h3>
                <div className="bg-muted/20 rounded-lg p-4 space-y-2 max-h-[300px] overflow-y-auto border">
                  {txDetail?.outputs?.map((output, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between text-sm p-2 bg-background rounded border shadow-sm"
                    >
                      <span
                        className="font-mono truncate max-w-[200px] sm:max-w-full"
                        title={output}
                      >
                        {output}
                      </span>
                      <CopyButton value={output} className="h-6 w-6" />
                    </div>
                  ))}
                  {(!txDetail?.outputs || txDetail.outputs.length === 0) && (
                    <span className="text-muted-foreground text-sm italic">
                      No outputs
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
