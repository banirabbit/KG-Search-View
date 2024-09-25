import { FormControl, Grid, MenuItem, Select, Switch } from "@mui/material";
import NumberInput from "../NumberInput";
interface ChildProps {
  centerNumber: any;
  setCenterNumber: any;
  rank: any;
  setRank: any;
  align: any;
  setAlign: any;
  nodesep: any;
  setNodeSep: any;
  ranksep: any;
  setRankSep: any;
  ctrPoints: any;
  setCtrPoints: any;
}
export default function Dagre({
  centerNumber,
  setCenterNumber,
  rank,
  setRank,
  align,
  setAlign,
  nodesep,
  setNodeSep,
  ranksep,
  setRankSep,
  ctrPoints,
  setCtrPoints,
}: ChildProps) {
  const alignMenu = [
    {
      value: "UL",
      label: "对齐到左上角",
    },
    {
      value: "UR",
      label: "对齐到右上角",
    },
    {
      value: "DL",
      label: "对齐到左下角",
    },
    {
      value: "DR",
      label: "对齐到右下角",
    },
  ];
  const rankMenu = [
    {
      value: "TB",
      label: "从上至下布局",
    },
    {
      value: "BT",
      label: "从下至上布局",
    },
    {
      value: "LR",
      label: "从左至右布局",
    },
    {
      value: "RL",
      label: "从右至左布局",
    },
  ];
  return (
    <Grid
      container
      direction="column"
      spacing={2}
      sx={{ fontSize: 17, color: "#434D5B" }}
    >
      {/* begin */}
      <Grid item>
        <Grid container direction="row" spacing={2} alignItems="center">
          <Grid item>Begin: [</Grid>
          <Grid item>
            <NumberInput
              value={centerNumber.from}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                if (event.target.value !== undefined) {
                  setCenterNumber((pre: any) => ({
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
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                if (event.target.value !== undefined) {
                  setCenterNumber((pre: any) => ({
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
      {/* rankdir, align */}
      <Grid item>
        <Grid container direction="row" spacing={3} alignItems="center">
          <Grid item>RankDir:</Grid>
          <Grid item>
            <FormControl variant="standard" sx={{ m: 1, minWidth: 90 }}>
              <Select id="dagre-rank-select" value={rank} label="RankSelect">
                {rankMenu.map((option) => (
                  <MenuItem
                    key={option.value}
                    value={option.value}
                    onClick={() => setRank(option.value)}
                  >
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item>Align:</Grid>
          <Grid item>
            <FormControl variant="standard" sx={{ m: 1, minWidth: 90 }}>
              <Select id="dagre-align-select" value={align} label="AlignSelect">
                {alignMenu.map((option) => (
                  <MenuItem
                    key={option.value}
                    value={option.value}
                    onClick={() => setAlign(option.value)}
                  >
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Grid>
      {/* nodesep, ranksep */}
      <Grid item>
        <Grid container direction="row" spacing={3} alignItems="center">
          <Grid item>NodeSep:</Grid>
          <Grid item>
            <NumberInput
              value={nodesep}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                if (event.target.value !== undefined) {
                  setNodeSep(event.target.value);
                }
              }}
            />
          </Grid>
          <Grid item id="RankSepLabel">
            RankSep:
          </Grid>
          <Grid item>
            <NumberInput
              value={ranksep}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                if (event.target.value !== undefined) {
                  setRankSep(event.target.value);
                }
              }}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
