import TitleText from "@/components/base/title-text";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, X } from "lucide-react";
import CallbackBlockView from "./callback-block-view";
import CallbackInoputView from "./callback-input-view";
import CallbackOutputView from "./callback-output-view";
import CallbackTransactionView from "./callback-transaction-view";
import { querySearchApi } from "@/utils/api/apis";
import { useState, useRef, useCallback } from "react";
import {
  SearchBlockResponse,
  SearchTransactionResponse,
  SearchPutDataResponse,
} from "@/utils/api/types";

interface SearchCallbackData {
  type: string;
  blockData?: SearchBlockResponse;
  transactionData?: SearchTransactionResponse;
  inputData?: SearchPutDataResponse;
  outputData?: SearchPutDataResponse;
}

export default function SearchInputCard() {
  const [value, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [showPover, setShowPoper] = useState(false);
  const [result, setResult] = useState({} as SearchCallbackData);
  async function handleSearch(searchValue: string) {
    setLoading(true);
    try {
      let req = await querySearchApi({ searchValue });
      if (req && req.data && req.data.block) {
        setResult({
          type: "block",
          blockData: req.data.block,
        });
      } else if (req && req.data && req.data.transaction) {
        setResult({
          type: "transaction",
          transactionData: req.data.transaction,
        });
      } else if (req && req.data && req.data.input) {
        setResult({
          type: "Input",
          inputData: req.data.input,
        });
      } else if (req && req.data && req.data.output) {
        setResult({
          type: "Output",
          outputData: req.data.output,
        });
      } else {
        setResult({
          type: "unknown",
        });
      }
    } catch (error: any) {
      setResult({
        type: "unknown",
      });
    }
    setLoading(false);
  }
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setShowPoper(true);
      setQuery(value);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        if (value.trim()) handleSearch(value.trim());
      }, 500);
    },
    [handleSearch]
  );

  const handleKeyPress = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        event.preventDefault();
        if (value.trim()) {
          setShowPoper(true);
          handleSearch(value.trim());
        }
      }
    },
    [handleSearch, value]
  );
  return (
    <div className="flex flex-col gap-4 w-full">
      <TitleText>Neptune Explorer</TitleText>
      <Popover open={showPover} onOpenChange={setShowPoper}>
        <PopoverTrigger asChild>
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9 pr-9"
              value={value}
              placeholder="Search by block / block hash / txn hash ..."
              onChange={handleInputChange}
              onKeyUp={handleKeyPress}
            />
            {value && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-9 w-9 hover:bg-transparent"
                onClick={() => setQuery("")}
              >
                <X className="h-4 w-4 text-muted-foreground" />
                <span className="sr-only">Clear</span>
              </Button>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0"
          align="start"
        >
          <div className="p-4">
            {loading ? (
              <div className="flex flex-col gap-2">
                <Skeleton className="h-2 w-full rounded-full" />
                <Skeleton className="h-2 w-full rounded-full" />
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
            ) : result.type === "block" && result.blockData ? (
              <CallbackBlockView blockResponse={result.blockData} />
            ) : result.type === "transaction" && result.transactionData ? (
              <CallbackTransactionView
                transactionResponse={result.transactionData}
              />
            ) : result.type === "Input" && result.inputData ? (
              <CallbackInoputView inputResponse={result.inputData} />
            ) : result.type === "Output" && result.outputData ? (
              <CallbackOutputView outputResponse={result.outputData} />
            ) : (
              <div className="flex flex-col gap-2">
                <span className="text-[#718096]">Blocks</span>
                <span>No results found.</span>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
