import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { Container, Box, Typography, TextField, Button, List, ListItem, ListItemText, Alert } from "@mui/material";

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
    <Container maxWidth="sm">
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" gutterBottom>Log Workout</Typography>
        <TextField label="Exercise Name" value={exercise.name} onChange={e => setExercise({ ...exercise, name: e.target.value })} fullWidth margin="normal" />
        <TextField label="Weight (kg)" value={exercise.weight} onChange={e => setExercise({ ...exercise, weight: e.target.value })} type="number" fullWidth margin="normal" />
        <TextField label="Reps" value={exercise.reps} onChange={e => setExercise({ ...exercise, reps: e.target.value })} type="number" fullWidth margin="normal" />
        <TextField label="Sets" value={exercise.sets} onChange={e => setExercise({ ...exercise, sets: e.target.value })} type="number" fullWidth margin="normal" />
        <Button variant="outlined" sx={{ mt: 1 }} onClick={addExercise}>Add Exercise</Button>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        <List>
          {exercises.map((ex, i) => (
            <ListItem key={i}><ListItemText primary={`${ex.name}: ${ex.weight}kg x ${ex.reps} x ${ex.sets}`} /></ListItem>
          ))}
        </List>
        <Button variant="contained" sx={{ mt: 2 }} onClick={saveWorkout}>Save Workout</Button>
      </Box>
    </Container>
  );
} 