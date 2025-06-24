import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, getDoc, collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { getNextSessionRecommendation } from "../utils/aiLogic";
import { Container, Box, Typography, Button, Divider, List, ListItem, ListItemText, Alert, Card, CardContent, Grid, Paper } from "@mui/material";

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
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom fontWeight={700}>Dashboard</Typography>
        </Grid>
        {error && (
          <Grid item xs={12}><Alert severity="error">{error}</Alert></Grid>
        )}
        <Grid item xs={12} md={4}>
          <Card elevation={3} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom>Profile</Typography>
              <Typography>Current Weight: <b>{profile.weight} kg</b></Typography>
              <Typography>Goal Weight: <b>{profile.goalWeight} kg</b></Typography>
            </CardContent>
          </Card>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom>Calories Today</Typography>
              <Typography>{totalCalories} / {calorieTarget}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" color="primary" gutterBottom>Quick Actions</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Button variant="contained" color="primary" sx={{ transition: '0.2s', fontWeight: 600 }} onClick={() => navigate("/workout-log")}>Log Workout</Button>
              <Button variant="contained" color="secondary" sx={{ transition: '0.2s', fontWeight: 600 }} onClick={() => navigate("/food-log")}>Log Food</Button>
              <Button variant="outlined" sx={{ transition: '0.2s', fontWeight: 600 }} onClick={() => navigate("/workout-history")}>Workout History</Button>
              <Button variant="outlined" sx={{ transition: '0.2s', fontWeight: 600 }} onClick={() => navigate("/chat")}>Chat Coach</Button>
            </Box>
          </Paper>
          <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" color="primary" gutterBottom>Last Workout</Typography>
            {lastWorkout ? (
              <List>
                <ListItem><ListItemText primary={`Date: ${lastWorkout.date}`} /></ListItem>
                {lastWorkout.exercises.map((ex, i) => (
                  <ListItem key={i}><ListItemText primary={`${ex.name}: ${ex.weight}kg x ${ex.reps} x ${ex.sets}`} /></ListItem>
                ))}
              </List>
            ) : <Typography color="text.secondary">No workouts logged yet.</Typography>}
          </Paper>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" color="primary" gutterBottom>AI Recommendation for Next Session</Typography>
            {lastWorkout ? (
              <List>
                {getNextSessionRecommendation(lastWorkout).map((ex, i) => (
                  <ListItem key={i}><ListItemText primary={`${ex.name}: ${ex.weight}kg x ${ex.reps} x ${ex.sets}`} /></ListItem>
                ))}
              </List>
            ) : <Typography color="text.secondary">Log a workout to get recommendations.</Typography>}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
} 