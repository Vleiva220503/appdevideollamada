import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Container,
  TextField,
  Box,
  IconButton,
  Snackbar,
  Typography,
  Paper,
  Alert
} from "@mui/material";
import DailyIframe from "@daily-co/daily-js";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const App = () => {
  const [callObject, setCallObject] = useState(null);
  const [url, setUrl] = useState("");
  const [joined, setJoined] = useState(false);
  const [inputUrl, setInputUrl] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const videoRef = useRef(null);

  const apiKey = "e976051c3f8c3732f68caa7cc93d2633cdbd3023e480a8a1f9d4b31458aa4c8f";

  const createCall = async () => {
    const response = await fetch("https://api.daily.co/v1/rooms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        properties: {
          enable_chat: true,
          start_video_off: true,
          start_audio_off: true,
          // Add any other room properties as needed
        }
      }),
    });
    const room = await response.json();
    setUrl(room.url);
    setInfoOpen(true);
  };

  const joinCall = (callUrl) => {
    try {
      new URL(callUrl); // Check if URL is valid
      window.location.href = callUrl;
    } catch (_) {
      setAlertOpen(true);
    }
  };

  useEffect(() => {
    if (callObject) {
      callObject.on("joined-meeting", () => {
        const localVideo = callObject.participants().local.videoTrack;
        if (localVideo && videoRef.current) {
          videoRef.current.srcObject = new MediaStream([localVideo]);
        }
      });
    }
  }, [callObject]);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
  };

  const handleJoin = () => {
    joinCall(inputUrl);
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  const handleInfoClose = () => {
    setInfoOpen(false);
  };

  return (
    <Container maxWidth="md" style={{ marginTop: "20px" }}>
      <Paper elevation={3} style={{ padding: "20px" }}>
        <Typography variant="h4" gutterBottom>
          Video Conferencia Estilo Teams
        </Typography>
        <Box>
          <Button
            variant="contained"
            color="primary"
            onClick={createCall}
            fullWidth
          >
            Crear Reunión
          </Button>
          {url && (
            <Box mt={2}>
              <TextField
                value={url}
                disabled
                fullWidth
                margin="normal"
                variant="outlined"
              />
              <IconButton onClick={handleCopy} aria-label="copy to clipboard">
                <ContentCopyIcon />
              </IconButton>
              <Typography variant="body1" mt={2}>
                Comparta este link para unir participantes a la llamada.
                Pegue la siguiente URL en "Ingresar código o vínculo".
              </Typography>
            </Box>
          )}
          <Box mt={2} display="flex" alignItems="center">
            <TextField
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="Ingresa un código o vínculo"
              fullWidth
              margin="normal"
              variant="outlined"
            />
            <Button
              variant="contained"
              color="secondary"
              onClick={handleJoin}
              disabled={!inputUrl.trim()}
              style={{ marginLeft: "10px" }}
            >
              Unirse
            </Button>
          </Box>
        </Box>
        <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleAlertClose}>
          <Alert onClose={handleAlertClose} severity="error">
            Link no válido, por favor corrige.
          </Alert>
        </Snackbar>
        <Snackbar open={infoOpen} autoHideDuration={6000} onClose={handleInfoClose}>
          <Alert onClose={handleInfoClose} severity="info">
            Pegue la siguiente URL en "Ingresar código o vínculo".
          </Alert>
        </Snackbar>
      </Paper>
    </Container>
  );
};

export default App;
