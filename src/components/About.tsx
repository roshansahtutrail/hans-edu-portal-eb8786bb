import { Target, Lightbulb, Heart, TrendingUp } from "lucide-react";

const features = [
  {
    icon: Target,
    title: "Our Mission",
    description:
      "To provide world-class education that empowers students with practical skills and knowledge for a successful career.",
  },
  {
    icon: Lightbulb,
    title: "Innovation First",
    description:
      "We constantly update our curriculum to match industry demands and incorporate the latest technologies.",
  },
  {
    icon: Heart,
    title: "Student-Centric",
    description:
      "Every decision we make prioritizes student success, from personalized mentoring to career guidance.",
  },
  {
    icon: TrendingUp,
    title: "Career Growth",
    description:
      "Our industry partnerships and placement cell ensure students transition smoothly into their dream careers.",
  },
];

export const About = () => {
  return (
    <section id="about" className="section-padding bg-secondary/50">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            About Us
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-6">
            Transforming Lives Through{" "}
            <span className="text-primary">Quality Education</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Founded in 2010, Hans Educational Institute has been at the forefront
            of professional education, helping thousands of students achieve their
            career goals through industry-relevant training and mentorship.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 bg-card rounded-2xl border border-border hover:border-primary/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mb-5 group-hover:shadow-glow transition-shadow duration-300">
                <feature.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-heading font-bold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stats Bar */}
        <div className="mt-16 p-8 rounded-3xl gradient-primary">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "1000+", label: "Pass Out Students" },
              { value: "200+", label: "Expert Faculty" },
              { value: "50+", label: "Industry Partners" },
              { value: "25+", label: "Branches Nationwide" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-heading font-bold text-primary-foreground mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-primary-foreground/80 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
