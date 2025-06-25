import React, { useState } from "react";
import { Container, Box, Typography, TextField, Button, Paper, Stack, Card, CardContent, Grid } from "@mui/material";
import { getSimpleCoachResponse } from "../utils/aiLogic";

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { from: "coach", text: "Hi! Ask me about your workout or nutrition." }
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input) return;
    const userMsg = { from: "user", text: input };
    const coachMsg = { from: "coach", text: getSimpleCoachResponse(input) };
    setMessages([...messages, userMsg, coachMsg]);
    setInput("");
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h5" fontWeight={700} color="primary" gutterBottom>Coach Chat</Typography>
          <Paper variant="outlined" sx={{ minHeight: 200, maxHeight: 300, overflow: "auto", p: 2, mb: 2, bgcolor: "#f9f9f9" }}>
            <Stack spacing={1}>
              {messages.map((msg, i) => (
                <Box
                  key={i}
                  alignSelf={msg.from === "user" ? "flex-end" : "flex-start"}
                  sx={{
                    bgcolor: msg.from === "user" ? "primary.light" : "secondary.light",
                    color: msg.from === "user" ? "primary.contrastText" : "secondary.contrastText",
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    maxWidth: "80%",
                    boxShadow: 1,
                    fontWeight: 500
                  }}
                >
                  <Typography variant="body1">{msg.text}</Typography>
                </Box>
              ))}
            </Stack>
          </Paper>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={9}>
              <TextField
                fullWidth
                placeholder="Ask your coach..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") sendMessage(); }}
                sx={{ mb: 1 }}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={3}>
              <Button variant="contained" fullWidth sx={{ fontWeight: 600, transition: '0.2s' }} onClick={sendMessage}>Send</Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
} 