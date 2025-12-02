"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { querySearchApi } from "@/utils/api/apis";
import { Loader2, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HomeSearch() {
  const router = useRouter();
  const { toast } = useToast();
  const [searchValue, setSearchValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchValue.trim()) return;
    setIsSearching(true);
    try {
      const res = await querySearchApi({ searchValue: searchValue.trim() });
      const data = res.data;

      if (data.block) {
        router.push(`/block?h=${data.block.block_hash}`);
      } else if (data.transaction) {
        router.push(`/tx?id=${data.transaction.id}`);
      } else if (data.input) {
        if (data.input.txid) router.push(`/tx?id=${data.input.txid}`);
        else if (data.input.height)
          router.push(`/block?h=${data.input.height}`);
      } else if (data.output) {
        if (data.output.txid) router.push(`/tx?id=${data.output.txid}`);
        else if (data.output.height)
          router.push(`/block?h=${data.output.height}`);
      } else {
        toast({
          title: "No results found",
          description: "Please check your search query.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Search failed",
        description: "An error occurred while searching.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex flex-col gap-8 items-center text-center">
      <div className="space-y-4">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight lg:text-6xl">
          Neptune Privacy Explorer ⚓
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Explore blocks, transactions, and network statistics for the Neptune
          blockchain.
        </p>
      </div>

      <div className="flex w-full max-w-2xl items-center space-x-2">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by address, block, transaction hash, or UTXO"
            className="pl-10 h-12 text-lg rounded-full shadow-sm"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isSearching}
          />
        </div>
        <Button
          size="lg"
          className="h-12 px-8 rounded-full bg-[rgb(59,64,167)] hover:bg-[rgb(59,64,167)]/90"
          onClick={handleSearch}
          disabled={isSearching}
        >
          {isSearching ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Search"
          )}
        </Button>
      </div>
    </div>
  );
}
