import { useEffect, useState } from "react";
import { Bell, Newspaper, AlertCircle, Calendar } from "lucide-react";
import { getNotices, Notice, initializeData } from "@/lib/data";
import { cn } from "@/lib/utils";

export const NewsNotices = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [filter, setFilter] = useState<"all" | "news" | "notice">("all");

  useEffect(() => {
    initializeData();
    setNotices(getNotices());
  }, []);

  const filteredNotices = notices.filter(
    (n) => filter === "all" || n.type === filter
  );

  return (
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
                  "bg-card rounded-xl border p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
                  notice.isImportant
                    ? "border-accent shadow-accent/20"
                    : "border-border"
                )}
              >
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
                  {notice.isImportant && (
                    <span className="px-2 py-0.5 bg-destructive/10 text-destructive text-xs font-medium rounded">
                      Important
                    </span>
                  )}
                </div>
                <h3 className="font-heading font-bold text-foreground mb-2 line-clamp-2">
                  {notice.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {notice.content}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(notice.date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};
