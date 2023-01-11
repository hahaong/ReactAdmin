import React, { Component, Fragment } from "react";
import { Card, Button, Table, Modal, Form, Input, message, Tree } from "antd";
import { connect } from "react-redux";
import { ExclamationCircleOutlined, PlusOutlined } from "@ant-design/icons";

import dayjs from "dayjs";

import {
  reqRoleList,
  reqUpdateRole,
  reqAddRole,
  reqDeleteRole,
} from "../../api/index";

import { PAGE_SIZE } from "../../config";

const Role = (props) => {
  const [form] = Form.useForm();
  const [roleList, setRoleList] = React.useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);

  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedRole, setSelectedRole] = React.useState("");

  //tree ---------------------
  const [expandedKeys, setExpandedKeys] = React.useState(['all']);
  const [checkedKeys, setCheckedKeys] = React.useState([]);
  const [selectedKeys, setSelectedKeys] = React.useState([]);
  const [autoExpandParent, setAutoExpandParent] = React.useState(true);
  const onExpand = (expandedKeysValue) => {
    console.log("onExpand", expandedKeysValue);
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };
  const onCheck = (checkedKeysValue) => {
    console.log("onCheck", checkedKeysValue);
    setCheckedKeys(checkedKeysValue);
  };
  const onSelect = (selectedKeysValue, info) => {
    console.log("onSelect", info);
    setSelectedKeys(selectedKeysValue);
  };
  //end tree ---------------------

  React.useEffect(() => {
    getRoleList();
  }, []);

  const getRoleList = async () => {
    const result = await reqRoleList();
    if (!result.empty) {
      const resultList = result.map((doc) => ({
        key: doc.id,
        role: doc.data().role,
        createdAtTimeStamp: doc.data().createdAt,
        createdAt: dayjs(doc.data().createdAt.toDate()).format(
          "YYYY-MM-DD HH:mm:ss"
        ),
        authAtTimeStamp: doc.data().authAt,
        authAt: doc.data().authAt
          ? dayjs(doc.data().authAt.toDate()).format("YYYY-MM-DD HH:mm:ss")
          : "",
        authorizer: doc.data().authorizer,
        menuList: doc.data().menuList,
      }));

      console.log(resultList);
      setRoleList(resultList);
      setIsLoading(false);

      //save CategoryList to redux
      // props.saveCategory(resultList);
    } else {
      message.warning("Retrieved empty data");
      setIsLoading(false);
    }
  };

  const showAdd = () => {
    form.resetFields();
    setIsAddModalOpen(true);
  };

  const showUpdate = (item) => {
    setSelectedRole(item);
    console.log(item)
    const { menuList } = item;
    setCheckedKeys(menuList);
    setIsEditModalOpen(true);
  };

  const handleEditOk = async() => {
    
    console.log(JSON.stringify(selectedRole.menuList))
    console.log(JSON.stringify(checkedKeys))

    if (!(JSON.stringify(selectedRole.menuList) == JSON.stringify(checkedKeys))){
      console.log(checkedKeys);
      message.success(`Updated ${selectedRole.role} Successfully`, 5);
      console.log(props);
      // console.log(JSON.parse(localStorage.getItem('user')))
      let result = await reqUpdateRole(selectedRole.key, {
        menuList: checkedKeys,
        authorizer: props.userInfo.user.username || JSON.parse(localStorage.getItem('user')).username,
      });
      if(result){
        getRoleList();
      }
    }
    setIsEditModalOpen(false);
  };

  const handleEditCancel = () => {
    setIsEditModalOpen(false);
  };

  const handleAddOk = () => {
    form
      .validateFields()
      .then(async (values) => {
        let result = await reqAddRole(values);
        if(result){
          console.log(result)
          console.log("value:", values);
          message.success(`Add role ${values.role} successfully`, 5);
          setIsAddModalOpen(false);
          getRoleList();
        }
      })
      .catch((errorInfo) => {
        console.log(errorInfo);
      });
  };

  const handleAddCancel = () => {
    setIsAddModalOpen(false);
  };

  const showDelete = (item) => {
    Modal.confirm({
      title: "Confirm",
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure to remove ${item.role}?`,
      okText: "Confirm",
      cancelText: "Cancel",
      onOk: () => {
        toDelete(item);
      },
    });
  };

  const toDelete = async (roleObj) => {
    let result = await reqDeleteRole(roleObj.key);
    if(result){
      message.success(`Successfully deleted ${roleObj.role}`);
      getRoleList();
    }
  };

  const columns = [
    {
      title: "Role Name",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "Authorization At",
      dataIndex: "authAt",
      key: "authAt",
    },
    {
      title: "Authorizer",
      dataIndex: "authorizer",
      key: "authorizer",
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

  const treeData = [
    {
      title: "All",
      key: "all",
      children: [
        {
          title: "Home",
          key: "home",
        },
        {
          title: "Management",
          key: "management",
          children: [
            {
              title: "Category",
              key: "category",
            },
            {
              title: "Person",
              key: "person",
            },
          ],
        },
        {
          title: "User",
          key: "user",
        },
        {
          title: "Role",
          key: "role",
        },
      ],
    },
  ];

  return (
    <div>
      <Card
        title="Role Management"
        extra={
          <Button
            type="primary"
            onClick={() => {
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
          dataSource={roleList}
          columns={columns}
          rowKey="key"
          pagination={{ pageSize: PAGE_SIZE, showQuickJumper: true }}
          loading={isLoading}
        />
      </Card>
      <Modal
        title={"Edit Role"}
        open={isEditModalOpen}
        onOk={handleEditOk}
        onCancel={handleEditCancel}
      >
        <Tree
          checkable
          onExpand={onExpand}
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
          onCheck={onCheck}
          checkedKeys={checkedKeys}
          onSelect={onSelect}
          selectedKeys={selectedKeys}
          treeData={treeData}
        />
      </Modal>

      <Modal
        title={"Add Role"}
        open={isAddModalOpen}
        onOk={handleAddOk}
        onCancel={handleAddCancel}
      >
        <Form
          name="basic"
          labelCol={{
            span: 5,
          }}
          wrapperCol={{
            span: 18,
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
            label="Role Name"
            name="role"
            rules={[
              {
                required: true,
                message: "Please input your role name",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default connect((state) => {
  return { userInfo: state.userInfo };
}, {})(Role);
