// src/app/api/notes/route.ts
import connectDB from "@/lib/connectDB";
import Note from "@/lib/models/Note";
import jwt from "jsonwebtoken";


export async function GET(req: Request) {
  try {
    await connectDB();

    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = (decoded as any).id;

    const userNotes = await Note.find({ userId });

    return new Response(JSON.stringify(userNotes), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify([]), { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    if (!body.title || !body.content || !body.userId) {
      return new Response(
        JSON.stringify({ message: "Missing required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const newNote = await Note.create(body);
    return new Response(JSON.stringify(newNote), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error saving note:", error);
    return new Response(
      JSON.stringify({ message: "Error saving note" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
