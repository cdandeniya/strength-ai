import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, getDoc, collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { getNextSessionRecommendation } from "../utils/aiLogic";
import { Container, Box, Typography, Button, List, ListItem, ListItemText, Alert, Card, CardContent, Grid, Paper, Avatar, Grow, Fade } from "@mui/material";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import BoltIcon from "@mui/icons-material/Bolt";
import EditIcon from "@mui/icons-material/Edit";

export default function DashboardPage() {
  const [profile, setProfile] = useState({});
  const [lastWorkout, setLastWorkout] = useState(null);
  const [todayMeals, setTodayMeals] = useState([]);
  const [calorieTarget, setCalorieTarget] = useState(2000);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);
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
      } finally {
        setLoaded(true);
      }
    };
    fetchData();
  }, []);

  const totalCalories = todayMeals.reduce((sum, m) => sum + Number(m.calories || 0), 0);

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #e3f0ff 100%)', py: 4 }}>
      <Container maxWidth="md">
        {/* Profile Section */}
        <Grow in={loaded} timeout={600}>
          <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, mb: 4, borderRadius: 4, display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap', background: 'rgba(255,255,255,0.95)' }}>
            <Avatar sx={{ width: 80, height: 80, fontSize: 36, bgcolor: 'primary.main' }}>
              {profile.name ? profile.name.charAt(0).toUpperCase() : <EmojiEventsIcon fontSize="large" />}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" fontWeight={800} color="primary.main" sx={{ letterSpacing: 1 }}>
                {profile.name ? profile.name : "Welcome!"}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1 }}>
                Your personal AI-powered fitness dashboard
              </Typography>
              <Grid container spacing={2}>
                <Grid item>
                  <Typography color="text.secondary" fontSize={14}>Current Weight</Typography>
                  <Typography fontWeight={700}>{profile.weight} kg</Typography>
                </Grid>
                <Grid item>
                  <Typography color="text.secondary" fontSize={14}>Goal Weight</Typography>
                  <Typography fontWeight={700}>{profile.goalWeight} kg</Typography>
                </Grid>
                <Grid item>
                  <Typography color="text.secondary" fontSize={14}>Experience</Typography>
                  <Typography fontWeight={700}>{profile.experience || "-"}</Typography>
                </Grid>
              </Grid>
            </Box>
            <Button variant="outlined" startIcon={<EditIcon />} sx={{ borderRadius: 3, fontWeight: 700, px: 3 }} onClick={() => navigate('/profile')}>
              Edit Profile
            </Button>
          </Paper>
        </Grow>
        <Grid container spacing={4}>
          {/* Profile & Calories */}
          <Grid item xs={12} md={4}>
            <Fade in={loaded} timeout={800}>
              <Card elevation={0} sx={{ borderRadius: 4, p: 2, mb: 3, bgcolor: "#f8fafc", boxShadow: '0 2px 12px 0 #e3e8f0', transition: '0.2s', '&:hover': { boxShadow: '0 4px 24px 0 #cfd8dc', transform: 'translateY(-2px)' } }}>
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
            </Fade>
            <Fade in={loaded} timeout={1000}>
              <Card elevation={0} sx={{ borderRadius: 4, p: 2, bgcolor: "#f8fafc", boxShadow: '0 2px 12px 0 #e3e8f0', transition: '0.2s', '&:hover': { boxShadow: '0 4px 24px 0 #cfd8dc', transform: 'translateY(-2px)' } }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}><RestaurantIcon /></Avatar>
                    <Typography variant="h6" color="secondary" fontWeight={700}>Calories Today</Typography>
                  </Box>
                  <Typography variant="h5" fontWeight={700}>{totalCalories} / {calorieTarget}</Typography>
                </CardContent>
              </Card>
            </Fade>
          </Grid>
          {/* Workouts & AI Recommendation */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Fade in={loaded} timeout={1200}>
                  <Card elevation={0} sx={{ borderRadius: 4, p: 2, mb: 2, bgcolor: "#f8fafc", boxShadow: '0 2px 12px 0 #e3e8f0', transition: '0.2s', '&:hover': { boxShadow: '0 4px 24px 0 #cfd8dc', transform: 'translateY(-2px)' } }}>
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
                </Fade>
              </Grid>
              <Grid item xs={12}>
                <Fade in={loaded} timeout={1400}>
                  <Card elevation={0} sx={{ borderRadius: 4, p: 2, bgcolor: "#e3f2fd", boxShadow: '0 2px 12px 0 #b3e5fc', transition: '0.2s', '&:hover': { boxShadow: '0 4px 24px 0 #90caf9', transform: 'translateY(-2px)' } }}>
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
                </Fade>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {error && (
          <Box sx={{ mt: 3 }}><Alert severity="error">{error}</Alert></Box>
        )}
      </Container>
    </Box>
  );
} 