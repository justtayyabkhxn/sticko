"use client";

import NoteCard from "@/components/NoteCard";
import NoteEditor from "@/components/NoteEditor";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Note = {
  _id: string;
  title: string;
  content?: string;
  todos?: { text: string; completed: boolean }[];
  color?: string;
  pinned?: boolean;
};

export default function HomePage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [showEditor, setShowEditor] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
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
        const sortedNotes = data.sort((a, b) => {
          if (a.pinned === b.pinned) return 0;
          return a.pinned ? -1 : 1;
        });

        setNotes(sortedNotes);
      } else {
        console.error("Expected array but got:", data);
        setNotes([]);
      }
    } catch (err) {
      console.error("Error fetching notes:", err);
      setNotes([]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  const handleSaveNotes = () => {
    const json = JSON.stringify(notes, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `sticko-notes-${Date.now()}.json`;
    a.click();

    URL.revokeObjectURL(url);
  };

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (note.content?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
  );

  return (
    <main className="flex flex-col min-h-screen p-4 bg-[#121212] text-gray-200">
      <header className="flex flex-col sm:flex-row justify-between items-center mb-6 p-4 gap-4">
        <Link href="/">
          <h1 className="text-3xl font-bold text-white">📝 Sticko - Notes </h1>
        </Link>
        <div className="flex gap-4">
          <Link
            href="/notes"
            className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-md shadow font-bold"
          >
            Notes
          </Link>
          <Link
            href="/todos"
            className="bg-green-500 hover:bg-green-600 text-black px-4 py-2 rounded-md shadow font-bold"
          >
            Todos
          </Link>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleSaveNotes}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md shadow-lg cursor-pointer font-bold"
          >
            Save Notes
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md shadow-lg cursor-pointer font-bold"
          >
            Logout
          </button>
        </div>
      </header>

      {/* 🔍 Search Input */}
      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-md px-4 py-2 rounded-md bg-[#1f1f1f] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* 🗂 Filtered Notes */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 flex-grow">
        {filteredNotes.length > 0 ? (
          filteredNotes.map((note) => (
            <NoteCard
              key={note._id}
              id={note._id}
              title={note.title}
              content={note.content}
              todos={note.todos}
              color={note.color}
              pinned={note.pinned}
              onSave={fetchNotes}
            />
          ))
        ) : (
          <p className="text-center col-span-full text-gray-400">
            No notes found.
          </p>
        )}
      </section>

      {/* ➕ Create New Note */}
      <button
        onClick={() => setShowEditor(true)}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-2xl text-sm font-bold cursor-pointer text-shadow-2xs/10"
      >
        Add Note
      </button>

      {/* 📝 Note Editor Modal */}
      {showEditor && (
        <NoteEditor onClose={() => setShowEditor(false)} onSave={fetchNotes} />
      )}

      {/* 🔻 Footer */}
      <footer className="p-4 text-center text-sm text-gray-400 font-bold">
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
    </main>
  );
}
