"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

import Logo from "@/assets/ustp.png"; 
import SideImage from "@/assets/left-image.png"; 
import { Eye, EyeOff, Loader2 } from "lucide-react";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      
      router.push("/protected");
      router.refresh(); 
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 border-none shadow-xl">
        <CardContent className="grid p-0 md:grid-cols-2">
          
          {/* --- Left Side (Image) --- */}
          <div className="bg-muted relative hidden md:block h-full min-h-[500px]">
            <Image
              src={SideImage}
              alt="Service Portal Background"
              fill
              className="object-cover"
              priority
            />
            {/* Overlay using standard utility classes */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-primary/20 to-transparent flex items-end p-8">
                <div className="text-white">
                    <p className="text-lg font-bold mb-1">Empowering the Community</p>
                    <p className="text-sm italic font-light opacity-90">
                        "Real-time tracking for real-world impact."
                    </p>
                </div>
            </div>
          </div>

          {/* --- Right Side (Form) --- */}
          <div className="p-6 md:p-8 flex flex-col justify-center bg-background">
            <CardHeader className="flex flex-col items-center space-y-2 text-center p-0 mb-8">
              <Link href={"/"} className="mb-4">
                <Image 
                  src={Logo} 
                  alt="OSA Service Portal" 
                  width={100} 
                  height={100} 
                  className="block" 
                />
              </Link>
              <CardTitle className="text-2xl font-bold tracking-tight">
                Welcome Back
              </CardTitle>
              <CardDescription>
                Sign in to manage your service hours and logs
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Institutional Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="id.number@ustp.edu.ph"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div className="grid gap-2 relative">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/auth/forgot-password" className="text-xs text-primary hover:underline font-medium">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                    <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    className="pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    />
                    <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                    >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
              </div>

              {error && (
                <p className="text-[0.8rem] font-medium text-destructive bg-destructive/10 border border-destructive/20 rounded-md p-3 text-center">
                  {error}
                </p>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <p className="mt-8 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/auth/sign-up" className="text-primary font-bold hover:underline">
                Register Now
              </Link>
            </p>
          </div>
          
        </CardContent>
      </Card>
    </div>
  );
}