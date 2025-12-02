import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, ArrowRight } from "lucide-react";

export default function WalletAdCard() {
  return (
    <Card className="rounded-[15px] bg-[rgb(245,246,255)] border-none">
      <CardContent className="flex flex-row justify-between items-center p-4">
        <img
          className="w-auto h-[100px] rounded-md select-none object-contain"
          src="/logo.png"
          alt="Logo"
        />
        <div className="flex flex-col gap-2.5 items-end">
          <span className="text-right text-[rgb(59,64,167)] select-none font-semibold text-base">
            The Neptune Privacy Wallet is ready to go!
          </span>
          <span className="text-right text-[rgb(59,64,167)] select-none text-[10px]">
            One-Step Transfers with Neptune Privacy Wallet ⚡
          </span>
          <div className="flex flex-row items-center justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              className="select-none bg-transparent text-[rgb(59,64,167)] border-[rgb(59,64,167)] hover:bg-[rgb(59,64,167)]/10 hover:text-[rgb(59,64,167)]"
              asChild
            >
              <a
                href="https://github.com/VxBlocks/vxb_neptune_wallet"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Wallet className="mr-2 h-3.5 w-3.5" />
                Try Now
                <ArrowRight className="ml-2 h-3.5 w-3.5" />
              </a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
