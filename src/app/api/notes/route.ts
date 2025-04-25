// src/app/api/notes/route.ts
import connectDB from "@/lib/connectDB";
import Note from "@/lib/models/Note";

export async function GET() {
  try {
    await connectDB();
    const notes = await Note.find();
    return new Response(JSON.stringify(notes), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching notes:", error);
    return new Response(
      JSON.stringify({ message: "Error fetching notes" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
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
