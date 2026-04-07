"use client";

import { cn } from "@/lib/utils";
import { useSignIn, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import Logo from "@/assets/ustp.png"; 
import SideImage from "@/assets/left-image.png"; 

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {

  const { signIn } = useSignIn();
  const clerk = useClerk();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [identifier, setIdentifier] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signIn) return;

    setIsLoading(true);
    setError(null);

    try {
      const { error } = await signIn.password({
        identifier: identifier,
        password,
      });

      if (error) {
        setError(error.message || "Invalid credentials");
        return;
      }

      if (signIn.status === "complete") {
        await signIn.finalize({
          navigate: ({ session, decorateUrl }) => {
            if (session?.currentTask) return;

            const url = decorateUrl("/protected");

            if (url.startsWith("http")) {
              window.location.href = url;
            } else {
              router.push(url);
            }
          },
        });
      } else {
        setError("Sign in incomplete. Try again.");
      }

    } catch (err: any) {
      setError(err?.errors?.[0]?.longMessage || err?.message || "Sign in failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 border-none shadow-xl">
        <CardContent className="grid p-0 md:grid-cols-2">

          

          {/* RIGHT FORM */}
          <div className="p-6 md:p-8 flex flex-col justify-center bg-background">

            <div className="flex flex-col items-center text-center mb-8">
              <Link href="/">
                <Image src={Logo} alt="Logo" width={100} height={100} />
              </Link>
              <h1 className="text-2xl font-bold mt-4">Welcome Back</h1>
              <p className="text-sm text-muted-foreground">
                Sign in to your account
              </p>
            </div>

            <form onSubmit={handleSignIn} className="space-y-4">

              <div className="grid gap-2">
                <Label>Email or Username</Label>
                <Input
                  type="text"
                  placeholder="email or username"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label>Password</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="pr-10"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-500 text-center">{error}</p>
              )}

              {/* CAPTCHA (important if enabled) */}
              <div id="clerk-captcha" className="flex justify-center" />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 animate-spin" />}
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm">
              Don’t have an account?{" "}
              <Link href="/auth/sign-up" className="font-bold text-primary">
                Register
              </Link>
            </p>
          </div>


          {/* LEFT IMAGE */}
          <div className="relative hidden md:flex items-center justify-center h-full min-h-[500px] overflow-hidden bg-[#1a0e05]">
            <Image
              src={SideImage}
              alt="Service Portal Background"
              fill
              className="object-fill"
              sizes="(max-width: 768px) 0vw, 50vw"
              quality={95}
              priority
            />
          </div>

        </CardContent>
      </Card>
    </div>
  );
}