import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { collection, getDocs, orderBy, query, doc, updateDoc } from "firebase/firestore";
import { Container, Box, Typography, List, ListItem, ListItemText, Divider, Alert, Card, CardContent, IconButton, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Stack } from "@mui/material";
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

  const handleEdit = (idx) => {
    setEditIdx(idx);
    setEditWorkout(JSON.parse(JSON.stringify(workouts[idx]))); // deep copy
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
      setWorkouts(prev => prev.map((w, i) => i === editIdx ? { ...w, exercises: editWorkout.exercises } : w));
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
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h5" fontWeight={700} color="primary" gutterBottom>Workout History</Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <List>
            {workouts.map((item, idx) => (
              <React.Fragment key={item.id}>
                <ListItem secondaryAction={
                  <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(idx)}>
                    <EditIcon />
                  </IconButton>
                }>
                  <ListItemText primary={`Date: ${item.date}`} />
                </ListItem>
                {item.exercises.map((ex, i) => (
                  <ListItem key={i} sx={{ pl: 4 }}>
                    <ListItemText primary={ex.name} secondary={ex.sets ? ex.sets.map((set, j) => `Set ${j+1}: ${set.weight}kg x ${set.reps}`).join(' | ') : ''} />
                  </ListItem>
                ))}
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </CardContent>
      </Card>
      <Dialog open={editIdx !== null} onClose={() => setEditIdx(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Workout</DialogTitle>
        <DialogContent>
          {editWorkout && editWorkout.exercises.map((ex, exIdx) => (
            <Box key={exIdx} sx={{ mb: 2 }}>
              <Typography fontWeight={700} sx={{ mb: 1 }}>{ex.name}</Typography>
              <Stack spacing={1}>
                {ex.sets && ex.sets.map((set, setIdx) => (
                  <Box key={setIdx} sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                      label="Weight (kg)"
                      type="number"
                      value={set.weight}
                      onChange={e => handleEditChange(exIdx, setIdx, 'weight', e.target.value)}
                      sx={{ flex: 1 }}
                    />
                    <TextField
                      label="Reps"
                      type="number"
                      value={set.reps}
                      onChange={e => handleEditChange(exIdx, setIdx, 'reps', e.target.value)}
                      sx={{ flex: 1 }}
                    />
                  </Box>
                ))}
              </Stack>
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditIdx(null)} color="secondary">Cancel</Button>
          <Button onClick={saveEdit} color="primary" variant="contained" disabled={editLoading}>{editLoading ? "Saving..." : "Save"}</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
} 