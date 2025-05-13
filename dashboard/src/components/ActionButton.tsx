import { Button } from "@mui/material";
import { Mic, Stop, RestartAlt, SettingsVoice } from "@mui/icons-material";

interface Props {
  micOn: boolean;
  isProcessing: boolean;
  transcript: string;
  recordingComplete: boolean;
  toggleMic: () => void;
  handleReset: () => void;
}

export default function ActionButtons({
  micOn,
  isProcessing,
  toggleMic,
  handleReset,
}: Props) {
  return (
    <ButtonGroupWrapper>
      <Button
        onClick={toggleMic}
        startIcon={micOn ? <SettingsVoice /> : <Mic />}
        variant="contained"
        color={micOn ? "error" : "success"}
        sx={buttonStyle}
      >
        {micOn ? "Listening" : "Call"}
      </Button>

      <Button
        startIcon={<RestartAlt />}
        variant="outlined"
        color="warning"
        onClick={handleReset}
        sx={buttonStyle}
      >
        Reset
      </Button>
    </ButtonGroupWrapper>
  );
}

const buttonStyle = {
  width: 120,
  height: 48,
  fontWeight: 600,
  fontSize: 16,
  textTransform: "none",
  boxShadow: 3,
};

const ButtonGroupWrapper = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      marginTop: "2rem",
      display: "flex",
      justifyContent: "center",
      gap: "16px",
      flexWrap: "wrap",
    }}
  >
    {children}
  </div>
);
