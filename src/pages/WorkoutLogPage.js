import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { Container, Typography, TextField, Button, List, ListItem, ListItemText, Alert, Card, CardContent, Grid, Autocomplete, ListItemIcon, Box, IconButton, Stack } from "@mui/material";
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import SportsKabaddiIcon from '@mui/icons-material/SportsKabaddi';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const exerciseOptions = [
  { label: "Dumbbell Incline Press", icon: <FitnessCenterIcon color="primary" /> },
  { label: "Barbell Squat", icon: <FitnessCenterIcon color="primary" /> },
  { label: "Bench Press", icon: <FitnessCenterIcon color="primary" /> },
  { label: "Deadlift", icon: <FitnessCenterIcon color="primary" /> },
  { label: "Pull Up", icon: <AccessibilityNewIcon color="secondary" /> },
  { label: "Push Up", icon: <AccessibilityNewIcon color="secondary" /> },
  { label: "Overhead Press", icon: <FitnessCenterIcon color="primary" /> },
  { label: "Lat Pulldown", icon: <FitnessCenterIcon color="primary" /> },
  { label: "Seated Row", icon: <FitnessCenterIcon color="primary" /> },
  { label: "Leg Press", icon: <DirectionsRunIcon color="success" /> },
  { label: "Bicep Curl", icon: <FitnessCenterIcon color="primary" /> },
  { label: "Tricep Extension", icon: <FitnessCenterIcon color="primary" /> },
  { label: "Chest Fly", icon: <FitnessCenterIcon color="primary" /> },
  { label: "Lateral Raise", icon: <FitnessCenterIcon color="primary" /> },
  { label: "Leg Curl", icon: <DirectionsRunIcon color="success" /> },
  { label: "Leg Extension", icon: <DirectionsRunIcon color="success" /> },
  { label: "Calf Raise", icon: <DirectionsRunIcon color="success" /> },
  { label: "Plank", icon: <SportsKabaddiIcon color="info" /> },
  { label: "Crunch", icon: <SportsKabaddiIcon color="info" /> },
  { label: "Russian Twist", icon: <SportsKabaddiIcon color="info" /> },
  { label: "Mountain Climber", icon: <SportsKabaddiIcon color="info" /> },
];

export default function WorkoutLogPage() {
  const [exercises, setExercises] = useState([]);
  const [exercise, setExercise] = useState({ name: "", sets: [] });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const addSet = () => {
    setExercise(prev => ({ ...prev, sets: [...prev.sets, { weight: "", reps: "" }] }));
  };

  const updateSet = (idx, field, value) => {
    setExercise(prev => ({
      ...prev,
      sets: prev.sets.map((set, i) => i === idx ? { ...set, [field]: value } : set)
    }));
  };

  const removeSet = (idx) => {
    setExercise(prev => ({
      ...prev,
      sets: prev.sets.filter((_, i) => i !== idx)
    }));
  };

  const addExercise = () => {
    if (!exercise.name || exercise.sets.length === 0 || exercise.sets.some(s => !s.weight || !s.reps)) {
      setError("Fill all fields and add at least one set");
      return;
    }
    setExercises([...exercises, exercise]);
    setExercise({ name: "", sets: [] });
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
            <Grid item xs={12}>
              <Autocomplete
                freeSolo
                options={exerciseOptions}
                getOptionLabel={option => typeof option === 'string' ? option : option.label}
                value={exercise.name ? exerciseOptions.find(opt => opt.label === exercise.name) || { label: exercise.name } : null}
                onChange={(_, newValue) => setExercise({ ...exercise, name: newValue ? (newValue.label || newValue) : "" })}
                onInputChange={(_, newInputValue) => setExercise({ ...exercise, name: newInputValue })}
                ListboxProps={{
                  sx: {
                    fontSize: 16,
                    minWidth: 260,
                    maxWidth: 340,
                    borderRadius: 2,
                    boxShadow: 3,
                    p: 0.5,
                  }
                }}
                renderOption={(props, option, { selected }) => (
                  <Box component="li"
                    {...props}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      bgcolor: selected ? '#e3f2fd' : props['aria-selected'] ? '#f0f4ff' : 'white',
                      borderRadius: 2,
                      fontWeight: 600,
                      fontSize: 16,
                      minHeight: 48,
                      px: 2,
                      py: 1,
                      mb: 0.5,
                      cursor: 'pointer',
                      transition: 'background 0.2s',
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36, fontSize: 24 }}>{option.icon}</ListItemIcon>
                    <ListItemText primary={option.label} primaryTypographyProps={{ fontWeight: 600, fontSize: 16 }} />
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField {...params} label="Exercise Name" margin="normal" variant="outlined" fullWidth sx={{ minWidth: 260, borderRadius: 2 }} />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Stack spacing={2}>
                {exercise.sets.map((set, idx) => (
                  <Grid container spacing={1} alignItems="center" key={idx}>
                    <Grid item xs={5}>
                      <TextField
                        label={`Weight (kg) - Set ${idx + 1}`}
                        value={set.weight}
                        onChange={e => updateSet(idx, 'weight', e.target.value)}
                        type="number"
                        fullWidth
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={5}>
                      <TextField
                        label="Reps"
                        value={set.reps}
                        onChange={e => updateSet(idx, 'reps', e.target.value)}
                        type="number"
                        fullWidth
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <IconButton color="error" onClick={() => removeSet(idx)} aria-label="Remove set">
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                ))}
                <Button startIcon={<AddIcon />} variant="outlined" color="primary" onClick={addSet} sx={{ fontWeight: 600, alignSelf: 'flex-start' }}>
                  Add Set
                </Button>
              </Stack>
            </Grid>
          </Grid>
          <Button variant="outlined" sx={{ mt: 2, fontWeight: 600, transition: '0.2s' }} onClick={addExercise}>Add Exercise</Button>
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          <List sx={{ mt: 2 }}>
            {exercises.map((ex, i) => (
              <ListItem key={i} alignItems="flex-start">
                <ListItemText
                  primary={ex.name}
                  secondary={
                    <>
                      {ex.sets.map((set, j) => (
                        <Box key={j} sx={{ display: 'inline-block', mr: 2 }}>
                          <b>Set {j + 1}:</b> {set.weight}kg x {set.reps}
                        </Box>
                      ))}
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
          <Button variant="contained" sx={{ mt: 2, fontWeight: 600, transition: '0.2s' }} onClick={saveWorkout}>Save Workout</Button>
        </CardContent>
      </Card>
    </Container>
  );
} 