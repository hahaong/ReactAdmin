import React, { Component } from "react";
import { Button, Form, Input, Col } from "antd";
import { connect } from "react-redux";
import {
  createDemo1Action,
  createDemo2Action,
} from "../../redux/actions_creators/test_action";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import "./css/login.css";
import logo from "./imgs/logo.png";
const { Item } = Form;

class Login extends Component {
  componentDidMount() {
    console.log(this.props);
  }

  state = {
    passwordValidateStatus: null,
    passwordErrorMsg: null,
    password: null,
  };

  onFinish = (values) => {
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
    return (
      <div className="login">
        <header>
          <img src={logo} alt="" />
          <h1>ALPR System{this.props.test}</h1>
        </header>
        <section>
          <h1>
            User Login<Button onClick={this.action}>Click</Button>
          </h1>

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

export default connect((state) => ({ test: state.test }), {
  demo1: createDemo1Action,
  demo2: createDemo2Action,
})(Login);
