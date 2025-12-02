import NavTextLink from "@/components/base/nav-text-link";
import { useBlockTxDatas, useLoadingBlockTxs } from "@/store/txs/hooks";
import { stringConvertToTimestamp } from "@/utils/data-format";
import { ellipsis } from "@/utils/ellipsis-format";
import { tokenFormat } from "@/utils/math-format";
import { timestampToDate } from "@/utils/tools";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { Badge } from "@/components/ui/badge";

const FormattedNumber = ({ value }: { value: number | string | undefined }) => {
  if (value === undefined || value === null) return null;
  return <>{Number(value).toLocaleString()}</>;
};

export default function BlockTransactionTable() {
  const loading = useLoadingBlockTxs();
  const txsDatas = useBlockTxDatas();

  if (!loading && !txsDatas) return null;

  return (
    <Card className="shadow-sm border-muted">
      <CardHeader className="bg-muted/30 py-4 border-b">
        <div className="flex flex-row justify-between items-center">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            Transactions
            {txsDatas && <Badge variant="secondary">{txsDatas.length}</Badge>}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0 relative min-h-[200px]">
        <LoadingOverlay visible={loading} />
        <div className="hidden sm:block">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/10">
                <TableHead className="pl-6">Block</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Fee</TableHead>
                <TableHead className="text-center">Inputs</TableHead>
                <TableHead className="text-center">Outputs</TableHead>
                <TableHead>Proof Type</TableHead>
                <TableHead className="pr-6 text-right">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {txsDatas &&
                txsDatas.map((element) => (
                  <TableRow key={element.id}>
                    <TableCell className="pl-6 font-medium">
                      {element.height ? element.height : "--"}
                    </TableCell>
                    <TableCell className="break-all max-w-[200px]">
                      <NavTextLink
                        href={`/tx?id=${element.id}`}
                        className="text-[rgb(59,64,167)] hover:underline"
                      >
                        {ellipsis(element?.id)}
                      </NavTextLink>
                    </TableCell>
                    <TableCell>
                      <FormattedNumber value={tokenFormat(element.fee)} />
                    </TableCell>
                    <TableCell className="text-center">
                      <FormattedNumber value={element?.num_inputs} />
                    </TableCell>
                    <TableCell className="text-center">
                      <FormattedNumber value={element?.num_outputs} />
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-normal">
                        {element?.proof_type}
                      </Badge>
                    </TableCell>
                    <TableCell className="pr-6 text-right text-muted-foreground">
                      {element?.time &&
                      element?.time === "0001-01-01T08:05:43+08:05"
                        ? "--"
                        : timestampToDate(
                            stringConvertToTimestamp(element?.time ?? ""),
                            "YYYY-MM-DD HH:mm:ss"
                          )}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex flex-col gap-4 sm:hidden p-4">
          {txsDatas &&
            txsDatas.map((item, index) => {
              return (
                <Card key={index} className="border shadow-sm">
                  <CardContent className="flex flex-col gap-3 p-4">
                    <div className="flex flex-row justify-between items-center">
                      <span className="text-sm font-medium text-muted-foreground">
                        Block
                      </span>
                      <span className="font-medium">{item.height ?? "--"}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium text-muted-foreground">
                        Transaction ID
                      </span>
                      <NavTextLink
                        href={`/tx?id=${item.id}`}
                        className="text-sm text-[rgb(59,64,167)] break-all"
                      >
                        {item?.id}
                      </NavTextLink>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">
                          Fee
                        </span>
                        <span>
                          <FormattedNumber value={tokenFormat(item.fee)} />
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">
                          Proof
                        </span>
                        <span>{item?.proof_type}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">
                          Inputs
                        </span>
                        <span>
                          <FormattedNumber value={item?.num_inputs} />
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">
                          Outputs
                        </span>
                        <span>
                          <FormattedNumber value={item?.num_outputs} />
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
        </div>
      </CardContent>
    </Card>
  );
}
