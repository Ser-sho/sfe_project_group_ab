"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 px-4">
      <div className="max-w-xl text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-800 mb-6 drop-shadow-sm">
          Welcome to Smart Campus Portal
        </h1>
        <p className="text-lg md:text-xl text-gray-700 mb-8">
          Your all-in-one platform for managing student, lecturer, and admin services with ease.
        </p>
        <button
          onClick={() => router.push("/signin")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition-all duration-200"
        >
          Get Started
        </button>
      </div>
    </main>
  );
}
