import React, { Component, Fragment } from "react";
import { Card, Button, Table, Modal, Form, Input, message } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

import {
  reqCategoryList,
  reqAddCategory,
  reqCheckDuplicationCategoryList,
  reqUpdateCategory,
  reqDeleteCategory,
} from "../../api/index";
import { PAGE_SIZE } from "../../config";
const { Item } = Form;

const Category = () => {
  const [form] = Form.useForm();

  const [state, setState] = React.useState({
    categoryList: [],
    isModalOpen: false,
    operationType: "",
    isLoading: true,
    categoryId: "",
  });

  React.useEffect(() => {
    getCatagoryList();
  }, []);

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const onFinish = (value) => {
    console.log("value:", value);
  };

  const showAdd = () => {
    setState({
      ...state,
      isModalOpen: true,
      operationType: "add",
    });
  };

  const showUpdate = (item) => {
    const { key, categoryName } = item;
    form.setFieldValue("categoryName", categoryName);
    setState({
      ...state,
      categoryId: key,
      isModalOpen: true,
      operationType: "update",
    });
  };

  const showDelete = (item) => {
    const { key, categoryName } = item;
    Modal.confirm({
      title: "Confirm",
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure to remove ${categoryName}?`,
      okText: "Confirm",
      cancelText: "Cancel",
      onOk: () => {
        toDelete({ categoryId: key, categoryName });
      },
    });

    setState({
      ...state,
      categoryId: key,
      operationType: "delete",
    });
  };

  const getCatagoryList = async () => {
    const result = await reqCategoryList();
    setState({
      ...state,
      isLoading: false,
    });
    const resultList = result.docs.map((doc) => ({
      key: doc.id,
      categoryName: doc.data().type,
    }));
    setState({
      categoryList: resultList.reverse(),
    });
  };

  const toAdd = async (values) => {
    let { categoryName } = values;
    await reqCheckDuplicationCategoryList("type", categoryName);
    let result = await reqAddCategory({ type: categoryName });
    if (result) {
      message.success("Successfully added a new category");
      setState({
        ...state,
        isModalOpen: false,
      });
      form.resetFields();
      getCatagoryList();
    } else {
      message.error("Add category failed, please try again");
    }
  };

  const toUpdate = async (categoryObj) => {
    let { categoryId, categoryName } = categoryObj;
    let result = await reqUpdateCategory(categoryId, "type", categoryName);
    message.success("Successfully updated category name");
    getCatagoryList();
  };

  const toDelete = async (categoryObj) => {
    let { categoryId, categoryName } = categoryObj;
    let result = await reqDeleteCategory(categoryId);
    message.success(`Successfully deleted ${categoryName}`);
    getCatagoryList();
  };

  const handleOk = () => {
    const { operationType } = state;
    form
      .validateFields()
      .then((values) => {
        if (operationType == "add") {
          toAdd(values);
        }
        if (operationType == "update") {
          const categoryId = state.categoryId;
          const categoryName = values.categoryName;
          const categoryObj = { categoryId, categoryName };
          toUpdate(categoryObj);
        }
        return;
      })
      .catch((errorInfo) => {
        message.warning(errorInfo.errorFields[0].errors[0]);
      });
  };

  const handleCancel = () => {
    form.resetFields();
    setState({
      ...state,
      isModalOpen: false,
    });
  };

  const columns = [
    {
      title: "Category Name",
      dataIndex: "categoryName",
      key: "categoryName",
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
              onClick={() => {
                showDelete(item);
              }}
            >
              Delete
            </Button>
          </Fragment>
        );
      },
      width: "25%",
      align: "center",
    },
  ];
  return (
    <Fragment>
      <Card
        title="Category Management"
        extra={
          <Button
            type="primary"
            onClick={() => {
              showAdd();
            }}
          >
            Add
          </Button>
        }
      >
        <Table
          bordered
          dataSource={state.categoryList}
          columns={columns}
          rowKey="key"
          pagination={{ pageSize: PAGE_SIZE, showQuickJumper: true }}
          loading={state.isLoading}
        />
      </Card>
      <Modal
        title={
          state.operationType === "add" ? "Add Category" : "Update Category"
        }
        open={state.isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          name="basic"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          form={form}
        >
          <Item
            name="categoryName"
            initialValue=""
            rules={[
              { required: true, message: "Please input your category name!" },
            ]}
          >
            <Input
              style={{ width: "100%" }}
              placeholder="Please enter category name"
            />
          </Item>
        </Form>
      </Modal>
    </Fragment>
  );
};

export default Category;
