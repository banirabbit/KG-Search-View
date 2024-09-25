import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { IconButton, Stack } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import Item from "antd/es/list/Item";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { getGraphNode, updateNodeData } from "../../../../actions/graphProjectAction";
interface props {
  open: boolean;
  setOpen: any;
}
export default function AddNodeDialog({ open, setOpen }: props) {
  const handleClose = () => {
    setOpen(false);
    setAddClick(false)
  };
  const [newNodeItem, setNewNodeItem] = useState([
    { id: 0, label: "name", value: "", error:false },
    { id: 1, label: "class", value: "", error:false },
  ]);
  const onAddNewProperty = () => {
    let thisId = newNodeItem.length;
    setNewNodeItem([...newNodeItem, { id: thisId, label: "", value: "", error:false }]);
  };
  const dispatch = useDispatch();
  const [addClick, setAddClick] = useState(false);
  return (
    <React.Fragment>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Node</DialogTitle>
        <DialogContent>
          <DialogContentText>加入一个节点</DialogContentText>
          <Stack direction="column" spacing={3} mt={2}>
            {newNodeItem.map((item) => (
              <Stack direction="row" spacing={5}>
                <TextField
                  required
                  disabled={item.label === "name" || item.label === "class"}
                  autoFocus
                  margin="dense"
                  id={"label" + item.id}
                  sx={{ width: "100px" }}
                  value={item.label}
                  label={"label"}
                  variant="standard"
                  onChange={(e) => {
                    let error = false
                    newNodeItem.forEach((i)=>{
                      if(i.label === e.target.value) error=true
                    })
                    setNewNodeItem((prevState) => {
                      const newArray = [...prevState];
                      newArray[item.id] = { ...item, label: e.target.value, error:error };
                      return newArray;
                    });
                    
                  }}
                  error={(addClick && newNodeItem[item.id].value === "") || item.error}
                />

                <TextField
                  required
                  fullWidth
                  margin="dense"
                  id="name"
                  value={item.value}
                  label="Input Property"
                  variant="standard"
                  onChange={(e) => {
                    setNewNodeItem((prevState) => {
                      const newArray = [...prevState];
                      newArray[item.id] = { ...item, value: e.target.value };
                      return newArray;
                    });
                    
                  }}
                  error={addClick && newNodeItem[item.id].value === ""}
                />

                <IconButton
                  disabled={item.label === "name" || item.label === "class"}
                  onClick={() => {
                    let tempArray = newNodeItem.filter((i) => i.id !== item.id);
                    setNewNodeItem(tempArray);
                  }}
                >
                  <RemoveCircleOutlineIcon></RemoveCircleOutlineIcon>
                </IconButton>
              </Stack>
            ))}

            <Item>
              <Button
                variant="outlined"
                endIcon={<AddCircleOutlineIcon />}
                onClick={onAddNewProperty}
                sx={{ width: "100%" }}
              >
                Add Property
              </Button>
            </Item>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={() => {
              let props: any = {};
              let error = false;
              newNodeItem.forEach((item) => {
                if (
                  item.label === "" || item.value === "" || item.error
                ) {
                  error = true;
                }
                props[item.label] = item.value;
              });
              if (!error) {
                setAddClick(false)
                dispatch(updateNodeData(props));
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
