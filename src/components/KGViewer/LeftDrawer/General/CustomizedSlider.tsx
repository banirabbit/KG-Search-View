import * as React from "react";
import Slider from "@mui/material/Slider";
import { styled } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../../../../store";
import { useRef, useState } from "react";
import {
  setLoading,
  setRelationships,
} from "../../../../actions/graphProjectAction";
import { FormControl, Input, TextField } from "@mui/material";
//import { setLoading, setRelationships } from "../../../actions/dataAction";

const PrettoSlider = styled(Slider)({
  color: "#D1A9B5",
  height: 4,
  "& .MuiSlider-track": {
    border: "none",
  },
  "& .MuiSlider-thumb": {
    height: 15,
    width: 15,
    backgroundColor: "#fff",
    border: "2px solid currentColor",
    "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
      boxShadow: "inherit",
    },
    "&::before": {
      display: "none",
    },
  },
  "& .MuiSlider-valueLabel": {
    lineHeight: 1,
    fontSize: 10,
    background: "unset",
    padding: 0,
    width: 20,
    height: 20,
    borderRadius: "50% 50% 50% 0",
    backgroundColor: "#D1A9B5",
    transformOrigin: "bottom left",
    transform: "translate(50%, -100%) rotate(-45deg) scale(0)",
    "&::before": { display: "none" },
    "&.MuiSlider-valueLabelOpen": {
      transform: "translate(50%, -100%) rotate(-45deg) scale(1)",
    },
    "& > *": {
      transform: "rotate(45deg)",
    },
  },
});

export default function CustomizedSlider() {
  const { relationships: rela, total: total } = useSelector(
    (state: AppState) => state.graphProject
  );
  const [value, setValue] = useState(rela);
  const dispatch = useDispatch();
  const debounceTimeout = useRef<number | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    dispatch(setLoading(false));
    // 设置新的 timeout
    debounceTimeout.current = window.setTimeout(() => {
        dispatch(setRelationships(event.target.value));
  },1000)
  };
  const handleBlur = () => {
    if (value < 0) {
      setValue(0);
    } else if (value > 1000000) {
      setValue(100000);
    }
  };
  return (
    // <PrettoSlider
    //   valueLabelDisplay="auto"
    //   aria-label="pretto slider"
    //   defaultValue={rela}
    //   value={value}
    //   onChange={handleChange}
    //   min={5}
    //   max={10000}
    // />
    <Input
      value={value}
      size="small"
      sx={{
        m: 0,
        width: 120,
        marginLeft: 8,
        "& .MuiInputBase-input": {
          color: "#E0E3E7",
        },
        "& .MuiInputLabel-root": {
          color: "#E0E3E7",
        },
      }}
      onChange={handleChange}
      onBlur={handleBlur}
      inputProps={{
        step: 200,
        min: 0,
        max: 1000000,
        type: "number",
        "aria-labelledby": "input-slider",
      }}
    />
  );
}
