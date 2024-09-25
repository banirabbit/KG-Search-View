import React, { useState, FC } from "react";
import "./LeftDrawer.css";
import { createFromIconfontCN } from "@ant-design/icons";
import General from "./General/General";
import Info from "./Info/Info";
import { useHistory } from "react-router-dom";
import { IconButton } from "@mui/material";
import SavedSearchIcon from "@mui/icons-material/SavedSearch";
import HelpPage from "./HelpPage";
const SideArrow = createFromIconfontCN({
  scriptUrl: "//at.alicdn.com/t/c/font_4425519_6zqord7489w.js",
});

export default function LeftDrawer() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedContent, setSelectedContent] = useState("Content 1");

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  const history = useHistory();
  const changeContent = (content: string) => {
    setSelectedContent(content);
  };

  return (
    <div className="leftdrawerContainer">
      <div className={`drawer ${sidebarOpen ? "" : "closed"}`}>
        <div className="content-buttons">
          <img
            src="./icon.jpg"
            onClick={() => {
              history.push("");
              window.location.reload();
            }}
            className="headPicture"
          />
          <button
            onClick={() => {
              changeContent("Content 1");
              console.log(1);
            }}
            className="iconfont"
          >
            general
          </button>
          <button
            onClick={() => changeContent("Content 2")}
            className="iconfont"
          >
            info
          </button>
          <button
            onClick={() => changeContent("Content 3")}
            className="iconfont"
          >
            help
          </button>
        </div>
        {selectedContent === "Content 1" ? (
          <General></General>
        ) : selectedContent === "Content 2" ? (
          <Info></Info>
        ) : (
          <HelpPage></HelpPage>
        )}
      </div>
      <button onClick={toggleSidebar} className="togglebutton">
        {sidebarOpen ? (
          <SideArrow type="icon-left" />
        ) : (
          <SideArrow type="icon-right"></SideArrow>
        )}
      </button>
    </div>
  );
}
