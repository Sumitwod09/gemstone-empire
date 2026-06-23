"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Input, Button } from "@/components/ui";
import { toast } from "sonner";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/account";

  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

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

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    const supabase = createClient();

    if (!supabase) {
      toast.success("Google Login (Mock Mode)");
      router.push(redirect);
      setGoogleLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirect)}`,
        },
      });
      if (error) throw error;
    } catch (err: unknown) {
      toast.error((err as Error).message ?? "Failed to connect to Google");
      setGoogleLoading(false);
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
          <Button type="submit" loading={loading} className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700">
            {mode === "login" ? "Sign In" : "Create Account"}
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-400">Or continue with</span>
          </div>
        </div>

        <Button
          type="button"
          variant="secondary"
          onClick={handleGoogleLogin}
          loading={googleLoading}
          className="w-full flex items-center justify-center gap-2 border border-gray-200 text-gray-600 hover:bg-gray-50/80 transition-colors font-semibold"
        >
          <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.137 4.114-3.468 0-6.286-2.818-6.286-6.286s2.818-6.286 6.286-6.286c1.558 0 2.977.57 4.077 1.508l2.977-2.977C18.96 1.83 15.82 1 12.24 1 6.037 1 1 6.037 1 12.24s5.037 11.24 11.24 11.24c6.262 0 10.428-4.4 10.428-10.603 0-.712-.07-1.4-.2-2.073l-10.228.481z"
            />
          </svg>
          Google
        </Button>

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
