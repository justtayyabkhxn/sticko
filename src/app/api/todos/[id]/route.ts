import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import Todo from "@/lib/models/Todo";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";


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

export async function DELETE(req: NextRequest) {
    await connectDB();
  
    const userId = getUserIdFromToken(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  
    try {
      // Extract todoId from the URL path (assuming the URL is of the format '/api/todos/[todoId]')
      const urlParts = req.nextUrl.pathname.split("/"); 
      const todoId = urlParts[urlParts.length - 1];  // Get the last part as the todoId
  
      if (!todoId || !mongoose.Types.ObjectId.isValid(todoId)) {
        return NextResponse.json({ error: "Invalid Todo ID" }, { status: 400 });
      }
  
      const todo = await Todo.findOne({ _id: todoId, userId: new mongoose.Types.ObjectId(userId) });
  
      if (!todo) {
        return NextResponse.json({ error: "Todo not found" }, { status: 404 });
      }
  
      await Todo.findByIdAndDelete(todoId); // Delete the todo
  
      return NextResponse.json({ message: "Todo deleted successfully" }, { status: 200 });
    } catch (err: any) {
      console.error("Error deleting todo:", err);
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
  }