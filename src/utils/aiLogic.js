// src/utils/aiLogic.js

export function getNextSessionRecommendation(lastWorkout) {
  // For each exercise, if all sets/reps completed, increase weight by 2.5%
  return lastWorkout.exercises.map(ex => {
    let newWeight = Number(ex.weight);
    // For MVP, assume all sets/reps completed
    newWeight = Math.round(newWeight * 1.025 * 2) / 2; // round to nearest 0.5
    return { ...ex, weight: newWeight };
  });
}

// Simple rule-based chat
export function getSimpleCoachResponse(input) {
  input = input.toLowerCase();
  if (input.includes("bench press")) return "Try increasing your bench press by 2.5% if you completed all sets last time!";
  if (input.includes("calories")) return "Check your dashboard for today's calorie total. Stay within your target!";
  if (input.includes("weight should i lift")) return "Increase the weight by 2.5% if you completed all sets and reps last session.";
  return "I'm here to help! Ask about your workout or nutrition.";
} 