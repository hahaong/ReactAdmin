import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import {
  createDeleteUserInfoAction
} from "../../redux/actions_creators/login_action";
class Admin extends Component {
  componentDidMount() {
    console.log(this.props);
  }

  logout = () => {
    this.props.deleteUserInfo()
  };

  render() {
    const { user, token, isLogin } = this.props.userInfo;
    if (!isLogin) {
      return <Redirect to="/login" />;
    } else {
      return (
        <div>
          <div>
            I am Admin component,my name is {user.username}
          </div>
          <button onClick={this.logout}>Logout</button>
        </div>
      );
    }
  }
}

export default connect((state) => ({ userInfo: state.userInfo }), {
  deleteUserInfo:createDeleteUserInfoAction
})(Admin);
