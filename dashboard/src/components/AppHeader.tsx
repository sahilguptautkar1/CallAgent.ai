import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { PermPhoneMsg } from "@mui/icons-material";
import { useLocation } from "react-router-dom";

interface Props {
  onOpenModal: () => void;
}

export default function AppHeader({ onOpenModal }: Props) {
  const location = useLocation();
  const showCallHistory = location.pathname === "/voice";

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            fontSize: "1.4rem",
            ml: 1,
            display: "flex",
            alignItems: "center",
            color: "grey.800",
          }}
        >
          CallAgent<span style={{ color: "primary.main" }}>.AI</span>
        </Typography>

        {showCallHistory && (
          <Button
            startIcon={<PermPhoneMsg />}
            variant="outlined"
            onClick={onOpenModal}
          >
            Call History
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
