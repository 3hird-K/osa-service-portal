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
import RightImage from "@/assets/left-image.png"; 
import { Eye, EyeOff, Loader2 } from "lucide-react";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    if (password !== repeatPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
      router.push("/auth/sign-up-success");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 border-none shadow-xl">
        <CardContent className="grid p-0 md:grid-cols-2">
          
          {/* --- Left Side (Form) --- */}
          <div className="p-6 md:p-8 flex flex-col justify-center bg-background">
            <CardHeader className="flex flex-col items-center space-y-2 text-center p-0 mb-6">
              <Link href={"/"} className="mb-2">
                <Image 
                  src={Logo} 
                  alt="OSA Logo" 
                  width={100} 
                  height={100} 
                  className="block" 
                />
              </Link>
              <CardTitle className="text-2xl font-bold tracking-tight">
                Create Account
              </CardTitle>
              <CardDescription>
                Register for the OSA Service Tracking Portal
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="Juan"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Dela Cruz"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>

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

              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
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

              <div className="grid gap-2">
                <Label htmlFor="repeat-password">Confirm Password</Label>
                <Input
                  id="repeat-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Repeat your password"
                  required
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              {error && (
                <p className="text-[0.8rem] font-medium text-destructive bg-destructive/10 border border-destructive/20 rounded-md p-3 text-center">
                  {error}
                </p>
              )}

              {/* Uses default variant (bg-primary / text-primary-foreground) */}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Registering..." : "Sign Up"}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              {/* Uses text-primary to match theme */}
              <Link href="/auth/login" className="text-primary font-bold hover:underline">
                Sign in
              </Link>
            </p>
          </div>

          {/* --- Right Side (Image) --- */}
          <div className="bg-muted relative hidden md:block h-full min-h-[600px]">
            <Image
              src={RightImage}
              alt="Community Service"
              fill
              className="object-fit object-center"
              priority
            />
            {/* THEME-AWARE GRADIENT:
                Uses `from-primary/90` to create a strong brand-colored overlay at the bottom.
                Uses `text-primary-foreground` (usually white) for text contrast.
            */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-primary/20 to-transparent flex items-end p-8">
              <div className="text-primary-foreground">
                <p className="text-lg font-bold mb-2">Service. Integrity. Innovation.</p>
                <p className="text-sm italic font-light opacity-90">
                  "Streamlining community outreach through technology, ensuring every hour counts towards a better tomorrow."
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}