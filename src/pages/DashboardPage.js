import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, getDoc, collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { getNextSessionRecommendation, getRandomWorkoutSplit, aiRecommendationInfo } from "../utils/aiLogic";
import { Container, Box, Typography, Button, List, ListItem, ListItemText, Alert, Card, CardContent, Grid, Paper, Avatar, Grow, Fade, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import BoltIcon from "@mui/icons-material/Bolt";
import EditIcon from "@mui/icons-material/Edit";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useTheme } from '@mui/material/styles';

export default function DashboardPage() {
  const [profile, setProfile] = useState({});
  const [lastWorkout, setLastWorkout] = useState(null);
  const [todayMeals, setTodayMeals] = useState([]);
  const [calorieTarget, setCalorieTarget] = useState(2000);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [workoutSplit, setWorkoutSplit] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();

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
    setWorkoutSplit(getRandomWorkoutSplit());
  }, []);

  const totalCalories = todayMeals.reduce((sum, m) => sum + Number(m.calories || 0), 0);

  return (
    <Box sx={{ minHeight: '100vh', background: theme.palette.background.default, py: 4 }}>
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
                Your personal fitness dashboard
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
        {/* Quadrant Grid Section */}
        <Grid container spacing={3} sx={{ height: { xs: 'auto', md: 480 }, mb: 2 }}>
          <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', height: { md: '50%' } }}>
            <Card elevation={2} sx={{ flex: 1, borderRadius: 4, display: 'flex', flexDirection: 'column', justifyContent: 'center', p: 3, mb: { xs: 2, md: 0 }, boxShadow: '0 2px 12px 0 #e3e8f0', transition: '0.2s', '&:hover': { boxShadow: '0 4px 24px 0 #cfd8dc', transform: 'translateY(-2px)' } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}><EmojiEventsIcon /></Avatar>
                <Typography variant="h6" color="primary" fontWeight={700}>Profile</Typography>
              </Box>
              <Typography color="text.secondary">Current Weight</Typography>
              <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>{profile.weight} kg</Typography>
              <Typography color="text.secondary">Goal Weight</Typography>
              <Typography variant="h6" fontWeight={600}>{profile.goalWeight} kg</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', height: { md: '50%' } }}>
            <Card elevation={2} sx={{ flex: 1, borderRadius: 4, display: 'flex', flexDirection: 'column', justifyContent: 'center', p: 3, mb: { xs: 2, md: 0 }, boxShadow: '0 2px 12px 0 #e3e8f0', transition: '0.2s', '&:hover': { boxShadow: '0 4px 24px 0 #cfd8dc', transform: 'translateY(-2px)' } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}><RestaurantIcon /></Avatar>
                <Typography variant="h6" color="secondary" fontWeight={700}>Calories Today</Typography>
              </Box>
              <Typography variant="h5" fontWeight={700}>{totalCalories} / {calorieTarget}</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', height: { md: '50%' } }}>
            <Card elevation={2} sx={{ flex: 1, borderRadius: 4, display: 'flex', flexDirection: 'column', justifyContent: 'center', p: 3, boxShadow: '0 2px 12px 0 #e3e8f0', transition: '0.2s', '&:hover': { boxShadow: '0 4px 24px 0 #cfd8dc', transform: 'translateY(-2px)' } }}>
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
            </Card>
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', height: { md: '50%' } }}>
            <Card elevation={2} sx={{ flex: 1, borderRadius: 4, display: 'flex', flexDirection: 'column', justifyContent: 'center', p: 3, boxShadow: '0 2px 12px 0 #e3e8f0', transition: '0.2s', '&:hover': { boxShadow: '0 4px 24px 0 #cfd8dc', transform: 'translateY(-2px)' } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}><BoltIcon /></Avatar>
                <Typography variant="h6" color="info.main" fontWeight={700} sx={{ flex: 1 }}>Recommendation</Typography>
                <IconButton onClick={() => setInfoOpen(true)} color="info" size="small"><InfoOutlinedIcon /></IconButton>
              </Box>
              {lastWorkout ? (
                <List>
                  {getNextSessionRecommendation(lastWorkout, profile).map((ex, i) => (
                    <ListItem key={i}>
                      <ListItemText
                        primary={ex.name + ': ' + (ex.suggestion ? `${ex.weight}kg (${ex.suggestion})` : `${ex.weight}kg (suggested)`)}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : <Typography color="text.secondary">Log a workout to get recommendations.</Typography>}
              {workoutSplit && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle1" fontWeight={700} color="info.main">Suggested Workout: {workoutSplit.name}</Typography>
                  <List>
                    {workoutSplit.exercises.map((ex, i) => (
                      <ListItem key={i}><ListItemText primary={ex} /></ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </Card>
          </Grid>
        </Grid>
        <Dialog open={infoOpen} onClose={() => setInfoOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>How Recommendations Work</DialogTitle>
          <DialogContent>
            <Typography whiteSpace="pre-line">{aiRecommendationInfo}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setInfoOpen(false)} color="primary">Close</Button>
          </DialogActions>
        </Dialog>
        {error && (
          <Box sx={{ mt: 3 }}><Alert severity="error">{error}</Alert></Box>
        )}
      </Container>
    </Box>
  );
} 