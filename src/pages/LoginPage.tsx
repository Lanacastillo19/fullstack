import { useState } from "react";
import { useNavigate } from "react-router";
import useAuthStore from "../store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Always fall back to your live Vercel backend URL
const RAW_API_URL = import.meta.env.VITE_API_URL || "https://backend-21o5.vercel.app/api";
const API_URL = RAW_API_URL.replace(/\/$/, "");

export default function LoginPage() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setError(null);

    try {
      // Ensures the endpoint resolves to https://backend-21o5.vercel.app/api/auth/login
      const endpoint = API_URL.endsWith("/api")
        ? `${API_URL}/auth/login`
        : `${API_URL}/api/auth/login`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: name, username: name, name }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to log in.");
      }

      if (data.token) {
        // Pass both user name and backend-signed JWT token
        login(data.user?.name || name, data.token);
        navigate("/");
      } else {
        throw new Error("No token returned from server.");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white">Login</h2>
      <form onSubmit={handleLogin} className="mt-4 space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="username">Email / Username</Label>
          <Input
            id="username"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your email or name..."
            required
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Signing in..." : "Sign In"}
        </Button>
      </form>
    </div>
  );
}