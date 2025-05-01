import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import Todo from "@/lib/models/Todo";
import mongoose from "mongoose";
import jwt, { JwtPayload } from "jsonwebtoken";

// Define custom token payload type
interface TokenPayload extends JwtPayload {
  id: string;
}

const getUserIdFromToken = (req: NextRequest): string | null => {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.split(" ")[1];
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
    return decoded.id;
  } catch {
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
    const urlParts = req.nextUrl.pathname.split("/");
    const todoId = urlParts[urlParts.length - 1];

    if (!todoId || !mongoose.Types.ObjectId.isValid(todoId)) {
      return NextResponse.json({ error: "Invalid Todo ID" }, { status: 400 });
    }

    const todo = await Todo.findOne({
      _id: todoId,
      userId: new mongoose.Types.ObjectId(userId),
    });

    if (!todo) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    await Todo.findByIdAndDelete(todoId);

    return NextResponse.json(
      { message: "Todo deleted successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error deleting todo:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
