import { FormControlLabel, IconButton } from "@mui/material";
import Switch, { SwitchProps } from "@mui/material/Switch";
import { styled } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../../../../store";
import { setMapModel } from "../../../../actions/graphProjectAction";
import CustomizedSlider from "./CustomizedSlider";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import RemoveIcon from "@mui/icons-material/Remove";
import { useState } from "react";
import AddEdgeDialog from "./AddEdgeDialog";
import AddNodeDialog from "./AddNodeDialog";
import DeleteNodeDialog from "./DeleteNodeDialog";
import DeleteEdgeDialog from "./DeleteEdgeDialog";
interface ChildProps {
  contentOpen: any;
}
export default function Actions({ contentOpen }: ChildProps) {
  const isMapModel = useSelector(
    (state: AppState) => state.graphProject.isMapModel
  );
  const dispatch = useDispatch();
  const IOSSwitch = styled((props: SwitchProps) => (
    <Switch
      focusVisibleClassName=".Mui-focusVisible"
      disableRipple
      {...props}
    />
  ))(({ theme }) => ({
    width: 38,
    height: 20,
    padding: 0,
    "& .MuiSwitch-switchBase": {
      padding: 0,
      margin: 2,
      transitionDuration: "300ms",
      "&.Mui-checked": {
        transform: "translateX(16px)",
        color: "#fff",
        "& + .MuiSwitch-track": {
          backgroundColor: "#D1A9B5",
          opacity: 1,
          border: 0,
        },
        "&.Mui-disabled + .MuiSwitch-track": {
          opacity: 0.5,
        },
      },
      "&.Mui-focusVisible .MuiSwitch-thumb": {
        color: "#33cf4d",
        border: "6px solid #fff",
      },
      "&.Mui-disabled .MuiSwitch-thumb": {
        color:
          theme.palette.mode === "light"
            ? theme.palette.grey[100]
            : theme.palette.grey[600],
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
      },
    },
    "& .MuiSwitch-thumb": {
      boxSizing: "border-box",
      width: 16,
      height: 16,
    },
    "& .MuiSwitch-track": {
      borderRadius: 20 / 2,
      backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
      opacity: 1,
      transition: theme.transitions.create(["background-color"], {
        duration: 500,
      }),
    },
  }));
  const handleMapOpen = () => {
    if (isMapModel) {
      dispatch(setMapModel(false));
    } else {
      dispatch(setMapModel(true));
    }
  };
  const [addEdgeOpen, setAddEdgeOpen] = useState(false);
  const [addNodeOpen, setAddNodeOpen] = useState(false);
  const [removeNodeOpen, setRemoveNodeOpen] = useState(false);
  const [removeEdgeOpen, setRemoveEdgeOpen] = useState(false);
  return (
    <div
      className={`nodestyleContainer ${contentOpen.actions ? "" : "closed"}`}
    >
      <ul className="nodestyle">
        <li>
          <div style={{ lineHeight: "20px" }}>MapModel </div>
          <IOSSwitch
            sx={{ m: 1 }}
            checked={isMapModel}
            onClick={handleMapOpen}
          />
        </li>
        <li>
          <div className="divider"></div>
        </li>

        <li className="nodeNumber">
          <div style={{ lineHeight: "20px",width:"80px",display:"inline-block" }} >Relationships</div>
          <CustomizedSlider></CustomizedSlider>
        </li>
        <li>
          <div className="divider"></div>
        </li>
        <li>
          <div className="addNodeEdge">
            <div style={{ lineHeight: "20px", marginBottom: "0px" }}>
              Add Node
            </div>
            <IconButton
              onClick={() => setAddNodeOpen(true)}
              style={{ width: "24px", height: "24px", marginLeft: "8px" }}
            >
              <AddOutlinedIcon></AddOutlinedIcon>
            </IconButton>
          </div>
        </li>
        <li>
          <div className="divider"></div>
        </li>
        <li>
          <div className="addNodeEdge">
            <div style={{ lineHeight: "20px", marginBottom: "0px" }}>
              Add Edge
            </div>
            <IconButton
              style={{ width: "24px", height: "24px", marginLeft: "8px" }}
              onClick={() => setAddEdgeOpen(true)}
            >
              <AddOutlinedIcon></AddOutlinedIcon>
            </IconButton>
          </div>
        </li>
        <li>
          <div className="divider"></div>
        </li>
        <li>
          <div className="addNodeEdge">
            <div style={{ lineHeight: "20px", marginBottom: "0px" }}>
              Remove Node
            </div>
            <IconButton
              style={{ width: "24px", height: "24px", marginLeft: "8px" }}
              onClick={() => setRemoveNodeOpen(true)}
            >
              <RemoveIcon></RemoveIcon>
            </IconButton>
          </div>
        </li>
        <li>
          <div className="divider"></div>
        </li>
        <li>
          <div className="addNodeEdge">
            <div style={{ lineHeight: "20px", marginBottom: "0px" }}>
              Remove Edge
            </div>
            <IconButton
              style={{ width: "24px", height: "24px", marginLeft: "8px" }}
              onClick={() => setRemoveEdgeOpen(true)}
            >
              <RemoveIcon></RemoveIcon>
            </IconButton>
          </div>
        </li>
      </ul>
      <AddEdgeDialog
        open={addEdgeOpen}
        setOpen={setAddEdgeOpen}
      ></AddEdgeDialog>
      <AddNodeDialog
        open={addNodeOpen}
        setOpen={setAddNodeOpen}
      ></AddNodeDialog>
      <DeleteNodeDialog
        open={removeNodeOpen}
        setOpen={setRemoveNodeOpen}
      ></DeleteNodeDialog>
      <DeleteEdgeDialog
        open={removeEdgeOpen}
        setOpen={setRemoveEdgeOpen}
      ></DeleteEdgeDialog>
    </div>
  );
}
