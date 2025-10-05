
"use client";

import { useState } from "react";
import Input from "../../components/Input";
import TypingLoader from "../../components/TypingLoader";
import { getDietPlanApi } from "../../api/app.api";
import type { components } from "../../api/schema";

type UserDietRequest = components["schemas"]["UserDietRequest"];
type DietPlan = components["schemas"]["DayPlan"];

async function getDietPlan(formData: Record<string, string>): Promise<DietPlan[]> {
  const req: UserDietRequest = {
    height: Number(formData.height),
    weight: Number(formData.weight),
    food_preference: formData.foodPreference,
    allergens: formData.allergies,
    medical_conditions: formData.medical,
    budget: Number(formData.budget),
    target: "weight_loss", // or use a field if present
  };
  const res = await getDietPlanApi(req);
  return res.week_plan;
}

export default function Page() {
  const [selectedDay, setSelectedDay] = useState("Mon");
  const [agentVisible, setAgentVisible] = useState(true);
  const [loading, setLoading] = useState(false);
  const [dietPlan, setDietPlan] = useState<DietPlan[]>([]);
  const [formData, setFormData] = useState({
    height: "",
    weight: "",
    allergies: "",
    foodPreference: "",
    budget: "",
    medical: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleGenerate = async () => {
    setLoading(true);
    setAgentVisible(true);
    setDietPlan([]);
    setError(null);
    try {
      const plan = await getDietPlan(formData);
      console.log("DietPlan from API:", plan);
      setDietPlan(plan);
    } catch (err: Error | unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch diet plan";
      setError(errorMessage);
      setDietPlan([]);
    }
    setLoading(false);
  };

  const selectedPlan = dietPlan.find((p) => p.day === selectedDay);

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center py-10 font-mono">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="border border-zinc-800 bg-zinc-900/70 rounded-2xl shadow-2xl backdrop-blur-md overflow-hidden p-6">
          {/* 🧍 User Input Form */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-zinc-300">
              User Information
            </h2>
            <div className="space-y-3">
              <Input
                label="Height (cm)"
                value={formData.height}
                onChange={(v) => handleChange("height", v)}
              />
              <Input
                label="Weight (kg)"
                value={formData.weight}
                onChange={(v) => handleChange("weight", v)}
              />
              <Input
                label="Allergies"
                value={formData.allergies}
                onChange={(v) => handleChange("allergies", v)}
              />
              <Input
                label="Food Preference"
                value={formData.foodPreference}
                onChange={(v) => handleChange("foodPreference", v)}
              />
              <Input
                label="Budget (¥ per week)"
                value={formData.budget}
                onChange={(v) => handleChange("budget", v)}
              />
              <Input
                label="Medical Conditions"
                value={formData.medical}
                onChange={(v) => handleChange("medical", v)}
              />
            </div>
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white px-5 py-2 rounded-lg font-semibold transition"
            >
              {loading ? "Generating..." : "Generate Weekly Plan"}
            </button>
          </div>
          
          {/* 💭 Agent Thoughts Panel */}
          <div className="flex flex-col space-y-3 mt-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-zinc-300">
                Agent Thoughts
              </h2>
              <button
                onClick={() => setAgentVisible(!agentVisible)}
                className="text-sm text-zinc-400 hover:text-emerald-400"
              >
                {agentVisible ? "Hide" : "Show"}
              </button>
            </div>
            {agentVisible && (
              <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-4 h-60 overflow-y-auto text-sm leading-relaxed">
                {loading ? (
                  <TypingLoader />
                ) : dietPlan.length > 0 ? (
                  <p>
                    ✅ Analysis complete. Generated a plan based on height {formData.height}cm, weight {formData.weight}kg, and {formData.foodPreference} diet preference.
                  </p>
                ) : (
                  <p>
                    Provide your details and click &quot;Generate Weekly Plan&quot; to see results.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Diet Plan */}
        <div className="border border-zinc-800 bg-zinc-900/70 rounded-2xl shadow-2xl backdrop-blur-md overflow-hidden p-6">
          <div className="space-y-4">
            {error && (
              <p className="text-red-400 text-sm">Error: {error}</p>
            )}
            {!dietPlan.length && !loading && !error && (
              <p className="text-zinc-500 text-sm">
                No plan yet. Please generate one on the left.
              </p>
            )}
            {loading && <p className="text-emerald-400">Generating plan...</p>}
            
            {/* Only show days and plan after we have data */}
            {dietPlan.length > 0 && (
              <div className="space-y-4">
                {/* Day selector tabs */}
                <div className="flex overflow-x-auto bg-gradient-to-r from-emerald-500 to-indigo-500 p-1 rounded-lg">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                    <button
                      key={day}
                      onClick={() => setSelectedDay(day)}
                      className={`flex-1 px-4 py-2 font-semibold rounded-lg transition ${
                        selectedDay === day
                          ? "bg-white text-zinc-900"
                          : "text-white hover:bg-white/20"
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>

                {/* Selected day's meal plan */}
                {selectedPlan && (
                  <>
                    <h2 className="text-lg font-semibold text-zinc-300 mb-4">
                      {selectedDay} — Diet Plan
                    </h2>
                    <p className="text-sm text-zinc-400 mb-4">
                      Meals per day: {selectedPlan.mealsPerDay} | Target calories: {selectedPlan.targetCalories} kcal
                    </p>
                    <div className="space-y-4">
                      {selectedPlan.meals.map((meal) => (
                        <div
                          key={meal.name}
                          className="bg-zinc-800/40 border border-zinc-700 rounded-xl p-4 flex justify-between items-start hover:bg-zinc-800/60 transition"
                        >
                          <div>
                            <h3 className="font-semibold">{meal.name}</h3>
                            <p className="text-sm text-zinc-400">{meal.time}</p>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {meal.items.map((item) => (
                                <span
                                  key={item}
                                  className="bg-zinc-700/50 text-xs px-2 py-1 rounded-lg"
                                >
                                  {item}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-emerald-400 font-semibold">
                              {meal.calories} cal
                            </p>
                            <p className="text-xs text-zinc-400 mt-1">
                              P: {meal.macros.protein}g | C: {meal.macros.carbs}g | F: {meal.macros.fat}g
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}