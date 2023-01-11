import React, { Component, Fragment } from "react";
import { Card, Button, Table, Modal, Form, Input, message, Select } from "antd";
import { connect } from "react-redux";
import { ExclamationCircleOutlined, PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

import {
  reqUserList,
  reqRoleById,
  reqRoleList,
  reqAddUser,
  reqDeleteUser,
  reqUpdateUser,
} from "../../api/index";
import { PAGE_SIZE } from "../../config";
const { Option } = Select;
const User = () => {
  const [form] = Form.useForm();
  const [userList, setUserList] = React.useState([]);
  const [roleList, setRoleList] = React.useState([]);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedUser, setSelectedUser] = React.useState("");

  const [operType, setOperType] = React.useState("");

  React.useEffect(() => {
    getUserList();
    getRoleList();
  }, []);

  const getUserList = async () => {
    const result = await reqUserList();
    if (!result.empty) {
      let resultList = result.map(async (doc) => ({
        key: doc.id,
        username: doc.data().username,
        password: doc.data().password,
        email: doc.data().email,
        phoneNo: doc.data().phoneNumber,
        createdAtTimeStamp: doc.data().createdAt,
        createdAt: dayjs(doc.data().createdAt.toDate()).format(
          "YYYY-MM-DD HH:mm:ss"
        ),
        roleId: doc.data().role,
        role: doc.data().role ? await getRole(doc.data().role) : "",
      }));

      let localResultList = [];
      for (let i = 0; i < resultList.length; i++) {
        let result = await resultList[i];
        if (result.username != "admin") {
          localResultList.push(result);
        }
      }
      setUserList(localResultList);
      setIsLoading(false);
    } else {
      message.warning("Retrieved empty data");
      setIsLoading(false);
    }
  };

  const getRoleList = async () => {
    const result = await reqRoleList();
    if (!result.empty) {
      const resultList = result.map((doc) => ({
        key: doc.id,
        role: doc.data().role,
      }));
      setRoleList(resultList);
    } else {
      message.warning("Retrieved empty data");
    }
  };

  const getRole = async (roleId) => {
    let result = await reqRoleById(roleId);
    return result.data().role;
  };

  const showAdd = () => {
    setOperType("Add");
    form.resetFields();
    setIsModalOpen(true);
  };

  const showUpdate = (item) => {
    console.log(item);
    setOperType("Update");
    setSelectedUser(item);
    form.setFieldsValue({
      username: item.username,
      password: item.password,
      email: item.email,
      phoneNo: item.phoneNo,
      role: item.roleId,
    });
    setIsModalOpen(true);
  };

  const handleEditOk = async () => {
    form
      .validateFields()
      .then(async (values) => {
        let result = await reqUpdateUser(selectedUser.key, {
          username: values.username,
          password: values.password,
          role: values.role,
          email: values.email || "",
          phoneNumber: values.phoneNo || "",
        });

        if (result) {
          message.success(`Successfully updated ${selectedUser.username}`);
          getUserList();
        }
      })
      .catch((errorInfo) => {
        console.log(errorInfo);
      });
    setIsModalOpen(false);
  };

  const handleAddOk = () => {
    form
      .validateFields()
      .then(async (values) => {
        let result = await reqAddUser({
          username: values.username,
          password: values.password,
          role: values.role,
          email: values.email || "",
          phoneNumber: values.phoneNo || "",
        });
        if (result) {
          message.success(`Successfully added ${selectedUser.username}`);
          getUserList();
        }
      })
      .catch((errorInfo) => {
        console.log(errorInfo);
      });
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const showDelete = (item) => {
    Modal.confirm({
      title: "Confirm",
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure to remove ${item.username}?`,
      okText: "Confirm",
      cancelText: "Cancel",
      onOk: () => {
        toDelete(item);
      },
    });
  };

  const toDelete = async (userObj) => {
    let result = reqDeleteUser(userObj.key);
    if (result) {
      message.success(`Successfully deleted ${userObj.username}`);
      setTimeout(()=>{
        getUserList();
      },500)
    }
  };

  const columns = [
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Password",
      dataIndex: "password",
      key: "password",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone No",
      dataIndex: "phoneNo",
      key: "phoneNo",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Operation",
      // dataIndex: "key",
      key: "operation",
      render: (item) => {
        return (
          <Fragment>
            <Button
              type="link"
              onClick={() => {
                showUpdate(item);
              }}
            >
              Edit
            </Button>
            <Button
              type="link"
              danger
              onClick={() => {
                showDelete(item);
              }}
            >
              Remove
            </Button>
          </Fragment>
        );
      },
      width: "25%",
      align: "center",
    },
  ];

  return (
    <div>
      <Card
        title="User Management"
        extra={
          <Button
            type="primary"
            onClick={() => {
              setOperType("add");
              showAdd();
            }}
            icon={<PlusOutlined />}
          >
            Add
          </Button>
        }
        bordered={false}
      >
        <Table
          bordered
          dataSource={userList}
          columns={columns}
          rowKey="key"
          pagination={{ pageSize: PAGE_SIZE, showQuickJumper: true }}
          loading={isLoading}
        />
      </Card>
      <Modal
        title={operType === "Add" ? "Add User" : "Update User Information"}
        open={isModalOpen}
        onOk={operType === "Add" ? handleAddOk : handleEditOk}
        onCancel={handleCancel}
      >
        <Form
          name="basic"
          labelCol={{
            span: 5,
          }}
          wrapperCol={{
            span: 16,
          }}
          style={{
            paddingTop: "12px",
          }}
          // onFinish={onFinish}
          // onFinishFailed={onFinishFailed}
          autoComplete="off"
          form={form}
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[
              {
                required: true,
                message: "Please input your username",
              },
            ]}
          >
            <Input placeholder="Please enter your username" allowClear />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password",
              },
            ]}
          >
            <Input placeholder="Please enter your password" allowClear />
          </Form.Item>

          <Form.Item label="Email" name="email">
            <Input placeholder="Please select your email" allowClear />
          </Form.Item>

          <Form.Item label="Phone No" name="phoneNo">
            <Input placeholder="Please select your phone No" allowClear />
          </Form.Item>

          <Form.Item
            label="Role"
            name="role"
            rules={[
              {
                required: true,
                message: "Please select your role",
              },
            ]}
          >
            <Select placeholder="Please select your role" allowClear>
              {roleList.map((obj) => (
                <Option key={obj.key} value={obj.key}>
                  {obj.role}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default User;
