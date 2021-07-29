import React from "react";

//Dependencies Imports
import FolderTwoToneIcon from "@material-ui/icons/FolderTwoTone";
import EmailTwoToneIcon from "@material-ui/icons/EmailTwoTone";
import InsertChartTwoToneIcon from "@material-ui/icons/InsertChartTwoTone";
import CalendarTodayTwoToneIcon from "@material-ui/icons/CalendarTodayTwoTone";
import ExitToAppTwoToneIcon from "@material-ui/icons/ExitToAppTwoTone";

//File Imports
import logo from "../assets/trello.png";

const Sidebar: React.FC = () => {
  return (
    <div className="sidebar">
      <img src={logo} width={25} height={25} />
      <div className="sidebar_center">
        <FolderTwoToneIcon className="sidebar_icon" />
        <EmailTwoToneIcon className="sidebar_icon" />
        <InsertChartTwoToneIcon className="sidebar_icon" />
        <CalendarTodayTwoToneIcon className="sidebar_icon" />
      </div>
      <ExitToAppTwoToneIcon className="sidebar_icon sidebar_iconBottom" />
    </div>
  );
};

export default Sidebar;
