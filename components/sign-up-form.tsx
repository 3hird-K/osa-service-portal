"use client";

import { cn } from "@/lib/utils";
import { useClerk, useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, Loader2, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";

import Logo from "@/assets/ustp.png";
import RightImage from "@/assets/left-image.png";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const { signUp } = useSignUp();
  const clerk = useClerk();
  const router = useRouter();

  const [step, setStep] = useState<"personal" | "credentials" | "verification">("personal");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.firstName.trim()) {
      setError("First name is required");
      return;
    }
    if (!formData.lastName.trim()) {
      setError("Last name is required");
      return;
    }

    setStep("credentials");
  };

  const handleBackStep = () => {
    setError(null);
    setStep("personal");
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUp) return;

    setIsLoading(true);
    setError(null);

    if (!formData.email.trim()) {
      setError("Email is required");
      setIsLoading(false);
      return;
    }

    if (!formData.password) {
      setError("Password is required");
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await signUp.password({
        emailAddress: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.userName || undefined,
      });

      if (error) {
        setError(error.message || "Signup failed");
        return;
      }

      const emailCodeResult = await signUp.verifications.sendEmailCode();
      if (emailCodeResult.error) {
        setError(emailCodeResult.error.message || "Failed to send verification code");
        return;
      }

      setStep("verification");
    } catch (err: any) {
      setError(err?.errors?.[0]?.longMessage || err?.message || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUp) return;

    setIsLoading(true);
    setError(null);

    try {
      const { error } = await signUp.verifications.verifyEmailCode({
        code: verificationCode,
      });

      if (error) {
        setError(error.message || "Invalid verification code");
        return;
      }

      if (signUp.status === "complete") {
        await signUp.finalize({
          navigate: ({ session, decorateUrl }) => {
            if (session?.currentTask) {
              return;
            }

            const url = decorateUrl("/protected");
            if (url.startsWith("http")) {
              window.location.href = url;
            } else {
              router.push(url);
            }
          },
        });
      } else {
        setError("Verification incomplete");
      }
    } catch (err: any) {
      setError(err?.errors?.[0]?.longMessage || err?.message || "Invalid verification code");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 border-none shadow-xl">
        <CardContent className="grid p-0 md:grid-cols-2">
          {/* LEFT IMAGE */}
          <div className="relative hidden md:flex items-center justify-center h-full min-h-[500px] overflow-hidden bg-[#1a0e05]">
            <Image
              src={RightImage}
              alt="Community Service"
              fill
              className="object-fill"
              sizes="(max-width: 768px) 0vw, 50vw"
              quality={95}
              priority
            />
          </div>

          {/* RIGHT FORM */}
          <div className="p-6 md:p-8 flex flex-col justify-center bg-background">
            {/* Header */}
            <div className="flex flex-col items-center text-center mb-8">
              <Link href="/">
                <Image src={Logo} alt="Logo" width={100} height={100} />
              </Link>
              <h1 className="text-2xl font-bold mt-4">Create Account</h1>
              <p className="text-sm text-muted-foreground">
                Join our community today
              </p>
            </div>

            {/* Progress Indicator */}
            {step !== "verification" && (
              <div className="flex items-center justify-between mb-8 px-2">
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step === "personal" || step === "credentials"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    1
                  </div>
                  <span className="text-xs text-muted-foreground mt-1">Personal</span>
                </div>
                
                <div className={`flex-1 h-0.5 mx-2 rounded-full transition-all ${
                  step === "credentials" ? "bg-primary" : "bg-muted"
                }`} />
                
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step === "credentials" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}>
                    2
                  </div>
                  <span className="text-xs text-muted-foreground mt-1">Credentials</span>
                </div>
              </div>
            )}

            {/* STEP 1: PERSONAL INFO */}
            {step === "personal" && (
              <form onSubmit={handleNextStep} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      placeholder="John"
                      required
                      value={formData.firstName}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      placeholder="Doe"
                      required
                      value={formData.lastName}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="userName">Username</Label>
                  <Input
                    id="userName"
                    name="userName"
                    placeholder="johndoe"
                    required
                    value={formData.userName}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                  {/* <p className="text-xs text-muted-foreground">Optional</p> */}
                </div>

                {error && (
                  <p className="text-sm text-red-500 text-center">{error}</p>
                )}

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            )}

            {/* STEP 2: CREDENTIALS */}
            {step === "credentials" && (
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      required
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      aria-label="Toggle confirm password visibility"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <p className="text-sm text-red-500 text-center">{error}</p>
                )}

                <div id="clerk-captcha" className="flex justify-center" />

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={handleBackStep}
                    disabled={isLoading}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1" 
                    disabled={isLoading}
                  >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isLoading ? "Creating..." : "Create Account"}
                  </Button>
                </div>
              </form>
            )}

            {/* STEP 3: VERIFICATION */}
            {step === "verification" && (
              <form onSubmit={handleVerifyEmail} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="code">Verification Code</Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Enter the 6-digit code sent to {formData.email}
                  </p>
                  <Input
                    id="code"
                    type="text"
                    placeholder="000000"
                    maxLength={6}
                    required
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
                    disabled={isLoading}
                    className="text-center text-lg tracking-widest"
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-500 text-center">{error}</p>
                )}

                <div id="clerk-captcha" className="flex justify-center" />

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isLoading ? "Verifying..." : "Verify & Sign Up"}
                </Button>

                <button
                  type="button"
                  className="w-full text-sm text-primary font-bold hover:underline"
                  onClick={() => setStep("credentials")}
                  disabled={isLoading}
                >
                  Back to Credentials
                </button>
              </form>
            )}

            {/* Footer Links */}
            <p className="mt-6 text-center text-sm">
              Already have an account?{" "}
              <Link href="/auth/login" className="font-bold text-primary">
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}