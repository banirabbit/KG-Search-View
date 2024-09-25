import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Switch from "@mui/material/Switch";
import AutoComplete from "./AutoComplete";

import {
  Checkbox,
  Grid,
  Input,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Slider,
  Stack,
  SvgIcon,
  Typography,
} from "@mui/material";
import { Graph } from "@antv/g6";
import { useSelector } from "react-redux";
import { AppState } from "../../../../store";
import { useEffect, useState } from "react";
import InsightsIcon from "@mui/icons-material/Insights";
import MapsHomeWorkOutlinedIcon from "@mui/icons-material/MapsHomeWorkOutlined";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import EventIcon from "@mui/icons-material/Event";
import EventNoteIcon from "@mui/icons-material/EventNote";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import NumbersIcon from "@mui/icons-material/Numbers";
import { orange } from "@mui/material/colors";
interface ChildProps {
  open: any;
  setOpen: any;
}
interface autoItem {
  title: string;
}
interface DateStateType {
  five: boolean;
  three: boolean;
  one: boolean;
}
// Update the color options to include a new option
declare module "@mui/icons-material/Numbers" {
  interface NumbersIconPropsColorOverrides {
    orange: true;
  }
}
declare module "@mui/material/Slider" {
  interface SliderPropsColorOverrides {
    orange: true;
  }
}
export default function InfoFilter({ open, setOpen }: ChildProps) {
  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth, setMaxWidth] = useState<DialogProps["maxWidth"]>("md");
  const [nodeLabel, setNodeLabel] = useState<autoItem[]>([]);
  const handleClose = () => {
    setOpen(false);
  };
  const handleSet = () => {
    setOpen(false);
  };

  const graphdata = useSelector(
    (state: AppState) => state.graphProject.graphData
  );
  const nodes = graphdata.nodes;
  const edges = graphdata.edges;
  let labels: autoItem[] = [];
  let nodetype = [
    {
      title: "企业",
    },
    {
      title: "专利",
    },
    {
      title: "招投标",
    },
    {
      title: "人",
    },
    {
      title: "作品",
    },
  ];
  // 专利的搜索选项
  let docOptions = [
    {
      id: "企业",
      icon: MapsHomeWorkOutlinedIcon,
      label: "请选择企业",
      enLabel: "Please choose assignee",
      secondText: "0条结果",
    },
    {
      id: "优先权日期",
      icon: EventIcon,
      label: "请选择优先权日期",
      enLabel: "Please priority date",
      secondText: "0条结果",
    },
    {
      id: "出版日期",
      icon: EventNoteIcon,
      label: "请选择出版日期",
      enLabel: "Please priority date",
      secondText: "0条结果",
    },
  ];
  //招投标的搜索选项
  let bidOptions = [
    {
      id: "招标公司",
      icon: MapsHomeWorkOutlinedIcon,
      label: "请选择企业",
      enLabel: "Please choose assignee",
      secondText: "0条结果",
    },
    {
      id: "中标公司",
      icon: MapsHomeWorkOutlinedIcon,
      label: "请选择企业",
      enLabel: "Please choose assignee",
      secondText: "0条结果",
    },
    {
      id: "发布日期",
      icon: EventNoteIcon,
      label: "请选择出版日期",
      enLabel: "Please choose date",
      secondText: "0条结果",
    },
    {
      id: "地域",
      icon: EventNoteIcon,
      label: "请选择出版日期",
      enLabel: "Please choose date",
      secondText: "0条结果",
    },
  ];
  const [sliderValue, setSliderValue] = useState(1000);
  const [secondary, setSecondary] = useState(true);
  const [docPrioDateCheck, setPrioDocDateCheck] = useState<DateStateType>({
    five: false,
    three: false,
    one: false,
  });
  useEffect(() => {
    if (nodes !== undefined && nodes.length > 0) {
      nodes.forEach((item: any) => {
        labels.push({ title: item.name });
      });
      setNodeLabel(labels);
    } else {
      console.log("nodes undefined!");
    }
  }, [graphdata]);
  const handleBlur = () => {
    if (sliderValue < 0) {
      setSliderValue(0);
    } else if (sliderValue > 8000) {
      setSliderValue(8000);
    }
  };
  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setSliderValue(newValue as number);
  };
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSliderValue(event.target.value === "" ? 0 : Number(event.target.value));
  };
  const handlePrioCheckChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const falseState = {
      five: false,
      three: false,
      one: false,
    };
    setPrioDocDateCheck({
      ...falseState,
      [event.target.name]: event.target.checked,
    });
  };
  //类型autoComplete的参数
  const [typeValue, setTypeValue] = useState<any[]>([]);
  const onTypeValueChange = (event: any, newValue: any, reason: any) => {
    setTypeValue(newValue);
    console.log("typevalue:", typeValue);
  };
  //节点度数选择
  const [degreeValue, setDegreeValue] = useState<number[]>([20, 37]);
  const handleDegreeChange = (event: Event, newValue: number | number[]) => {
    setDegreeValue(newValue as number[]);
  };

  return (
    <React.Fragment>
      <Dialog
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>搜索设置</DialogTitle>
        <DialogContent>
          <Stack
            noValidate
            component="form"
            spacing={3}
            sx={{
              width: "100%",
              "&.MuiStack-root": { marginTop: 1 },
            }}
          >
            <AutoComplete
              id={"node-type"}
              options={nodetype}
              label={"请选择节点类型"}
              placeholder={"Choose Node Type"}
              style={{ width: "100%" }}
              value={typeValue}
              onValueChange={onTypeValueChange}
            ></AutoComplete>
            {typeValue.some((element: any) => element.title === "招投标") ? (
              //  招投标
              <Box>
                <Divider textAlign="left">
                  <Chip label="招投标" size="small" />
                </Divider>
                <List>
                  {bidOptions.map((value) => (
                    <ListItem key={value.id}>
                      <Grid container direction="row">
                        <Grid
                          item
                          sx={{
                            "&.MuiGrid-root": {
                              display: "flex",
                              alignItems: "center",
                              width: "30px",
                            },
                          }}
                        >
                          <ListItemIcon>
                            <SvgIcon
                              component={value.icon}
                              viewBox="0 0 24 24"
                              color="primary"
                            />
                          </ListItemIcon>
                        </Grid>

                        <Grid
                          item
                          sx={{
                            marginLeft: 1,
                            width: "100px",
                            "&.MuiGrid-root": {
                              display: "flex",
                              alignItems: "center",
                            },
                          }}
                        >
                          <ListItemText primary={value.id} />
                        </Grid>

                        <Grid item sx={{ width: "600px", marginLeft: 3 }}>
                          {value.id === "招标公司" ||
                          value.id === "中标公司" ? (
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
                              <Grid item>
                                <AutoComplete
                                  id={"node-type"}
                                  options={[]}
                                  label={"请选择企业"}
                                  placeholder={"Choose Company"}
                                  style={{ width: "420px" }}
                                  value={[]}
                                  onValueChange={undefined}
                                ></AutoComplete>
                              </Grid>
                              <Grid item sx={{ marginLeft: 2 }}>
                                <Typography
                                  variant="overline"
                                  color="rgb(0, 0, 0, 0.5)"
                                >
                                  SHOW 0/1000 RESULTS
                                </Typography>
                              </Grid>
                            </Grid>
                          ) : value.id === "地域" ? (
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
                              <Grid item>
                                <AutoComplete
                                  id={"node-type"}
                                  options={[]}
                                  label={"请选择城市"}
                                  placeholder={"Choose Cities"}
                                  style={{ width: "420px" }}
                                  value={[]}
                                  onValueChange={undefined}
                                ></AutoComplete>
                              </Grid>
                              <Grid item sx={{ marginLeft: 2 }}>
                                <Typography
                                  variant="overline"
                                  color="rgb(0, 0, 0, 0.5)"
                                >
                                  SHOW 0/1000 RESULTS
                                </Typography>
                              </Grid>
                            </Grid>
                          ) : (
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
                                <LocalizationProvider
                                  dateAdapter={AdapterDayjs}
                                >
                                  <DatePicker />
                                </LocalizationProvider>
                              </Grid>
                              <Grid item sx={{ width: "10px", margin: 2 }}>
                                <Typography
                                  variant="overline"
                                  color="rgb(0, 0, 0, 0.5)"
                                >
                                  -
                                </Typography>
                              </Grid>
                              <Grid item sx={{ width: "130px" }}>
                                <LocalizationProvider
                                  dateAdapter={AdapterDayjs}
                                >
                                  <DatePicker />
                                </LocalizationProvider>
                              </Grid>
                            </Grid>
                          )}
                        </Grid>
                      </Grid>
                    </ListItem>
                  ))}
                  <ListItem
                    sx={{ justifyContent: "flex-end", paddingBottom: 0 }}
                  >
                    <FormControlLabel
                      control={<Checkbox defaultChecked />}
                      label="中标公司不为空"
                    />
                  </ListItem>
                  <ListItem
                    sx={{ justifyContent: "flex-end", paddingBottom: 0 }}
                  >
                    <Typography variant="overline" color="rgb(0, 0, 0, 0.5)">
                      CHOOSE 0 RESULTS / 1000 RESULTS TOTAL
                    </Typography>
                  </ListItem>
                </List>
              </Box>
            ) : (
              <></>
            )}
            {typeValue.some((element: any) => element.title === "专利") ? (
              // 专利
              <Box>
                <Divider textAlign="left">
                  <Chip label="专利选项" size="small" />
                </Divider>
                <List>
                  {docOptions.map((value) => (
                    <ListItem key={value.id}>
                      <Grid container direction="row">
                        <Grid
                          item
                          sx={{
                            "&.MuiGrid-root": {
                              display: "flex",
                              alignItems: "center",
                              width: "30px",
                            },
                          }}
                        >
                          <ListItemIcon>
                            <SvgIcon
                              component={value.icon}
                              viewBox="0 0 24 24"
                              color="primary"
                            />
                          </ListItemIcon>
                        </Grid>

                        <Grid
                          item
                          sx={{
                            marginLeft: 1,
                            width: "100px",
                            "&.MuiGrid-root": {
                              display: "flex",
                              alignItems: "center",
                            },
                          }}
                        >
                          <ListItemText primary={value.id} />
                        </Grid>

                        <Grid item sx={{ width: "600px", marginLeft: 3 }}>
                          {value.id === "企业" ? (
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
                              <Grid item>
                                <AutoComplete
                                  id={"node-type"}
                                  options={[]}
                                  label={"请选择企业"}
                                  placeholder={"Choose Company"}
                                  style={{ width: "420px" }}
                                  value={[]}
                                  onValueChange={undefined}
                                ></AutoComplete>
                              </Grid>
                              <Grid item sx={{ marginLeft: 2 }}>
                                <Typography
                                  variant="overline"
                                  color="rgb(0, 0, 0, 0.5)"
                                >
                                  SHOW 0/1000 RESULTS
                                </Typography>
                              </Grid>
                            </Grid>
                          ) : (
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
                                <LocalizationProvider
                                  dateAdapter={AdapterDayjs}
                                >
                                  <DatePicker />
                                </LocalizationProvider>
                              </Grid>
                              <Grid item sx={{ width: "10px", margin: 2 }}>
                                <Typography
                                  variant="overline"
                                  color="rgb(0, 0, 0, 0.5)"
                                >
                                  -
                                </Typography>
                              </Grid>
                              <Grid item sx={{ width: "130px" }}>
                                <LocalizationProvider
                                  dateAdapter={AdapterDayjs}
                                >
                                  <DatePicker />
                                </LocalizationProvider>
                              </Grid>
                            </Grid>
                          )}
                        </Grid>
                      </Grid>
                    </ListItem>
                  ))}
                  <ListItem
                    sx={{ justifyContent: "flex-end", paddingBottom: 0 }}
                  >
                    <Typography variant="overline" color="rgb(0, 0, 0, 0.5)">
                      CHOOSE 0 RESULTS / 1000 RESULTS TOTAL
                    </Typography>
                  </ListItem>
                </List>
              </Box>
            ) : (
              <></>
            )}

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
                  <Typography sx={{ width: "80px" }}>搜索显示</Typography>
                </Grid>
                <Grid item>
                  <HelpOutlineOutlinedIcon
                    color="disabled"
                    fontSize="small"
                  ></HelpOutlineOutlinedIcon>
                </Grid>
                <Grid item xs>
                  <Slider
                    value={typeof sliderValue === "number" ? sliderValue : 0}
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
              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  <EqualizerIcon color="secondary"></EqualizerIcon>
                </Grid>
                <Grid item>
                  <Typography sx={{ width: "80px" }}>图显示</Typography>
                </Grid>
                <Grid item>
                  <HelpOutlineOutlinedIcon
                    color="disabled"
                    fontSize="small"
                  ></HelpOutlineOutlinedIcon>
                </Grid>
                <Grid item xs>
                  <Slider
                    value={typeof sliderValue === "number" ? sliderValue : 0}
                    onChange={handleSliderChange}
                    min={10}
                    max={8000}
                    aria-labelledby="input-slider"
                    color="secondary"
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
              {/* 节点度数 */}
              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  <NumbersIcon sx={{ color: orange[500] }}></NumbersIcon>
                </Grid>
                <Grid item>
                  <Typography sx={{ width: "80px" }}>节点度数</Typography>
                </Grid>
                <Grid item>
                  <HelpOutlineOutlinedIcon
                    color="disabled"
                    fontSize="small"
                  ></HelpOutlineOutlinedIcon>
                </Grid>
                <Grid item xs>
                  <Slider
                    value={degreeValue}
                    onChange={handleDegreeChange}
                    min={10}
                    max={8000}
                    aria-labelledby="input-slider"
                    valueLabelDisplay="auto"
                    color="orange"
                  />
                </Grid>
              </Grid>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>取消</Button>
          <Button onClick={handleSet}>确认</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
