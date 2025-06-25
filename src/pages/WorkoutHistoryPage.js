import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { collection, getDocs, orderBy, query, doc, updateDoc } from "firebase/firestore";
import { Container, Box, Typography, List, ListItem, ListItemText, Divider, Alert, Card, CardContent, IconButton, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Stack, Paper } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';

export default function WorkoutHistoryPage() {
  const [workouts, setWorkouts] = useState([]);
  const [error, setError] = useState("");
  const [editIdx, setEditIdx] = useState(null);
  const [editWorkout, setEditWorkout] = useState(null);
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const workoutsRef = collection(db, "users", auth.currentUser.uid, "workouts");
        const q = query(workoutsRef, orderBy("date", "desc"));
        const snap = await getDocs(q);
        setWorkouts(snap.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() })));
      } catch (e) {
        setError("Failed to load workout history");
      }
    };
    fetchWorkouts();
  }, []);

  // Group workouts by date
  const groupedByDate = workouts.reduce((acc, workout, idx) => {
    if (!acc[workout.date]) acc[workout.date] = [];
    acc[workout.date].push({ ...workout, idx });
    return acc;
  }, {});
  const sortedDates = Object.keys(groupedByDate).sort((a, b) => b.localeCompare(a));

  const handleEdit = (workoutIdx, exIdx) => {
    setEditIdx({ workoutIdx, exIdx });
    setEditWorkout(JSON.parse(JSON.stringify(workouts[workoutIdx]))); // deep copy
  };

  const handleEditChange = (exIdx, setIdx, field, value) => {
    setEditWorkout(prev => {
      const updated = { ...prev };
      updated.exercises[exIdx].sets[setIdx][field] = value;
      return updated;
    });
  };

  const saveEdit = async () => {
    setEditLoading(true);
    try {
      const workoutRef = doc(db, "users", auth.currentUser.uid, "workouts", editWorkout.id);
      await updateDoc(workoutRef, {
        exercises: editWorkout.exercises
      });
      setWorkouts(prev => prev.map((w, i) => i === editIdx.workoutIdx ? { ...w, exercises: editWorkout.exercises } : w));
      setEditIdx(null);
      setEditWorkout(null);
    } catch (e) {
      setError("Failed to update workout");
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h5" fontWeight={700} color="primary" gutterBottom>Workout History</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Box>
        {sortedDates.map(date => (
          <Paper key={date} elevation={3} sx={{ mb: 4, borderRadius: 4, p: { xs: 2, md: 3 }, background: 'rgba(255,255,255,0.04)' }}>
            <Typography variant="h6" fontWeight={700} color="primary" sx={{ mb: 2 }}>{date}</Typography>
            <Divider sx={{ mb: 2 }} />
            <List disablePadding>
              {groupedByDate[date].map((workout) => (
                workout.exercises.map((ex, exIdx) => (
                  <ListItem key={exIdx} alignItems="flex-start" sx={{ pl: 0, pr: 0, mb: 1, borderRadius: 2, '&:hover': { background: 'rgba(144,202,249,0.07)' } }}
                    secondaryAction={
                      <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(workout.idx, exIdx)}>
                        <EditIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={<Typography fontWeight={600}>{ex.name}</Typography>}
                      secondary={ex.sets ? ex.sets.map((set, j) => `Set ${j+1}: ${set.weight}kg x ${set.reps}`).join(' | ') : ''}
                    />
                  </ListItem>
                ))
              ))}
            </List>
          </Paper>
        ))}
      </Box>
      <Dialog open={!!editIdx} onClose={() => setEditIdx(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Exercise</DialogTitle>
        <DialogContent>
          {editWorkout && editIdx && (
            <Box sx={{ mb: 2 }}>
              <Typography fontWeight={700} sx={{ mb: 1 }}>{editWorkout.exercises[editIdx.exIdx].name}</Typography>
              <Stack spacing={1}>
                {editWorkout.exercises[editIdx.exIdx].sets && editWorkout.exercises[editIdx.exIdx].sets.map((set, setIdx) => (
                  <Box key={setIdx} sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                      label="Weight (kg)"
                      type="number"
                      value={set.weight}
                      onChange={e => handleEditChange(editIdx.exIdx, setIdx, 'weight', e.target.value)}
                      sx={{ flex: 1 }}
                    />
                    <TextField
                      label="Reps"
                      type="number"
                      value={set.reps}
                      onChange={e => handleEditChange(editIdx.exIdx, setIdx, 'reps', e.target.value)}
                      sx={{ flex: 1 }}
                    />
                  </Box>
                ))}
              </Stack>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditIdx(null)} color="secondary">Cancel</Button>
          <Button onClick={saveEdit} color="primary" variant="contained" disabled={editLoading}>{editLoading ? "Saving..." : "Save"}</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
} 