import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { Container, Box, Typography, TextField, Button, List, ListItem, ListItemText, Alert, Card, CardContent, Grid, Paper, Autocomplete, Select, MenuItem, InputLabel, FormControl, CircularProgress, Stack } from "@mui/material";

const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner", "Snack"];

export default function FoodLogPage() {
  const [meal, setMeal] = useState({ food: "", calories: "", category: "", mealType: "Breakfast" });
  const [meals, setMeals] = useState([]);
  const [error, setError] = useState("");
  const [foodOptions, setFoodOptions] = useState([]);
  const [loading, setLoading] = useState(false);

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

  // Search for foods using USDA FoodData Central API
  const searchFoods = async (query) => {
    if (!query) return;
    setLoading(true);
    try {
      const res = await fetch(`https://api.nal.usda.gov/fdc/v1/foods/search?api_key=DEMO_KEY&query=${encodeURIComponent(query)}&pageSize=10`);
      const data = await res.json();
      setFoodOptions(data.foods ? data.foods.map(f => ({
        label: f.description,
        calories: f.foodNutrients?.find(n => n.nutrientName === "Energy")?.value || "",
        category: f.foodCategory || "",
      })) : []);
    } catch (e) {
      setFoodOptions([]);
    } finally {
      setLoading(false);
    }
  };

  const addMeal = async () => {
    if (!meal.food || !meal.calories || !meal.mealType) {
      setError("Fill all fields");
      return;
    }
    const date = new Date().toISOString().slice(0, 10);
    await addDoc(collection(db, "users", auth.currentUser.uid, "meals"), {
      ...meal,
      date,
    });
    setMeal({ food: "", calories: "", category: "", mealType: "Breakfast" });
    setError("");
    fetchMeals();
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h5" fontWeight={700} color="primary" gutterBottom>Log Food</Typography>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 3 }, mb: 3, borderRadius: 4 }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ xs: "stretch", sm: "flex-end" }}>
          <Box flex={2}>
            <Autocomplete
              freeSolo
              options={foodOptions}
              loading={loading}
              getOptionLabel={option => typeof option === 'string' ? option : option.label}
              value={
                meal.food
                  ? (foodOptions.find(opt => opt.label === meal.food) || meal.food)
                  : null
              }
              onInputChange={(_, value, reason) => {
                if (reason === 'input') {
                  setMeal(m => ({ ...m, food: value }));
                  if (value.length > 2) searchFoods(value);
                }
                if (reason === 'clear') {
                  setMeal(m => ({ ...m, food: '', calories: '', category: '' }));
                }
              }}
              onChange={(_, value) => {
                if (typeof value === 'string') {
                  setMeal(m => ({ ...m, food: value, calories: '', category: '' }));
                } else if (value && value.label) {
                  setMeal(m => ({
                    ...m,
                    food: value.label,
                    calories: value.calories || '',
                    category: value.category || '',
                  }));
                } else {
                  setMeal(m => ({ ...m, food: '', calories: '', category: '' }));
                }
              }}
              renderInput={(params) => (
                <TextField {...params} label="Food Name" margin="normal" fullWidth variant="outlined" size="large" InputProps={{
                  ...params.InputProps,
                  style: { fontSize: 20, padding: 16 },
                  endAdornment: (
                    <>
                      {loading ? <CircularProgress color="inherit" size={18} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }} />
              )}
            />
          </Box>
          <Box flex={1}>
            <TextField label="Calories" value={meal.calories} onChange={e => setMeal({ ...meal, calories: e.target.value })} type="number" fullWidth margin="normal" variant="outlined" size="large" inputProps={{ style: { fontSize: 18 } }} />
          </Box>
          <Box flex={1}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Meal Type</InputLabel>
              <Select
                value={meal.mealType}
                label="Meal Type"
                onChange={e => setMeal({ ...meal, mealType: e.target.value })}
                size="large"
              >
                {MEAL_TYPES.map(type => <MenuItem key={type} value={type}>{type}</MenuItem>)}
              </Select>
            </FormControl>
          </Box>
        </Stack>
        {meal.category && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 1 }}>
            Category: {meal.category}
          </Typography>
        )}
        <Button variant="contained" sx={{ mt: 2, fontWeight: 700, fontSize: 18, borderRadius: 3, py: 1.2 }} fullWidth onClick={addMeal}>Add Meal</Button>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      </Paper>
      <Card elevation={2} sx={{ borderRadius: 4 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={700} color="primary" gutterBottom>Today's Meals</Typography>
          <List sx={{ mt: 1 }}>
            {meals.map((item, i) => (
              <ListItem key={i}>
                <ListItemText primary={`${item.mealType ? item.mealType + ': ' : ''}${item.food}: ${item.calories} kcal`} secondary={item.category ? `Category: ${item.category}` : null} />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Container>
  );
} 