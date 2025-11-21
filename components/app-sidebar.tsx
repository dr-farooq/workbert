"use client"

import * as React from "react"
import {
  Home,
  Calendar,
  Users,
  Settings,
  GalleryVerticalEnd,
  AudioWaveform,
  Command,
} from "lucide-react"
import { useParams } from "next/navigation"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "Dr. Farooq",
    email: "dr.farooq@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Corp",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Beta Industries",
      logo: AudioWaveform,
      plan: "Startup",
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const params = useParams();
  const orgId = params.orgId as string;

  const navItems = [
    {
      title: "Home",
      url: `/dashboard/${orgId}`,
      icon: Home,
    },
    {
      title: "Rosters",
      url: `/dashboard/${orgId}/rosters`,
      icon: Calendar,
    },
    {
      title: "Users",
      url: `/dashboard/${orgId}/users`,
      icon: Users,
    },
    {
      title: "Settings",
      url: `/dashboard/${orgId}/settings`,
      icon: Settings,
    },
  ];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
