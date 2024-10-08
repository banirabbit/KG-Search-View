import * as React from "react";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { useEffect, useState } from "react";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
interface ChildProps {
  id: string;
  options: Array<any>;
  label: string;
  placeholder: string;
  style: any;
  value: any[];
  onValueChange: any;
}
export default function AutoComplete({
  id,
  options,
  label,
  placeholder,
  style,
  value,
  onValueChange,
}: ChildProps) {
  return (
    <Autocomplete
      multiple
      id={id}
      options={options}
      disableCloseOnSelect
      value={value}
      onChange={onValueChange}
      getOptionLabel={(option) => option.title}
      renderOption={(props, option, { selected }) => (
        <li {...props}>
          <Checkbox
            icon={icon}
            checkedIcon={checkedIcon}
            style={{ marginRight: 8 }}
            checked={selected}
          />
          {option.title}
        </li>
      )}
      style={style}
      renderInput={(params) => (
        <TextField {...params} label={label} placeholder={placeholder} />
      )}
    />
  );
}
