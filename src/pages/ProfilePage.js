import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Container, Box, Typography, TextField, Button, Alert, Card, CardContent, Grid, Paper, MenuItem, Select, InputLabel, FormControl } from "@mui/material";

const experienceOptions = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "Athlete"
];
const sexOptions = ["Male", "Female", "Other"];

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    age: "",
    sex: "",
    height: "",
    weight: "",
    experience: "",
    goalWeight: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const docRef = doc(db, "users", auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().profile) {
          setProfile({ ...profile, ...docSnap.data().profile });
        }
      } catch (e) {
        setError("Failed to load profile");
      }
    };
    fetchProfile();
    // eslint-disable-next-line
  }, []);

  const handleSave = async () => {
    setError("");
    setSuccess("");
    try {
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        profile,
      });
      setSuccess("Profile saved!");
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (e) {
      setError("Failed to save profile");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Card elevation={3}>
        <CardContent>
          <Typography component="h1" variant="h5" sx={{ mb: 2, fontWeight: 700 }} color="primary">
            Profile
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Age"
                value={profile.age}
                onChange={e => setProfile({ ...profile, age: e.target.value })}
                fullWidth
                margin="normal"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="sex-label" sx={{ color: 'primary.main' }}>Sex</InputLabel>
                <Select
                  labelId="sex-label"
                  value={profile.sex || ""}
                  label="Sex"
                  onChange={e => setProfile({ ...profile, sex: e.target.value })}
                  sx={{
                    background: '#f5f7fa',
                    borderRadius: 2,
                    fontWeight: 600,
                    color: 'primary.main',
                    '& .MuiSelect-icon': { color: 'primary.main' },
                  }}
                >
                  {sexOptions.map(option => (
                    <MenuItem key={option} value={option} sx={{ fontWeight: 600, color: 'primary.dark' }}>{option}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Height"
                value={profile.height}
                onChange={e => setProfile({ ...profile, height: e.target.value })}
                fullWidth
                margin="normal"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Weight"
                value={profile.weight}
                onChange={e => setProfile({ ...profile, weight: e.target.value })}
                fullWidth
                margin="normal"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Goal Weight"
                value={profile.goalWeight}
                onChange={e => setProfile({ ...profile, goalWeight: e.target.value })}
                fullWidth
                margin="normal"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="experience-label" sx={{ color: 'primary.main' }}>Experience</InputLabel>
                <Select
                  labelId="experience-label"
                  value={profile.experience || ""}
                  label="Experience"
                  onChange={e => setProfile({ ...profile, experience: e.target.value })}
                  sx={{
                    background: '#f5f7fa',
                    borderRadius: 2,
                    fontWeight: 600,
                    color: 'primary.main',
                    '& .MuiSelect-icon': { color: 'primary.main' },
                  }}
                >
                  {experienceOptions.map(option => (
                    <MenuItem key={option} value={option} sx={{ fontWeight: 600, color: 'primary.dark' }}>{option}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
          <Button variant="contained" fullWidth sx={{ mt: 3, fontWeight: 600, transition: '0.2s' }} onClick={handleSave}>
            Save Profile
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
} 