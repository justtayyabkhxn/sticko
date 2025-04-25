"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";

export default function NoteEditor({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: () => void;
}) {
  const { data: session } = useSession(); // ✅ moved inside component

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [color, setColor] = useState("#1e1e1e");

  const handleSubmit = async () => {
    if (!session?.user?.id) return;

    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        content,
        color,
        userId: session.user.id,
      }),
    });

    if (res.ok) {
      setTitle("");
      setContent("");
      onSave();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-[#1e1e1e] p-6 rounded-xl w-[90%] max-w-md shadow-2xl">
        <h2 className="text-xl font-bold text-white mb-4">Add a Note</h2>

        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full mb-3 px-4 py-2 rounded bg-zinc-800 text-white"
        />

        <textarea
          placeholder="Write something..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          className="w-full mb-3 px-4 py-2 rounded bg-zinc-800 text-white"
        />

        <div className="flex justify-between items-center">
          <div>
            <label className="text-gray-300 mr-2">Color:</label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </div>
          <div className="space-x-2">
            <button
              className="bg-gray-600 px-4 py-1 rounded text-white"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="bg-blue-600 px-4 py-1 rounded text-white"
              onClick={handleSubmit}
              disabled={!session?.user?.id}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
