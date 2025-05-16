// app/page.tsx
"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Welcome Home</h1>
      <button
        onClick={() => router.push("/signin")}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Go to Sign In
      </button>
    </main>
  );
}
