import { useEffect, useState } from "react";
import { db, ref, onValue } from "../services/firebase";
import { HelpRequest } from "../types";
import axios from "axios";
import {
  Container,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import Header from "../components/AppHeader";
import HelpRequestCard from "../components/HelperRequestCard";
import FilterDialog from "../components/FilterDialog";

export default function Dashboard() {
  const [requests, setRequests] = useState<HelpRequest[]>([]);
  const [answers, setAnswers] = useState<{ [id: string]: string }>({});
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<
    "all" | "pending" | "resolved"
  >("all");

  useEffect(() => {
    onValue(ref(db, "help_requests"), (snapshot) => {
      const data = snapshot.val() || {};
      const items = Object.entries(data).map(([id, val]) => ({
        id,
        ...(val as Omit<HelpRequest, "id">),
      }));
      setRequests(items);
    });
  }, []);

  const submitResponse = async (id: string) => {
    const answer = answers[id];
    if (!answer) return;
    await axios.post("http://localhost:5000/respond", {
      request_id: id,
      answer,
    });
    setAnswers((prev) => ({ ...prev, [id]: "" }));
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Header onOpenModal={() => {}} />

      <Container maxWidth="md" sx={{ mt: 6, mb: 6 }}>
        <Box
          sx={{
            borderRadius: 6,
            p: 4,
            background: " rgba(33,150,243,0.1)",
            minHeight: requests.length === 0 ? 540 : "auto",
            maxHeight: 540,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mt={2}
          >
            <Typography variant="h5" fontWeight={700} color="primary">
              Supervisor Dashboard
            </Typography>

            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Status</InputLabel>
              <Select
                label="Status"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="resolved">Resolved</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {requests.length === 0 ? (
            <Box
              flex={1}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <h3 style={{ color: "grey" }}>
                The board is clear. No pending requests!
              </h3>
            </Box>
          ) : (
            <Box
              sx={{
                maxHeight: "65vh",
                overflowY: "auto",
                mt: 3,
                pr: 1,
                "&::-webkit-scrollbar": { display: "none" },
                scrollbarWidth: "none",
              }}
              display="flex"
              flexDirection="column"
              gap={3}
            >
              {[...requests]
                .filter((r) =>
                  filterStatus === "all" ? true : r.status === filterStatus
                )
                .reverse()
                .map((r, index) => (
                  <HelpRequestCard
                    key={r.id}
                    request={r}
                    index={index}
                    answer={answers[r.id] || ""}
                    onAnswerChange={(val) =>
                      setAnswers((prev) => ({ ...prev, [r.id]: val }))
                    }
                    onSubmit={() => submitResponse(r.id)}
                  />
                ))}
            </Box>
          )}
        </Box>
      </Container>
      <FilterDialog
        open={filterOpen}
        selected={filterStatus}
        onClose={() => setFilterOpen(false)}
        onSelect={(val) => {
          setFilterStatus(val as "all" | "pending" | "resolved");
          setFilterOpen(false);
        }}
      />
    </Box>
  );
}
