import { client } from "./client";
import type { HealthResponse, ABTestRequest, ABTestResponse } from "./types";

// Health check
export async function getHealth(): Promise<HealthResponse> {
  try {
    const { data, error } = await client.GET("/health");
    if (error) throw error;
    return data as HealthResponse;
  } catch (err) {
    console.error("Failed to fetch health:", err);
    throw err;
  }
}

// Suggest AB Test
export async function suggestABTest(data: ABTestRequest): Promise<ABTestResponse> {
  try {
    const { data: result, error } = await client.POST("/suggest-ab-test", { body: data });
    if (error) throw error;
    return result as ABTestResponse;
  } catch (err) {
    console.error("Failed to get AB test suggestion:", err);
    throw err;
  }
}
