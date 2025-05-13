import React, { useRef, useEffect, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { Box, Container, Paper, Typography } from "@mui/material";
import { db, ref, push, set, onValue } from "../services/firebase";
import { AskedQuestion, HelpRequest, KBEntry } from "../types";
import AppHeader from "../components/AppHeader";
import MicVisualizer from "../components/MicVisualizer";
import QuestionBox from "../components/QuestionBox";
import ResponseBox from "../components/ResponseBox";
import ActionButtons from "../components/ActionButton";
import AskedQuestionsDialog from "../components/AskedQuestionDialog";
import { connectToRoom } from "../services/livekit";
import { Room } from "livekit-client";

export default function VoiceAgent() {
  const [response, setResponse] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [knowledgeBase, setKnowledgeBase] = useState<KBEntry[]>([]);
  const [askedQuestions, setAskedQuestions] = useState<AskedQuestion[]>([]);
  const [helpRequests, setHelpRequests] = useState<Record<string, any>>({});
  const [isModalOpen, setModalOpen] = useState(false);
  const [micOn, setMicOn] = useState(false);
  const [recordingComplete, setRecordingComplete] = useState(false);
  const [hasProcessed, setHasProcessed] = useState(false);
  const [silenceTimer, setSilenceTimer] = useState<NodeJS.Timeout | null>(null);
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  const transcriptRef = useRef<HTMLDivElement | null>(null);
  const [room, setRoom] = useState<Room | null>(null);

  const joinLiveKitRoom = async () => {
    try {
      const res = await fetch("http://localhost:5000/livekit-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identity: "livekit-user", name: "Caller" }),
      });
      const { token } = await res.json();
      const joinedRoom = await connectToRoom(token);
      setRoom(joinedRoom);
      console.log("🎤 Connected to LiveKit Room");
    } catch (err) {
      console.error("LiveKit connection failed", err);
    }
  };

  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [transcript]);

  useEffect(() => {
    const kbRef = ref(db, "knowledge_base");
    return onValue(kbRef, (snapshot) => {
      const data = snapshot.val() || {};
      setKnowledgeBase(Object.values(data));
    });
  }, []);

  useEffect(() => {
    const reqRef = ref(db, "help_requests");
    return onValue(reqRef, (snapshot) => {
      const data: Record<string, HelpRequest> = snapshot.val() || {};
      setHelpRequests(data);
      setAskedQuestions((prev) =>
        prev.map((q) => {
          if (q.status === "pending") {
            const match = Object.values(data).find(
              (req) =>
                req.question.toLowerCase().trim() ===
                  q.question.toLowerCase().trim() &&
                req.status === "resolved" &&
                req.answer
            );
            return match
              ? { ...q, answer: match.answer, status: "success" }
              : q;
          }
          return q;
        })
      );
    });
  }, []);

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (!micOn) return;

    if (silenceTimer) clearTimeout(silenceTimer);

    const timeout = setTimeout(() => {
      SpeechRecognition.stopListening();
      setMicOn(false);
      setRecordingComplete(true);

      const cleaned = transcript.trim();
      if (!cleaned) {
        const fallback = "Please ask your query.";
        setResponse(fallback);
        speak(fallback);
      } else {
        handleProcess();
      }
    }, 4000);

    setSilenceTimer(timeout);
    return () => clearTimeout(timeout);
  }, [transcript, micOn]);

  const normalize = (str: string) => str.trim().toLowerCase();

  const handleProcess = async () => {
    setIsProcessing(true);
    setHasProcessed(true);

    const cleaned = normalize(transcript);
    const matched = knowledgeBase.find(
      (entry) => normalize(entry.question) === cleaned
    );

    if (matched) {
      setResponse(matched.answer);
      speak(matched.answer);
      setAskedQuestions((prev) => [
        {
          question: transcript,
          answer: matched.answer,
          status: "success",
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
    } else {
      const fallback = "Let me check with my supervisor and get back to you.";
      setResponse(fallback);
      speak(fallback);

      const alreadyPending = Object.values(helpRequests).find(
        (req) => normalize(req.question) === cleaned && req.status === "pending"
      );

      if (!alreadyPending) {
        const newRef = push(ref(db, "help_requests"));
        await set(newRef, {
          question: transcript,
          status: "pending",
          answer: "",
          createdAt: new Date().toISOString(),
        });
      }

      setAskedQuestions((prev) => [
        {
          question: transcript,
          answer: fallback,
          status: "pending",
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
    }

    setIsProcessing(false);
  };
  const toggleMic = () => {
    if (micOn) return;

    joinLiveKitRoom(); // ⬅️ Connect to LiveKit

    setMicOn(true);
    SpeechRecognition.startListening({ continuous: true });

    if (hasProcessed) {
      resetTranscript();
      setResponse("");
      setHasProcessed(false);
    }
    setRecordingComplete(false);
  };

  const handleReset = () => {
    SpeechRecognition.stopListening();
    resetTranscript();
    setResponse("");
    setMicOn(false);
    setRecordingComplete(false);
    setHasProcessed(false);
  };

  if (!browserSupportsSpeechRecognition) {
    return (
      <Typography>Your browser does not support speech recognition.</Typography>
    );
  }

  // useEffect(() => {
  //   return () => {
  //     if (room) {
  //       room.disconnect();
  //     }
  //   };
  // }, [room]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppHeader onOpenModal={() => setModalOpen(true)} />
      <Container maxWidth="sm" sx={{ mt: 6, mb: 6 }}>
        <Paper
          elevation={0}
          sx={{
            borderRadius: 6,
            p: 4,
            background: "rgba(33,150,243,0.1)",
            minHeight: 540,
          }}
        >
          <Typography
            variant="h5"
            fontWeight={700}
            gutterBottom
            color="primary"
            textAlign="center"
          >
            AI Voice Assistant
          </Typography>

          <MicVisualizer micOn={micOn} listening={listening} />
          <QuestionBox transcript={transcript} transcriptRef={transcriptRef} />
          <ResponseBox response={response} />

          <ActionButtons
            micOn={micOn}
            isProcessing={isProcessing}
            transcript={transcript}
            recordingComplete={recordingComplete}
            toggleMic={toggleMic}
            handleReset={handleReset}
          />
        </Paper>
      </Container>

      <AskedQuestionsDialog
        open={isModalOpen}
        onClose={() => setModalOpen(false)}
        questions={askedQuestions}
      />
    </Box>
  );
}
