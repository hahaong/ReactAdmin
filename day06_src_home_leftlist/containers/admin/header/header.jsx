import React from "react";
import { withRouter } from "react-router-dom";
import dayjs from "dayjs";
import { Button, Modal } from "antd";
import {
  FullscreenOutlined,
  FullscreenExitOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import screenfull from "screenfull";
import { connect } from "react-redux";
import { createDeleteUserInfoAction } from "../../../redux/actions_creators/login_action";
import { TITLES_MAP } from "../../../config";
import "./css/header.css";

function Header(props) {
  const { confirm } = Modal;

  const [state, setState] = React.useState({
    isFull: false,
    date: dayjs().format("YYYY-MM-DD HH:mm:ss"),
    title: "",
  });

  React.useEffect(() => {
    screenfull.on("change", () => {
      setState({ ...state, isFull: !state.isFull });
    });
    let timeID = setInterval(() => {
      setState({ ...state, date: dayjs().format("YYYY-MM-DD HH:mm:ss") });
    }, 1000);
    return () => clearInterval(timeID);
  }, []);


  React.useEffect(() => {
    getTitle();
  }, [state.title]);

  const fullScreen = () => {
    screenfull.toggle();
  };

  const showConfirm = () => {
    confirm({
      title: "Confirm to Logout?",
      icon: <ExclamationCircleFilled />,
      content: "You would need to login again.",
      onOk: () => {
        console.log("OK");
        props.deleteUser();
      },
      onCancel: () => {
        console.log("Cancel");
      },
    });
  };

  const getTitle = () => {
    if (props.location.pathname.includes("detail")) {
      setState({ ...state, title:"Detail" });
      return
    }
    if (props.location.pathname.includes("add")) {
      setState({ ...state, title:"Register" });
      return
    }
    if (props.location.pathname.includes("update")) {
      setState({ ...state, title:"Update" });
      return
    }
    Object.keys(TITLES_MAP).forEach((key) => {
      if (key == props.location.pathname) {
        setState({ ...state, title: TITLES_MAP[key] });
        return
      }
    });
    // let title = props.location.pathname.split("/").reverse()[0];
    // title = title.charAt(0).toUpperCase() + title.slice(1);
    // setState({ ...state, title }); //get the last string of http path
  };

  return (
    <header className="header">
      <div className="header-top">
        <Button size="small" onClick={fullScreen}>
          {state.isFull ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
        </Button>

        <span className="username">Welcome {props.userInfo.user.username}</span>
        <Button type="link" size="small" onClick={showConfirm}>
          Logout
        </Button>
      </div>
      <div className="header-bottom">
        <div className="header-bottom-left">
          {props.title || state.title}
          {/* {this.props.location.pathname} */}
        </div>
        <div className="header-bottom-right">{state.date}</div>
      </div>
    </header>
  );
}

export default connect(
  (state) => ({
    userInfo: state.userInfo,
    title: state.title,
  }),
  { deleteUser: createDeleteUserInfoAction }
)(withRouter(Header));
