import { 
  BookOpen, 
  Users, 
  MessageSquare, 
  Bell, 
  Shield, 
  UserCog, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Quote,
  Home
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

export type Tab = "courses" | "faculty" | "inquiries" | "notices" | "founders" | "users" | "settings";

interface AdminSidebarProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  counts: {
    courses: number;
    faculty: number;
    notices: number;
    inquiries: number;
    founders: number;
    users: number;
  };
  canManageUsers: boolean;
  onNavigateHome: () => void;
}

export const AdminSidebar = ({ 
  activeTab, 
  setActiveTab, 
  counts, 
  canManageUsers,
  onNavigateHome 
}: AdminSidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);

  const tabs = [
    { id: "courses" as Tab, label: "Courses", icon: BookOpen, count: counts.courses },
    { id: "faculty" as Tab, label: "Faculty", icon: Users, count: counts.faculty },
    { id: "notices" as Tab, label: "News & Notices", icon: Bell, count: counts.notices },
    { id: "inquiries" as Tab, label: "Inquiries", icon: MessageSquare, count: counts.inquiries },
    { id: "founders" as Tab, label: "Founders", icon: Quote, count: counts.founders },
    ...(canManageUsers ? [{ id: "users" as Tab, label: "Users", icon: UserCog, count: counts.users }] : []),
    { id: "settings" as Tab, label: "Settings", icon: Settings, count: 0 },
  ];

  return (
    <aside 
      className={cn(
        "bg-card border-r border-border h-[calc(100vh-4rem)] sticky top-16 flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Collapse Toggle */}
      <div className="p-2 border-b border-border flex justify-end">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all duration-200",
              activeTab === tab.id
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted",
              collapsed && "justify-center px-2"
            )}
            title={collapsed ? tab.label : undefined}
          >
            <tab.icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && (
              <>
                <span className="flex-1 text-left">{tab.label}</span>
                {tab.count > 0 && (
                  <span className={cn(
                    "text-xs px-2 py-0.5 rounded-full",
                    activeTab === tab.id ? "bg-primary-foreground/20" : "bg-muted"
                  )}>
                    {tab.count}
                  </span>
                )}
              </>
            )}
          </button>
        ))}
      </nav>

      {/* Home Button */}
      <div className="p-2 border-t border-border">
        <button
          onClick={onNavigateHome}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200",
            collapsed && "justify-center px-2"
          )}
          title={collapsed ? "View Website" : undefined}
        >
          <Home className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>View Website</span>}
        </button>
      </div>
    </aside>
  );
};
