"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); // Start loading

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (res.ok) {
        router.push("/login");
      } else {
        const data = await res.json();
        alert(data.message || "Something went wrong.");
      }
    } catch (err) {
      alert("Network error. Please try again."+err);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-[#121212] text-white">
      <form
        onSubmit={handleSignup}
        className="bg-zinc-900 p-6 rounded-xl shadow-md w-96 text-center"
      >
        <h2 className="text-2xl font-bold mb-4">Sign Up For 📝Sticko</h2>

        <input
          type="text"
          placeholder="Full Name"
          className="w-full p-2 mb-3 rounded bg-zinc-800 text-white"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-3 rounded bg-zinc-800 text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full p-2 pr-10 mb-4 rounded bg-zinc-800 text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-5 transform -translate-y-1/2 text-sm text-gray-400"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full ${
            loading ? "bg-blue-400" : "bg-blue-600"
          } p-2 rounded cursor-pointer mb-3 font-bold`}
        >
          {loading ? "Creating account..." : "Sign up"}
        </button>

        <p className="text-sm text-gray-400">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-400 hover:underline">
            Login
          </Link>
        </p>

        <footer className="mt-2 p-4 text-center text-sm text-gray-400 font-bold">
          <p>
            © {new Date().getFullYear()} Sticko. Built with ❤️ by{" "}
            <a
              href="https://justtayyabkhan.vercel.app"
              target="_blank"
              className="text-orange-400 cursor-pointer hover:underline font-bold"
            >
              Tayyab Khan
            </a>
          </p>
        </footer>
      </form>
    </main>
  );
}
