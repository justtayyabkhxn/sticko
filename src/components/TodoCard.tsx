type TodoCardProps = {
    todo: { _id: string; text: string; completed: boolean };
    onSave: () => void;
  };
  
  export default function TodoCard({ todo, onSave }: TodoCardProps) {
    const toggleCompletion = async () => {
      const token = localStorage.getItem("token");
  
      try {
        const res = await fetch(`/api/todos/${todo._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            completed: !todo.completed,
          }),
        });
  
        if (res.ok) {
          onSave(); // Refresh todos list
        }
      } catch (err) {
        console.error("Error toggling completion:", err);
      }
    };
  
    const deleteTodo = async () => {
      const token = localStorage.getItem("token");
  
      try {
        const res = await fetch(`/api/todos/${todo._id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (res.ok) {
          onSave(); // Refresh todos list
        }
      } catch (err) {
        console.error("Error deleting todo:", err);
      }
    };
  
    return (
      <div className="bg-gray-800 p-4 rounded-md">
        <div className="flex justify-between items-center">
          <p
            className={`text-white ${todo.completed ? "line-through" : ""}`}
          >
            {todo.text}
          </p>
          <div className="flex gap-2">
            <button
              onClick={toggleCompletion}
              className={`bg-green-500 text-white px-2 py-1 rounded-md cursor-pointer`}
            >
              {todo.completed ? "Undo" : "Complete"}
            </button>
            <button
              onClick={deleteTodo}
              className="bg-red-600 text-white px-2 py-1 rounded-md cursor-pointer"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  }
  