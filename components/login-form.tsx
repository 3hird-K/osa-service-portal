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
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [identifier, setIdentifier] = useState("");
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signIn) return;

    setIsLoading(true);
    setError(null);

    try {
      // Reverting to the working .password() method but fixing TS errors
      const res: any = await signIn.password({
        identifier,
        password,
      });

      // In this SDK version, errors are returned in the response object
      if (res.error) {
        setError(res.error.message || "Invalid credentials");
        return;
      }

      // Debugging: See the full picture
      console.log("Sign-in Call Result:", res);
      console.log("Full SignIn Instance:", signIn);

      // Try to find the status
      const status = (signIn as any).status;

      if (status === "complete") {
        await signIn.finalize({
          navigate: ({ decorateUrl }) => {
            window.location.href = decorateUrl("/protected");
          },
        });
      } else if (status === "needs_second_factor" || status === "needs_first_factor_verification") {
        try {
          if (status === "needs_second_factor") {
            // Use the direct MFA method found in your console log
            if ((signIn as any).mfa?.sendEmailCode) {
              await (signIn as any).mfa.sendEmailCode();
            }
          } else {
            // Use the direct emailCode method found in your console log
            if ((signIn as any).emailCode?.sendCode) {
              await (signIn as any).emailCode.sendCode();
            }
          }
          setIsVerifying(true);
        } catch (prepErr: any) {
          console.error("Verification trigger error:", prepErr);
          setIsVerifying(true);
        }
      } else {
        setError(`Status: ${status}. Additional verification required.`);
      }

    } catch (err: any) {
      const clerkError = err?.errors?.[0];
      setError(clerkError?.longMessage || err?.message || "Sign in failed");
    } finally {
      setIsLoading(false);
    }
  };

  const resendCode = async () => {
    if (!signIn) return;
    setIsLoading(true);
    setError(null);
    try {
      if ((signIn as any).status === "needs_second_factor") {
        await (signIn as any).mfa.sendEmailCode();
      } else {
        await (signIn as any).emailCode.sendCode();
      }
      setError("New code sent to your email.");
    } catch (err: any) {
      setError("Failed to resend code.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signIn) return;

    setIsLoading(true);
    setError(null);

    try {
      let result: any;
      const status = (signIn as any).status;
      const cleanCode = code.trim();

      if (status === "needs_second_factor") {
        result = await (signIn as any).mfa.verifyEmailCode({ code: cleanCode });
      } else {
        // Some versions of this SDK expect { code }, some expect just the string
        try {
          result = await (signIn as any).emailCode.verifyCode({ code: cleanCode });
        } catch (e) {
          result = await (signIn as any).emailCode.verifyCode(cleanCode);
        }
      }

      // Log the result to see what's inside
      console.log("Verification Result:", result);

      // In some versions, the result IS the updated signIn object
      const currentStatus = result?.status || (signIn as any).status;

      if (currentStatus === "complete" || (signIn as any).createdSessionId) {
        await signIn.finalize({
          navigate: ({ decorateUrl }) => {
            window.location.href = decorateUrl("/protected");
          },
        });
      } else {
        setError(`Verification status: ${currentStatus}. Please check the code.`);
      }
    } catch (err: any) {
      const clerkError = err?.errors?.[0];
      setError(clerkError?.longMessage || err?.message || "Invalid verification code");
      console.error("Verification Error:", err);
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
              <h1 className="text-2xl font-bold mt-4">
                {isVerifying ? "Verify Identity" : "Welcome Back"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {isVerifying
                  ? "Enter the 6-digit code sent to your device/email"
                  : "Sign in to your account"}
              </p>
            </div>

            {!isVerifying ? (
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

                {error && <p className="text-sm text-red-500 text-center">{error}</p>}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 animate-spin" />}
                  Sign In
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerify} className="space-y-4">
                <div className="grid gap-2">
                  <Label>Verification Code</Label>
                  <Input
                    type="text"
                    placeholder="123456"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    disabled={isLoading}
                    maxLength={6}
                    className="text-center text-2xl tracking-[0.5em] font-bold"
                    required
                  />
                </div>

                {error && <p className="text-sm text-red-500 text-center">{error}</p>}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 animate-spin" />}
                  Verify & Login
                </Button>
                <div className="flex justify-between items-center gap-2">
                  <Button
                    variant="ghost"
                    className="text-xs"
                    onClick={() => setIsVerifying(false)}
                    disabled={isLoading}
                  >
                    Back to login
                  </Button>
                  <Button
                    variant="link"
                    className="text-xs"
                    onClick={resendCode}
                    disabled={isLoading}
                  >
                    Resend code
                  </Button>
                </div>
              </form>
            )}

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