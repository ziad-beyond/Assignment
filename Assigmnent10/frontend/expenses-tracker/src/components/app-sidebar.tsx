"use client";

import * as React from "react";
import {
  Wallet,
  Calendar,
  Wallet2,
  LayoutDashboard 
} from "lucide-react";

import { NavUser } from "@/components/nav-user";
import Cookies from 'js-cookie';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useEffect, useState } from "react";

// Sample data for simplified navMain
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Manage Expenses",
    url: "/menageExpenses",
    icon: Wallet,
  },
  {
    title: "Summary",
    url: "/summary",
    icon: Wallet2,
  },
  {
    title: "Monthly Report",
    url: "/monthlyReport",
    icon: Calendar,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [email, setEmail] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);

  useEffect(() => { 
    const userEmail = Cookies.get('email') || null; 
    const userName = Cookies.get('name')|| null; 
    setEmail(userEmail); 
    setName(userName); 
  }, []);

  const user = {
    name: name || "shadcn",
    email: email || "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <img
          src="/brand2.png"
          alt="Brand"
          className="h-12 w-24 ml-0 object-cover dark:brightness-[0.2] dark:grayscale"
        />
        <hr />
      </SidebarHeader>
      <SidebarContent className="mt-2">
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <a href={item.url}>
                  <item.icon />
                  <span className="text-lg">{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <hr />
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
