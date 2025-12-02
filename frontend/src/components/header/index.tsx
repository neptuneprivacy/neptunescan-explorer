import NetworkContent from "../home/network-content";
import { useRouter } from "next/navigation";
import MobileNavbar from "../navbar/mobileNavbar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function Header() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="w-full">
      <div className="flex justify-between w-full px-[30px] flex-nowrap my-[10px]">
        <div className="sm:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="p-0 w-[280px]"
            >
              <SheetHeader className="p-6 flex justify-center items-center border-b">
                <SheetTitle>
                  <img
                    style={{ cursor: "pointer" }}
                    src={"/logo.png"}
                    height={60}
                    width={60}
                    alt="Logo"
                    onClick={() => {
                      router.push("/");
                      setOpen(false);
                    }}
                  />
                </SheetTitle>
              </SheetHeader>
              <MobileNavbar closeDrawer={() => setOpen(false)} />
            </SheetContent>
          </Sheet>
        </div>
        <div className="flex flex-row gap-4">
          <NetworkContent />
        </div>
      </div>
    </div>
  );
}
