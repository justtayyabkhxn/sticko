"use client";

import NoteCard from "@/components/NoteCard";
import NoteEditor from "@/components/NoteEditor";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Note = {
  _id: string;
  title: string;
  content?: string;
  todos?: { text: string; completed: boolean }[];
  color?: string;
};

export default function HomePage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [showEditor, setShowEditor] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
    } else {
      fetchNotes();
    }
  }, [router]);

  const fetchNotes = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("/api/notes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (Array.isArray(data)) {
        setNotes(data);
      } else {
        console.error("Expected array but got:", data);
        setNotes([]);
      }
    } catch (err) {
      console.error("Error fetching notes:", err);
      setNotes([]);
    }
  };

  // 🔥 Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload(); // Reloads the page
  };

  return (
    <main className="min-h-screen p-4 bg-[#121212] text-gray-200">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">📝 Sticko</h1>
        {/* 🔥 Logout Button */}
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md shadow-lg cursor-pointer font-bold"
        >
          Logout
        </button>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {notes.map((note) => (
          <NoteCard
            key={note._id}
            id={note._id}
            title={note.title}
            content={note.content}
            todos={note.todos}
            color={note.color}
            onSave={fetchNotes}
          />
        ))}
      </section>

      <button
        onClick={() => setShowEditor(true)}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-2xl text-xl cursor-pointer"
      >
        +
      </button>

      {showEditor && (
        <NoteEditor onClose={() => setShowEditor(false)} onSave={fetchNotes} />
      )}

      {/* 🔥 Professional Footer */}
      <footer className="mt-15 p-4 text-center text-sm text-gray-400 font-bold">
        <p>
          © {new Date().getFullYear()} Sticko. Built with ❤️ by <a
            href="https://justtayyabkhan.vercel.app"
            target="_blank"
            className="text-orange-400 cursor-pointer hover:underline font-bold"
          >
            Tayyab Khan
          </a>
        </p>
      </footer>
    </main>
  );
}
