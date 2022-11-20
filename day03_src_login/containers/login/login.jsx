import React, { Component } from "react";
import { Button, Form, Input, Col, message } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
import {Redirect} from 'react-router-dom'
import {
  createSaveUserInfoAction
} from "../../redux/actions_creators/login_action";
import { reqLogin } from "../../api";
import "./css/login.css";
import logo from "./imgs/logo.png";
const { Item } = Form;

class Login extends Component {
  state = {
    passwordValidateStatus: null,
    passwordErrorMsg: null,
    password: null,
  };

  onFinish = async (values) => {
    // values = {usename:xxx, password:yyy}
    const { username, password } = values;
    let result = await reqLogin(username, password);
    const {status,msg,data} = result
    if(status === 0){
      this.props.saveUserInfo(data)
      //jump to admin page
      this.props.history.replace('./admin')
    }else{
      // message.warning(msg) 
      message.warning("username or password error")
    }
    console.log("Success:", values);
  };
  onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  validatePassword = (value) => {
    if (!value) {
      return {
        validateStatus: "error",
        errorMsg: "password must be entered ",
      };
    } else if (value.length > 12) {
      return {
        validateStatus: "error",
        errorMsg: "password must not exceed 12 characters ",
      };
    } else if (value.length < 4) {
      return {
        validateStatus: "error",
        errorMsg: "password must exceed 4 characters ",
      };
    } else if (!/^\w+$/.test(value)) {
      return {
        validateStatus: "error",
        errorMsg:
          "Username must be composed of letters, numbers, and underscores",
      };
    } else {
      return {
        validateStatus: "success",
        errorMsg: "",
      };
    }
  };

  onPasswordChange = (obj) => {
    this.setState({
      ...this.validatePassword(obj.target.value),
      password: obj.target.value,
    });
  };

  action = () => {
    this.props.demo2("0719");
  };

  render() {
    const {isLogin} = this.props;
    if(isLogin) {
      return <Redirect to="/admin"/>
    }
    return (
      <div className="login">
        <header>
          <img src={logo} alt="" />
          <h1>ALPR System</h1>
        </header>
        <section>
          <h1>User Login</h1>

          {/* antd form  */}

          <Form
            name="basic"
            onFinish={this.onFinish}
            onFinishFailed={this.onFinishFailed}
            autoComplete="off"
          >
            <Item
              // label="Username"
              name="username"
              rules={[
                { required: true, message: "Please input your username!" },
                { max: 12, message: "Username must less than 12 characters" },
                { min: 4, message: "Username must more than 4 characters" },
                {
                  pattern: /^\w+$/,
                  message:
                    "Username must be composed of letters, numbers, and underscores",
                },
              ]}
            >
              <Input
                style={{ width: "100%" }}
                prefix={<UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                placeholder="Username"
              />
            </Item>

            <Item
              // label="Password"
              name="password"
              validateStatus={this.state.validateStatus}
              help={this.state.errorMsg}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                type="password"
                placeholder="Password"
                value={this.state.password}
                onChange={this.onPasswordChange}
              />
            </Item>

            <Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
                block
              >
                Log in
              </Button>
            </Item>
          </Form>
        </section>
      </div>
    );
  }
}

export default connect((state) => ({isLogin:state.userInfo.isLogin}), {
  saveUserInfo: createSaveUserInfoAction,
})(Login);
