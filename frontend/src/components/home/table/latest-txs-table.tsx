import NavTextLink from "@/components/base/nav-text-link";
import { useLatestTxDatas } from "@/store/txs/hooks";
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
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const FormattedNumber = ({ value }: { value: number | string | undefined }) => {
  if (value === undefined || value === null) return null;
  return <>{Number(value).toLocaleString()}</>;
};

const formatTxId = (id: string | undefined) => {
  if (!id) return "--";
  if (id.length <= 16) return id;
  return `${id.slice(0, 8)}...${id.slice(-8)}`;
};

export default function LatestTxsTable() {
  const latestTxDatas = useLatestTxDatas();
  const router = useRouter();

  const rows =
    latestTxDatas &&
    latestTxDatas.map((element) => (
      <TableRow key={element.id}>
        <TableCell>
          {element.height ? (
            <NavTextLink href={`/block?h=${element.height}`}>
              <FormattedNumber value={element.height} />
            </NavTextLink>
          ) : (
            "--"
          )}
        </TableCell>
        <TableCell className="break-all">
          <NavTextLink href={`/tx?id=${element.id}`}>
            {formatTxId(element?.id)}
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
        <TableCell>{element?.proof_type}</TableCell>
        <TableCell>
          {element?.time && element?.time === "0001-01-01T08:05:43+08:05"
            ? "--"
            : timestampToDate(
                stringConvertToTimestamp(element?.time ?? ""),
                "YYYY-MM-DD HH:mm:ss"
              )}
        </TableCell>
      </TableRow>
    ));

  return (
    <div className="flex flex-col gap-4">
      <div className="hidden sm:block rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Block</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Fee</TableHead>
              <TableHead className="text-center">Inputs</TableHead>
              <TableHead className="text-center">Outputs</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>{rows}</TableBody>
        </Table>
      </div>
      <div className="flex flex-col gap-4 sm:hidden">
        {latestTxDatas &&
          latestTxDatas.map((item, index) => {
            return (
              <Card key={index} className="p-4">
                <CardContent className="flex flex-col gap-4 p-0">
                  <div className="flex flex-row gap-4 items-center">
                    <span className="w-[120px] font-medium">Block:</span>
                    <div className="w-full min-w-[120px]">
                      {item.height ? (
                        <NavTextLink href={`/block?h=${item.height}`}>
                          <FormattedNumber value={item.height} />
                        </NavTextLink>
                      ) : (
                        "--"
                      )}
                    </div>
                  </div>
                  <div className="flex flex-row gap-4 items-start break-all">
                    <span className="w-[120px] font-medium">ID:</span>
                    <div className="w-full min-w-[120px] break-all">
                      <NavTextLink href={`/tx?id=${item.id}`}>
                        <span className="text-sm text-muted-foreground">
                          {formatTxId(item?.id)}
                        </span>
                      </NavTextLink>
                    </div>
                  </div>
                  <div className="flex flex-row gap-4 items-center">
                    <span className="w-[120px] font-medium">Fee:</span>
                    <div className="w-full min-w-[120px]">
                      <FormattedNumber value={tokenFormat(item.fee)} />
                    </div>
                  </div>
                  <div className="flex flex-row gap-4 items-center">
                    <span className="w-[120px] font-medium">Inputs:</span>
                    <div className="w-full min-w-[120px]">
                      <FormattedNumber value={item?.num_inputs} />
                    </div>
                  </div>
                  <div className="flex flex-row gap-4 items-center">
                    <span className="w-[120px] font-medium">Outputs:</span>
                    <div className="w-full min-w-[120px]">
                      <FormattedNumber value={item?.num_outputs} />
                    </div>
                  </div>
                  <div className="flex flex-row gap-4 items-center">
                    <span className="w-[120px] font-medium">Proof Type:</span>
                    <div className="w-full min-w-[120px]">
                      {item?.proof_type}
                    </div>
                  </div>
                  <div className="flex flex-row gap-4 items-center">
                    <span className="w-[120px] font-medium">Time:</span>
                    <div className="w-full min-w-[120px]">
                      {item?.time && item?.time === "0001-01-01T08:05:43+08:05"
                        ? "--"
                        : timestampToDate(
                            stringConvertToTimestamp(item?.time ?? ""),
                            "YYYY-MM-DD HH:mm:ss"
                          )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
      </div>
    </div>
  );
}
