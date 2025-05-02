
# Sticko - Notes & Todos

Sticko is a web application built using **Next.js**, **TypeScript**, and **Tailwind CSS** that allows users to create, manage, and save notes and todos with an intuitive interface. Sticko also includes AI-powered features to assist with note summarization, text rewriting, translation, and more.

## Features

### 📝 Notes
- Create, edit, and delete notes.
- Organize notes with smart title generation.
- AI-Powered features:
  - **Summarize**: Get a concise summary of your note.
  - **Rewrite**: Reword your note for a more formal or casual tone.
  - **Translate**: Translate your note to a different language (e.g., Hindi, Urdu).
  - **Generate Todo List**: Automatically generate a to-do list from your note.

### ✅ Todos
- Add, edit, and delete todos.
- Mark todos as completed or pending.
- Save todos to a JSON file for backup.

### 🔒 Authentication
- User authentication via JWT (JSON Web Token).
- Secure API routes with token-based authorization.

### 💾 Export Notes and Todos
- Download notes and todos as JSON files for easy backup or import.

### 📱 Mobile Friendly
- Fully responsive design, optimized for both desktop and mobile devices.

---

## Tech Stack

- **Frontend**: Next.js, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, MongoDB (for storing notes and todos)

---

## Setup and Installation

### Prerequisites

- Node.js (>= 16.x)
- MongoDB (for local development or use a cloud provider like MongoDB Atlas)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/sticko.git
cd sticko
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file at the root of the project and add the following environment variables:

```env
NEXT_PUBLIC_GEMINI_API_KEY=your_google_gemini_api_key
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

> You can obtain your **Gemini API Key** from Google Cloud's generative AI platform.

### 4. Run the Development Server

Start the development server with:

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

---


## How to Use

### User Authentication

- To log in, enter your username and password.
- If you are not logged in, the app will redirect you to the login page.

### Adding Notes and Todos

- **Notes**: Go to the "Notes" page, click "Add Note", and start typing.
- **Todos**: Switch to the "Todos" page, add your tasks, and mark them as completed when done.

## File Structure

```bash
.
├── components/        # React components (UI elements)
│   ├── Header.tsx
│   └── NoteCard.tsx
├── pages/             # Next.js pages
│   ├── api/           # API routes (Backend)
│   ├── todos.tsx      # Todos page
│   └── notes.tsx      # Notes page
├── public/            # Static files (images, etc.)
├── styles/            # Tailwind CSS setup
└── utils/             # Utility functions (helpers, hooks)
```

---

## Contributing

We welcome contributions! If you find bugs or want to add new features, feel free to fork the repo and submit a pull request.

---

## License

MIT License. See `LICENSE` for more details.

---

## Author

**Tayyab Khan**  
Built with ❤️  
[My Website](https://justtayyabkhan.vercel.app)
```