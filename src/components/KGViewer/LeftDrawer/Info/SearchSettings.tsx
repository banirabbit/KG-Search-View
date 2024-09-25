import * as React from "react";
import Button from "@mui/material/Button";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import {
  Autocomplete,
  Box,
  Checkbox,
  Chip,
  Divider,
  FormControlLabel,
  Grid,
  Input,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Slider,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { SetStateAction, useEffect, useRef, useState } from "react";
import InsightsIcon from "@mui/icons-material/Insights";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import AutoComplete from "./AutoComplete";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers";
import EventIcon from "@mui/icons-material/Event";
import LoadingButton from "@mui/lab/LoadingButton";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../../../../store";
import {
  edgeSearchClassLimit,
  getEdgeLabels,
  searchNodesPath,
  getNodeLabels,
  nodeSearchClassLimit,
  setSearchResult,
  setSearchResCheck,
  searchNodeByName,
  SET_SUCCESS,
  SET_SUCCESS_OPEN,
} from "../../../../actions/graphProjectAction";
import dayjs, { Dayjs } from "dayjs";
import FastForwardIcon from "@mui/icons-material/FastForward";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import debounce from "lodash/debounce";
interface ChildProps {
  open: boolean;
  setOpen: (value: SetStateAction<boolean>) => void;
}
interface DateStateType {
  five: boolean;
  three: boolean;
  one: boolean;
}
type nodeTypeItem = { title: string; id: number };
type nodeTypeInterface = nodeTypeItem[];
// 定义对象的接口
interface MyObject {
  [key: string]: any;
}
// 定义深拷贝函数
export function deepCopy<T>(obj: T): T {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => deepCopy(item)) as any;
  }

  const copiedObj: MyObject = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      copiedObj[key] = deepCopy(obj[key]);
    }
  }
  return copiedObj as T;
}
export default function SearchSetting({ open, setOpen }: ChildProps) {
  const handleClose = () => {
    setOpen(false);
    setSearchType("");
  };
  const [searchType, setSearchType] = useState("");
  const handleSearchTypeChange = (e: SelectChangeEvent) => {
    setSearchType(e.target.value);
    setMaxWidth("md");
  };

  const [sliderValue, setSliderValue] = useState(0);
  const handleBlur = () => {
    if (sliderValue < 0) {
      setSliderValue(0);
    } else if (sliderValue > 8000) {
      setSliderValue(8000);
    }
  };
  const debounceTimeout = useRef<number | null>(null);
  //节点的slider和input
  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setSliderValue(newValue as number);
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = window.setTimeout(() => {
      if (typeValue.length > 0) {
        let classes = typeValue.map((item: any) => item.title);
        dispatch(
          nodeSearchClassLimit({
            classes: classes,
            limit: newValue === 0 ? 100 : newValue,
          })
        );
      }
    }, 1000);
  };
  const inputDebounceTimeout = useRef<number | null>(null);
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSliderValue(event.target.value === "" ? 0 : Number(event.target.value));
    if (inputDebounceTimeout.current) {
      clearTimeout(inputDebounceTimeout.current);
    }
    inputDebounceTimeout.current = window.setTimeout(() => {
      if (typeValue.length > 0) {
        let classes = typeValue.map((item: any) => item.title);
        dispatch(
          nodeSearchClassLimit({
            classes: classes,
            limit:
              Number(event.target.value) === 0
                ? 100
                : Number(event.target.value),
          })
        );
      }
    }, 1000);
  };
  const [maxWidth, setMaxWidth] = useState<DialogProps["maxWidth"]>("sm");
  const [fullWidth, setFullWidth] = useState(true);
  const {
    nodeLabels,
    edgeLabels,
    searchOriginNodes,
    resCheck,
    searchOriginEdge,
    searchOriginPath,
    searchOriginFuzzy,
    searchTime
  } = useSelector((state: AppState) => state.graphProject);
  const dispatch = useDispatch();
  const [nodeType, setNodeType] = useState<nodeTypeInterface>([]);
  useEffect(() => {
    dispatch(getNodeLabels());
  }, [dispatch]);
  useEffect(() => {
    let typeList: nodeTypeInterface = [];
    if (nodeLabels !== undefined && nodeLabels.length !== 0) {
      nodeLabels.forEach((item: string, index: number) => {
        typeList.push({ title: item, id: index });
      });
    }
    setNodeType(typeList);
  }, [nodeLabels]);
  //节点类型autoComplete的参数
  const [typeValue, setTypeValue] = useState<any[]>([]);
  const onTypeValueChange = (event: any, newValue: any, reason: any) => {
    setTypeValue(newValue);
    let classes = newValue.map((item: any) => item.title);
    console.log(classes);
    if (newValue.length > 0) {
      dispatch(
        nodeSearchClassLimit({
          classes: classes,
          limit: sliderValue === 0 ? 100 : sliderValue,
        })
      );
    }
  };
  const [resultNumber, setResultNumber] = useState(0);
  const [searchNodesRes, setSearchNodesRes] = useState<any[]>();
  const [nodeError, setNodeError] = useState(false);
  useEffect(() => {
    setResultNumber(0);
    setEdgeResNumber(0);
    setEdgeNodeResNumber(0);
    setSourceInput(true);
    setTargetInput(true);
  }, []);
  useEffect(() => {
    setResultNumber(searchOriginNodes?.length);
    setSearchNodesRes(searchOriginNodes);
    if (searchOriginNodes !== undefined) {
      const regex = /^\d{4}-\d{2}-\d{2}$/;
      const trueKey = Object.keys(docPrioDateCheck).find(
        (key) => docPrioDateCheck[key as keyof typeof docPrioDateCheck] === true
      );
      if (trueKey !== undefined) {
        const year = trueKey === "five" ? 5 : trueKey === "three" ? 3 : 1;
        const currentYear = new Date().getFullYear();
        const targetYear = currentYear - year;
        const searchNodes: any[] = deepCopy(searchOriginNodes);
        const newArr = searchNodes.filter((item: any) => {
          return Object.keys(item).some((key) => {
            if (regex.test(item[key])) {
              const matchYear = parseInt(item[key].substring(0, 4));
              return matchYear >= targetYear && matchYear <= currentYear;
            }
            return false;
          });
        });
        setSearchNodesRes(newArr);
        setResultNumber(newArr.length);
      } else {
        const from = fromDate?.format("YYYY-MM-DD");
        const to = endDate?.format("YYYY-MM-DD");
        if (
          from !== "Invalid Date" &&
          to !== "Invalid Date" &&
          from !== undefined &&
          to !== undefined
        ) {
          if (searchOriginNodes !== undefined) {
            const searchNodes: any[] = deepCopy(searchOriginNodes);
            const regex = /^\d{4}-\d{2}-\d{2}$/;
            const newArr = searchNodes.filter((item: any) => {
              return Object.keys(item).some((key) => {
                if (regex.test(item[key])) {
                  const match = new Date(item[key]);
                  return match >= new Date(from) && match <= new Date(to);
                }
                return false;
              });
            });
            setSearchNodesRes(newArr);
            setResultNumber(newArr.length);
          }
        }
      }
    }
  }, [searchOriginNodes]);
  const [docPrioDateCheck, setPrioDocDateCheck] = useState<DateStateType>({
    five: false,
    three: false,
    one: false,
  });

  const handlePrioCheckChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const year =
      event.target.name === "five" ? 5 : event.target.name === "three" ? 3 : 1;
    const falseState = {
      five: false,
      three: false,
      one: false,
    };
    setPrioDocDateCheck({
      ...falseState,
      [event.target.name]: event.target.checked,
    });
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    const currentYear = new Date().getFullYear();
    const targetYear = currentYear - year;
    if (searchOriginNodes !== undefined) {
      const searchNodes: any[] = deepCopy(searchOriginNodes);
      const newArr = searchNodes.filter((item: any) => {
        return Object.keys(item).some((key) => {
          if (regex.test(item[key])) {
            const matchYear = parseInt(item[key].substring(0, 4));
            return matchYear >= targetYear && matchYear <= currentYear;
          }
          return false;
        });
      });
      setSearchNodesRes(newArr);
      setResultNumber(newArr.length);
    }
  };
  const [fromDate, setFromDate] = React.useState<Dayjs | null>();
  const [endDate, setEndDate] = React.useState<Dayjs | null>();
  //边类型参数
  const [edgeTypeValue, setEdgeTypeValue] = useState<any[]>([]); //option里的值
  const [edgeResNumber, setEdgeResNumber] = useState(0);
  const [edgeNodeResNumber, setEdgeNodeResNumber] = useState(0);
  useEffect(() => {
    dispatch(getEdgeLabels());
  }, [dispatch]);
  useEffect(() => {
    let typeList: nodeTypeInterface = [];
    if (edgeLabels !== undefined && edgeLabels.length !== 0) {
      edgeLabels.forEach((item: string, index: number) => {
        typeList.push({ title: item, id: index });
      });
    }
    setEdgeTypeValue(typeList);
  }, [edgeLabels]);
  const [edgeType, setEdgeType] = useState<any[]>([]); //选择的值
  const onEdgeTypeValueChange = (event: any, newValue: any, reason: any) => {
    setEdgeType(newValue);
    let classes = newValue.map((item: any) => item.title);
    if (classes.length > 0) {
      dispatch(
        edgeSearchClassLimit({
          classes: classes,
          limit: edgeSlider === 0 ? 100 : edgeSlider * 2,
        })
      );
    }
  };
  const [edgeSlider, setEdgeSliderValue] = useState(0);
  const edgeDebounceTimeout = useRef<number | null>(null);
  const handleEdgeSliderChange = (
    event: Event,
    newValue: number | number[]
  ) => {
    setEdgeSliderValue(newValue as number);
    if (edgeDebounceTimeout.current) {
      clearTimeout(edgeDebounceTimeout.current);
    }
    edgeDebounceTimeout.current = window.setTimeout(() => {
      let classes = edgeType.map((item) => item.title);
      if (classes.length > 0) {
        dispatch(
          edgeSearchClassLimit({
            classes: classes,
            limit: newValue === 0 ? 100 : edgeSlider,
          })
        );
      }
    }, 1000);
  };
  const edgeInputDebounceTimeout = useRef<number | null>(null);
  const edgeInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEdgeSliderValue(
      event.target.value === ""
        ? 0
        : Number(event.target.value)
    );
    let classes = edgeType.map((item) => item.title);
    if (edgeInputDebounceTimeout.current) {
      clearTimeout(edgeInputDebounceTimeout.current);
    }
    edgeInputDebounceTimeout.current = window.setTimeout(() => {
    if (classes.length > 0) {
      dispatch(
        edgeSearchClassLimit({
          classes: classes,
          limit:
            Number(event.target.value) === 0
              ? 100
              : Number(event.target.value),
        })
      );
    }}, 1000);
  }
  useEffect(() => {
    if (Object.keys(searchOriginEdge).length > 0) {
      setEdgeResNumber(searchOriginEdge?.edges?.length);
      setEdgeNodeResNumber(searchOriginEdge?.nodes?.length);
    }
  }, [searchOriginEdge]);
  const [edgeError, setEdgeError] = useState(false);
  //路径搜索参数
  const [target, setTarget] = useState<string | null>();
  const [source, setSource] = useState<string | null>();
  const [targetOptions, setTargetOptions] = useState([""]);
  const [sourceOptions, setSourceOptions] = useState([""]);
  const [sourceInput, setSourceInput] = useState(true);
  const [targetInput, setTargetInput] = useState(true);
  useEffect(() => {
    dispatch(searchNodeByName(""));
  }, []);
  useEffect(() => {
    let tempArr = [""];
    if (searchOriginFuzzy?.length > 0) {
      searchOriginFuzzy?.forEach((item: any, index: number) => {
        tempArr[index] = item.name;
      });
      if (targetInput) {
        setTargetOptions(tempArr);
      }
      if (sourceInput) {
        setSourceOptions(tempArr);
      }
    }
  }, [searchOriginFuzzy]);
  const handleSourceInputChange = debounce(
    (event: any, newInputValue: string) => {
      dispatch(searchNodeByName(newInputValue));
      setSourceInput(true);
      setTargetInput(false);
    },
    1000
  ); // 设置延迟时间，单位为毫秒
  const handleTargetInputChange = debounce(
    (event: any, newInputValue: string) => {
      dispatch(searchNodeByName(newInputValue));
      setSourceInput(false);
      setTargetInput(true);
    },
    1000
  ); // 设置延迟时间，单位为毫秒
  const [pathSliderValue, setPathSliderValue] = useState(0);
  const [resPathNodes, setResPathNodes] = useState(0);
  const [resPathEdges, setResPathEdges] = useState(0);
  const [resPaths, setResPaths] = useState(0);
  const [resPathTime, setResPathTime] = useState(0);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [resError, setResError] = useState(false);
  const handlePathSliderChange = (
    event: Event,
    newValue: number | number[]
  ) => {
    setPathSliderValue(newValue as number);
  };
  useEffect(() => {
    console.log(searchOriginPath);
    if (
      Object.keys(searchOriginPath).length > 0 &&
      searchOriginPath.nodes.length > 0
    ) {
      setResPathNodes(searchOriginPath.nodes.length);
      setResPathEdges(searchOriginPath.edges.length);
      setResPaths(searchOriginPath.path.length);
      setResPathTime(searchOriginPath.time);
      setResError(false);
    } else if (buttonLoading) {
      setResError(true);
    } else {
      setResError(false);
    }
    setButtonLoading(false);
  }, [searchOriginPath]);
  return (
    <React.Fragment>
      <Dialog
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>搜索设置</DialogTitle>
        {searchType === "" ? (
          <>
            <DialogContent>
              <DialogContentText>请选择搜索类型</DialogContentText>
              <InputLabel htmlFor="max-width">Choose Type</InputLabel>
              <Select
                fullWidth
                id="demo-simple-select"
                value={""}
                label="Choose Type"
                onChange={handleSearchTypeChange}
              >
                <MenuItem value={"node"}>节点搜索</MenuItem>
                <MenuItem value={"edge"}>关系搜索</MenuItem>
                <MenuItem value={"path"}>路径搜索</MenuItem>
              </Select>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button type="submit">OK</Button>
            </DialogActions>
          </>
        ) : searchType === "node" ? (
          <>
            <DialogContent>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={resCheck}
                    onChange={() => {
                      dispatch(setSearchResCheck(!resCheck));
                    }}
                  />
                }
                label="结果显示在图中"
              />
              <DialogContentText color="error">
                {nodeError ? "无结果，请选择类别或扩大时间范围" : ""}
              </DialogContentText>
              <Stack
                noValidate
                component="form"
                spacing={3}
                sx={{
                  width: "100%",
                  "&.MuiStack-root": {
                    marginTop: 1,
                    paddingTop: 1,
                    paddingBottom: 3,
                  },
                }}
              >
                <AutoComplete
                  id={"node-type"}
                  options={nodeType}
                  label={"请选择节点类型"}
                  placeholder={"Choose Node Type"}
                  style={{ width: "100%" }}
                  value={typeValue}
                  onValueChange={onTypeValueChange}
                ></AutoComplete>

                <Grid
                  container
                  direction="row"
                  sx={{
                    "&.MuiGrid-root": {
                      display: "flex",
                      alignItems: "center",
                    },
                  }}
                >
                  <Grid
                    item
                    sx={{
                      "&.MuiGrid-root": {
                        display: "flex",
                        alignItems: "center",
                        width: "100px",
                      },
                    }}
                  >
                    <EventIcon color="primary"></EventIcon>
                    <Typography sx={{ margin: "auto 15px" }}>日期</Typography>
                  </Grid>
                  <Grid item>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={docPrioDateCheck.five}
                          onChange={handlePrioCheckChange}
                          name="five"
                        />
                      }
                      label="近5年"
                    />
                  </Grid>
                  <Grid item>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={docPrioDateCheck.three}
                          onChange={handlePrioCheckChange}
                          name="three"
                        />
                      }
                      label="近3年"
                    />
                  </Grid>
                  <Grid item>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={docPrioDateCheck.one}
                          onChange={handlePrioCheckChange}
                          name="one"
                        />
                      }
                      label="近1年"
                    />
                  </Grid>
                  <Grid item sx={{ width: "130px", marginLeft: 3 }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        value={fromDate}
                        onChange={(newValue) => {
                          const falseState = {
                            five: false,
                            three: false,
                            one: false,
                          };
                          setPrioDocDateCheck({
                            ...falseState,
                          });
                          setFromDate(newValue);
                          const from = newValue?.format("YYYY-MM-DD");
                          const to = endDate?.format("YYYY-MM-DD");
                          if (
                            from !== "Invalid Date" &&
                            to !== "Invalid Date" &&
                            from !== undefined &&
                            to !== undefined
                          ) {
                            if (searchOriginNodes !== undefined) {
                              const searchNodes: any[] =
                                deepCopy(searchOriginNodes);
                              const regex = /^\d{4}-\d{2}-\d{2}$/;
                              const newArr = searchNodes.filter((item: any) => {
                                return Object.keys(item).some((key) => {
                                  if (regex.test(item[key])) {
                                    const match = new Date(item[key]);
                                    return (
                                      match >= new Date(from) &&
                                      match <= new Date(to)
                                    );
                                  }
                                  return false;
                                });
                              });
                              setSearchNodesRes(newArr);
                              setResultNumber(newArr.length);
                            }
                          }
                        }}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item sx={{ width: "10px", margin: 2 }}>
                    <Typography variant="overline" color="rgb(0, 0, 0, 0.5)">
                      -
                    </Typography>
                  </Grid>
                  <Grid item sx={{ width: "130px" }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        value={endDate}
                        onChange={(newValue: any) => {
                          const falseState = {
                            five: false,
                            three: false,
                            one: false,
                          };
                          setPrioDocDateCheck({
                            ...falseState,
                          });
                          setEndDate(newValue);
                          const to = newValue?.format("YYYY-MM-DD");
                          const from = fromDate?.format("YYYY-MM-DD");
                          if (
                            from !== "Invalid Date" &&
                            to !== "Invalid Date" &&
                            from !== undefined &&
                            to !== undefined
                          ) {
                            if (searchOriginNodes !== undefined) {
                              const searchNodes: any[] =
                                deepCopy(searchOriginNodes);
                              const regex = /^\d{4}-\d{2}-\d{2}$/;
                              const newArr = searchNodes.filter((item: any) => {
                                return Object.keys(item).some((key) => {
                                  if (regex.test(item[key])) {
                                    const match = new Date(item[key]);
                                    return (
                                      match >= new Date(from) &&
                                      match <= new Date(to)
                                    );
                                  }
                                  return false;
                                });
                              });
                              setSearchNodesRes(newArr);
                              setResultNumber(newArr.length);
                            }
                          }
                        }}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item sx={{ marginLeft: "10px" }}>
                    <Typography variant="overline" color="rgb(0, 0, 0, 0.5)">
                      FIND {resultNumber} RESULTS
                    </Typography>
                  </Grid>
                </Grid>
                {/* 数据规模栏 */}
                <Box>
                  <Divider textAlign="left" sx={{ marginBottom: 3 }}>
                    <Chip label="数据规模" size="small" />
                  </Divider>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item>
                      <InsightsIcon color="primary"></InsightsIcon>
                    </Grid>
                    <Grid item>
                      <Typography sx={{ width: "80px" }}>结果条数</Typography>
                    </Grid>
                    <Grid item>
                      <HelpOutlineOutlinedIcon
                        color="disabled"
                        fontSize="small"
                      ></HelpOutlineOutlinedIcon>
                    </Grid>
                    <Grid item xs>
                      <Slider
                        value={
                          typeof sliderValue === "number" ? sliderValue : 0
                        }
                        onChange={handleSliderChange}
                        min={10}
                        max={8000}
                        aria-labelledby="input-slider"
                      />
                    </Grid>
                    <Grid item sx={{ width: "100px" }}>
                      <Input
                        value={sliderValue}
                        size="small"
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        inputProps={{
                          step: 100,
                          min: 0,
                          max: 8000,
                          type: "number",
                          "aria-labelledby": "input-slider",
                        }}
                      />
                    </Grid>
                  </Grid>
                  <Grid container spacing={2} alignItems="center"></Grid>
                </Box>
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  setSearchType("");
                }}
              >
                Back
              </Button>
              <Button
                onClick={() => {
                  if (
                    searchNodesRes !== undefined &&
                    searchNodesRes.length > 0
                  ) {
                    dispatch(
                      setSearchResult({ nodes: [...searchNodesRes], edges: [] })
                    );
                    dispatch({type:SET_SUCCESS, data:"搜索成功，用时"+searchTime+"ms"})
                    dispatch({type:SET_SUCCESS_OPEN, data:true})
                    setOpen(false);
                    setNodeError(false);
                  } else {
                    setNodeError(true);
                  }
                }}
              >
                OK
              </Button>
            </DialogActions>
          </>
        ) : searchType === "edge" ? (
          <>
            <DialogContent>
              <DialogContentText color="error">
                {edgeError ? "无结果，请选择类别" : ""}
              </DialogContentText>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={resCheck}
                    onChange={() => {
                      dispatch(setSearchResCheck(!resCheck));
                    }}
                  />
                }
                label="结果显示在图中"
              />
              <Stack
                noValidate
                component="form"
                spacing={4}
                sx={{
                  width: "100%",
                  "&.MuiStack-root": {
                    marginTop: 1,
                    paddingTop: 1,
                    paddingBottom: 3,
                  },
                }}
              >
                <AutoComplete
                  id={"edge-search"}
                  options={edgeTypeValue}
                  label={"Edge Type"}
                  placeholder={"Enter Edge Type"}
                  style={{ width: "100%" }}
                  value={edgeType}
                  onValueChange={onEdgeTypeValueChange}
                ></AutoComplete>
                <Stack direction="row" justifyContent="flex-end" spacing={3}>
                  <Typography variant="overline" color="rgb(0, 0, 0, 0.5)">
                    FIND {edgeResNumber} EDGES
                  </Typography>
                  <Typography variant="overline" color="rgb(0, 0, 0, 0.5)">
                    FIND {edgeResNumber} NODES
                  </Typography>
                </Stack>

                {/* 数据规模栏 */}
                <Box>
                  <Divider textAlign="left" sx={{ marginBottom: 3 }}>
                    <Chip label="数据规模" size="small" />
                  </Divider>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item>
                      <InsightsIcon color="primary"></InsightsIcon>
                    </Grid>
                    <Grid item>
                      <Typography sx={{ width: "80px" }}>结果条数</Typography>
                    </Grid>
                    <Grid item>
                      <HelpOutlineOutlinedIcon
                        color="disabled"
                        fontSize="small"
                      ></HelpOutlineOutlinedIcon>
                    </Grid>
                    <Grid item xs>
                      <Slider
                        value={typeof edgeSlider === "number" ? edgeSlider : 0}
                        onChange={handleEdgeSliderChange}
                        min={10}
                        max={8000}
                        aria-labelledby="input-slider"
                      />
                    </Grid>
                    <Grid item sx={{ width: "100px" }}>
                      <Input
                        value={edgeSlider}
                        size="small"
                        onChange={edgeInputChange}
                        onBlur={() => {
                          if (edgeSlider < 0) {
                            setEdgeSliderValue(0);
                          } else if (edgeSlider > 8000) {
                            setEdgeSliderValue(8000);
                          }
                        }}
                        inputProps={{
                          step: 100,
                          min: 0,
                          max: 8000,
                          type: "number",
                          "aria-labelledby": "input-slider",
                        }}
                      />
                    </Grid>
                  </Grid>
                  <Grid container spacing={2} alignItems="center"></Grid>
                </Box>
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  setSearchType("");
                }}
              >
                Back
              </Button>
              <Button
                onClick={() => {
                  if (
                    edgeType.length > 0 &&
                    Object.keys(searchOriginEdge).length > 0
                  ) {
                    dispatch(setSearchResult(searchOriginEdge));
                    setOpen(false);
                    setEdgeError(false);
                  } else {
                    setEdgeError(true);
                  }
                }}
              >
                OK
              </Button>
            </DialogActions>
          </>
        ) : searchType === "path" ? (
          <>
            <DialogContent>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={resCheck}
                    onChange={() => {
                      dispatch(setSearchResCheck(!resCheck));
                    }}
                  />
                }
                label="结果显示在图中"
              />
              <DialogContentText color="error">
                {resError ? "无结果，请重新选择" : ""}
              </DialogContentText>
              <DialogContentText>查询两点之间的路径</DialogContentText>
              <Stack
                noValidate
                component="form"
                spacing={4}
                sx={{
                  width: "100%",
                  "&.MuiStack-root": {
                    marginTop: 1,
                    paddingTop: 1,
                    paddingBottom: 3,
                  },
                }}
              >
                <Stack direction="row" spacing={4}>
                  <Autocomplete
                    disablePortal
                    id="node 1"
                    options={sourceOptions !== undefined ? sourceOptions : []}
                    sx={{ width: 300 }}
                    value={source}
                    renderInput={(params) => (
                      <TextField {...params} label="Source" />
                    )}
                    onChange={(event: any, newValue: string | null) => {
                      setSource(newValue);
                    }}
                    onInputChange={handleSourceInputChange}
                  />
                  <HorizontalRuleIcon color="primary"></HorizontalRuleIcon>
                  <Autocomplete
                    disablePortal
                    id="node 2"
                    value={target}
                    options={targetOptions !== undefined ? targetOptions : []}
                    sx={{ width: 300 }}
                    renderInput={(params) => (
                      <TextField {...params} label="Target" />
                    )}
                    onChange={(event: any, newValue: string | null) => {
                      setTarget(newValue);
                    }}
                    onInputChange={handleTargetInputChange}
                  />
                  {!buttonLoading ? (
                    <Button
                      variant="outlined"
                      startIcon={<FastForwardIcon />}
                      onClick={() => {
                        if (source !== null && target !== null) {
                          setButtonLoading(true);
                          dispatch(
                            searchNodesPath({
                              source: source,
                              target: target,
                              number:
                                pathSliderValue === 0 ? 1 : pathSliderValue,
                            })
                          );
                        }
                      }}
                    >
                      开始检索
                    </Button>
                  ) : (
                    <LoadingButton loading variant="outlined">
                      Submit
                    </LoadingButton>
                  )}
                </Stack>
                <Stack direction="row" justifyContent="flex-end" spacing={3}>
                  <Typography variant="overline" color="rgb(0, 0, 0, 0.5)">
                    USE {resPathTime}s IN TOTAL
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="flex-end" spacing={3}>
                  <Typography variant="overline" color="rgb(0, 0, 0, 0.5)">
                    FIND {resPathEdges} EDGES
                  </Typography>
                  <Typography variant="overline" color="rgb(0, 0, 0, 0.5)">
                    FIND {resPathNodes} NODES
                  </Typography>
                  <Typography variant="overline" color="rgb(0, 0, 0, 0.5)">
                    FIND {resPaths} PATHS
                  </Typography>
                </Stack>
                {/* 数据规模栏 */}
                <Box>
                  <Divider textAlign="left" sx={{ marginBottom: 3 }}>
                    <Chip label="数据规模" size="small" />
                  </Divider>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item>
                      <InsightsIcon color="primary"></InsightsIcon>
                    </Grid>
                    <Grid item>
                      <Typography sx={{ width: "80px" }}>关系条数</Typography>
                    </Grid>
                    <Grid item>
                      <Tooltip
                        title="关系条数越多，查询时间越久，条数大于五时可能发生卡顿。"
                        arrow
                      >
                        <HelpOutlineOutlinedIcon
                          color="disabled"
                          fontSize="small"
                        ></HelpOutlineOutlinedIcon>
                      </Tooltip>
                    </Grid>
                    <Grid item xs>
                      <Slider
                        value={
                          typeof pathSliderValue === "number"
                            ? pathSliderValue
                            : 1
                        }
                        onChange={handlePathSliderChange}
                        min={1}
                        max={5}
                        aria-labelledby="input-slider"
                      />
                    </Grid>
                    <Grid item sx={{ width: "100px" }}>
                      <Input
                        value={pathSliderValue}
                        size="small"
                        onChange={(
                          event: React.ChangeEvent<HTMLInputElement>
                        ) => {
                          setPathSliderValue(
                            event.target.value === ""
                              ? 1
                              : Number(event.target.value)
                          );
                        }}
                        onBlur={handleBlur}
                        inputProps={{
                          step: 1,
                          min: 1,
                          max: 5,
                          type: "number",
                          "aria-labelledby": "input-slider",
                        }}
                      />
                    </Grid>
                  </Grid>
                  <Grid container spacing={2} alignItems="center"></Grid>
                </Box>
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  setSearchType("");
                }}
              >
                Back
              </Button>
              <Button
                onClick={() => {
                  if (
                    Object.keys(searchOriginPath).length > 0 &&
                    searchOriginPath.nodes.length > 0
                  ) {
                    dispatch(
                      setSearchResult({
                        nodes: searchOriginPath.nodes,
                        edges: searchOriginPath.edges,
                      })
                    );
                    setOpen(false);
                  } else {
                    setResError(true);
                  }
                }}
              >
                OK
              </Button>
            </DialogActions>
          </>
        ) : (
          <></>
        )}
      </Dialog>
    </React.Fragment>
  );
}
