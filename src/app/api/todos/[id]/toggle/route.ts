import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import Todo from "@/lib/models/Todo";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

// Correct approach for dynamic routes
export async function PATCH(req: NextRequest, context: { params: { id: string } }) {
  await connectDB();

  // Await params before accessing them
  const { id: todoId } = await context.params;  // Awaiting params before using

  if (!mongoose.Types.ObjectId.isValid(todoId)) {
    return NextResponse.json({ error: "Invalid Todo ID" }, { status: 400 });
  }

  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    const userId = decoded.id;

    const todo = await Todo.findOne({ _id: todoId, userId });

    if (!todo) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    todo.completed = !todo.completed;
    await todo.save();

    return NextResponse.json(todo, { status: 200 });
  } catch (err) {
    console.error("Error toggling todo:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
