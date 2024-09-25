import Snackbar, { SnackbarOrigin } from "@mui/material/Snackbar";

interface ChildProps {
  text: string;
  open: boolean;
  setOpen: any;
}

export default function WarnAlert({ text, open, setOpen }: ChildProps) {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Snackbar
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      open={open}
      onClose={handleClose}
      message={"WARN:" + text}
      sx={{
        "& .MuiPaper-root.MuiSnackbarContent-root": {
          backgroundColor: "#FF5A34",
        },
      }}
    />
  );
}
