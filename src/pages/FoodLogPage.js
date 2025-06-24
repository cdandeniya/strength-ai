import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { Container, Box, Typography, TextField, Button, List, ListItem, ListItemText, Alert, Card, CardContent, Grid, Paper } from "@mui/material";

export default function FoodLogPage() {
  const [meal, setMeal] = useState({ food: "", calories: "" });
  const [meals, setMeals] = useState([]);
  const [error, setError] = useState("");

  const fetchMeals = async () => {
    try {
      const mealsRef = collection(db, "users", auth.currentUser.uid, "meals");
      const snap = await getDocs(mealsRef);
      const today = new Date().toISOString().slice(0, 10);
      setMeals(snap.docs.map(doc => doc.data()).filter(m => m.date === today));
    } catch (e) {
      setError("Failed to load meals");
    }
  };

  useEffect(() => {
    fetchMeals();
    // eslint-disable-next-line
  }, []);

  const addMeal = async () => {
    if (!meal.food || !meal.calories) {
      setError("Fill all fields");
      return;
    }
    const date = new Date().toISOString().slice(0, 10);
    await addDoc(collection(db, "users", auth.currentUser.uid, "meals"), {
      ...meal,
      date,
    });
    setMeal({ food: "", calories: "" });
    setError("");
    fetchMeals();
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h5" fontWeight={700} color="primary" gutterBottom>Log Food</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={8}>
              <TextField label="Food Name" value={meal.food} onChange={e => setMeal({ ...meal, food: e.target.value })} fullWidth margin="normal" variant="outlined" />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField label="Calories" value={meal.calories} onChange={e => setMeal({ ...meal, calories: e.target.value })} type="number" fullWidth margin="normal" variant="outlined" />
            </Grid>
          </Grid>
          <Button variant="outlined" sx={{ mt: 2, fontWeight: 600, transition: '0.2s' }} onClick={addMeal}>Add Meal</Button>
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          <List sx={{ mt: 2 }}>
            {meals.map((item, i) => (
              <ListItem key={i}><ListItemText primary={`${item.food}: ${item.calories} kcal`} /></ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Container>
  );
} 