// app/page.tsx or app/landing/page.tsx (your landing page)
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#121212] text-gray-200 flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-white">📝 Sticko</h1>
      <p className="text-lg sm:text-xl text-gray-400 mb-6 text-center max-w-md font-bold">
      Your Mind 🧠, Organized 📚.
      </p>
      <Link
        href="/notes"
        className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold text-lg px-6 py-2 rounded-lg shadow transition-all"
      >
        Get Started
      </Link>

      <footer className="absolute bottom-4 text-sm text-gray-500 font-semibold">
        Built with ❤️ by{" "}
        <a
          href="https://justtayyabkhan.vercel.app"
          target="_blank"
          className="text-orange-400 hover:underline"
        >
          Tayyab Khan
        </a>
      </footer>
    </main>
  );
}
