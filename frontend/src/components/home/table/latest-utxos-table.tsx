import NavTextLink from "@/components/base/nav-text-link";
import { useLatestUtxoDatas } from "@/store/utxo/hooks";
import { numberConverTo } from "@/utils/math-format";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FileText } from "lucide-react";
import { useRouter } from "next/navigation";

const FormattedNumber = ({
  value,
  style,
}: {
  value: number | string | undefined;
  style?: React.CSSProperties;
}) => {
  if (value === undefined || value === null) return null;
  return <span style={style}>{Number(value).toLocaleString()}</span>;
};

export default function LatestUtxosTable() {
  const latestUtxos = useLatestUtxoDatas();
  const router = useRouter();
  return (
    <div className="flex flex-col gap-2">
      <div className="hidden sm:block">
        <Card className="p-1.5">
          <CardContent className="flex flex-col justify-center p-0">
            {latestUtxos &&
              latestUtxos.map((item, index) => {
                return (
                  <div key={index} className="flex flex-col">
                    <div className="flex flex-row items-center h-[82px] gap-6 px-6">
                      <FileText size={18} />
                      <FormattedNumber
                        style={{ fontSize: "14px" }}
                        value={item.id}
                      />
                      <span className="text-sm">{item.digest}</span>
                    </div>
                    {index != latestUtxos.length - 1 && <Separator />}
                  </div>
                );
              })}
          </CardContent>
        </Card>
      </div>
      <div className="flex flex-col gap-2 sm:hidden">
        {latestUtxos &&
          latestUtxos.map((item, index) => {
            return (
              <Card key={index}>
                <CardContent className="flex flex-col gap-2 p-4">
                  <div className="flex flex-row justify-between items-center">
                    <div className="flex flex-row items-center gap-2">
                      <FileText size={24} />
                      <span className="text-lg text-[#332526]">
                        <FormattedNumber value={item.id} />
                      </span>
                    </div>
                  </div>
                  <div className="break-all">
                    <span className="text-base text-[#332526]">
                      {item.digest}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
      </div>
      {latestUtxos && latestUtxos.length === 5 && (
        <div className="flex justify-center">
          <Button
            variant="link"
            onClick={() => {
              router.push("/utxos");
            }}
          >
            View all UTXOs
          </Button>
        </div>
      )}
    </div>
  );
}
