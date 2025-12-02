import { SearchTransactionResponse } from "@/utils/api/types";
import { stringConvertToTimestamp } from "@/utils/data-format";
import { timestampToDate } from "@/utils/tools";
import { ArrowRightLeft } from "lucide-react";
import styles from "./search.module.css";
import { ellipsis30 } from "@/utils/ellipsis-format";
import { useRouter } from "next/navigation";

const FormattedNumber = ({ value }: { value: number | string | undefined }) => {
  if (value === undefined || value === null) return null;
  return <>{Number(value).toLocaleString()}</>;
};

export default function CallbackTransactionView({
  transactionResponse,
}: {
  transactionResponse: SearchTransactionResponse;
}) {
  const router = useRouter();
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[#718096]">Transactions</span>
      <div
        className={`hidden sm:flex flex-row justify-between items-center ${styles.block_result} cursor-pointer`}
        onClick={() => {
          router.push(`/tx?id=${transactionResponse.id}`);
        }}
      >
        <div className="flex flex-row items-center gap-2">
          <ArrowRightLeft size={18} />
          {transactionResponse.height ? (
            <FormattedNumber value={transactionResponse.height ?? "--"} />
          ) : (
            "--"
          )}
        </div>
        <span className="text-sm text-[#8E8E93]">
          {ellipsis30(transactionResponse.id)}
        </span>

        <span className="text-sm text-[#8E8E93]">
          {timestampToDate(
            stringConvertToTimestamp(transactionResponse.time ?? ""),
            "YYYY-MM-DD HH:mm:ss"
          )}
        </span>
      </div>
      <div
        className="flex sm:hidden flex-col gap-2 cursor-pointer"
        onClick={() => {
          router.push(`/tx?id=${transactionResponse.id}`);
        }}
      >
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row items-center gap-2">
            <ArrowRightLeft size={18} />
            <span className="text-sm text-[#8E8E93]">
              {transactionResponse.height ? (
                <FormattedNumber value={transactionResponse.height ?? "--"} />
              ) : (
                "--"
              )}
            </span>
          </div>
        </div>
        <div className="break-all">
          <span className="text-sm text-[#8E8E93]">
            {ellipsis30(transactionResponse.id)}
          </span>
        </div>
        <span className="text-sm text-[#8E8E93]">
          {timestampToDate(
            stringConvertToTimestamp(transactionResponse.time ?? ""),
            "YYYY-MM-DD HH:mm:ss"
          )}
        </span>
      </div>
    </div>
  );
}
