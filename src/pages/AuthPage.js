import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { Container, Box, Typography, TextField, Button, Link, Card, CardContent, Paper } from "@mui/material";
import Logo from '../logo.svg';

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleAuth = async () => {
    setError("");
    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, "users", userCredential.user.uid), {
          email,
          profile: {},
        });
        navigate("/profile");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        navigate("/dashboard");
      }
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box sx={{ width: '100%' }}>
        <Paper elevation={4} sx={{ p: { xs: 3, sm: 4 }, borderRadius: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#f7fafd' }}>
          <img src={Logo} alt="Gym Coach Logo" style={{ width: 80, height: 80, marginBottom: 16 }} />
          <Typography component="h1" variant="h3" sx={{ mb: 1, fontWeight: 800, color: 'primary.main', letterSpacing: 1, textAlign: 'center' }}>
            Gym Coach
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
            Welcome! Log in or create your account to start your fitness journey.
          </Typography>
          <Box sx={{ width: '100%', mt: 1 }}>
            <TextField label="Email" fullWidth margin="normal" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
            <TextField label="Password" type="password" fullWidth margin="normal" value={password} onChange={e => setPassword(e.target.value)} autoComplete={isSignUp ? "new-password" : "current-password"} />
            {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
            <Button variant="contained" fullWidth sx={{ mt: 2, fontWeight: 700, fontSize: 18, borderRadius: 3, py: 1.2 }} onClick={handleAuth}>
              {isSignUp ? "Sign Up" : "Login"}
            </Button>
            <Link component="button" variant="body2" sx={{ mt: 2, display: 'block', textAlign: 'center' }} onClick={() => setIsSignUp(!isSignUp)}>
              {isSignUp ? "Have an account? Login" : "No account? Sign Up"}
            </Link>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
} 