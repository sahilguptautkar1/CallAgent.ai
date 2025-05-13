import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
  Typography,
  Box,
  Chip,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { AskedQuestion } from "../types";

interface Props {
  open: boolean;
  onClose: () => void;
  questions: AskedQuestion[];
}

export default function AskedQuestionsDialog({
  open,
  onClose,
  questions,
}: Props) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ position: "relative", pr: 5 }}>
        Questions Asked
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <List>
          {questions.length === 0 ? (
            <Typography color="text.secondary" sx={{ textAlign: "center" }}>
              No questions asked yet.
            </Typography>
          ) : (
            questions.map((q, index) => (
              <Box key={index}>
                <ListItem
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    mb: 1,
                  }}
                >
                  <ListItemText
                    primary={`Q ${index + 1}: ${q.question}?`}
                    secondary={`Ans: ${q.answer}`}
                    primaryTypographyProps={{ variant: "body1" }}
                    secondaryTypographyProps={{
                      variant: "body1",
                      sx: { mt: 1, wordBreak: "break-word" },
                    }}
                  />
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    width="100%"
                    alignItems="center"
                  >
                    <Typography variant="body2" color="text.secondary">
                      Created: {new Date(q.createdAt).toLocaleString()}
                    </Typography>
                    <Chip
                      label={q.status === "pending" ? "Pending" : "Answered"}
                      color={q.status === "pending" ? "warning" : "success"}
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  </Box>
                </ListItem>
                {index < questions.length - 1 && <Divider />}
              </Box>
            ))
          )}
        </List>
      </DialogContent>
    </Dialog>
  );
}
