import { Box, Typography } from "@mui/material";
import React from "react";

interface Props {
  transcript: string;
  transcriptRef: React.RefObject<HTMLDivElement | null>;
}

export default function QuestionBox({ transcript, transcriptRef }: Props) {
  return (
    <Box mt={4} textAlign="left">
      <Typography variant="subtitle2" gutterBottom color="textSecondary">
        <strong>Question:</strong>
      </Typography>
      <Box
        ref={transcriptRef}
        sx={{
          height: 50,
          overflowY: "auto",
          border: "1px solid",
          borderColor: "grey.300",
          borderRadius: 2,
          p: 1,
          mb: 3,
          backgroundColor: "white",
        }}
      >
        <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
          {transcript || (
            <Typography color="grey" fontSize={15}>
              Click on <strong>Start</strong> to ask a question.
            </Typography>
          )}
        </Typography>
      </Box>
    </Box>
  );
}
