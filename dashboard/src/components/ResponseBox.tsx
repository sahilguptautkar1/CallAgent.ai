import { Box, Typography } from "@mui/material";

interface Props {
  response: string;
}

export default function ResponseBox({ response }: Props) {
  return (
    <Box textAlign="left">
      <Typography variant="subtitle2" gutterBottom color="textSecondary">
        <strong>Response:</strong>
      </Typography>
      <Box
        sx={{
          height: 50,
          overflowY: "auto",
          border: "1px solid",
          borderColor: "grey.300",
          borderRadius: 2,
          p: 1,
          backgroundColor: "white",
        }}
      >
        <Typography variant="body2">
          {response || (
            <Typography color="grey" fontSize={15}>
              No response yet.
            </Typography>
          )}
        </Typography>
      </Box>
    </Box>
  );
}
