import { useEffect, useState } from "react";
import { Quote } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface FounderMessage {
  id: string;
  name: string;
  designation: string;
  message: string;
  image: string | null;
}

export const FounderSection = () => {
  const [founder, setFounder] = useState<FounderMessage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFounderMessage = async () => {
      const { data, error } = await supabase
        .from("founder_message")
        .select("id, name, designation, message, image")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        setFounder(data);
      }
      setLoading(false);
    };

    fetchFounderMessage();
  }, []);

  if (loading) {
    return (
      <section className="section-padding bg-primary/5">
        <div className="container-custom">
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    );
  }

  if (!founder) {
    return null;
  }

  return (
    <section id="founder" className="section-padding bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container-custom">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Leadership
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
            Our Founder Says
          </h2>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-card rounded-2xl border border-border shadow-lg overflow-hidden">
            <div className="grid md:grid-cols-3 gap-0">
              {/* Founder Image */}
              <div className="md:col-span-1 relative">
                <div className="aspect-square md:aspect-auto md:h-full">
                  <img
                    src={founder.image || "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop"}
                    alt={founder.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent md:bg-gradient-to-r" />
                <div className="absolute bottom-4 left-4 md:hidden">
                  <h3 className="text-xl font-heading font-bold text-primary-foreground">
                    {founder.name}
                  </h3>
                  <p className="text-primary-foreground/80 text-sm">
                    {founder.designation}
                  </p>
                </div>
              </div>

              {/* Message Content */}
              <div className="md:col-span-2 p-6 md:p-8 flex flex-col justify-center">
                <Quote className="w-10 h-10 text-primary/30 mb-4" />
                <p className="text-muted-foreground leading-relaxed mb-6 text-lg italic">
                  "{founder.message}"
                </p>
                <div className="hidden md:block">
                  <h3 className="text-xl font-heading font-bold text-foreground">
                    {founder.name}
                  </h3>
                  <p className="text-primary font-medium">
                    {founder.designation}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};