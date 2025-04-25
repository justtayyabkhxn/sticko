import { connectDB } from "@/lib/connectDB";
import Note from "@/lib/models/Note";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const notes = await Note.find();
  return NextResponse.json(notes);
}

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();
  const newNote = await Note.create(body);
  return NextResponse.json(newNote);
}
