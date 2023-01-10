import React, { Component } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import { Layout } from "antd";

import { createDeleteUserInfoAction } from "../../redux/actions_creators/login_action";
import { reqCategoryList } from "../../api";
import Header from "./header/header";
import "./css/admin.css";
import Home from "../home/home";
import LeftNav from "./left_nav/left_nav";
import Registration from "../registration/registration";
import Category from "../category/category";
import Person from "../person/person";
import Detail from "../person/detail";
import AddUpdate from "../person/add_update";
import User from "../user/user";
import Role from "../role/role";
import Bar from "../bar/bar";
import Line from "../line/line";
import Pie from "../pie/pie";

const { Footer, Sider, Content } = Layout;

class Admin extends Component {
  componentDidMount() {
    // console.log(this.props);
  }

  logout = () => {
    this.props.deleteUserInfo();
  };

  demo = async () => {
    let result = await reqCategoryList();
    console.log(result);
  };

  render() {
    const { user, token, isLogin } = this.props.userInfo;
    if (!isLogin) {
      return <Redirect to="/login" />;
    } else {
      return (
        <Layout hasSider className="admin">
          <Sider
            style={{
              overflow: "auto",
              height: "100vh",
              position: "fixed",
              left: 0,
              top: 0,
              bottom: 0,
            }}
            className="sider"
          >
            <LeftNav />
          </Sider>
          <Layout
            style={{
              marginLeft: 200,
            }}
          >
            <Header>Header</Header>
            <Content
              className="content"
              style={{
                margin: "24px 16px 0",
                overflow: "auto",
              }}
            >
              <Switch>
                <Route path="/admin/home" component={Home}></Route>
                <Route
                  path="/admin/registration"
                  component={Registration}
                ></Route>
                <Route
                  path="/admin/management/category"
                  component={Category}
                ></Route>
                <Route
                  path="/admin/management/person"
                  component={Person}
                  exact
                ></Route>
                <Route
                  path="/admin/management/person/detail/:id"
                  component={Detail}
                ></Route>
                <Route
                  path="/admin/management/person/add_update"
                  component={AddUpdate}
                  exact
                ></Route>
                <Route
                  path="/admin/management/person/add_update/:id"
                  component={AddUpdate}
                ></Route>
                <Route path="/admin/user" component={User}></Route>
                <Route path="/admin/role" component={Role}></Route>
                <Route path="/admin/bar" component={Bar}></Route>
                <Route path="/admin/line" component={Line}></Route>
                <Route path="/admin/pie" component={Pie}></Route>
                <Redirect to="/admin/home"></Redirect>
              </Switch>
            </Content>
            <Footer className="footer">
              Google Chrome is recommended for the best user experience
            </Footer>
          </Layout>
        </Layout>
      );
    }
  }
}

export default connect((state) => ({ userInfo: state.userInfo }), {
  deleteUserInfo: createDeleteUserInfoAction,
})(Admin);
