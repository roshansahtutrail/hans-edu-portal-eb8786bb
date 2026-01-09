import { useEffect, useState } from "react";
import { Bell, Newspaper, AlertCircle, Calendar, AlertTriangle, ArrowRight, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toNepaliDate } from "@/lib/nepaliDate";

interface Notice {
  id: string;
  title: string;
  content: string;
  type: string;
  priority: "urgent" | "important" | "regular";
  image: string | null;
  created_at: string;
}

export const NewsNotices = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [filter, setFilter] = useState<"all" | "news" | "notice">("all");
  const [loading, setLoading] = useState(true);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

  useEffect(() => {
    const fetchNotices = async () => {
      const { data, error } = await supabase
        .from("notices")
        .select("id, title, content, type, priority, image, created_at")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setNotices(data as Notice[]);
      }
      setLoading(false);
    };

    fetchNotices();
  }, []);

  const filteredNotices = notices.filter(
    (n) => filter === "all" || n.type === filter
  );

  const getPriorityIcon = (priority: string) => {
    if (priority === "urgent") return <AlertTriangle className="w-3 h-3" />;
    return null;
  };

  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "border-destructive shadow-destructive/20";
      case "important":
        return "border-accent shadow-accent/20";
      default:
        return "border-border";
    }
  };

  return (
    <>
      <section id="notices" className="section-padding bg-secondary/30">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Stay Updated
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
              News & Notices
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Keep up with the latest announcements, events, and important updates
              from Hans Educational Institute.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex justify-center gap-2 mb-8">
            {[
              { id: "all", label: "All", icon: Bell },
              { id: "news", label: "News", icon: Newspaper },
              { id: "notice", label: "Notices", icon: AlertCircle },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as typeof filter)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200",
                  filter === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-muted-foreground hover:text-foreground hover:bg-muted border border-border"
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Notices Grid */}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNotices.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No {filter === "all" ? "updates" : filter} available.</p>
                </div>
              ) : (
                filteredNotices.map((notice) => (
                  <div
                    key={notice.id}
                    className={cn(
                      "bg-card rounded-xl border overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
                      getPriorityStyles(notice.priority)
                    )}
                  >
                    {notice.image && (
                      <img
                        src={notice.image}
                        alt={notice.title}
                        className="w-full h-40 object-cover"
                      />
                    )}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium",
                            notice.type === "news"
                              ? "bg-primary/10 text-primary"
                              : "bg-accent/10 text-accent"
                          )}
                        >
                          {notice.type === "news" ? (
                            <Newspaper className="w-3 h-3" />
                          ) : (
                            <AlertCircle className="w-3 h-3" />
                          )}
                          {notice.type === "news" ? "News" : "Notice"}
                        </span>
                        {notice.priority !== "regular" && (
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded capitalize",
                              notice.priority === "urgent"
                                ? "bg-destructive/10 text-destructive"
                                : "bg-accent/10 text-accent"
                            )}
                          >
                            {getPriorityIcon(notice.priority)}
                            {notice.priority}
                          </span>
                        )}
                      </div>
                      <h3 className="font-heading font-bold text-foreground mb-2 line-clamp-2">
                        {notice.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                        {notice.content}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="w-3.5 h-3.5" />
                          {toNepaliDate(notice.created_at, 'YYYY MMMM DD')}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-primary hover:text-primary/80"
                          onClick={() => setSelectedNotice(notice)}
                        >
                          Read More
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </section>

      {/* Read More Modal */}
      {selectedNotice && (
        <div className="fixed inset-0 bg-foreground/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {selectedNotice.image && (
              <img
                src={selectedNotice.image}
                alt={selectedNotice.title}
                className="w-full h-64 object-cover"
              />
            )}
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium",
                      selectedNotice.type === "news"
                        ? "bg-primary/10 text-primary"
                        : "bg-accent/10 text-accent"
                    )}
                  >
                    {selectedNotice.type === "news" ? (
                      <Newspaper className="w-3 h-3" />
                    ) : (
                      <AlertCircle className="w-3 h-3" />
                    )}
                    {selectedNotice.type === "news" ? "News" : "Notice"}
                  </span>
                  {selectedNotice.priority !== "regular" && (
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded capitalize",
                        selectedNotice.priority === "urgent"
                          ? "bg-destructive/10 text-destructive"
                          : "bg-accent/10 text-accent"
                      )}
                    >
                      {getPriorityIcon(selectedNotice.priority)}
                      {selectedNotice.priority}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setSelectedNotice(null)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                {selectedNotice.title}
              </h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                <Calendar className="w-4 h-4" />
                {toNepaliDate(selectedNotice.created_at, 'YYYY MMMM DD')}
              </div>
              <div className="prose prose-sm max-w-none text-muted-foreground">
                <p className="whitespace-pre-wrap">{selectedNotice.content}</p>
              </div>
              <Button
                className="w-full mt-6"
                onClick={() => setSelectedNotice(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};