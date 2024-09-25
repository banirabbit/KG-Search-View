import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { deleteEdgeData } from "../../../../actions/graphProjectAction";
interface props {
  open: boolean;
  setOpen: any;
}
export default function DeleteEdgeDialog({ open, setOpen }: props) {
  const handleClose = () => {
    setOpen(false);
    setAddClick(false)
  };
  const [newEdge, setNewEdge] = useState({
    sourceNode: "",
    targetNode: "",
    label: "",
  });
  const dispatch = useDispatch();
  const [addClick, setAddClick] = useState(false);
  return (
    <React.Fragment>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Delete Edge</DialogTitle>
        <DialogContent>
          <DialogContentText>移除一组关系</DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="source-node"
            name="source-node"
            label="Source Node ID"
            value={newEdge.sourceNode}
            onChange={(e) => {
              setNewEdge({ ...newEdge, sourceNode: e.target.value });
            }}
            fullWidth
            variant="standard"
            error={addClick && newEdge.sourceNode === ""}
          />
          <TextField
            required
            margin="dense"
            id="target-node"
            name="target-node"
            label="Target Node ID"
            value={newEdge.targetNode}
            onChange={(e) => {
              setNewEdge({ ...newEdge, targetNode: e.target.value });
            }}
            fullWidth
            variant="standard"
            error={addClick && newEdge.targetNode === ""}
          />
          <TextField
            required
            margin="dense"
            id="type"
            name="type"
            label="Edge Type"
            value={newEdge.label}
            onChange={(e) => {
              setNewEdge({ ...newEdge, label: e.target.value });
            }}
            fullWidth
            variant="standard"
            error={addClick && newEdge.label === ""}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={() => {
              let error = false;
              if (
                newEdge.sourceNode === "" ||
                newEdge.targetNode === "" ||
                newEdge.label === ""
              )
                error = true;
              if(!error) {
                setAddClick(false)
                dispatch(
                  deleteEdgeData({
                    start_id: newEdge.sourceNode,
                    end_id: newEdge.targetNode,
                    type: newEdge.label,
                  })
                );
                setOpen(false);
              }else {
                setAddClick(true)
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
