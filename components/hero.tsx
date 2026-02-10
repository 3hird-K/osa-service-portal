import Image from "next/image";
import UstpLogo from "@/assets/ustp.png";

export function Hero() {
  return (
    <section className="flex flex-col items-center justify-center text-center gap-6 px-4 py-12 sm:gap-8 sm:py-20 md:py-24">
      {/* Logo */}
      <a
        href="https://www.ustp.edu.ph/"
        target="_blank"
        rel="noreferrer"
        className="group" // Added group for hover effects
      >
        <Image
          src={UstpLogo}
          alt="USTP Logo"
          width={140}
          height={140}
          // w-28 on mobile, w-36 on tablet/desktop. 
          // 'h-auto' preserves aspect ratio based on the width.
          className="h-auto w-28 rounded-xl shadow-md transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl sm:w-36"
        />
      </a>

      {/* Title Container */}
      <div className="flex w-full max-w-4xl flex-col items-center space-y-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl">
          OSA Service Portal
        </h1>
        
        <p className="max-w-xl text-base text-muted-foreground sm:text-lg md:text-xl">
          Streamline your{" "}
          <span className="font-semibold text-primary">community service,</span>{" "}
          track <span className="font-semibold text-primary">real-time hours,</span>{" "}
          and manage{" "}
          <span className="font-semibold text-primary">IoT verification</span> —
          all in one unified dashboard.
        </p>

        <p className="max-w-2xl text-sm text-muted-foreground/80 sm:text-base md:text-lg">
          The official administrative hub for USTP's QR-based service tracking,
          providing secure, tamper-proof logs and automated hour calculations
          for all student outreach programs.
        </p>
      </div>

      {/* Divider */}
      <div className="my-4 h-px w-full max-w-[200px] bg-gradient-to-r from-transparent via-foreground/20 to-transparent sm:my-6 sm:max-w-lg" />
      
      {/* Optional: Add a Call to Action button here for mobile users to tap immediately */}
    </section>
  );
}