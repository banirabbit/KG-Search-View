import { IconButton } from "@mui/material";
import Snackbar, { SnackbarOrigin } from "@mui/material/Snackbar";
import React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../../../store";
import CloseIcon from '@mui/icons-material/Close';
import { setMessageClose } from "../../../actions/graphProjectAction";
export default function SuccessAlert() {

  const dispatch = useDispatch();
  const handleClose = () => {
    dispatch(setMessageClose(false))
  };
  const {successMessage,successOpen} = useSelector(
    (state: AppState) => state.graphProject
  );
  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );
  return (
    <Snackbar
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      autoHideDuration={6000}
      open={successOpen}
      onClose={handleClose}
      message={successMessage}
      sx={{
        "& .MuiPaper-root.MuiSnackbarContent-root": {
          backgroundColor: "#559664",
        },
      }}
      action={action}
    />
  );
}
