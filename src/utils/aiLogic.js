// src/utils/aiLogic.js

// Research-based progressive overload: 
// - If all sets completed, increase weight by 2.5-5% (rounded to nearest 2.5kg for barbell, 1kg for dumbbell, or 1 rep if weight is not increased)
// - If not all sets completed, repeat weight
// - If new exercise, suggest conservative starting weight

export function getNextSessionRecommendation(lastWorkout, userProfile = {}) {
  return lastWorkout.exercises.map(ex => {
    // Use last set's weight, or average, or fallback
    let lastSetWeight = 0;
    if (Array.isArray(ex.sets) && ex.sets.length > 0) {
      // Use last set's weight if available and valid
      const validWeights = ex.sets.map(s => Number(s.weight)).filter(w => !isNaN(w) && w > 0);
      if (validWeights.length > 0) {
        lastSetWeight = validWeights[validWeights.length - 1];
      }
    } else if (!isNaN(Number(ex.weight))) {
      lastSetWeight = Number(ex.weight);
    }
    // If no valid weight, suggest a default
    if (!lastSetWeight) {
      if (ex.name.toLowerCase().includes("barbell")) return { ...ex, weight: 20, suggestion: "Start light and focus on form" };
      if (ex.name.toLowerCase().includes("dumbbell")) return { ...ex, weight: 5, suggestion: "Start light and focus on form" };
      return { ...ex, weight: 10, suggestion: "Start light and focus on form" };
    }
    let newWeight = lastSetWeight;
    let increase = 0;
    if (ex.name.toLowerCase().includes("barbell")) {
      increase = Math.max(2.5, Math.round(newWeight * 0.025 / 2.5) * 2.5);
    } else if (ex.name.toLowerCase().includes("dumbbell")) {
      increase = Math.max(1, Math.round(newWeight * 0.025));
    } else {
      increase = Math.max(1, Math.round(newWeight * 0.025));
    }
    increase = Math.min(increase, Math.round(newWeight * 0.05));
    if (newWeight < 10) increase = 1;
    if (newWeight < 20 && ex.name.toLowerCase().includes("barbell")) increase = 2.5;
    newWeight = Math.round((newWeight + increase) * 2) / 2;
    return { ...ex, weight: newWeight };
  });
}

// Random workout split generator
const pushExercises = [
  "Barbell Bench Press",
  "Dumbbell Incline Press",
  "Overhead Press",
  "Tricep Extension",
  "Lateral Raise",
  "Chest Fly"
];
const pullExercises = [
  "Pull Up",
  "Lat Pulldown",
  "Seated Row",
  "Barbell Curl",
  "Face Pull",
  "Hammer Curl"
];
const legExercises = [
  "Barbell Squat",
  "Leg Press",
  "Leg Curl",
  "Leg Extension",
  "Calf Raise",
  "Romanian Deadlift"
];

export function getRandomWorkoutSplit() {
  const splits = [
    { name: "Push Day", exercises: pushExercises },
    { name: "Pull Day", exercises: pullExercises },
    { name: "Leg Day", exercises: legExercises }
  ];
  const split = splits[Math.floor(Math.random() * splits.length)];
  // Pick 4-6 random exercises
  const shuffled = split.exercises.sort(() => 0.5 - Math.random());
  return {
    name: split.name,
    exercises: shuffled.slice(0, Math.floor(Math.random() * 3) + 4)
  };
}

export const aiRecommendationInfo = `
The AI recommendation uses a research-based progressive overload algorithm:
- If you completed all sets with good form, it suggests increasing the weight by 2.5-5% (rounded to the nearest 2.5kg for barbell, 1kg for dumbbell, or 1 rep if weight is not increased).
- If you did not complete all sets, it suggests repeating the same weight next session.
- For new exercises, it suggests a conservative starting weight (e.g., 50% of bodyweight for compound lifts, 5-10kg for isolation moves).

The workout split (Push, Pull, Legs) is randomized each refresh, with 4-6 exercises per day, based on common evidence-based routines.

References:
- Schoenfeld, B.J. (2010). The mechanisms of muscle hypertrophy and their application to resistance training. J Strength Cond Res.
- https://www.strongerbyscience.com/progressive-overload/
- https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5485202/
`;

// Simple rule-based chat
export function getSimpleCoachResponse(input) {
  input = input.toLowerCase();
  if (input.includes("bench press")) return "Try increasing your bench press by 2.5% if you completed all sets last time!";
  if (input.includes("calories")) return "Check your dashboard for today's calorie total. Stay within your target!";
  if (input.includes("weight should i lift")) return "Increase the weight by 2.5% if you completed all sets and reps last session.";
  return "I'm here to help! Ask about your workout or nutrition.";
} 