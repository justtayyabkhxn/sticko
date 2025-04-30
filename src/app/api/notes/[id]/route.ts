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

    const noteId = req.nextUrl.pathname.split("/")[3]; // `/api/notes/[id]`
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    const userId = decoded.id;

    const body = await req.json();
    const { title, content, todos, color, pinned } = body; // ✅ Include pinned

    // Ensure the note belongs to the logged-in user
    const existingNote = await Note.findById(noteId);

    if (!existingNote || existingNote.userId.toString() !== userId) {
      return NextResponse.json(
        { error: "Note not found or unauthorized" },
        { status: 403 }
      );
    }

    // Update the note
    const updatedNote = await Note.findByIdAndUpdate(
      noteId,
      { title, content, todos, color, pinned }, // ✅ Add pinned to update
      { new: true }
    );

    return NextResponse.json(updatedNote);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to update note" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    await connectDB();

    const url = new URL(req.url);
    const id = url.pathname.split("/").pop(); // Extract the ID from the URL

    if (!id) {
      return new Response(JSON.stringify({ message: "Note ID missing" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const deletedNote = await Note.findByIdAndDelete(id);

    if (!deletedNote) {
      return new Response(JSON.stringify({ message: "Note not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ message: "Note deleted successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error deleting note:", error);
    return new Response(JSON.stringify({ message: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
