import { useEffect, useState } from "react";
import { Clock, BarChart, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { getCourses, initializeData, Course } from "@/lib/data";

export const Courses = () => {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    initializeData();
    setCourses(getCourses());
  }, []);

  const scrollToContact = () => {
    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="courses" className="section-padding">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            Our Programs
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-6">
            Industry-Ready <span className="text-primary">Courses</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Choose from our wide range of professionally designed courses that
            prepare you for real-world challenges and career success.
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <div
              key={course.id}
              className="group bg-card rounded-2xl border border-border overflow-hidden hover:border-primary/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                <span className="absolute bottom-4 left-4 px-3 py-1 rounded-full bg-accent text-accent-foreground text-sm font-bold">
                  {course.price}
                </span>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-heading font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {course.title}
                </h3>
                <p className="text-muted-foreground mb-4 line-clamp-2">
                  {course.description}
                </p>

                {/* Meta */}
                <div className="flex items-center gap-4 mb-5">
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    {course.duration}
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <BarChart className="w-4 h-4" />
                    {course.level}
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full group/btn"
                  onClick={scrollToContact}
                >
                  Enroll Now
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
