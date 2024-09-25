import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../../../../store";
import { deleteNodeById } from "../../../../actions/graphProjectAction";

interface props {
  open: boolean;
  setOpen: any;
}
export default function DeleteNodeDialog({ open, setOpen }: props) {
  const handleClose = () => {
    setOpen(false);
    setAddClick(false)
  };
  const [removeNode, setRemoveNode] = useState({ id: "", name: "" });
  const graphData = useSelector(
    (state: AppState) => state.graphProject.graphData
  );

  const dispatch = useDispatch();
  const [addClick, setAddClick] = useState(false);
  return (
    <React.Fragment>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Remove Node</DialogTitle>
        <DialogContent>
          <DialogContentText>移除一个节点</DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="node-id"
            name="node-id"
            label="Node ID"
            value={removeNode.id}
            onChange={(e) => {
              setRemoveNode({ ...removeNode, id: e.target.value });
              graphData.nodes.forEach((item: any) => {
                if (item.id === e.target.value) {
                  setRemoveNode({ id: e.target.value, name: item.name });
                }
              });
            }}
            fullWidth
            variant="standard"
            error={addClick && removeNode.id === ""}
          />
          <TextField
            required
            margin="dense"
            id="node-name"
            name="node-name"
            label="Node Name"
            value={removeNode.name}
            onChange={(e) => {
              setRemoveNode({ ...removeNode, name: e.target.value });
              graphData.nodes.forEach((item: any) => {
                if (item.name === e.target.value) {
                  setRemoveNode({ id: item.id, name: item.name });
                }
              });
            }}
            fullWidth
            variant="standard"
            error={addClick && removeNode.name === ""}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={() => {
              let error = false;
              if (removeNode.id === "" || removeNode.name === "") error = true;
              if (!error) {
                setAddClick(false);
                dispatch(deleteNodeById(removeNode.id));
                setOpen(false);
              } else {
                setAddClick(true);
              }
            }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
