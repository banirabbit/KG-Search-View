import Snackbar, { SnackbarOrigin } from "@mui/material/Snackbar";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { AppState } from "../../../store";



export default function FailAlert() {
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const failMessage = useSelector(
    (state: AppState) => state.graphProject.failMessage
  );
  useEffect(() => {
    if(failMessage !== "")
        setOpen(true);
  }, [failMessage]);
  return (
    <Snackbar
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      open={open}
      onClose={handleClose}
      message={failMessage}
      sx={{
        "& .MuiPaper-root.MuiSnackbarContent-root": {
          backgroundColor: "#EA2A57",
        },
      }}
    />
  );
}
