"use client";

import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

type DecodedToken = {
  id: string;
  name: string;
  exp: number;  
};

interface NoteEditorProps {
  onClose: () => void;
  onSave: () => void;
}

export default function NoteEditor({ onClose, onSave }: NoteEditorProps) {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [color, setColor] = useState<string>("#1e1e1e");
  const [user, setUser] = useState<{ id: string; name: string } | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        if (decoded && decoded.id) {
          setUser({ id: decoded.id, name: decoded.name });
        } else {
          console.error("No valid user data in token");
        }
      } catch (err) {
        console.error("Error decoding token", err);
      }
    }
  }, []);

  const handleSubmit = async () => {
    if (!user?.id) {
      setError("You must be logged in to save a note.");
      return;
    }

    setError("");
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
          color,
          userId: user.id,
        }),
      });

      if (!res.ok) {
        const { message } = await res.json();
        setError(message || "Failed to save note");
        return;
      }

      // Clear inputs and tell parent to refresh
      setTitle("");
      setContent("");
      onSave();
      onClose();
    } catch (err) {
      console.error("Save note error:", err);
      setError("An unexpected error occurred");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-[#1e1e1e] p-6 rounded-xl w-[90%] max-w-md shadow-2xl">
        <h2 className="text-xl font-bold text-white mb-4">Add a Note</h2>

        {error && <div className="text-red-400 mb-2">{error}</div>}

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
          <div className="flex items-center gap-2">
            <label className="text-gray-300">Color:</label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="cursor-pointer"
            />
          </div>

          <div className="space-x-2">
            <button
              onClick={onClose}
              className="bg-gray-600 px-4 py-1 rounded text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="bg-blue-600 px-4 py-1 rounded text-white disabled:opacity-50"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
