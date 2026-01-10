import hansLogo from "@/assets/hans_logo.jpg";

export const LogoLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background">
      {/* Animated background circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-primary/10 animate-pulse delay-100" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full bg-primary/15 animate-pulse delay-200" />
      </div>

      {/* Logo container with animations */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Logo with pulse ring effect */}
        <div className="relative">
          {/* Outer rotating ring */}
          <div className="absolute inset-0 -m-4 rounded-full border-4 border-primary/30 border-t-primary animate-spin" style={{ animationDuration: '2s' }} />
          
          {/* Middle pulsing ring */}
          <div className="absolute inset-0 -m-2 rounded-full border-2 border-primary/20 animate-ping" style={{ animationDuration: '1.5s' }} />
          
          {/* Logo image */}
          <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden shadow-2xl ring-4 ring-primary/20 animate-pulse">
            <img
              src={hansLogo}
              alt="Hans Educational Institute"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Institute name with gradient */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-gradient animate-fade-in">
            Hans Educational Institute
          </h1>
          <p className="text-muted-foreground text-sm md:text-base animate-fade-in delay-100">
            Empowering Futures Through Education
          </p>
        </div>

        {/* Loading dots animation */}
        <div className="flex items-center gap-2 mt-4">
          <span className="w-3 h-3 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-3 h-3 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-3 h-3 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>

        {/* Loading text */}
        <p className="text-sm text-muted-foreground animate-pulse">
          Loading...
        </p>
      </div>
    </div>
  );
};
