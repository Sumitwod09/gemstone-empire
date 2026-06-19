"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Input, Button } from "@/components/ui";
import { toast } from "sonner";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/account";

  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();

    if (!supabase) {
      toast.success(mode === "login" ? "Logged in (Mock Mode)" : "Account created (Mock Mode)!");
      router.push(redirect);
      setLoading(false);
      return;
    }

    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push(redirect);
        router.refresh();
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        });
        if (error) throw error;
        toast.success("Account created! Please check your email to confirm.");
        setMode("login");
      }
    } catch (err: unknown) {
      toast.error((err as Error).message ?? "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <h1
          className="text-3xl font-bold text-[var(--color-text-primary)] mb-2 text-center"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {mode === "login" ? "Welcome Back" : "Create Account"}
        </h1>
        <p className="text-sm text-[var(--color-text-muted)] text-center mb-8">
          {mode === "login" ? "Sign in to your account" : "Join Gemstone Empire"}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {mode === "register" && (
            <Input
              label="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          )}
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
          <Button type="submit" loading={loading} className="w-full mt-2">
            {mode === "login" ? "Sign In" : "Create Account"}
          </Button>
        </form>

        <p className="text-sm text-center text-[var(--color-text-muted)] mt-6">
          {mode === "login" ? (
            <>
              No account?{" "}
              <button
                onClick={() => setMode("register")}
                className="text-[var(--color-accent)] hover:underline font-medium"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setMode("login")}
                className="text-[var(--color-accent)] hover:underline font-medium"
              >
                Sign in
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center text-sm text-[var(--color-text-muted)]">Loading auth form...</div>}>
      <LoginForm />
    </Suspense>
  );
}
