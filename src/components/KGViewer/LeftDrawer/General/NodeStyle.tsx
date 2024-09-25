import {
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import Switch, { SwitchProps } from "@mui/material/Switch";
import { styled } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { setLabelShow } from "../../../../actions/graphProjectAction";
import { AppState } from "../../../../store";
import { useEffect, useState } from "react";
interface ChildProps {
  contentOpen: any;
}
export default function NodeStyle({ contentOpen }: ChildProps) {
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
  const { labelShow, nodeStyle, isBigModel } = useSelector(
    (state: AppState) => state.graphProject
  );
  const dispatch = useDispatch();
  const onLabelChange = () => {
    dispatch(setLabelShow(!labelShow));
  };
  const [nodeLabel, setNodeLabel] = useState("");
  const [nodeColor, setNodeColor] = useState<any>();
  useEffect(() => {
    console.log(Object.keys(nodeStyle));
    if (Object.keys(nodeStyle).length > 0) {
      setNodeLabel(Object.keys(nodeStyle)[0]);
      setNodeColor(nodeStyle[Object.keys(nodeStyle)[0]].big);
    }
  }, [nodeStyle]);
  const handleChange = (event: SelectChangeEvent) => {
    setNodeLabel(event.target.value);
    console.log(event.target.value);
    setNodeColor(nodeStyle[event.target.value].big);
  };
  return (
    <div className={`nodestyleContainer ${contentOpen.node ? "" : "closed"}`}>
      <ul className="nodestyle">
        <li>
          <div style={{ lineHeight: "20px" }}>NodeLabel </div>
          <IOSSwitch
            sx={{ m: 1 }}
            checked={labelShow}
            onClick={onLabelChange}
          />
        </li>
        <li>
          <div className="divider"></div>
        </li>
        <li
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <FormControl
            variant="standard"
            sx={{
              m: 0,
              minWidth: 120,
              "& .MuiInputBase-input": {
                color: "#E0E3E7",
              },
              "& .MuiInputLabel-root": {
                color: "#E0E3E7",
              },
            }}
            size="small"
          >
            <Select
              labelId="demo-select-small-label"
              id="demo-select-small"
              value={nodeLabel}
              label="Node Label"
              onChange={handleChange}
            >
              {Object.keys(nodeStyle).map((key) => (
                <MenuItem value={key}>{key}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <div
            style={{
              backgroundColor: nodeColor,
              width: "35px",
              height: "20px",
              borderRadius: "3px",
            }}
          ></div>
        </li>
      </ul>
    </div>
  );
}
