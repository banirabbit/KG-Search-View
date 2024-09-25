import Snackbar, { SnackbarOrigin } from "@mui/material/Snackbar";

interface ChildProps {
  text: string;
  open: boolean;
  setOpen: any;
}

export default function InfoAlert({ text, open, setOpen }: ChildProps) {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Snackbar
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      open={open}
      onClose={handleClose}
      message={text}
      sx={{
        "& .MuiPaper-root.MuiSnackbarContent-root": {
          backgroundColor: "#7DA8FF",
        },
      }}
    />
  );
}
