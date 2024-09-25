import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../../../store";
import "./index.css";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { IconButton } from "@mui/material";
import { useEffect } from "react";

export default function RightTopStatistic() {
  const { length, selectedNodes, total, relationships, relationNumber, schemaCover } = useSelector(
    (state: AppState) => state.graphProject
  );
  return (
    <div className="RightTop">
      <ul>
        <li>
          <div>
            {length === undefined ? 0 : length}:
            {total === undefined ? 0 : total}
          </div>
          <div>Nodes</div>
        </li>
        <li>
          <div>
            {relationships === undefined ? 0 : relationships}:
            {relationNumber === undefined ? 0 : relationNumber}
          </div>
          <div>Relationships</div>
        </li>
        <li>
          <div>{selectedNodes === undefined ? 0 : selectedNodes}</div>
          <div>Selected Nodes</div>
        </li> 
      </ul>
    </div>
  );
}
