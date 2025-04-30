import { useState } from "react";
import { X, Pin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Todo = { text: string; completed: boolean };

export default function NoteCard({
  id,
  title,
  content,
  todos,
  color,
  onSave,
  pinned = false,
}: {
  id: string;
  title: string;
  content?: string;
  todos?: Todo[];
  color?: string;
  onSave: () => void;
  pinned?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedContent, setEditedContent] = useState(content || "");
  const [editedTodos, setEditedTodos] = useState<Todo[]>(todos || []);
  const [isPinned, setIsPinned] = useState(pinned);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  // 🔁 Toggle Pin and send API request immediately
  const togglePin = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent modal from opening

    const updatedPinStatus = !isPinned;
    setIsPinned(updatedPinStatus); // Optimistic UI update

    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ pinned: updatedPinStatus }),
      });

      if (!res.ok) throw new Error("Failed to update pin status");
      onSave(); // Refresh notes list
    } catch (err) {
      console.error("Error updating pin:", err);
      alert("Could not update pin status");
      setIsPinned(!updatedPinStatus); // Rollback if error
    }
  };

  return (
    <>
      {/* Note Card */}
      <div
        className="rounded-2xl p-4 shadow-md break-words cursor-pointer transition-transform hover:scale-105 h-[30px]"
        onClick={openModal}
        style={{
          backgroundColor: color || "#1e1e1e",
          minHeight: "180px",
          overflow: "visible",
        }}
      >
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold mb-1 text-white truncate">
            {title}
          </h3>
          <Pin
            size={16}
            className={`text-white transition ${
              isPinned ? "rotate-45 fill-white" : "opacity-50"
            }`}
            onClick={togglePin}
          />
        </div>
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

      {/* Modal with Animation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 px-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-[#1e1e1e] rounded-2xl w-full max-w-md p-6 text-white relative shadow-xl space-y-4 h-[700px]"
            >
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
                className="w-full bg-transparent border-b-3 border-gray-500 text-3xl font-bold outline-none"
              />

              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                placeholder="Add your notes..."
                className="w-full bg-transparent border-b-3 border-gray-500 text-sm outline-none resize-none h-[500px]"
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
                  className="px-4 py-1 bg-gray-700 hover:bg-gray-600 rounded font-bold text-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    try {
                      const res = await fetch(`/api/notes/${id}`, {
                        method: "DELETE",
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: `Bearer ${localStorage.getItem(
                            "token"
                          )}`,
                        },
                      });

                      if (!res.ok) throw new Error("Failed to delete note");

                      onSave();
                      closeModal();
                    } catch (err) {
                      console.error(err);
                      alert("Error deleting note");
                    }
                  }}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm cursor-pointer font-bold"
                >
                  Delete
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
                          pinned: isPinned, // ⬅️ include in update
                        }),
                      });

                      if (!res.ok) throw new Error("Failed to update note");

                      onSave();
                      closeModal();
                    } catch (err) {
                      console.error(err);
                      alert("Error updating note");
                    }
                  }}
                  className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded font-bold text-sm cursor-pointer"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
