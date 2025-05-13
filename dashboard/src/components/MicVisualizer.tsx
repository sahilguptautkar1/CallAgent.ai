import { Box } from "@mui/material";
import { Mic } from "@mui/icons-material";

interface Props {
  micOn: boolean;
  listening: boolean;
}

export default function MicVisualizer({ micOn, listening }: Props) {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      my={2}
      height={140}
    >
      <Box sx={{ position: "relative", width: 80, height: 80 }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            border: "3px solid",
            borderColor: micOn ? "primary.main" : "grey.400",
            backgroundColor: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 3,
          }}
        >
          <Mic color={micOn ? "primary" : "disabled"} />
        </Box>

        {[...Array(3)].map((_, i) => (
          <Box
            key={i}
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: 80,
              height: 80,
              borderRadius: "50%",
              border: micOn ? "2px solid" : "2px dashed",
              borderColor: micOn ? "primary.main" : "grey.300",
              transform: "translate(-50%, -50%)",
              animation:
                micOn && listening
                  ? `pulseRipple 1.6s ease-out infinite`
                  : "none",
              animationDelay: `${i * 0.4}s`,
              zIndex: 1,
            }}
          />
        ))}

        <style>{`
          @keyframes pulseRipple {
            0% {
              transform: translate(-50%, -50%) scale(1);
              opacity: 0.6;
            }
            100% {
              transform: translate(-50%, -50%) scale(1.8);
              opacity: 0;
            }
          }
        `}</style>
      </Box>
    </Box>
  );
}
