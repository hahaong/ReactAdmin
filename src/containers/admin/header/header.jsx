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
    title:state.title
  }),
  { deleteUser: createDeleteUserInfoAction }
)
@withRouter
class Header extends Component {
  state = {
    isFull: false,
    date:dayjs().format('YYYY-MM-DD HH:mm:ss'),
    title:''
  };

  componentDidMount() {
    this.getTitle();
    screenfull.on("change", () => {
      this.setState({ isFull: !this.state.isFull });
    });
    this.timeID = setInterval(()=>{
      this.setState({date:dayjs().format('YYYY-MM-DD HH:mm:ss')})
    },1000)
  }

  componentWillUnmount(){
    clearInterval(this.timeID)
  }

  fullScreen = () => {
    screenfull.toggle();
  };

  showConfirm = () => {
    confirm({
      title: "Confirm to Logout?",
      icon: <ExclamationCircleFilled />,
      content: "You would need to login again.",
      onOk: () => {
        console.log("OK");
        this.props.deleteUser();
      },
      onCancel: () => {
        console.log("Cancel");
      },
    });
  };

  getTitle = () =>{
    let title = this.props.location.pathname.split('/').reverse()[0];
    title = title.charAt(0).toUpperCase() + title.slice(1)
    this.setState({title}) //get the last string of http path
  }

  render() {
    let {isFull} = this.state;
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
          <div className="header-bottom-left">
            {this.props.title || this.state.title}
            {/* {this.props.location.pathname} */}
            </div>
          <div className="header-bottom-right">{this.state.date}</div>
        </div>
      </header>
    );
  }
}
export default Header;
