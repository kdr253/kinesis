// src/app/customer/page.tsx
"use client";

import { useEffect, useState } from "react";
import { ABTestRequest, ABTestResponse } from "@/api/types";
import { suggestABTest, getHealth } from "@/api/app.api";

export default function CustomerPage() {
  const [suggestion, setSuggestion] = useState<ABTestResponse | null>(null);

  useEffect(() => {
    async function fetchABTest() {
      const request: ABTestRequest = {
        product_id: 101,
        current_position: "bottom shelf",
      };
      const res = await suggestABTest(request);
      setSuggestion(res);
    }
    fetchABTest();
  }, []);

  return (
    <div>
      <h1>Customer Page - AB Test Demo</h1>
      {suggestion ? (
        <div>
          <p>Product ID: {suggestion.product_id}</p>
          <p>Agent Suggestion: {suggestion.suggestion}</p>
        </div>
      ) : (
        <p>Loading suggestion...</p>
      )}
    </div>
  );
}
