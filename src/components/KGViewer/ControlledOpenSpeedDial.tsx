import * as React from "react";
import Box from "@mui/material/Box";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import FileCopyIcon from "@mui/icons-material/FileCopyOutlined";
import SaveIcon from "@mui/icons-material/Save";
import PrintIcon from "@mui/icons-material/Print";
import ShareIcon from "@mui/icons-material/Share";
import LayoutDialog from "./LayoutDialog/LayoutDialog";

const actions = [
  { icon: <FileCopyIcon />, name: "切换布局" },
  { icon: <SaveIcon />, name: "Save" },
  { icon: <PrintIcon />, name: "Print" },
  { icon: <ShareIcon />, name: "Share" },
];

export default function ControlledOpenSpeedDial() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [layoutOpen, setLayoutOpen] = React.useState(false);
  return (
    <Box sx={{ position: "absolute", right: 300, bottom: 80, height: 250 }}>
      <SpeedDial
        ariaLabel="SpeedDial controlled open example"
        icon={<SpeedDialIcon />}
        onOpen={handleOpen}
        open={open}
      >
        {actions.map((action) => {
          if (action.name === "切换布局")
            return (
              <SpeedDialAction
                key={action.name}
                icon={action.icon}
                tooltipTitle={action.name}
                onClick={() => setLayoutOpen(true)}
              />
            );
          else
            return (
              <SpeedDialAction
                key={action.name}
                icon={action.icon}
                tooltipTitle={action.name}
                onClick={handleClose}
              />
            );
        })}
      </SpeedDial>
    </Box>
  );
}
