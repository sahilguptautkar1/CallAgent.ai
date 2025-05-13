// 📁 src/components/FilterDialog.tsx
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";

interface Props {
  open: boolean;
  selected: string;
  onClose: () => void;
  onSelect: (value: string) => void;
}

export default function FilterDialog({
  open,
  selected,
  onClose,
  onSelect,
}: Props) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Select Status Filter</DialogTitle>
      <DialogContent>
        <FormControl component="fieldset">
          <RadioGroup
            value={selected}
            onChange={(e) => onSelect(e.target.value)}
          >
            <FormControlLabel value="all" control={<Radio />} label="All" />
            <FormControlLabel
              value="pending"
              control={<Radio />}
              label="Pending"
            />
            <FormControlLabel
              value="resolved"
              control={<Radio />}
              label="Resolved"
            />
          </RadioGroup>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
