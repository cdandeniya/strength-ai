import React, { useState } from "react";
import { Container, Box, Typography, TextField, Button, Paper, Stack } from "@mui/material";
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
    <Container maxWidth="sm">
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" gutterBottom>AI Coach Chat</Typography>
        <Paper variant="outlined" sx={{ minHeight: 200, maxHeight: 300, overflow: "auto", p: 2, mb: 2 }}>
          <Stack spacing={1}>
            {messages.map((msg, i) => (
              <Box key={i} alignSelf={msg.from === "user" ? "flex-end" : "flex-start"} bgcolor={msg.from === "user" ? "#d0f0c0" : "#f0d0c0"} px={2} py={1} borderRadius={2}>
                <Typography variant="body1">{msg.text}</Typography>
              </Box>
            ))}
          </Stack>
        </Paper>
        <TextField
          fullWidth
          placeholder="Ask your coach..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") sendMessage(); }}
          sx={{ mb: 1 }}
        />
        <Button variant="contained" onClick={sendMessage}>Send</Button>
      </Box>
    </Container>
  );
} 