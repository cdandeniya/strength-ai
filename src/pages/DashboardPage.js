import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, getDoc, collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { getNextSessionRecommendation } from "../utils/aiLogic";
import { Container, Box, Typography, Button, Divider, List, ListItem, ListItemText, Alert } from "@mui/material";

export default function DashboardPage() {
  const [profile, setProfile] = useState({});
  const [lastWorkout, setLastWorkout] = useState(null);
  const [todayMeals, setTodayMeals] = useState([]);
  const [calorieTarget, setCalorieTarget] = useState(2000);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRef = doc(db, "users", auth.currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setProfile(userSnap.data().profile || {});
          setCalorieTarget(userSnap.data().profile?.calorieTarget || 2000);
        }
        // Last workout
        const workoutsRef = collection(db, "users", auth.currentUser.uid, "workouts");
        const q = query(workoutsRef, orderBy("date", "desc"), limit(1));
        const workoutSnap = await getDocs(q);
        if (!workoutSnap.empty) setLastWorkout(workoutSnap.docs[0].data());
        // Today's meals
        const mealsRef = collection(db, "users", auth.currentUser.uid, "meals");
        const today = new Date().toISOString().slice(0, 10);
        const mealsSnap = await getDocs(mealsRef);
        setTodayMeals(mealsSnap.docs.map(doc => doc.data()).filter(m => m.date === today));
      } catch (e) {
        setError("Failed to load dashboard data");
      }
    };
    fetchData();
  }, []);

  const totalCalories = todayMeals.reduce((sum, m) => sum + Number(m.calories || 0), 0);

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 6 }}>
        <Typography variant="h4" gutterBottom>Dashboard</Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <Typography>Current Weight: {profile.weight} kg</Typography>
        <Typography>Goal Weight: {profile.goalWeight} kg</Typography>
        <Typography>Calories Today: {totalCalories} / {calorieTarget}</Typography>
        <Box sx={{ my: 2 }}>
          <Button variant="contained" sx={{ mr: 1 }} onClick={() => navigate("/workout-log")}>Log Workout</Button>
          <Button variant="contained" sx={{ mr: 1 }} onClick={() => navigate("/food-log")}>Log Food</Button>
          <Button variant="outlined" sx={{ mr: 1 }} onClick={() => navigate("/workout-history")}>Workout History</Button>
          <Button variant="outlined" onClick={() => navigate("/chat")}>Chat Coach</Button>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6">Last Workout:</Typography>
        {lastWorkout ? (
          <List>
            <ListItem><ListItemText primary={`Date: ${lastWorkout.date}`} /></ListItem>
            {lastWorkout.exercises.map((ex, i) => (
              <ListItem key={i}><ListItemText primary={`${ex.name}: ${ex.weight}kg x ${ex.reps} x ${ex.sets}`} /></ListItem>
            ))}
          </List>
        ) : <Typography>No workouts logged yet.</Typography>}
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6">AI Recommendation for Next Session:</Typography>
        {lastWorkout ? (
          <List>
            {getNextSessionRecommendation(lastWorkout).map((ex, i) => (
              <ListItem key={i}><ListItemText primary={`${ex.name}: ${ex.weight}kg x ${ex.reps} x ${ex.sets}`} /></ListItem>
            ))}
          </List>
        ) : <Typography>Log a workout to get recommendations.</Typography>}
      </Box>
    </Container>
  );
} 