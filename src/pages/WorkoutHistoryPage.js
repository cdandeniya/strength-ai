import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { Container, Box, Typography, List, ListItem, ListItemText, Divider, Alert } from "@mui/material";

export default function WorkoutHistoryPage() {
  const [workouts, setWorkouts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const workoutsRef = collection(db, "users", auth.currentUser.uid, "workouts");
        const q = query(workoutsRef, orderBy("date", "desc"));
        const snap = await getDocs(q);
        setWorkouts(snap.docs.map(doc => doc.data()));
      } catch (e) {
        setError("Failed to load workout history");
      }
    };
    fetchWorkouts();
  }, []);

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" gutterBottom>Workout History</Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <List>
          {workouts.map((item, idx) => (
            <React.Fragment key={idx}>
              <ListItem><ListItemText primary={`Date: ${item.date}`} /></ListItem>
              {item.exercises.map((ex, i) => (
                <ListItem key={i} sx={{ pl: 4 }}><ListItemText primary={`${ex.name}: ${ex.weight}kg x ${ex.reps} x ${ex.sets}`} /></ListItem>
              ))}
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Box>
    </Container>
  );
} 