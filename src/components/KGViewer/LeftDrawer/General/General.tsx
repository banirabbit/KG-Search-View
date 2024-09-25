import { createFromIconfontCN } from "@ant-design/icons";
import "./General.css";
import LayoutDialog from "../../LayoutDialog/LayoutDialog";
import { useState } from "react";
import { Padding } from "@mui/icons-material";
import NodeStyle from "./NodeStyle";
import Actions from "./Actions";
import EdgeStyle from "./EdgeStyle";
export default function General() {
  const SideArrow = createFromIconfontCN({
    scriptUrl: "//at.alicdn.com/t/c/font_4425519_o98lovt232e.js",
  });
  const [layoutOpen, setLayoutOpen] = useState(false);
  const [contentOpen, setContentOpen] = useState({
    node: false,
    actions: false,
    edge: false,
  });
  const [arrow, setArrow] = useState({
    node: "icon-down",
    edge: "icon-down",
    actions: "icon-down",
  });
  const toggleContent = (content: string) => {
    switch (content) {
      case "node": {
        if (contentOpen.node) {
          setContentOpen({ ...contentOpen, node: false });
          setArrow({ ...arrow, node: "icon-down" });
        } else {
          setContentOpen({ ...contentOpen, node: true });
          setArrow({ ...arrow, node: "icon-up" });
        }
        break;
      }
      case "actions": {
        if (contentOpen.actions) {
          setContentOpen({ ...contentOpen, actions: false });
          setArrow({ ...arrow, actions: "icon-down" });
        } else {
          setContentOpen({ ...contentOpen, actions: true });
          setArrow({ ...arrow, actions: "icon-up" });
        }
        break;
      }
      case "edge": {
        if (contentOpen.edge) {
          setContentOpen({ ...contentOpen, edge: false });
          setArrow({ ...arrow, edge: "icon-down" });
        } else {
          setContentOpen({ ...contentOpen, edge: true });
          setArrow({ ...arrow, edge: "icon-up" });
        }
        break;
      }
      default:
    }
  };
  return (
    <div className="left-content">
      <ul>
        <li>
          <button onClick={() => setLayoutOpen(true)}>
            <div>布局配置</div>
            <div className="arrow">
              <SideArrow type="icon-right-copy"></SideArrow>
            </div>
          </button>
        </li>
        <li>
          <button onClick={() => toggleContent("node")}>
            <div>节点样式</div>
            <div className="arrow">
              <SideArrow type={arrow.node}></SideArrow>
            </div>
          </button>
        </li>
        <NodeStyle contentOpen={contentOpen}></NodeStyle>
        <li>
          <button onClick={() => toggleContent("edge")}>
            <div>边样式</div>
            <div className="arrow">
              <SideArrow type="icon-down"></SideArrow>
            </div>
          </button>
        </li>
        <EdgeStyle contentOpen={contentOpen}></EdgeStyle>
        <li>
          <button onClick={() => toggleContent("actions")}>
            <div>操作</div>
            <div className="arrow">
              <SideArrow type="icon-down"></SideArrow>
            </div>
          </button>
        </li>
        <Actions contentOpen={contentOpen}></Actions>
      </ul>
      <LayoutDialog open={layoutOpen} setOpen={setLayoutOpen}></LayoutDialog>
    </div>
  );
}
