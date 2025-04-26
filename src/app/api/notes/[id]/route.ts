import connectDB from "../../../../lib/connectDB";
import Note from "../../../../lib/models/Note";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

type DecodedToken = {
  id: string;
  iat: number;
  exp: number;
};

export async function PATCH(req: NextRequest) {
  try {
    await connectDB();

    const noteId = req.nextUrl.pathname.split('/')[3]; // Assuming the ID is in the URL like `/api/notes/[id]`
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
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
