import React, { Component } from "react";
import { Redirect,Route,Switch } from "react-router-dom";
import { connect } from "react-redux";
import {Layout} from 'antd'
import {
  createDeleteUserInfoAction
} from "../../redux/actions_creators/login_action";
import {reqCategoryList} from '../../api'
import Header from './header/header'
import './css/admin.css'
import Home from '../../components/home/home'
import Category from '../category/category'
import Product from '../product/product'
import User from '../user/user'
import Role from '../role/role'
import Bar from '../bar/bar'
import Line from '../line/line'
import Pie from '../pie/pie'



const {Footer, Sider, Content } = Layout;

class Admin extends Component {
  componentDidMount() {
    console.log(this.props);
  }

  logout = () =>{
    this.props.deleteUserInfo()
  }

  demo = async() =>{
    let result = await reqCategoryList()
    console.log(result)
  }


  render() {
    const { user, token, isLogin } = this.props.userInfo;
    if (!isLogin) {
      return <Redirect to="/login" />;
    } else {
      return (
          <Layout className = 'admin'>
            <Sider className = 'sider'>Sider</Sider>
            <Layout>
              <Header>Header</Header>
              <Content className = "content">
                <Route path = "/admin/home" component={Home}></Route>
                <Route path = "/admin/prod_about/category" component={Category}></Route>
                <Route path = "/admin/prod_about/product" component={Product}></Route>
                <Route path = "/admin/user" component={User}></Route>
                <Route path = "/admin/role" component={Role}></Route>
                <Route path = "/admin/bar" component={Bar}></Route>
                <Route path = "/admin/line" component={Line}></Route>
                <Route path = "/admin/pie" component={Pie}></Route>
                <Redirect to="/admin/home"></Redirect>
                </Content>
              <Footer className="footer">Google Chrome is recommended for the best user experience</Footer>
            </Layout>
          </Layout>
      );
    }
  }
}

export default connect((state) => ({ userInfo: state.userInfo }), {
  deleteUserInfo:createDeleteUserInfoAction
})(Admin);
