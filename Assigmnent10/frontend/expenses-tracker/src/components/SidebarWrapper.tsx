"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { usePathname } from "next/navigation";

export default function SidebarWrapper({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();

  const hideSidebarRoutes = ["/","/signin", "/signup"];
  const showSidebar = !hideSidebarRoutes.includes(pathname);

  return (
    <SidebarProvider>
      <div className="layout">
        {showSidebar && <AppSidebar />}
        <main className={`content ${showSidebar ? "with-sidebar" : ""}`}>
          {showSidebar && <SidebarTrigger />}
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
