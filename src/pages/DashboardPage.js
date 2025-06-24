import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, getDoc, collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { getNextSessionRecommendation } from "../utils/aiLogic";
import { Container, Box, Typography, Button, Divider, List, ListItem, ListItemText, Alert, Card, CardContent, Grid, Paper, Avatar } from "@mui/material";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import BoltIcon from "@mui/icons-material/Bolt";

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
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      {/* Hero Section */}
      <Paper elevation={0} sx={{ p: { xs: 2, md: 4 }, mb: 4, borderRadius: 4, bgcolor: "#f5f7fa", textAlign: "center" }}>
        <Typography variant="h3" fontWeight={800} color="primary.main" gutterBottom sx={{ letterSpacing: 1 }}>
          Welcome{profile && profile.name ? `, ${profile.name}` : "!"}
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
          Your personal AI-powered fitness dashboard
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap', mt: 2 }}>
          <Button variant="contained" color="primary" size="large" sx={{ borderRadius: 3, fontWeight: 700, boxShadow: 2, transition: '0.2s' }} onClick={() => navigate("/workout-log")}>Log Workout</Button>
          <Button variant="contained" color="secondary" size="large" sx={{ borderRadius: 3, fontWeight: 700, boxShadow: 2, transition: '0.2s' }} onClick={() => navigate("/food-log")}>Log Food</Button>
          <Button variant="outlined" size="large" sx={{ borderRadius: 3, fontWeight: 700, boxShadow: 2, transition: '0.2s' }} onClick={() => navigate("/workout-history")}>Workout History</Button>
          <Button variant="outlined" size="large" sx={{ borderRadius: 3, fontWeight: 700, boxShadow: 2, transition: '0.2s' }} onClick={() => navigate("/chat")}>Chat Coach</Button>
        </Box>
      </Paper>
      <Grid container spacing={4}>
        {/* Profile & Calories */}
        <Grid item xs={12} md={4}>
          <Card elevation={0} sx={{ borderRadius: 4, p: 2, mb: 3, bgcolor: "#f8fafc", boxShadow: '0 2px 12px 0 #e3e8f0' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}><EmojiEventsIcon /></Avatar>
                <Typography variant="h6" color="primary" fontWeight={700}>Profile</Typography>
              </Box>
              <Typography color="text.secondary">Current Weight</Typography>
              <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>{profile.weight} kg</Typography>
              <Typography color="text.secondary">Goal Weight</Typography>
              <Typography variant="h6" fontWeight={600}>{profile.goalWeight} kg</Typography>
            </CardContent>
          </Card>
          <Card elevation={0} sx={{ borderRadius: 4, p: 2, bgcolor: "#f8fafc", boxShadow: '0 2px 12px 0 #e3e8f0' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}><RestaurantIcon /></Avatar>
                <Typography variant="h6" color="secondary" fontWeight={700}>Calories Today</Typography>
              </Box>
              <Typography variant="h5" fontWeight={700}>{totalCalories} / {calorieTarget}</Typography>
            </CardContent>
          </Card>
        </Grid>
        {/* Workouts & AI Recommendation */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card elevation={0} sx={{ borderRadius: 4, p: 2, mb: 2, bgcolor: "#f8fafc", boxShadow: '0 2px 12px 0 #e3e8f0', transition: '0.2s', '&:hover': { boxShadow: '0 4px 24px 0 #cfd8dc' } }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}><FitnessCenterIcon /></Avatar>
                    <Typography variant="h6" color="primary" fontWeight={700}>Last Workout</Typography>
                  </Box>
                  {lastWorkout ? (
                    <List>
                      <ListItem><ListItemText primary={`Date: ${lastWorkout.date}`} /></ListItem>
                      {lastWorkout.exercises.map((ex, i) => (
                        <ListItem key={i}><ListItemText primary={`${ex.name}: ${ex.weight}kg x ${ex.reps} x ${ex.sets}`} /></ListItem>
                      ))}
                    </List>
                  ) : <Typography color="text.secondary">No workouts logged yet.</Typography>}
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card elevation={0} sx={{ borderRadius: 4, p: 2, bgcolor: "#e3f2fd", boxShadow: '0 2px 12px 0 #b3e5fc', transition: '0.2s', '&:hover': { boxShadow: '0 4px 24px 0 #90caf9' } }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}><BoltIcon /></Avatar>
                    <Typography variant="h6" color="info.main" fontWeight={700}>AI Recommendation</Typography>
                  </Box>
                  {lastWorkout ? (
                    <List>
                      {getNextSessionRecommendation(lastWorkout).map((ex, i) => (
                        <ListItem key={i}><ListItemText primary={`${ex.name}: ${ex.weight}kg x ${ex.reps} x ${ex.sets}`} /></ListItem>
                      ))}
                    </List>
                  ) : <Typography color="text.secondary">Log a workout to get recommendations.</Typography>}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {error && (
        <Box sx={{ mt: 3 }}><Alert severity="error">{error}</Alert></Box>
      )}
    </Container>
  );
} 