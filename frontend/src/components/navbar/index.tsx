"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { linkdata } from "@/config/router";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronRight } from "lucide-react";
import React from "react";

function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [active, setActive] = useState("/");
  // Track open state for each collapsible item
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (pathname) {
      setActive(pathname);

      // Auto-open the group if a child is active
      linkdata.forEach((item) => {
        if (item.links && item.links.some((link) => link.link === pathname)) {
          setOpenItems((prev) => ({ ...prev, [item.label]: true }));
        }
      });
    }
  }, [pathname]);

  const toggleItem = (label: string) => {
    setOpenItems((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <div className="hidden sm:flex h-screen w-[228px] flex-col border-r bg-[rgb(59,64,167)]/5 sticky top-0 shrink-0">
      <div className="p-6 flex justify-center shrink-0">
        <div
          className="relative h-20 w-20 cursor-pointer transition-transform hover:scale-105 "
          onClick={() => router.push("/")}
        >
          <Image
            src="/logo.png"
            alt="Logo"
            fill
            className="object-contain "
            priority
          />
        </div>
      </div>

      <div className="flex-1 px-4 w-full overflow-hidden">
        <div className="space-y-2 pb-4">
          {linkdata.map((item, index) => {
            const Icon = item.icon;
            const hasLinks = item.links && item.links.length > 0;
            const isChildActive =
              hasLinks && item.links?.some((link) => link.link === active);
            const isActive = item.href === active || isChildActive;
            const isOpen = openItems[item.label] || false;

            if (hasLinks) {
              return (
                <Collapsible
                  key={index}
                  open={isOpen}
                  onOpenChange={() => toggleItem(item.label)}
                  className="w-full"
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-between h-10 font-medium px-4 hover:bg-accent hover:text-accent-foreground",
                        isActive ? "text-primary" : ""
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5" />
                        {item.label}
                      </div>
                      <ChevronRight
                        className={cn(
                          "h-4 w-4 transition-transform duration-200",
                          isOpen && "rotate-90"
                        )}
                      />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-1 pt-1 pb-0 pl-4 overflow-hidden">
                    {item.links?.map((subItem, subIndex) => {
                      const SubIcon = subItem.icon;
                      const isSubActive = subItem.link === active;
                      return (
                        <Button
                          key={subIndex}
                          variant={isSubActive ? "secondary" : "ghost"}
                          className={cn(
                            "w-full justify-start gap-3 h-9 font-normal px-4",
                            isSubActive &&
                              "bg-[rgb(59,64,167)]/10 text-[rgb(59,64,167)] hover:bg-[rgb(59,64,167)]/20"
                          )}
                          onClick={() => router.push(subItem.link)}
                        >
                          {SubIcon && <SubIcon className="h-4 w-4" />}
                          {subItem.label}
                        </Button>
                      );
                    })}
                  </CollapsibleContent>
                </Collapsible>
              );
            }

            return (
              <Button
                key={index}
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 h-10 font-medium px-4",
                  isActive &&
                    "bg-[rgb(59,64,167)]/10 text-[rgb(59,64,167)] hover:bg-[rgb(59,64,167)]/20"
                )}
                onClick={() => item.href && router.push(item.href)}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default React.memo(Navbar);
