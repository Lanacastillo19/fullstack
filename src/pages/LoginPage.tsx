import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "../store/authStore";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required.")
    .email("Must be a valid email address.")
    .refine((email) => email.endsWith("@dlsl.edu.ph"), {
      message: "Email must be an official @dlsl.edu.ph institutional email.",
    }),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// What POST /api/auth/login sends back.
interface LoginReply {
  token: string;
  user: { name: string; email: string; role: string };
}

const API_URL = "https://gt-4-fullstack.vercel.app";

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setServerError(null);

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as {
          message?: string;
        } | null;
        setServerError(body?.message ?? "Login failed. Try again.");
        return;
      }

      const reply = (await res.json()) as LoginReply;
      // Real token + user go into the store. The password is never kept.
      login(reply.user, reply.token);
      navigate("/");
    } catch {
      setServerError("Could not reach the server. Check your connection.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <h1 className="text-4xl font-bold mb-8">Login</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="example@dlsl.edu.ph"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
          )}
        </div>

        {serverError && (
          <p className="text-sm text-red-500">{serverError}</p>
        )}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Signing in..." : "Sign In"}
        </Button>
      </form>
    </div>
  );
}