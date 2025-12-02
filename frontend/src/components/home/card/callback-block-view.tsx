import NavTextLink from "@/components/base/nav-text-link";
import { SearchBlockResponse } from "@/utils/api/types";
import { stringConvertToTimestamp } from "@/utils/data-format";
import { timestampToDate } from "@/utils/tools";
import { Box } from "lucide-react";
import styles from "./search.module.css";
import { useRouter } from "next/navigation";

const FormattedNumber = ({ value }: { value: number | string | undefined }) => {
  if (value === undefined || value === null) return null;
  return <>{Number(value).toLocaleString()}</>;
};

export default function CallbackBlockView({
  blockResponse,
}: {
  blockResponse: SearchBlockResponse;
}) {
  const router = useRouter();
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[#718096]">Blocks</span>
      {blockResponse && blockResponse.block_hash ? (
        <div
          className={`hidden sm:flex flex-row justify-between items-center ${styles.block_result} cursor-pointer`}
          onClick={() => {
            router.push(`/block?h=${blockResponse.block_hash}`);
          }}
        >
          <div className="flex flex-row items-center gap-2">
            <Box size={18} />
            <FormattedNumber value={blockResponse.block} />
          </div>
          <span className="text-sm text-[#8E8E93]">
            {blockResponse.block_hash}
          </span>

          <span className="text-sm text-[#8E8E93]">
            {timestampToDate(
              stringConvertToTimestamp(blockResponse.time ?? ""),
              "YYYY-MM-DD HH:mm:ss"
            )}
          </span>
        </div>
      ) : null}
      {blockResponse && blockResponse.block_hash ? (
        <div className="flex flex-col gap-2 sm:hidden">
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-row items-center gap-2">
              <Box size={18} />
              <NavTextLink
                style={{ fontSize: "18px" }}
                href={`/block?h=${blockResponse.block}`}
              >
                <FormattedNumber value={blockResponse.block} />
              </NavTextLink>
            </div>
          </div>
          <div className="break-all">
            <span className="text-sm text-[#8E8E93]">
              {blockResponse.block_hash}
            </span>
          </div>
          <span className="text-sm text-[#8E8E93]">
            {timestampToDate(
              stringConvertToTimestamp(blockResponse.time ?? ""),
              "YYYY-MM-DD HH:mm:ss"
            )}
          </span>
        </div>
      ) : (
        <span>No results found.</span>
      )}
    </div>
  );
}
