// components/NoteCard.tsx
type Todo = { text: string; completed: boolean };

export default function NoteCard({
  title,
  content,
  todos,
  color,
}: {
  title: string;
  content?: string;
  todos?: Todo[];
  color?: string;
}) {
  return (
    <div
      className="rounded-2xl p-4 shadow-md break-words"
      style={{ backgroundColor: color || "#1e1e1e" }}
    >
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {content && <p className="text-sm">{content}</p>}

      {todos && todos.length > 0 && (
        <ul className="mt-2 space-y-1">
          {todos.map((todo, idx) => (
            <li key={idx} className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={todo.completed} readOnly />
              <span
                className={todo.completed ? "line-through text-gray-500" : ""}
              >
                {todo.text}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
