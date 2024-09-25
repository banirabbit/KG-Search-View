import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import MenuItem from "@mui/material/MenuItem";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import "./LayoutDialog.css";
import { setLayoutInfo } from "../../../actions/graphProjectAction";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../../../store";
import { useState } from "react";
import {
  FormControl,
  Grid,
  InputLabel,
  Select,
  Switch,
  Typography,
} from "@mui/material";
import NumberInput from "../NumberInput";
import Radial from "./Radial";
import Force from "./Force";
import Dagre from "./Dagre";

interface ChildProps {
  open: any;
  setOpen: any;
}

export default function LayoutDialog({ open, setOpen }: Readonly<ChildProps>) {
  const [type, setType] = useState("dagre");
  const layoutLabel = [
    {
      value: "random",
      label: "随机布局",
    },
    {
      value: "gForce",
      label: "力导向布局",
    },
    {
      value: "circular",
      label: "环形布局",
    },
    {
      value: "radial",
      label: "辐射布局",
    },
    {
      value: "dagre",
      label: "层次布局",
    },
  ];
  const dispatch = useDispatch();
  const [param, setParam] = useState(false);
  //屏幕中心
  const [centerNumber, setCenterNumber] = useState({
    from: window.innerWidth / 2,
    to: window.innerHeight / 2,
  });
  const focus = useSelector(
    (state: AppState) => state.graphProject.radialFocusNode
  );
  //环形布局的参数
  const [radius, setRadius] = useState(400);
  const [check, setCheck] = useState(false);
  const [divisions, setDivisions] = useState(5);
  const [order, setOrder] = useState("degree");
  const [angle, setAngle] = useState(1);
  //辐射布局的参数
  const [linkDis, setLinkDis] = useState(300); //边长度
  const [maxIter, setMaxIter] = useState(1000); //停止迭代到最大迭代数
  const [focusNode, setFocusNode] = useState("26949"); //辐射的中心点
  const [unitRadius, setUnitRadius] = useState(100); //每一圈距离上一圈的距离
  const [sort, setSort] = useState("undefined"); //同层节点布局后相距远近的依据
  const [prevOverlap, setPrevOverlap] = useState(true); //是否防止重叠
  const [strict, setStrict] = useState(true); //是否必须是严格的 radial 布局，及每一层的节点严格布局在一个环上
  const [worker, setWorker] = useState(true); //是否启用 web-worker 以防布局计算时间过长阻塞页面交互
  //层次布局的参数
  const [begin, setBegin] = useState({
    from: window.innerWidth * 0.15,
    to: window.innerHeight / 2 - window.innerHeight * 0.15,
  });
  const [rank, setRank] = useState("LR"); // 布局的方向。T：top（上）；B：bottom（下）；L：left（左）；R：right（右）。
  const [align, setAlign] = useState("DL"); // 节点对齐方式。U：upper（上）；D：down（下）；L：left（左）；R：right（右）
  const [nodesep, setNodeSep] = useState(50); // 节点间距（px）。在rankdir 为 'TB' 或 'BT' 时是节点的水平间距；在rankdir 为 'LR' 或 'RL' 时代表节点的竖直方向间距
  const [ranksep, setRankSep] = useState(50); // 层间距（px）。在rankdir 为 'TB' 或 'BT' 时是竖直方向相邻层间距；在rankdir 为 'LR' 或 'RL' 时代表水平方向相邻层间距
  const [ctrPoints, setCtrPoints] = useState(true); //是否保留布局连线的控制点

  const isBigModel = useSelector(
    (state: AppState) => state.graphProject.isBigModel
  );
  //力导向布局节点间力的设置
  const nodeStrength = (d: any) => {
    if (d.isLeaf) {
      return -150;
    }
    return 10;
  };
  const handleSet = async () => {
    if (type === "circular") {
      dispatch(
        setLayoutInfo({
          type: type,
          center: [centerNumber.from, centerNumber.to],
          radius: radius,
          divisions: divisions,
          ordering: order,
          clockwise: check,
          angleRatio: angle,
        })
      );
    } else if (type === "random") {
      dispatch(
        setLayoutInfo({
          type: type,
          center: [centerNumber.from, centerNumber.to],
        })
      );
    } else if (type === "radial") {
      dispatch(
        setLayoutInfo({
          type: type,
          center: [centerNumber.from, centerNumber.to],
          linkDistance: linkDis,
          maxIteration: maxIter,
          focusNode: focus === "" ? focusNode : focus,
          unitRadius: unitRadius,
          preventOverlap: prevOverlap,
          sortBy: sort,
          nodeSize: 70,
          strictRadial: strict,
          workerEnabled: worker,
        })
      );
    } else if (type === "gForce") {
      if (isBigModel) {
        dispatch(setLayoutInfo({ type: "force2", workerEnabled: true }));
      } else {
        dispatch(
          setLayoutInfo({
            type: "gForce",
            minMovement: 0.01,
            maxIteration: 5000,
            preventOverlap: true,
            damping: 0.99,
            linkdistance: 400,
          })
        );
      }
    } else if (type === "dagre") {
      dispatch(
        setLayoutInfo({
          type: type,
          // begin: [begin.from, begin.to],
          // rankdir: rank,
          // align: align,
          // nodesep: nodesep,
          // ranksep: ranksep,

          nodesepFunc: (d: any) => {
            if (d.id === "3") {
              return 500;
            }
            return 50;
          },
          ranksep: 70,
          controlPoints: false,
        })
      );
    }
    setOpen(false);
    setParam(false);
  };
  const handleClose = () => {
    setOpen(false);
    setParam(false);
  };
  const handleparamOpen = () => {
    if (param === true) {
      setParam(false);
    } else {
      setParam(true);
    }
  };
  return (
    <Dialog open={open}>
      <DialogTitle>选择布局</DialogTitle>

      <DialogContent>
        <TextField
          id="standard-select-layout"
          select
          label="Select Layout"
          value={type}
          variant="standard"
        >
          {layoutLabel.map((option) => (
            <MenuItem
              key={option.value}
              value={option.value}
              onClick={() => setType(option.value)}
            >
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>
      <DialogContent>
        <Button
          id="settingButton"
          onClick={handleparamOpen}
          variant="outlined"
          startIcon={<SettingsOutlinedIcon />}
        >
          修改参数
        </Button>
      </DialogContent>
      <DialogContent>
        {param && (
          <div>
            {type === "circular" ? (
              <Grid
                container
                direction="column"
                spacing={2}
                sx={{ fontSize: 17, color: "#434D5B" }}
              >
                <Grid item>
                  <Grid
                    container
                    direction="row"
                    spacing={3}
                    alignItems="center"
                  >
                    <Grid item>Center: [</Grid>
                    <Grid item>
                      <NumberInput
                        value={centerNumber.from}
                        onChange={(event: any) => {
                          if (event.target.value !== undefined) {
                            setCenterNumber((pre) => ({
                              ...pre,
                              from: event.target.value,
                            }));
                          }
                        }}
                      />
                    </Grid>
                    <Grid item>,</Grid>
                    <Grid item>
                      <NumberInput
                        value={centerNumber.to}
                        onChange={(event: any) => {
                          if (event.target.value !== undefined) {
                            setCenterNumber((pre) => ({
                              ...pre,
                              to: event.target.value,
                            }));
                          }
                        }}
                      />
                    </Grid>
                    <Grid item>]</Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <Grid
                    container
                    direction="row"
                    spacing={4}
                    alignItems="center"
                  >
                    <Grid item>Radius:</Grid>
                    <Grid item>
                      <NumberInput
                        value={radius}
                        onChange={(event: any, val: number | undefined) => {
                          if (event.target.value !== undefined) {
                            setRadius(event.target.value);
                          }
                        }}
                      />
                    </Grid>
                    <Grid item>Clockwise:</Grid>
                    <Grid item>
                      False
                      <Switch
                        checked={check}
                        onChange={(
                          event: React.ChangeEvent<HTMLInputElement>
                        ) => {
                          setCheck(event.target.checked);
                        }}
                        inputProps={{ "aria-label": "controlled" }}
                      />
                      True
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <Grid
                    container
                    direction="row"
                    spacing={3}
                    alignItems="center"
                  >
                    <Grid item>Divisions: </Grid>
                    <Grid item>
                      <NumberInput
                        value={divisions}
                        onChange={(event: any, val: number | undefined) => {
                          if (event.target.value !== undefined) {
                            setDivisions(event.target.value);
                          }
                        }}
                      />
                    </Grid>
                    <Grid item>Ordering: </Grid>
                    <Grid item>
                      <FormControl
                        variant="standard"
                        sx={{ m: 1, minWidth: 90 }}
                      >
                        <Select
                          id="circule-order-select"
                          value={order}
                          label="Order"
                        >
                          <MenuItem
                            value={"degree"}
                            onClick={() => setOrder("degree")}
                          >
                            按度数大小排序
                          </MenuItem>
                          <MenuItem
                            value={"null"}
                            onClick={() => setOrder("null")}
                          >
                            按数据顺序排序
                          </MenuItem>
                          <MenuItem
                            value={"topology"}
                            onClick={() => setOrder("topology")}
                          >
                            拓扑排序
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <Grid
                    container
                    direction="row"
                    spacing={1}
                    alignItems="center"
                  >
                    <Grid item>AngleRatio: </Grid>
                    <Grid item>
                      <NumberInput
                        value={angle}
                        onChange={(event: any, val: number | undefined) => {
                          if (event.target.value !== undefined) {
                            setAngle(event.target.value);
                          }
                        }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            ) : type === "random" ? (
              // Render content for "random"
              <Grid
                container
                direction="row"
                spacing={3}
                alignItems="center"
                sx={{ fontSize: 17, color: "#434D5B" }}
              >
                <Grid item>Center: [</Grid>
                <Grid item>
                  <NumberInput
                    value={centerNumber.from}
                    onChange={(event: any, val: number | undefined) => {
                      if (event.target.value !== undefined) {
                        setCenterNumber((pre) => ({
                          ...pre,
                          from: event.target.value,
                        }));
                      }
                    }}
                  />
                </Grid>
                <Grid item>,</Grid>
                <Grid item>
                  <NumberInput
                    value={centerNumber.to}
                    onChange={(event: any, val: number | undefined) => {
                      if (event.target.value !== undefined) {
                        setCenterNumber((pre) => ({
                          ...pre,
                          to: event.target.value,
                        }));
                      }
                    }}
                  />
                </Grid>
                <Grid item>]</Grid>
              </Grid>
            ) : type === "radial" ? (
              // Render  content for radial
              <Radial
                centerNumber={centerNumber}
                setCenterNumber={setCenterNumber}
                linkDis={linkDis}
                setLinkDis={setLinkDis}
                maxIter={maxIter}
                setMaxIter={setMaxIter}
                focusNode={focusNode}
                setFocusNode={setFocusNode}
                unitRadius={unitRadius}
                setUnitRadius={setUnitRadius}
                sort={sort}
                setSort={setSort}
                prevOverlap={prevOverlap}
                setPrevOverlap={setPrevOverlap}
                strict={strict}
                setStrict={setStrict}
                worker={worker}
                setWorker={setWorker}
              ></Radial>
            ) : type === "gForce" ? (
              <Force
                centerNumber={centerNumber}
                setCenterNumber={setCenterNumber}
                linkDis={linkDis}
                setLinkDis={setLinkDis}
              ></Force>
            ) : type === "dagre" ? (
              <Dagre
                centerNumber={begin}
                setCenterNumber={setBegin}
                rank={rank}
                setRank={setRank}
                align={align}
                setAlign={setAlign}
                nodesep={nodesep}
                setNodeSep={setNodeSep}
                ranksep={ranksep}
                setRankSep={setRankSep}
                ctrPoints={ctrPoints}
                setCtrPoints={setCtrPoints}
              ></Dagre>
            ) : (
              <></>
            )}
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>取消</Button>
        <Button onClick={handleSet}>确认</Button>
      </DialogActions>
    </Dialog>
  );
}
