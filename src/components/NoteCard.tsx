"use client";

import { useState } from "react";
import { X } from "lucide-react"; // For close icon

type Todo = { text: string; completed: boolean };

export default function NoteCard({
  id,
  title,
  content,
  todos,
  color,
  onSave, // ✅ New prop
}: {
  id: string;
  title: string;
  content?: string;
  todos?: Todo[];
  color?: string;
  onSave: () => void; // ✅ New prop type
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedContent, setEditedContent] = useState(content || "");
  const [editedTodos, setEditedTodos] = useState<Todo[]>(todos || []);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <>
      {/* Note Card */}
      <div
        className="rounded-2xl p-4 shadow-md break-words cursor-pointer transition-transform hover:scale-105"
        onClick={openModal}
        style={{
          backgroundColor: color || "#1e1e1e",
          minHeight: "180px", // small minimum height for empty notes
          overflow: "visible", // allow natural growth
        }} 
      >
        <h3 className="text-lg font-semibold mb-1 text-white truncate">
          {title}
        </h3>
        {content && (
          <p className="text-sm text-gray-300 line-clamp-4">{content}</p>
        )}
        {todos && todos.length > 0 && (
          <ul className="mt-2 space-y-1 text-sm text-white">
            {todos.slice(0, 3).map((todo, idx) => (
              <li key={idx} className="flex gap-2">
                <input type="checkbox" checked={todo.completed} readOnly />
                <span
                  className={todo.completed ? "line-through text-gray-400" : ""}
                >
                  {todo.text}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Modal Editor */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 px-4">
          <div className="bg-[#1e1e1e] rounded-2xl w-full max-w-md p-6 text-white relative shadow-xl space-y-4">
            <button
              className="absolute top-4 right-4 text-gray-300 hover:text-white cursor-pointer"
              onClick={closeModal}
            >
              <X size={20} color={"red"} />
            </button>

            <input
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              placeholder="Title"
              className="w-full bg-transparent border-b border-gray-500 text-lg font-bold outline-none"
            />

            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              placeholder="Add your notes..."
              className="w-full bg-transparent text-sm outline-none resize-none h-32"
            />

            <div className="space-y-2">
              {editedTodos.map((todo, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => {
                      const updatedTodos = [...editedTodos];
                      updatedTodos[idx].completed =
                        !updatedTodos[idx].completed;
                      setEditedTodos(updatedTodos);
                    }}
                  />
                  <input
                    value={todo.text}
                    onChange={(e) => {
                      const updatedTodos = [...editedTodos];
                      updatedTodos[idx].text = e.target.value;
                      setEditedTodos(updatedTodos);
                    }}
                    className={`bg-transparent outline-none w-full ${
                      todo.completed ? "line-through text-gray-400" : ""
                    }`}
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={closeModal}
                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    const res = await fetch(`/api/notes/${id}`, {
                      method: "PATCH",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem(
                          "token"
                        )}`,
                      },
                      body: JSON.stringify({
                        title: editedTitle,
                        content: editedContent,
                        todos: editedTodos,
                        color,
                      }),
                    });

                    if (!res.ok) {
                      throw new Error("Failed to update note");
                    }

                    onSave(); // ✅ Re-fetch notes after saving
                    closeModal(); // ✅ Close modal
                  } catch (err) {
                    console.error(err);
                    alert("Error updating note");
                  }
                }}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm cursor-pointer"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
