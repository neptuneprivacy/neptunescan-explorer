import NavTextLink from "@/components/base/nav-text-link";
import TitleText from "@/components/base/title-text";
import PaginationContent from "@/components/pagination-content";
import { requestBlockListData, setBlocksPage } from "@/store/block/block-slice";
import {
  useBlocks,
  useBlocksPage,
  useBlocksTotalPage,
  useLoadingBlocks,
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

export default function BlockListTable() {
  const dispatch = useAppDispatch();
  const blockPage = useBlocksPage();
  const totalPages = useBlocksTotalPage();
  const router = useRouter();
  useEffect(() => {
    dispatch(requestBlockListData({ page: blockPage }));
  }, [blockPage]);
  const loading = useLoadingBlocks();
  const blocks = useBlocks();

  const rows =
    blocks &&
    blocks.map((element) => (
      <TableRow key={element.block} className="align-top">
        <TableCell>
          <FormattedNumber value={element.block} />
        </TableCell>
        <TableCell className="break-all">
          <NavTextLink href={`/block?h=${element.block_hash}`}>
            {element?.block_hash}
          </NavTextLink>
        </TableCell>
        <TableCell>
          <FormattedNumber value={element.proof_target} />
        </TableCell>
        <TableCell>
          <div className="flex flex-row items-center">
            <FormattedNumber value={tokenFormat(element.coinbase_reward)} />
            <span className="mx-1"> / </span>
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
    ));

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl font-bold">Blocks</CardTitle>
        <PaginationContent
          total={totalPages}
          currentPage={blockPage}
          onchange={function (value: number): void {
            dispatch(setBlocksPage(value));
          }}
        />
      </CardHeader>
      <CardContent>
        <div className="relative">
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
              <TableBody>{rows}</TableBody>
            </Table>
          </div>
          <div className="flex flex-col gap-4 sm:hidden">
            {blocks &&
              blocks.map((item, index) => {
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
                        <span className="w-[120px] font-medium">
                          Block Hash:
                        </span>
                        <div className="w-full min-w-[120px] break-all">
                          <span
                            className="text-sm text-muted-foreground cursor-pointer hover:underline"
                            onClick={() => {
                              router.push(`/block?h=${item.block_hash}`);
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
                        <div className="w-full min-w-[120px] break-all">
                          <span className="text-sm text-muted-foreground">
                            {item?.proof_target}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-row gap-4 items-center">
                        <span className="w-[120px] font-medium">Reward:</span>
                        <div className="w-full min-w-[120px] break-all">
                          <div className="flex flex-row items-center text-sm text-muted-foreground">
                            <FormattedNumber
                              value={tokenFormat(item?.coinbase_reward)}
                            />
                            <span className="mx-1"> / </span>
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
