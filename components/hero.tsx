import Image from "next/image";
import UstpLogo from "@/assets/ustp.png";

export function Hero() {
  return (
    // Increased top padding (pt-20) to give the logo room below the navbar
    <section className="flex flex-col items-center justify-center text-center gap-8 px-6 pt-20 pb-12 sm:gap-10 sm:py-32">
      
      {/* Logo: Slightly larger on mobile for better brand presence */}
      <a
        href="https://www.ustp.edu.ph/"
        target="_blank"
        rel="noreferrer"
        className="group" 
      >
        <Image
          src={UstpLogo}
          alt="USTP Logo"
          width={140}
          height={140}
          priority
          className="h-auto w-20 sm:w-32 md:w-40 rounded-xl shadow-md transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl"
        />
      </a>

      {/* Title Container */}
      <div className="flex w-full max-w-4xl flex-col items-center space-y-6">
        {/* Title: Using a more aggressive scale for mobile impact */}
        <h1 className="text-4xl font-extrabold tracking-tighter text-foreground sm:text-6xl md:text-7xl lg:text-8xl">
          OSA Service Portal
        </h1>
        
        {/* Main description: Fixed sm:text-xs (which was making it too small) */}
        <p className="max-w-md text-base leading-relaxed text-muted-foreground sm:max-w-xl sm:text-lg md:text-xl">
          Streamline your{" "}
          <span className="font-semibold text-primary">community service,</span>{" "}
          track <span className="font-semibold text-primary">real-time hours,</span>{" "}
          and manage{" "}
          <span className="font-semibold text-primary">IoT verification</span> —
          all in one unified dashboard.
        </p>

        {/* Secondary text: Kept subtle but readable */}
        <p className="max-w-sm text-[13px] leading-relaxed text-muted-foreground/60 sm:max-w-2xl sm:text-base">
          The official administrative hub for USTP's QR-based service tracking,
          providing secure, tamper-proof logs and automated hour calculations.
        </p>
      </div>

      {/* Gradient Divider: More vibrant to separate from the Team section */}
      <div className="mt-4 h-px w-full max-w-[100px] bg-gradient-to-r from-transparent via-primary/50 to-transparent sm:max-w-md" />
      
    </section>
  );
}