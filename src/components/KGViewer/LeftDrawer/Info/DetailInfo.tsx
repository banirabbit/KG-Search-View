import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../../../../store";
import React, { useEffect, useState } from "react";
import DriveFileRenameOutlineOutlinedIcon from "@mui/icons-material/DriveFileRenameOutlineOutlined";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import { IconButton, TextField } from "@mui/material";
import { saveAs } from "file-saver";
import { unparse } from "papaparse";
import { editNodeInfo } from "../../../../actions/graphProjectAction";
import TableDialog from "./TableDialog";
interface editInfoType {
  id: number;
  props: any;
}
export default function DetailInfo() {
  const selectedInfo: { [key: string]: any } = useSelector(
    (state: AppState) => state.graphProject.selectedInfo
  );
  const { selectedNodes, selectedEdge } = useSelector(
    (state: AppState) => state.graphProject
  );

  const filterWords = [
    "style",
    "labelCfg",
    "img",
    "degree",
    "inDegree",
    "isReal",
    "label",
    "oriLabel",
    "labelLineNum",
    "oriFontSize",
    "type",
    "x",
    "y",
    "size",
    "outDegree",
    "__index_mapping",
    "__if_index",
    "relations",
    "color",
    "startPoint",
    "endPoint",
    "start",
    "end",
    "isRepeat",
  ];
  // 将对象的每一项映射为一个包含索引和值的对象数组
  const [editInfo, setEditInfo] = useState<any[]>([]);

  useEffect(() => {
    if (Object.keys(selectedInfo).length !== 0) {
      const filteredItems = Object.entries(selectedInfo)
        .filter(
          ([key]) =>
            filterWords.find((element) => element === key) === undefined
        )
        .map(([key, value], index) => ({
          id: index,
          key: key === "group" ? "node type" : key,
          value: value,
        }));
      setEditInfo(filteredItems);
      setIsNode(true);
      console.log(editInfo);
    }
  }, [selectedInfo]);

  const [showDiv, setShowDiv] = useState("detailInfoContainer");
  const [showUl, setShowUl] = useState("");
  const dispatch = useDispatch();

  const handleDivMouseEnter = () => {
    setShowDiv("detailInfoContainer customScrollbar");
  };
  const handleDivMouseLeave = () => {
    setShowDiv("detailInfoContainer");
  };
  const handleULMouseEnter = () => {
    setShowUl("customScrollbar");
  };
  const handleULMouseLeave = () => {
    setShowUl("");
  };
  const [editModel, setEditModel] = useState(false);
  const editChange = () => {
    setEditModel(!editModel);
  };
  const [editClick, setEditClick] = useState(false);
  const onEdit = () => {
    let newInfo: editInfoType = { id: 0, props: {} };
    let error = false;
    editInfo.forEach((item) => {
      if (item.key === "id") newInfo.id = parseInt(item.value);
      else newInfo.props[item.key] = item.value;
      if (item.value === "") error = true;
    });
    if (!error) {
      setEditClick(false);
      dispatch(editNodeInfo(newInfo));
      setEditModel(false);
    } else {
      setEditClick(true);
    }
  };
  const onEditCancel = () => {
    const filteredItems = Object.entries(selectedInfo)
      .filter(
        ([key]) => filterWords.find((element) => element === key) === undefined
      )
      .map(([key, value], index) => ({
        id: index,
        key: key === "group" ? "node type" : key,
        value: value,
      }));
    setEditInfo(filteredItems);
    setEditModel(false);
  };
  const [isNode, setIsNode] = useState(true);
  useEffect(() => {
    if (Object.keys(selectedEdge).length !== 0) {
      setIsNode(false);
      const filteredItems = Object.entries(selectedEdge)
        .filter(
          ([key]) =>
            filterWords.find((element) => element === key) === undefined
        )
        .map(([key, value], index) => ({
          id: index,
          key: key === "group" ? "edge type" : key,
          value: value,
        }));
      setEditInfo(filteredItems);
      console.log(editInfo);
    }
  }, [selectedEdge]);

  const handleDownload = () => {
    try {
      const csvData = isNode ? [selectedInfo] : [selectedEdge]
      const csv = unparse(csvData);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      saveAs(blob, "data.csv");
    } catch (err) {
      console.error("Error generating CSV:", err);
    }
  };
  const [tableOpen, setTableOpen] = useState(false);
  const handleTableClose = () => {
    setTableOpen(false);
  };
  return (
    <div
      className={showDiv}
      onMouseEnter={handleDivMouseEnter}
      onMouseLeave={handleDivMouseLeave}
    >
      <h2>{isNode ? selectedInfo.name : selectedEdge.label}</h2>
      <span style={{ margin: "5px", fontSize: "14px" }}>
        Selected {isNode ? "Node" : "Edge"}
      </span>
      <div className="detail">
        <div
          style={{
            margin: "5px",
            display: "flex",
            alignItems: "center",
            justifyContent: "left",
          }}
        >
          <div style={{ fontSize: "14px", fontWeight: "700" }}>
            {isNode ? "NODE" : "EDGE"} DATA
          </div>
          {editModel && isNode ? (
            <>
              <IconButton
                style={{ height: "14px", width: "14px", marginLeft: "10px" }}
                onClick={onEdit}
              >
                <CheckRoundedIcon></CheckRoundedIcon>
              </IconButton>{" "}
              <IconButton
                style={{ height: "14px", width: "14px", marginLeft: "10px" }}
                onClick={onEditCancel}
              >
                <ClearRoundedIcon></ClearRoundedIcon>
              </IconButton>
            </>
          ) : isNode ? (
            <IconButton
              style={{ height: "14px", width: "14px", marginLeft: "10px" }}
              onClick={editChange}
            >
              <DriveFileRenameOutlineOutlinedIcon></DriveFileRenameOutlineOutlinedIcon>
            </IconButton>
          ) : (
            <></>
          )}
        </div>
        <ul
          className={showUl}
          onMouseEnter={handleULMouseEnter}
          onMouseLeave={handleULMouseLeave}
        >
          {editInfo.map((item, index) => (
            <React.Fragment key={index}>
              <li style={{ fontWeight: 600 }}>{item.key}</li>
              <li style={{ color: "#ffffffa8" }}>
                {editModel &&
                item.key !== "id" &&
                item.key !== "name" &&
                item.key !== "class" ? (
                  <TextField
                    id={item.key}
                    value={item.value}
                    variant="outlined"
                    sx={{
                      width: "100%",
                      "& .MuiInputBase-input.MuiOutlinedInput-input": {
                        padding: "10px 8px",
                        color: "#ffffffa8",
                        fontSize: "14px",
                      },
                      color: "#ffffffa8",
                    }}
                    onChange={(e) => {
                      setEditInfo((prevState) => {
                        let newArray = [...prevState];
                        newArray[item.id] = { ...item, value: e.target.value };
                        return newArray;
                      });
                    }}
                    error={editClick && item.value === ""}
                  />
                ) : (
                  <>{item.value}</>
                )}
              </li>
              <div className="divider" style={{ marginBottom: 0 }}></div>
            </React.Fragment>
          ))}
        </ul>
      </div>
      <div className="detail" style={{ textAlign: "center" }}>
        <h4>FOUND {selectedNodes} RECORD</h4>
        <button
          style={{ backgroundColor: "#D1A9B5" }}
          onClick={() => {
            setTableOpen(true);
          }}
        >
          OPEN TABLE
        </button>
        <h4>EXPORT DATA</h4>
        <button style={{ backgroundColor: "#9BAFB8" }} onClick={handleDownload}>
          EXPORT
        </button>
      </div>
      <TableDialog
        open={tableOpen}
        handleClose={handleTableClose}
        selectedInfo={editInfo}
      ></TableDialog>
    </div>
  );
}
