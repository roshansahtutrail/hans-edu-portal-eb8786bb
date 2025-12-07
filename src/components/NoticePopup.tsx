import { useState, useEffect } from "react";
import { X, AlertTriangle, Bell, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface Notice {
  id: string;
  title: string;
  content: string;
  priority: "urgent" | "important" | "regular";
}

const DISMISSED_KEY = "hans_dismissed_notices";

export const NoticePopup = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dontShowToday, setDontShowToday] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchPopupNotices = async () => {
      const { data, error } = await supabase
        .from("notices")
        .select("id, title, content, priority")
        .eq("show_as_popup", true)
        .eq("is_active", true)
        .order("priority", { ascending: true })
        .order("created_at", { ascending: false });

      if (!error && data) {
        // Filter out dismissed notices
        const dismissed = getDismissedNotices();
        const filteredNotices = data.filter((n) => !dismissed.includes(n.id)) as Notice[];
        setNotices(filteredNotices);
        
        // Show popup after a short delay
        if (filteredNotices.length > 0) {
          setTimeout(() => setIsVisible(true), 1000);
        }
      }
    };

    fetchPopupNotices();
  }, []);

  const getDismissedNotices = (): string[] => {
    try {
      const stored = localStorage.getItem(DISMISSED_KEY);
      if (!stored) return [];
      
      const { date, ids } = JSON.parse(stored);
      const today = new Date().toDateString();
      
      // Clear if from a different day
      if (date !== today) {
        localStorage.removeItem(DISMISSED_KEY);
        return [];
      }
      
      return ids || [];
    } catch {
      return [];
    }
  };

  const dismissNotice = () => {
    const currentNotice = notices[currentIndex];
    
    if (dontShowToday && currentNotice) {
      const dismissed = getDismissedNotices();
      dismissed.push(currentNotice.id);
      localStorage.setItem(
        DISMISSED_KEY,
        JSON.stringify({
          date: new Date().toDateString(),
          ids: dismissed,
        })
      );
    }

    if (currentIndex < notices.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsVisible(false);
    }
    setDontShowToday(false);
  };

  const dismissAll = () => {
    if (dontShowToday) {
      const allIds = notices.map((n) => n.id);
      localStorage.setItem(
        DISMISSED_KEY,
        JSON.stringify({
          date: new Date().toDateString(),
          ids: allIds,
        })
      );
    }
    setIsVisible(false);
  };

  if (!isVisible || notices.length === 0) return null;

  const currentNotice = notices[currentIndex];
  
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "urgent":
        return <AlertTriangle className="w-5 h-5" />;
      case "important":
        return <Bell className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-destructive text-destructive-foreground";
      case "important":
        return "bg-accent text-accent-foreground";
      default:
        return "bg-primary text-primary-foreground";
    }
  };

  return (
    <div className="fixed inset-0 bg-foreground/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-lg animate-in fade-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div
          className={cn(
            "flex items-center gap-3 px-6 py-4 rounded-t-2xl",
            getPriorityStyles(currentNotice.priority)
          )}
        >
          {getPriorityIcon(currentNotice.priority)}
          <span className="font-medium capitalize">
            {currentNotice.priority} Notice
          </span>
          {notices.length > 1 && (
            <span className="ml-auto text-sm opacity-80">
              {currentIndex + 1} of {notices.length}
            </span>
          )}
          <button
            onClick={dismissAll}
            className="ml-2 p-1 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-heading font-bold text-foreground mb-3">
            {currentNotice.title}
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            {currentNotice.content}
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 space-y-4">
          <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={dontShowToday}
              onChange={(e) => setDontShowToday(e.target.checked)}
              className="rounded border-border text-primary focus:ring-primary"
            />
            Don't show this again today
          </label>
          <div className="flex gap-3">
            {notices.length > 1 && currentIndex < notices.length - 1 ? (
              <>
                <Button variant="outline" className="flex-1" onClick={dismissAll}>
                  Dismiss All
                </Button>
                <Button className="flex-1" onClick={dismissNotice}>
                  Next Notice
                </Button>
              </>
            ) : (
              <Button className="w-full" onClick={dismissNotice}>
                Got it
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
