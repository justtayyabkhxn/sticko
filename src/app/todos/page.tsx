"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Todo = {
  _id: string;
  text: string;
  completed: boolean;
};

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      fetchTodos();
    }
  }, [router]);

  const fetchTodos = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("/api/todos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (Array.isArray(data)) {
        setTodos(data);
      } else {
        console.error("Expected array but got:", data);
        setTodos([]);
      }
    } catch (err) {
      console.error("Error fetching todos:", err);
      setTodos([]);
    }
  };

  const handleAddTodo = async () => {
    const token = localStorage.getItem("token");
    if (!newTodo.trim()) return;

    try {
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: newTodo }),
      });

      if (res.ok) {
        setNewTodo("");
        fetchTodos();
      }
    } catch (err) {
      console.error("Failed to add todo:", err);
    }
  };

  const handleToggleComplete = async (id: string) => {
    const token = localStorage.getItem("token");

    try {
      await fetch(`/api/todos/${id}/toggle`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchTodos();
    } catch (err) {
      console.error("Failed to toggle todo:", err);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    const token = localStorage.getItem("token");
  
    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (res.ok) {
        fetchTodos(); // Refresh the todos list after deletion
      } else {
        const data = await res.json();
        console.error("Failed to delete todo:", data.message);
      }
    } catch (err) {
      console.error("Error deleting todo:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  // 💾 Save todos to JSON file
  const handleSaveTodos = () => {
    const json = JSON.stringify(todos, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `sticko-todos-${Date.now()}.json`;
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <main className="flex flex-col min-h-screen p-4 bg-[#121212] text-gray-200">
      <header className="flex flex-col sm:flex-row justify-between items-center mb-6 p-4 gap-4">
        <h1 className="text-3xl font-bold text-white">📝 Sticko - Todos</h1>
        <div className="flex gap-4">
          <Link
            href="/"
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
            onClick={handleSaveTodos}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md shadow-lg cursor-pointer font-bold"
          >
            Save Todos
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md shadow-lg cursor-pointer font-bold"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Input section */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new todo..."
          className="flex-grow px-4 py-2 rounded-md bg-gray-800 text-white focus:outline-none"
        />
        <button
          onClick={handleAddTodo}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-white font-bold cursor-pointer"
        >
          Add
        </button>
      </div>

      {/* Todos list */}
      <section className="flex flex-wrap gap-4 justify-start items-center">
        {todos.length === 0 ? (
          <p className="text-gray-400 col-span-full">No todos found.</p>
        ) : (
          todos.map((todo) => (
            <div
              key={todo._id}
              className={`cursor-pointer p-4 rounded-md shadow bg-gray-800 transition-all duration-200 hover:bg-gray-700 w-full sm:w-auto ${
                todo.completed ? "line-through text-gray-500" : ""
              }`}
            >
              <div className="flex justify-between items-center">
                <div
                  onClick={() => handleToggleComplete(todo._id)}
                  className="flex-grow"
                >
                  {todo.text}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteTodo(todo._id);
                  }}
                  className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-md ml-4"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </section>

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
