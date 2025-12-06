import { useEffect, useState } from "react";
import { Linkedin, Mail } from "lucide-react";
import { getFaculty, initializeData, Faculty as FacultyType } from "@/lib/data";

export const Faculty = () => {
  const [faculty, setFaculty] = useState<FacultyType[]>([]);

  useEffect(() => {
    initializeData();
    setFaculty(getFaculty());
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

        {/* Faculty Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {faculty.map((member, index) => (
            <div
              key={member.id}
              className="group bg-card rounded-2xl border border-border overflow-hidden hover:border-primary/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={member.image}
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
      </div>
    </section>
  );
};
