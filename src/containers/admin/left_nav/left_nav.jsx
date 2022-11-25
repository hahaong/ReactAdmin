import React, { Component } from "react";
import { Button, Menu } from "antd";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { createSaveTitleAction } from "../../../redux/actions_creators/menu_action";
import logo from "../../../static/imgs/logo.png";
import {
  AppstoreOutlined,
  ContainerOutlined,
  DesktopOutlined,
  MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
  HomeOutlined,
  UserAddOutlined,
  FolderOpenOutlined,
  DatabaseOutlined,
  IdcardOutlined,
} from "@ant-design/icons";

import "./left_nav.css";

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

const items = [
  getItem("Home", "/admin/home", <HomeOutlined />),
  getItem("Registration", "/admin/registration", <UserAddOutlined />),
  getItem("Management", "management", <FolderOpenOutlined />, [
    getItem("Category", "/admin/management/category", <DatabaseOutlined />),
    getItem("Person", "/admin/management/person", <IdcardOutlined />),
  ]),
];

@connect((state) => ({}), {
  saveTitle: createSaveTitleAction,
})
@withRouter
class LeftNav extends Component {

  onClick = ({ key }) => {
    //collapsed menus do not involve in navigation
    if (key.split("/").length != 0) {
      //save title to redux
      let title = key.split('/').reverse()[0];
      title = title.charAt(0).toUpperCase() + title.slice(1)
      this.props.saveTitle(title)
      
      //navigate to corresponding path by key
      this.props.history.replace(key);
    }
  };

  render() {
    return (
      <div>
        <header className="nav-header">
          <img src={logo} alt="" />
          <h1>ALPR</h1>
        </header>
        <Menu
          onClick={this.onClick}
          defaultSelectedKeys={[this.props.location.pathname]}
          defaultOpenKeys={[
            ...this.props.location.pathname.split("/").splice(2),
          ]}
          mode="inline"
          theme="dark"
          items={items}
        />
      </div>
    );
  }
}

export default LeftNav;
