import { SearchPutDataResponse } from "@/utils/api/types";
import { Separator } from "@/components/ui/separator";
import { Box, ArrowRightLeft } from "lucide-react";
import styles from "./search.module.css";
import { useRouter } from "next/navigation";

const FormattedNumber = ({ value }: { value: number | string | undefined }) => {
  if (value === undefined || value === null) return null;
  return <>{Number(value).toLocaleString()}</>;
};

export default function CallbackOutputView({
  outputResponse,
}: {
  outputResponse: SearchPutDataResponse;
}) {
  const router = useRouter();
  return (
    <div className="flex flex-col gap-2">
      {outputResponse.height ? (
        <div className="hidden sm:block">
          <span className="text-[#718096]">Blocks</span>
          <div
            className={`flex flex-row justify-between items-center ${styles.block_result} cursor-pointer`}
            onClick={() => {
              router.push(`/block?h=${outputResponse.height}`);
            }}
          >
            <div className="flex flex-row items-center gap-2">
              <Box size={18} />
              <FormattedNumber value={outputResponse.height} />
            </div>
          </div>
        </div>
      ) : null}
      {outputResponse.height && outputResponse.txid ? (
        <Separator className="hidden sm:block" />
      ) : null}
      {outputResponse.txid ? (
        <div className="hidden sm:block">
          <span className="text-[#718096]">Transactions</span>
          <div
            className={`flex flex-row justify-between items-center ${styles.block_result} cursor-pointer`}
            onClick={() => {
              router.push(`/tx?id=${outputResponse.txid}`);
            }}
          >
            <div className="flex flex-row items-center gap-2">
              <ArrowRightLeft size={18} />
              <span className="text-sm text-[#8E8E93]">
                {outputResponse.txid}
              </span>
            </div>
          </div>
        </div>
      ) : null}

      {outputResponse.height ? (
        <div className="flex flex-col sm:hidden">
          <span className="text-[#718096]">Blocks</span>
          <div
            className={`flex flex-row justify-between items-center ${styles.block_result} cursor-pointer`}
            onClick={() => {
              router.push(`/block?h=${outputResponse.height}`);
            }}
          >
            <div className="flex flex-row items-center gap-2">
              <Box size={18} />
              <FormattedNumber value={outputResponse.height} />
            </div>
          </div>
        </div>
      ) : null}
      {outputResponse.height && outputResponse.txid ? (
        <Separator className="sm:hidden" />
      ) : null}
      {outputResponse.txid ? (
        <div
          className="flex flex-col gap-0.5 sm:hidden cursor-pointer"
          onClick={() => {
            router.push(`/tx?id=${outputResponse.txid}`);
          }}
        >
          <span className="text-[#718096]">Transactions</span>
          <div
            className={`flex flex-row justify-between items-center ${styles.block_result}`}
          >
            <div className="flex flex-row items-center gap-2">
              <ArrowRightLeft size={18} />
            </div>
          </div>
          <div className="break-all">
            <span className="text-sm text-[#8E8E93]">
              {outputResponse.txid}
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
