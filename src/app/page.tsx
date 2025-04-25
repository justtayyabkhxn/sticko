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
    // Check if token exists in localStorage
    const token = localStorage.getItem("token");

    if (!token) {
      // If no token, redirect to login page
      router.push("/login");
    } else {
      // If token exists, fetch the notes
      fetchNotes();
    }
  }, []);

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
  

  return (
    <main className="min-h-screen p-4 bg-[#121212] text-gray-200">
      <header className="text-3xl font-bold mb-6 text-white">📝 Sticko</header>

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {notes.map((note) => (
          <NoteCard
            key={note._id}
            title={note.title}
            content={note.content}
            todos={note.todos}
            color={note.color}
          />
        ))}
      </section>

      <button
        onClick={() => setShowEditor(true)}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-2xl text-xl"
      >
        +
      </button>

      {showEditor && (
        <NoteEditor onClose={() => setShowEditor(false)} onSave={fetchNotes} />
      )}
    </main>
  );
}
