import  connectDB  from "../../../../lib/connectDB";
import Note from "../../../../lib/models/Note";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const noteId = params.id;
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = decoded.id;

    const body = await req.json();
    const { title, content, todos, color } = body;

    // Ensure the note belongs to the logged-in user
    const existingNote = await Note.findById(noteId);

    if (!existingNote || existingNote.userId.toString() !== userId) {
      return NextResponse.json({ error: "Note not found or unauthorized" }, { status: 403 });
    }

    // Update the note
    const updatedNote = await Note.findByIdAndUpdate(
      noteId,
      { title, content, todos, color },
      { new: true }
    );

    return NextResponse.json(updatedNote);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update note" }, { status: 500 });
  }
}
