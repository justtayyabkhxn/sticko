import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import Todo from "@/lib/models/Todo";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

// Utility to extract userId from token
const getUserIdFromToken = (req: NextRequest): string | null => {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.split(" ")[1];
  if (!token) return null;

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    return decoded.id;
  } catch (error) {
    return null;
  }
};

// POST method to create a new todo
export async function POST(req: NextRequest) {
  await connectDB();
  console.log("Auth Header:", req.headers.get("authorization"));

  const userId = getUserIdFromToken(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { text } = await req.json();

    if (!text || text.trim() === "") {
      return NextResponse.json({ error: "Todo text is required" }, { status: 400 });
    }

    const newTodo = await Todo.create({
      userId: new mongoose.Types.ObjectId(userId),
      text: text.trim(),
      completed: false,
    });

    return NextResponse.json(newTodo, { status: 201 });
  } catch (err: any) {
    console.error("Error creating todo:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// GET method to fetch all todos
export async function GET(req: NextRequest) {
  await connectDB();

  const userId = getUserIdFromToken(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const todos = await Todo.find({ userId: new mongoose.Types.ObjectId(userId) }).sort({ createdAt: -1 });
    return NextResponse.json(todos, { status: 200 });
  } catch (err: any) {
    console.error("Error fetching todos:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// DELETE method to delete a todo

