import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, ArrowRight } from "lucide-react";

export default function BaseAdCard() {
  return (
    <Card className="rounded-[15px] bg-[#fafbff] border-none">
      <CardContent className="flex flex-row justify-between items-center p-4">
        <img
          className="w-auto h-[100px] rounded-md select-none object-contain"
          src="/logo.png"
          alt="Logo"
        />
        <div className="flex flex-col gap-2.5 items-end">
          <span className="text-right text-[#0384d8] select-none font-semibold text-base">
            Homepage Header AD
          </span>
          <span className="text-right text-[#0384d8] select-none text-[10px]">
            🔥 Prime Visibility: Your Brand on Our Header!
          </span>
          <div className="flex flex-row items-center justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              className="select-none bg-transparent text-[#0384d8] border-[#0384d8] hover:bg-[#0384d8]/10 hover:text-[#0384d8]"
              asChild
            >
              <a
                href="https://github.com/VxBlocks/vxb_neptune_wallet/releases"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Wallet className="mr-2 h-3.5 w-3.5" />
                Contact Us
                <ArrowRight className="ml-2 h-3.5 w-3.5" />
              </a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
