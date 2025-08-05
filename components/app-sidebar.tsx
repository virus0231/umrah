"use client"

import type * as React from "react"
import {
  BarChart3,
  Users,
  FileText,
  Edit,
  Code,
  HeadingIcon as Header,
  FootprintsIcon as Footer,
  Plane,
  Phone,
  Package,
  LogOut,
  User,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

const data = {
  navMain: [
    {
      title: "Main Menu",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: BarChart3,
        },
        {
          title: "Users",
          url: "/dashboard/users",
          icon: Users,
        },
        {
          title: "Forms",
          url: "/dashboard/forms",
          icon: FileText,
        },
        // {
        //   title: "Page Editor",
        //   url: "/dashboard/pages",
        //   icon: Edit,
        // },
        {
          title: "Snippet Editor",
          url: "/dashboard/snippets",
          icon: Code,
        },
        // {
        //   title: "Header",
        //   url: "/dashboard/header",
        //   icon: Header,
        // },
        // {
        //   title: "Footer",
        //   url: "/dashboard/footer",
        //   icon: Footer,
        // },
        {
          title: "Flying Partners",
          url: "/dashboard/flying-partners",
          icon: Plane,
        },
        // {
        //   title: "Contact Page",
        //   url: "/dashboard/contact",
        //   icon: Phone,
        // },
        {
          title: "Packages",
          url: "/dashboard/packages",
          icon: Package,
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const handleLogout = () => {
    logout()
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    })
    router.push("/")
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-blue-600 text-white">
            <span className="font-bold">U</span>
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">CMS Dashboard</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {data.navMain.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={item.title}>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-2 px-2 py-2 text-sm">
              <User className="h-4 w-4" />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user?.name}</span>
                <span className="truncate text-xs text-gray-500">{user?.email}</span>
              </div>
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} tooltip="Logout">
              <LogOut />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
