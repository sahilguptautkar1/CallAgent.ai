import { Box, Typography, Chip, Paper, TextField, Button } from "@mui/material";
import { HelpRequest } from "../types";

interface Props {
  request: HelpRequest;
  index: number;
  answer: string;
  onAnswerChange: (value: string) => void;
  onSubmit: () => void;
}

export default function HelpRequestCard({
  request,
  index,
  answer,
  onAnswerChange,
  onSubmit,
}: Props) {
  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 4,
        backgroundColor: "white",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        transition: "transform 0.2s",
        "&:hover": {
          transform: "scale(1.01)",
        },
      }}
    >
      {/* Top Row: Question */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="subtitle1" fontWeight={600} color="text.primary">
          {index + 1}. {request.question}?
        </Typography>
      </Box>

      {/* Meta Info */}
      <Box display="flex" justifyContent="space-between" gap={2} mb={2}>
        <Box display="flex" gap={2}>
          <Typography variant="body2" color="text.secondary">
            Created: {new Date(request.createdAt).toLocaleString()}
          </Typography>
        </Box>
        <Chip
          label={request.status === "pending" ? "Pending" : "Resolved"}
          color={request.status === "pending" ? "warning" : "success"}
          size="small"
          sx={{ fontWeight: 500 }}
        />
      </Box>

      {/* Response Section */}
      {request.status === "pending" ? (
        <>
          <TextField
            fullWidth
            multiline
            rows={2}
            variant="outlined"
            placeholder="Type your response..."
            value={answer}
            onChange={(e) => onAnswerChange(e.target.value)}
            sx={{ mb: 2, backgroundColor: "#f9f9f9", borderRadius: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={onSubmit}
            sx={{
              fontWeight: 600,
              textTransform: "none",
              px: 4,
              py: 1,
              borderRadius: 2,
            }}
          >
            Submit
          </Button>
        </>
      ) : (
        <Box mt={1}>
          <Typography
            variant="subtitle2"
            color="text.secondary"
            gutterBottom
            fontWeight={600}
          >
            Response:
          </Typography>
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              backgroundColor: "#f5f5f5",
              borderRadius: 2,
              maxHeight: 85,
              overflowY: "auto",
            }}
          >
            <Typography
              variant="body2"
              color="text.primary"
              sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
            >
              {request.answer}
            </Typography>
          </Paper>
        </Box>
      )}
    </Paper>
  );
}
