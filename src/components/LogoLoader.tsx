import { useEffect, useState } from "react";
import hansLogo from "@/assets/hans_logo.jpg";

export const LogoLoader = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(var(--primary)/0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(var(--primary)/0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
      
      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '0.5s' }} />

      <div className="relative flex flex-col items-center gap-8">
        {/* Logo container with modern glass effect */}
        <div className="relative">
          {/* Rotating gradient ring */}
          <div 
            className="absolute -inset-4 rounded-full opacity-75"
            style={{
              background: 'conic-gradient(from 0deg, transparent, hsl(var(--primary)), transparent, hsl(var(--accent)), transparent)',
              animation: 'spin 3s linear infinite',
            }}
          />
          
          {/* Glass backdrop */}
          <div className="absolute -inset-3 rounded-full bg-background/80 backdrop-blur-sm" />
          
          {/* Logo with glow */}
          <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden shadow-[0_0_40px_rgba(var(--primary)/0.3)]">
            <img
              src={hansLogo}
              alt="Hans Educational Institute"
              className="w-full h-full object-cover"
              style={{
                animation: 'pulse 2s ease-in-out infinite',
              }}
            />
          </div>
        </div>

        {/* Modern text */}
        <div className="text-center space-y-1 z-10">
          <h1 className="text-xl md:text-2xl font-heading font-semibold tracking-tight text-foreground">
            Hans Educational Institute
          </h1>
          <p className="text-sm text-muted-foreground font-medium">
            Building Tomorrow's Leaders
          </p>
        </div>

        {/* Modern progress bar */}
        <div className="w-48 md:w-64 space-y-2 z-10">
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary via-accent to-primary rounded-full transition-all duration-300 ease-out"
              style={{ 
                width: `${Math.min(progress, 100)}%`,
                backgroundSize: '200% 100%',
                animation: 'shimmer 2s linear infinite',
              }}
            />
          </div>
          <p className="text-xs text-muted-foreground text-center font-medium">
            Loading experience...
          </p>
        </div>

        {/* Animated dots */}
        <div className="flex items-center gap-1.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-primary/60"
              style={{
                animation: 'bounce 1s ease-in-out infinite',
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
};
