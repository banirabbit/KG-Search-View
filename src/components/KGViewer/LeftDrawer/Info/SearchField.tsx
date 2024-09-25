import * as React from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import {
  createTheme,
  ThemeProvider,
  Theme,
  useTheme,
} from "@mui/material/styles";
import { Autocomplete } from "@mui/material";
interface ChildProps {
  inputValue: string;
  setInputValue: (newValue: string) => void;
  options: string[];
  handleChange: any;
  error: boolean;
  handleOption: (event: any, newValue: string | null) => void;
}
const customTheme = (outerTheme: Theme) =>
  createTheme({
    palette: {
      mode: outerTheme.palette.mode,
    },
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            "--TextField-brandBorderColor": "#E0E3E7",
            "--TextField-brandBorderHoverColor": "#E0E3E7",
            "--TextField-brandBorderFocusedColor": "#E0E3E7",
            "& label.Mui-focused": {
              color: "#E0E3E7",
            },
          },
        },
      },
      MuiInput: {
        styleOverrides: {
          root: {
            "&::before": {
              borderBottom: "2px solid var(--TextField-brandBorderColor)",
            },
            "&:hover:not(.Mui-disabled, .Mui-error):before": {
              borderBottom: "2px solid var(--TextField-brandBorderHoverColor)",
            },
            "&.Mui-focused:after": {
              borderBottom:
                "2px solid var(--TextField-brandBorderFocusedColor)",
            },
          },
        },
      },
    },
  });

export default function SearchField({
  inputValue,
  setInputValue,
  options,
  handleChange,
  error,
  handleOption,
}: ChildProps) {
  const outerTheme = useTheme();

  return (
    <Box
      sx={{
        "& .MuiInputBase-input": {
          color: "#E0E3E7",
        },
        "& .MuiInputLabel-root": {
          color: "#E0E3E7",
        },
      }}
    >
      <ThemeProvider theme={customTheme(outerTheme)}>
        <Autocomplete
          disablePortal
          id="search"
          options={options !== undefined ? options : []}
          sx={{ width: 200 }}
          value={inputValue}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search"
              variant="standard"
              error={error}
              helperText="No Search Result."
            />
          )}
          onChange={handleOption}
          onInputChange={handleChange}
        />
      </ThemeProvider>
    </Box>
  );
}
