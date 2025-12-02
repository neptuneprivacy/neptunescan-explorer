import NavTextLink from "@/components/base/nav-text-link";
import TitleText from "@/components/base/title-text";
import PaginationContent from "@/components/pagination-content";
import { useAppDispatch } from "@/store/hooks";
import {
  useLoadingAllTxs,
  useTransactionDatas,
  useTransactionPage,
  useTransactionTotal,
} from "@/store/txs/hooks";
import { requestAllTxs, setTxPage } from "@/store/txs/txs-slice";
import { stringConvertToTimestamp } from "@/utils/data-format";
import { tokenFormat } from "@/utils/math-format";
import { timestampToDate } from "@/utils/tools";
import { useEffect } from "react";
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

const FormattedNumber = ({ value }: { value: number | string | undefined }) => {
  if (value === undefined || value === null) return null;
  return <>{Number(value).toLocaleString()}</>;
};

export default function TransactionListTable() {
  const dispatch = useAppDispatch();
  const txsPage = useTransactionPage();
  const total = useTransactionTotal();
  useEffect(() => {
    dispatch(
      requestAllTxs({
        page: txsPage,
      })
    );
  }, [txsPage]);
  const loading = useLoadingAllTxs();
  const txsDatas = useTransactionDatas();

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl font-bold">Transactions</CardTitle>
        <PaginationContent
          total={total}
          currentPage={txsPage}
          onchange={function (value: number): void {
            dispatch(setTxPage(value));
          }}
        />
      </CardHeader>
      <CardContent>
        <div className="relative min-h-[200px]">
          <LoadingOverlay visible={loading} />
          <div className="hidden sm:block rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Block</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Fee</TableHead>
                  <TableHead className="text-center">Inputs</TableHead>
                  <TableHead className="text-center">Outputs</TableHead>
                  <TableHead>Proof Type</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {txsDatas &&
                  txsDatas.map((element) => (
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
                      <TableCell className="break-all max-w-[200px]">
                        <NavTextLink href={`/tx?id=${element.id}`}>
                          {element?.id}
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
          <div className="flex flex-col gap-2 sm:hidden">
            {txsDatas &&
              txsDatas.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="p-4 border rounded-lg bg-card text-card-foreground shadow-sm"
                  >
                    <div className="flex flex-col gap-4 p-0">
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
                            <span className="text-sm text-muted-foreground hover:underline">
                              {item?.id}
                            </span>
                          </NavTextLink>
                        </div>
                      </div>
                      <div className="flex flex-row gap-4 items-start">
                        <span className="w-[120px] font-medium">Fee:</span>
                        <div className="w-full min-w-[120px]">
                          <FormattedNumber value={tokenFormat(item.fee)} />
                        </div>
                      </div>
                      <div className="flex flex-row gap-4 items-start">
                        <span className="w-[120px] font-medium">Inputs:</span>
                        <div className="w-full min-w-[120px]">
                          <FormattedNumber value={item?.num_inputs} />
                        </div>
                      </div>
                      <div className="flex flex-row gap-4 items-start">
                        <span className="w-[120px] font-medium">Outputs:</span>
                        <div className="w-full min-w-[120px]">
                          <FormattedNumber value={item?.num_outputs} />
                        </div>
                      </div>
                      <div className="flex flex-row gap-4 items-start">
                        <span className="w-[120px] font-medium">
                          Proof Type:
                        </span>
                        <div className="w-full min-w-[120px]">
                          {item?.proof_type}
                        </div>
                      </div>
                      <div className="flex flex-row gap-4 items-start">
                        <span className="w-[120px] font-medium">Time:</span>
                        <div className="w-full min-w-[120px]">
                          {item?.time &&
                          item?.time === "0001-01-01T08:05:43+08:05"
                            ? "--"
                            : timestampToDate(
                                stringConvertToTimestamp(item?.time ?? ""),
                                "YYYY-MM-DD HH:mm:ss"
                              )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
