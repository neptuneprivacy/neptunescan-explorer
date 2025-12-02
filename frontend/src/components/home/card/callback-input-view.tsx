import { SearchPutDataResponse } from "@/utils/api/types";
import { Separator } from "@/components/ui/separator";
import { Box, ArrowRightLeft } from "lucide-react";
import styles from "./search.module.css";
import { useRouter } from "next/navigation";

const FormattedNumber = ({ value }: { value: number | string | undefined }) => {
  if (value === undefined || value === null) return null;
  return <>{Number(value).toLocaleString()}</>;
};

export default function CallbackInoputView({
  inputResponse,
}: {
  inputResponse: SearchPutDataResponse;
}) {
  const router = useRouter();
  return (
    <div className="flex flex-col gap-2">
      {inputResponse.height ? (
        <div className="hidden sm:block">
          <span className="text-[#718096]">Blocks</span>
          <div
            className={`flex flex-row justify-between items-center ${styles.block_result} cursor-pointer`}
            onClick={() => {
              router.push(`/block?h=${inputResponse.height}`);
            }}
          >
            <div className="flex flex-row items-center gap-2">
              <Box size={18} />
              <FormattedNumber value={inputResponse.height} />
            </div>
          </div>
        </div>
      ) : null}
      {inputResponse.height && inputResponse.txid ? (
        <Separator className="hidden sm:block" />
      ) : null}
      {inputResponse.txid ? (
        <div className="hidden sm:block">
          <span className="text-[#718096]">Transactions</span>
          <div
            className={`flex flex-row justify-between items-center ${styles.block_result} cursor-pointer`}
            onClick={() => {
              router.push(`/tx?id=${inputResponse.txid}`);
            }}
          >
            <div className="flex flex-row items-center gap-2">
              <ArrowRightLeft size={18} />
              <span className="text-sm text-[#8E8E93]">
                {inputResponse.txid}
              </span>
            </div>
          </div>
        </div>
      ) : null}

      {inputResponse.height ? (
        <div className="flex flex-col sm:hidden">
          <span className="text-[#718096]">Blocks</span>
          <div
            className={`flex flex-row justify-between items-center ${styles.block_result} cursor-pointer`}
            onClick={() => {
              router.push(`/block?h=${inputResponse.height}`);
            }}
          >
            <div className="flex flex-row items-center gap-2">
              <Box size={18} />
              <FormattedNumber value={inputResponse.height} />
            </div>
          </div>
        </div>
      ) : null}
      {inputResponse.height && inputResponse.txid ? (
        <Separator className="sm:hidden" />
      ) : null}
      {inputResponse.txid ? (
        <div
          className="flex flex-col gap-0.5 sm:hidden cursor-pointer"
          onClick={() => {
            router.push(`/tx?id=${inputResponse.txid}`);
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
            <span className="text-sm text-[#8E8E93]">{inputResponse.txid}</span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
