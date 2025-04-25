"use client";

import NoteCard from "@/components/NoteCard";
import { useEffect, useState } from "react";

type Note = {
  _id: string;
  title: string;
  content?: string;
  todos?: { text: string; completed: boolean }[];
  color?: string;
};

export default function HomePage() {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    fetch("/api/notes")
      .then(res => res.json())
      .then(data => setNotes(data));
  }, []);

  return (
    <main className="min-h-screen p-4 bg-[#121212] text-gray-200">
      <header className="text-3xl font-bold mb-6 text-white">📝 Sticko</header>

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {notes.map(note => (
          <NoteCard
            key={note._id}
            title={note.title}
            content={note.content}
            todos={note.todos}
            color={note.color}
          />
        ))}
      </section>

      <button className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-2xl text-xl">
        +
      </button>
    </main>
  );
}
