"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { normalizeUsername } from "@/lib/normalization";

const signUpSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username must be at most 20 characters"),
    email: z
      .string()
      .email("Please enter a valid email address")
      .optional()
      .or(z.literal("")),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignUpFormData = z.infer<typeof signUpSchema>;

export function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [usernameStatus, setUsernameStatus] = useState<{
    checking: boolean;
    available: boolean | null;
  }>({ checking: false, available: null });
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const watchedUsername = watch("username");

  // Check username availability
  useEffect(() => {
    const checkUsername = async () => {
      if (!watchedUsername || watchedUsername.length < 3) {
        setUsernameStatus({ checking: false, available: null });
        return;
      }

      setUsernameStatus({ checking: true, available: null });

      try {
        const normalizedUsername = normalizeUsername(watchedUsername);
        const response = await fetch("/api/auth/check-username", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: normalizedUsername }),
        });

        const data = await response.json();

        if (response.ok) {
          setUsernameStatus({ checking: false, available: data.available });
        } else {
          setUsernameStatus({ checking: false, available: null });
        }
      } catch {
        setUsernameStatus({ checking: false, available: null });
      }
    };

    const timeoutId = setTimeout(checkUsername, 500);
    return () => clearTimeout(timeoutId);
  }, [watchedUsername]);

  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          username: data.username,
          email: data.email || undefined,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Registration failed");
        return;
      }

      // Redirect to sign in page with success message
      router.push(
        "/auth/signin?message=Registration successful! Please sign in."
      );
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getUsernameStatusIcon = () => {
    if (usernameStatus.checking) {
      return <Loader2 className="h-4 w-4 animate-spin text-gray-400" />;
    }
    if (usernameStatus.available === true) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    if (usernameStatus.available === false) {
      return <XCircle className="h-4 w-4 text-red-500" />;
    }
    return null;
  };

  const getUsernameStatusText = () => {
    if (usernameStatus.checking) {
      return "Checking availability...";
    }
    if (usernameStatus.available === true) {
      return "Username is available";
    }
    if (usernameStatus.available === false) {
      return "Username is already taken";
    }
    return "";
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
        <CardDescription>
          Join the Iranian Fighting Game Community
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              {...register("name")}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <div className="relative">
              <Input
                id="username"
                type="text"
                placeholder="Choose a username"
                {...register("username")}
                className={`${errors.username ? "border-red-500" : ""} pr-10`}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                {getUsernameStatusIcon()}
              </div>
            </div>
            {errors.username && (
              <p className="text-sm text-red-500">{errors.username.message}</p>
            )}
            {getUsernameStatusText() && (
              <p
                className={`text-sm ${
                  usernameStatus.available === true
                    ? "text-green-600"
                    : usernameStatus.available === false
                    ? "text-red-600"
                    : "text-gray-600"
                }`}
              >
                {getUsernameStatusText()}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email (Optional)</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email (optional)"
              {...register("email")}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              {...register("password")}
              className={errors.password ? "border-red-500" : ""}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              {...register("confirmPassword")}
              className={errors.confirmPassword ? "border-red-500" : ""}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || usernameStatus.available === false}
          >
            {isLoading ? "Creating account..." : "Create Account"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/auth/signin" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
