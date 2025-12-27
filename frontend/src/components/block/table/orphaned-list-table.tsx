import NavTextLink from "@/components/base/nav-text-link";
import TitleText from "@/components/base/title-text";
import PaginationContent from "@/components/pagination-content";
import { requestOrphanedListData, setOrphanedPage } from "@/store/block/block-slice";
import {
  useOrphaned,
  useOrphanedPage,
  useOrphanedTotalPage,
  useLoadingOrphaned,
} from "@/store/block/hooks";
import { useAppDispatch } from "@/store/hooks";
import { stringConvertToTimestamp } from "@/utils/data-format";
import { tokenFormat } from "@/utils/math-format";
import { timestampToDate } from "@/utils/tools";
import { useRouter } from "next/navigation";
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

export default function OrphanedListTable() {
  const dispatch = useAppDispatch();
  const orphanedPage = useOrphanedPage();
  const totalPages = useOrphanedTotalPage();
  const router = useRouter();
  useEffect(() => {
    dispatch(requestOrphanedListData({ page: orphanedPage }));
  }, [orphanedPage]);
  const loading = useLoadingOrphaned();
  const orphaned = useOrphaned();

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl font-bold">Orphaned</CardTitle>
        <PaginationContent
          total={totalPages}
          currentPage={orphanedPage}
          onchange={function (value: number): void {
            dispatch(setOrphanedPage(value));
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
                  <TableHead>Hash</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead>Reward</TableHead>
                  <TableHead>Outputs</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orphaned &&
                  orphaned.map((element) => (
                    <TableRow key={element.block}>
                      <TableCell>
                        <FormattedNumber value={element.block} />
                      </TableCell>
                      <TableCell className="break-all max-w-[400px]">
                        <NavTextLink href={`/block/${element.block_hash}`}>
                          {element?.block_hash}
                        </NavTextLink>
                      </TableCell>
                      <TableCell>
                        <FormattedNumber value={element.proof_target} />
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-row items-center">
                          <FormattedNumber
                            value={tokenFormat(element.coinbase_reward)}
                          />
                          <span> / </span>
                          <FormattedNumber value={tokenFormat(element.fee)} />
                        </div>
                      </TableCell>
                      <TableCell>
                        <FormattedNumber value={element.outputs} />
                      </TableCell>
                      <TableCell>
                        {timestampToDate(
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
            {orphaned &&
              orphaned.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="p-4 border rounded-lg bg-card text-card-foreground shadow-sm"
                  >
                    <div className="flex flex-col gap-4 p-0">
                      <div className="flex flex-row gap-4 items-center">
                        <span className="w-[120px] font-medium">Block:</span>
                        <div className="w-full min-w-[120px]">
                          <FormattedNumber value={item.block} />
                        </div>
                      </div>
                      <div className="flex flex-row gap-4 items-start break-all">
                        <span className="w-[120px] font-medium">Hash:</span>
                        <div className="w-full min-w-[120px] break-all">
                          <span
                            className="text-sm text-muted-foreground cursor-pointer hover:underline"
                            onClick={() => {
                              router.push(`/block/${item.block_hash}`);
                            }}
                          >
                            {item?.block_hash}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-row gap-4 items-center">
                        <span className="w-[120px] font-medium">
                          Difficulty:
                        </span>
                        <div className="w-full min-w-[120px]">
                          <span className="text-sm text-muted-foreground">
                            {item?.proof_target}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-row gap-4 items-center">
                        <span className="w-[120px] font-medium">Reward:</span>
                        <div className="w-full min-w-[120px]">
                          <div className="flex flex-row items-center text-sm text-muted-foreground">
                            <FormattedNumber
                              value={tokenFormat(item?.coinbase_reward)}
                            />
                            <span> / </span>
                            <FormattedNumber value={tokenFormat(item?.fee)} />
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-row gap-4 items-center">
                        <span className="w-[120px] font-medium">Outputs:</span>
                        <div className="w-full min-w-[120px] break-all">
                          <span className="text-sm text-muted-foreground">
                            {item.outputs}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-row gap-4 items-center">
                        <span className="w-[120px] font-medium">Time:</span>
                        <div className="w-full min-w-[120px] break-all">
                          <span className="text-sm text-muted-foreground">
                            {timestampToDate(
                              stringConvertToTimestamp(item?.time ?? ""),
                              "YYYY-MM-DD HH:mm:ss"
                            )}
                          </span>
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
