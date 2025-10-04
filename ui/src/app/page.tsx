"use client";

import { useState } from "react";
import {getHealth} from "@/api/app.api";

export default function Home() {
  const [message, setMessage] = useState("Click the button");

  async function callAPI() {
    try {
      const res = await getHealth();
      setMessage(`Status: ${res.status}, Region: ${res.region}, Owner: ${res.owner}`);
    } catch (err) {
      setMessage("API call failed");
    }
  }

  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-xl mb-4">AWS Hackathon Demo</h1>
      <button onClick={callAPI} className="p-2 bg-blue-500 text-white rounded">
        Call API
      </button>
      <p className="mt-4">{message}</p>
    </main>
  );
}
