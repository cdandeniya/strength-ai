import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { collection, addDoc, getDocs, deleteDoc, query, where } from "firebase/firestore";
import { Container, Box, Typography, TextField, Button, List, ListItem, ListItemText, Alert, Card, CardContent, Grid, Paper, Autocomplete, Select, MenuItem, InputLabel, FormControl, CircularProgress, Stack, IconButton } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';

const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner", "Snack"];

// Curated gym/bodybuilder foods
const GYM_FOODS = [
  { label: "Chicken Breast (6oz)", calories: 280, category: "Poultry" },
  { label: "Canned Tuna (1 can)", calories: 120, category: "Fish" },
  { label: "Egg Whites (5 large)", calories: 85, category: "Eggs" },
  { label: "Whole Eggs (2 large)", calories: 140, category: "Eggs" },
  { label: "Oats (1 cup cooked)", calories: 150, category: "Grains" },
  { label: "Brown Rice (1 cup cooked)", calories: 215, category: "Grains" },
  { label: "White Rice (1 cup cooked)", calories: 205, category: "Grains" },
  { label: "Broccoli (1 cup)", calories: 30, category: "Vegetables" },
  { label: "Sweet Potato (1 medium)", calories: 110, category: "Vegetables" },
  { label: "Almonds (1oz)", calories: 165, category: "Nuts" },
  { label: "Peanut Butter (2 tbsp)", calories: 190, category: "Nuts/Spreads" },
  { label: "Greek Yogurt (1 cup, nonfat)", calories: 100, category: "Dairy" },
  { label: "Cottage Cheese (1/2 cup, lowfat)", calories: 90, category: "Dairy" },
  { label: "Protein Shake (whey, 1 scoop)", calories: 120, category: "Supplements" },
  { label: "Protein Shake (brand: Premier Protein)", calories: 160, category: "Supplements" },
  { label: "Protein Bar (brand: Quest)", calories: 200, category: "Supplements" },
  { label: "Ground Beef (90% lean, 4oz)", calories: 200, category: "Beef" },
  { label: "Salmon (6oz)", calories: 367, category: "Fish" },
  { label: "Quinoa (1 cup cooked)", calories: 220, category: "Grains" },
  { label: "Spinach (1 cup cooked)", calories: 40, category: "Vegetables" },
  { label: "Avocado (1 medium)", calories: 240, category: "Fruit" },
  { label: "Banana (1 medium)", calories: 105, category: "Fruit" },
  { label: "Apple (1 medium)", calories: 95, category: "Fruit" },
  { label: "Rice Cakes (2 cakes)", calories: 70, category: "Grains" },
  { label: "Skim Milk (1 cup)", calories: 90, category: "Dairy" },
  { label: "Whole Milk (1 cup)", calories: 150, category: "Dairy" },
  { label: "Turkey Breast (4oz)", calories: 120, category: "Poultry" },
  { label: "Shrimp (6oz)", calories: 168, category: "Fish" },
  { label: "Edamame (1 cup)", calories: 190, category: "Legumes" },
  { label: "Black Beans (1/2 cup)", calories: 110, category: "Legumes" },
  { label: "Lentils (1 cup cooked)", calories: 230, category: "Legumes" },
];

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
      setMeals(snap.docs.filter(doc => doc.data().date === today).map(doc => ({ ...doc.data(), id: doc.id })));
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
      setFoodOptions([
        ...GYM_FOODS.filter(f => f.label.toLowerCase().includes(query.toLowerCase())),
        ...(data.foods ? data.foods.map(f => ({
          label: f.description,
          calories: f.foodNutrients?.find(n => n.nutrientName === "Energy")?.value || "",
          category: f.foodCategory || "",
        })) : [])
      ]);
    } catch (e) {
      setFoodOptions(GYM_FOODS.filter(f => f.label.toLowerCase().includes(query.toLowerCase())));
    } finally {
      setLoading(false);
    }
  };

  // Default options for quick selection
  const defaultFoodOptions = GYM_FOODS;

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

  const removeMeal = async (id) => {
    try {
      await deleteDoc(collection(db, "users", auth.currentUser.uid, "meals"), id);
      setMeals(meals => meals.filter(m => m.id !== id));
    } catch (e) {
      setError("Failed to remove meal");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h5" fontWeight={700} color="primary" gutterBottom>Log Food</Typography>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 3 }, mb: 3, borderRadius: 4 }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ xs: "stretch", sm: "flex-end" }}>
          <Box flex={2}>
            <Autocomplete
              freeSolo
              options={foodOptions.length > 0 ? foodOptions : defaultFoodOptions}
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
              <ListItem key={item.id || i} secondaryAction={
                <IconButton edge="end" aria-label="delete" onClick={() => removeMeal(item.id)}>
                  <DeleteIcon />
                </IconButton>
              }>
                <ListItemText primary={`${item.mealType ? item.mealType + ': ' : ''}${item.food}: ${item.calories} kcal`} secondary={item.category ? `Category: ${item.category}` : null} />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Container>
  );
} 