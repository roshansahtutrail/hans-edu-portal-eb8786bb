import { useEffect, useRef, useState, ReactNode } from "react";

interface UseScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export const useScrollAnimation = (options: UseScrollAnimationOptions = {}) => {
  const { threshold = 0.1, rootMargin = "0px", triggerOnce = true } = options;
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce && ref.current) {
            observer.unobserve(ref.current);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, rootMargin, triggerOnce]);

  return { ref, isVisible };
};

// Animation types
type AnimationType = "fade-up" | "fade-left" | "fade-right" | "zoom-in" | "fade";

interface AnimateOnScrollProps {
  children: ReactNode;
  className?: string;
  animation?: AnimationType;
  delay?: number;
}

// Reusable animation wrapper component
export const AnimateOnScroll = ({ 
  children, 
  className = "",
  animation = "fade-up",
  delay = 0,
}: AnimateOnScrollProps) => {
  const { ref, isVisible } = useScrollAnimation();

  const getAnimationClasses = (anim: AnimationType): string => {
    switch (anim) {
      case "fade-up":
        return "translate-y-8 opacity-0";
      case "fade-left":
        return "-translate-x-8 opacity-0";
      case "fade-right":
        return "translate-x-8 opacity-0";
      case "zoom-in":
        return "scale-95 opacity-0";
      case "fade":
        return "opacity-0";
      default:
        return "opacity-0";
    }
  };

  const visibleClasses = "translate-y-0 translate-x-0 scale-100 opacity-100";
  const hiddenClasses = getAnimationClasses(animation);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${className} ${
        isVisible ? visibleClasses : hiddenClasses
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};
