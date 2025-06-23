import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Container, Box, Typography, TextField, Button, Alert } from "@mui/material";

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
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
          Profile
        </Typography>
        {["age", "sex", "height", "weight", "experience", "goalWeight"].map((field) => (
          <TextField
            key={field}
            label={field.charAt(0).toUpperCase() + field.slice(1)}
            value={profile[field]}
            onChange={e => setProfile({ ...profile, [field]: e.target.value })}
            fullWidth
            margin="normal"
          />
        ))}
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
        <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={handleSave}>
          Save Profile
        </Button>
      </Box>
    </Container>
  );
} 