import React, { Component } from "react";
import {withRouter} from "react-router-dom";
import dayjs from 'dayjs'
import { Button, Modal, Space } from "antd";
import {
  FullscreenOutlined,
  FullscreenExitOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import screenfull from "screenfull";
import { connect } from "react-redux";
import { createDeleteUserInfoAction } from "../../../redux/actions_creators/login_action";
import "./css/header.css";

const { confirm } = Modal;
@connect(
  (state) => ({
    userInfo: state.userInfo,
  }),
  { deleteUser: createDeleteUserInfoAction }
)
@withRouter
class Header extends Component {
  state = {
    isFull: false,
    date:dayjs().format('YYYY-MM-DD HH:mm:ss')
  };

  componentDidMount() {
    console.log(this.props)
    screenfull.on("change", () => {
      this.setState({ isFull: !this.state.isFull });
    });
    this.timeID = setInterval(()=>{
      this.setState({date:dayjs().format('YYYY MM-DD HH:mm:ss')})
    },1000)
  }

  componentWillUnmount(){
    clearInterval(this.timeID)
  }

  fullScreen = () => {
    screenfull.toggle();
  };

  logOut = () => {
    this.props.deleteUser();
  };

  showModal = () => {
    this.setState({
      open: true,
    });
  };

  hideModal = () => {
    this.setState({
      open: false,
    });
    this.logOut();
  };

  showConfirm = () => {
    confirm({
      title: "Confirm to Logout?",
      icon: <ExclamationCircleFilled />,
      content: "You would need to login again.",
      onOk: () => {
        console.log("OK");
        this.logOut();
      },
      onCancel: () => {
        console.log("Cancel");
      },
    });
  };

  render() {
    let { isFull, open } = this.state;
    let { user } = this.props.userInfo;
    return (
      <header className="header">
        <div className="header-top">
          <Button size="small" onClick={this.fullScreen}>
            {isFull ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
          </Button>

          <span className="username">Welcome {user.username}</span>
          <Button type="link" size="small" onClick={this.showConfirm}>
            Logout
          </Button>
        </div>
        <div className="header-bottom">
          <div className="header-bottom-left">{this.props.location.pathname}</div>
          <div className="header-bottom-right">{this.state.date}</div>
        </div>
      </header>
    );
  }
}
export default Header;
