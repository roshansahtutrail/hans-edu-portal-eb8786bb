import { useEffect, useState } from "react";
import { Quote, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AnimateOnScroll } from "@/hooks/useScrollAnimation";

interface FounderMessage {
  id: string;
  name: string;
  designation: string;
  message: string;
  image: string | null;
  display_order: number;
}

export const FounderSection = () => {
  const [founders, setFounders] = useState<FounderMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFounders = async () => {
      const { data, error } = await supabase
        .from("founder_message")
        .select("id, name, designation, message, image, display_order")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (!error && data) {
        setFounders(data);
      }
      setLoading(false);
    };

    fetchFounders();
  }, []);

  if (loading) {
    return (
      <section className="section-padding bg-primary/5">
        <div className="container-custom">
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  if (founders.length === 0) {
    return null;
  }

  return (
    <section id="founder" className="section-padding bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container-custom">
        <AnimateOnScroll animation="fade-up">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Leadership
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
              Our Founders Say
            </h2>
          </div>
        </AnimateOnScroll>

        <div className={`grid gap-8 ${founders.length === 1 ? 'max-w-4xl mx-auto' : 'md:grid-cols-2'}`}>
          {founders.map((founder, index) => (
            <AnimateOnScroll key={founder.id} animation="fade-up" delay={index * 100}>
              <div className="bg-card rounded-2xl border border-border shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden h-full">
                <div className="grid md:grid-cols-3 gap-0 h-full">
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
                    <p className="text-muted-foreground leading-relaxed mb-6 text-lg italic line-clamp-6">
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
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
};
