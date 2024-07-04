import React, { useState, useEffect, useRef } from "react";
import { Button, Container, TextField, Box } from "@mui/material";
import DailyIframe from "@daily-co/daily-js";

const App = () => {
  const [callObject, setCallObject] = useState(null);
  const [url, setUrl] = useState("");
  const [joined, setJoined] = useState(false);
  const videoRef = useRef(null);

  const apiKey =
    "e976051c3f8c3732f68caa7cc93d2633cdbd3023e480a8a1f9d4b31458aa4c8f";

  const createCall = async () => {
    const response = await fetch("https://api.daily.co/v1/rooms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ properties: { enable_chat: true } }),
    });
    const room = await response.json();
    setUrl(room.url);
  };

  const joinCall = () => {
    const newCallObject = DailyIframe.createCallObject();
    newCallObject.join({ url });
    setCallObject(newCallObject);
    setJoined(true);
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

  return (
    <Container>
      <h1>Video Conferencia Estilo Teams</h1>
      {joined ? (
        <Box>
          <video
            ref={videoRef}
            autoPlay
            muted
            style={{ width: "100%", height: "auto" }}
          />
          <Button onClick={() => callObject.leave()}>Salir</Button>
        </Box>
      ) : (
        <Box>
          <Button variant="contained" color="primary" onClick={createCall}>
            Crear Llamada
          </Button>
          {url && (
            <Box>
              <TextField value={url} disabled fullWidth margin="normal" />
              <Button variant="contained" color="secondary" onClick={joinCall}>
                Unirse a la Llamada
              </Button>
            </Box>
          )}
        </Box>
      )}
    </Container>
  );
};

export default App;
