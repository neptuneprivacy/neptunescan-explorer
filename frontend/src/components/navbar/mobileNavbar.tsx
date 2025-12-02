"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { mobileLinkdata } from "@/config/router";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface MobileNavbarProps {
  closeDrawer: () => void;
}

export default function MobileNavbar({ closeDrawer }: MobileNavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [active, setActive] = useState("/");

  useEffect(() => {
    if (pathname) {
      setActive(pathname);
    }
  }, [pathname]);

  const handleNavigation = (href: string) => {
    router.push(href);
    closeDrawer();
  };

  return (
    <ScrollArea className="h-[calc(100vh-80px)] px-4 pb-4">
      <div className="space-y-1 py-4">
        {mobileLinkdata.map((item, index) => {
          const Icon = item.icon;
          const isActive = item.href === active;

          return (
            <Button
              key={index}
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-3 h-12 text-base font-medium",
                isActive &&
                  "bg-[rgb(59,64,167)]/10 text-[rgb(59,64,167)] hover:bg-[rgb(59,64,167)]/20"
              )}
              onClick={() => item.href && handleNavigation(item.href)}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Button>
          );
        })}
      </div>
    </ScrollArea>
  );
}
