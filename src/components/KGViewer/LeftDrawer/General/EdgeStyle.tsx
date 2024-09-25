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
export default function EdgeStyle({ contentOpen }: ChildProps) {
  const { edgeStyle } = useSelector((state: AppState) => state.graphProject);

  const [edgeLabel, setEdgeLabel] = useState("");
  const [nodeColor, setNodeColor] = useState<any>();
  useEffect(() => {
    if (Object.keys(edgeStyle).length > 0) {
      setEdgeLabel(Object.keys(edgeStyle)[0]);
      setNodeColor(edgeStyle[Object.keys(edgeStyle)[0]].fill);
    }
  }, [edgeStyle]);
  const handleChange = (event: SelectChangeEvent) => {
    setEdgeLabel(event.target.value);
    console.log(event.target.value);

    setNodeColor(edgeStyle[event.target.value].fill);
  };
  return (
    <div className={`nodestyleContainer ${contentOpen.edge ? "" : "closed"}`}>
      <ul className="nodestyle">
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
              value={edgeLabel}
              label="Edge Label"
              onChange={handleChange}
            >
              {Object.keys(edgeStyle).map((key) => (
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
