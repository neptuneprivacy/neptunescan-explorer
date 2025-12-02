import PaginationContent from "@/components/pagination-content";
import { useAppDispatch } from "@/store/hooks";
import {
  useLoadingUtxo,
  useUtxoDatas,
  useUtxoPage,
  useUtxoTotalPage,
} from "@/store/utxo/hooks";
import { requestAllUtxos, setUtxoPage } from "@/store/utxo/utxo-slice";
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

export default function UtxoListTable() {
  const dispatch = useAppDispatch();
  const utxoPage = useUtxoPage();
  const totalPages = useUtxoTotalPage();
  useEffect(() => {
    dispatch(
      requestAllUtxos({
        page: utxoPage,
      })
    );
  }, [utxoPage]);
  const loading = useLoadingUtxo();
  const utxoDatas = useUtxoDatas();

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl font-bold">Utxos</CardTitle>
        <PaginationContent
          total={totalPages}
          currentPage={utxoPage}
          onchange={function (value: number): void {
            dispatch(setUtxoPage(value));
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
                  <TableHead>ID</TableHead>
                  <TableHead className="text-center">Digest</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {utxoDatas &&
                  utxoDatas.map((element) => (
                    <TableRow key={element.id}>
                      <TableCell>
                        <FormattedNumber value={element.id} />
                      </TableCell>
                      <TableCell className="text-center">
                        {element?.digest}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex flex-col gap-4 sm:hidden">
            {utxoDatas &&
              utxoDatas.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="p-4 border rounded-lg bg-card text-card-foreground shadow-sm"
                  >
                    <div className="flex flex-col gap-4 p-0">
                      <div className="flex flex-row gap-4 items-center">
                        <span className="w-20 font-medium">ID:</span>
                        <div className="w-full min-w-[140px]">
                          <span className="text-sm text-muted-foreground">
                            <FormattedNumber value={item.id} />
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-row gap-4 items-start break-all">
                        <span className="w-20 font-medium">Digest:</span>
                        <div className="w-full min-w-[140px] break-all">
                          <span className="text-sm text-muted-foreground">
                            {item.digest}
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
