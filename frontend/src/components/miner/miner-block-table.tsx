import { useAppDispatch } from "@/store/hooks";
import { useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { useLoadingMinerBlocks, useMinerBlocks, useMinerBlocksPage, useMinerBlocksTotalPage } from "@/store/miner/hooks";
import { stringConvertToTimestamp } from "@/utils/data-format";
import { tokenFormat } from "@/utils/math-format";
import { timestampToDate } from "@/utils/tools";
import { useRouter } from "next/navigation";
import NavTextLink from "../base/nav-text-link";
import PaginationContent from "../pagination-content";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { LoadingOverlay } from "../ui/loading-overlay";
import { requestMinerBlocks, setMinerBlocksPage } from "@/store/miner/miner-slice";

const FormattedNumber = ({ value }: { value: number | string | undefined }) => {
    if (value === undefined || value === null) return null;
    return <>{Number(value).toLocaleString()}</>;
};

export default function MinerBlockTable({ minerID }: { minerID: string }) {
    const dispatch = useAppDispatch();
    const minerBlockPage = useMinerBlocksPage();
    const totalPages = useMinerBlocksTotalPage();
    const router = useRouter();
    useEffect(() => {
        if (minerID) {
            dispatch(requestMinerBlocks({ digest: minerID, page: minerBlockPage }));
        }
    }, [dispatch, minerID, minerBlockPage]);
    const loading = useLoadingMinerBlocks();
    const blocks = useMinerBlocks();

    const rows =
        blocks && blocks.length > 0 &&
        blocks.map((element) => (
            <TableRow key={element.block} className="align-top">
                <TableCell>
                    <FormattedNumber value={element.block} />
                </TableCell>
                <TableCell className="break-all">
                    <NavTextLink href={`/block/${element.block}`}>
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
                <CardTitle className="text-xl font-bold">Miner Blocks</CardTitle>
                {
                    totalPages > 1 && (
                        <PaginationContent
                            total={totalPages}
                            currentPage={minerBlockPage}
                            onchange={function (value: number): void {
                                dispatch(setMinerBlocksPage(value));
                            }}
                        />
                    )
                }
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
                        {blocks && blocks.length > 0 &&
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
                                                            router.push(`/block/${item.block}`);
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