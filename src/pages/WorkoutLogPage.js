import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { Container, Box, Typography, TextField, Button, List, ListItem, ListItemText, Alert, Card, CardContent, Grid, Paper } from "@mui/material";

export default function WorkoutLogPage() {
  const [exercises, setExercises] = useState([]);
  const [exercise, setExercise] = useState({ name: "", weight: "", reps: "", sets: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const addExercise = () => {
    if (!exercise.name || !exercise.weight || !exercise.reps || !exercise.sets) {
      setError("Fill all fields");
      return;
    }
    setExercises([...exercises, exercise]);
    setExercise({ name: "", weight: "", reps: "", sets: "" });
    setError("");
  };

  const saveWorkout = async () => {
    if (exercises.length === 0) {
      setError("Add at least one exercise");
      return;
    }
    const date = new Date().toISOString().slice(0, 10);
    await addDoc(collection(db, "users", auth.currentUser.uid, "workouts"), {
      date,
      exercises,
    });
    navigate("/dashboard");
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h5" fontWeight={700} color="primary" gutterBottom>Log Workout</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField label="Exercise Name" value={exercise.name} onChange={e => setExercise({ ...exercise, name: e.target.value })} fullWidth margin="normal" variant="outlined" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Weight (kg)" value={exercise.weight} onChange={e => setExercise({ ...exercise, weight: e.target.value })} type="number" fullWidth margin="normal" variant="outlined" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Reps" value={exercise.reps} onChange={e => setExercise({ ...exercise, reps: e.target.value })} type="number" fullWidth margin="normal" variant="outlined" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Sets" value={exercise.sets} onChange={e => setExercise({ ...exercise, sets: e.target.value })} type="number" fullWidth margin="normal" variant="outlined" />
            </Grid>
          </Grid>
          <Button variant="outlined" sx={{ mt: 2, fontWeight: 600, transition: '0.2s' }} onClick={addExercise}>Add Exercise</Button>
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          <List sx={{ mt: 2 }}>
            {exercises.map((ex, i) => (
              <ListItem key={i}><ListItemText primary={`${ex.name}: ${ex.weight}kg x ${ex.reps} x ${ex.sets}`} /></ListItem>
            ))}
          </List>
          <Button variant="contained" sx={{ mt: 2, fontWeight: 600, transition: '0.2s' }} onClick={saveWorkout}>Save Workout</Button>
        </CardContent>
      </Card>
    </Container>
  );
} 