import { useEffect, useState } from "react";
import { Linkedin, Mail, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Faculty {
  id: string;
  name: string;
  designation: string;
  qualification: string;
  specialization: string;
  image: string | null;
  is_active: boolean;
}

export const Faculty = () => {
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaculty = async () => {
      const { data, error } = await supabase
        .from("faculty")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setFaculty(data);
      }
      setLoading(false);
    };

    fetchFaculty();
  }, []);

  return (
    <section id="faculty" className="section-padding bg-secondary/50">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            Our Team
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-6">
            Meet Our Expert <span className="text-primary">Faculty</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Learn from industry veterans and academic experts who bring real-world
            experience and passion for teaching to every class.
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : faculty.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No faculty members available at the moment.</p>
          </div>
        ) : (
          /* Faculty Grid */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {faculty.map((member) => (
              <div
                key={member.id}
                className="group bg-card rounded-2xl border border-border overflow-hidden hover:border-primary/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={member.image || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop"}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Social Links */}
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                    <button className="w-10 h-10 rounded-full bg-primary-foreground flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                      <Linkedin className="w-5 h-5" />
                    </button>
                    <button className="w-10 h-10 rounded-full bg-primary-foreground flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                      <Mail className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 text-center">
                  <h3 className="text-lg font-heading font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-sm text-primary font-semibold mb-2">
                    {member.designation}
                  </p>
                  <p className="text-xs text-muted-foreground mb-2">
                    {member.qualification}
                  </p>
                  <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    {member.specialization}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};