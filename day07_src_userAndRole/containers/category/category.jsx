import React, { Component, Fragment } from "react";
import { Card, Button, Table, Modal, Form, Input, message } from "antd";
import { connect } from "react-redux";
import { ExclamationCircleOutlined, PlusOutlined } from "@ant-design/icons";

import {
  reqCategoryList,
  reqAddCategory,
  reqCheckDuplicationCategoryList,
  reqUpdateCategory,
  reqDeleteCategory,
} from "../../api/index";
import { PAGE_SIZE } from "../../config";
import { createSaveCategoryAction } from "../../redux/actions_creators/category_action";

const { Item } = Form;

const Category = (props) => {
  const [form] = Form.useForm();
  const [categoryList, setCategoryList] = React.useState([]);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [operationType, setOperationType] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const [categoryId, setCategoryId] = React.useState("");

  React.useEffect(() => {
    getCatagoryList();
  }, []);

  const getCatagoryList = async () => {
    const result = await reqCategoryList();
    if (!result.empty) {
      const resultList = result.map((doc) => ({
        key: doc.id,
        categoryName: doc.data().category,
      }));
      setCategoryList(resultList);
      setIsLoading(false);

      //save CategoryList to redux
      props.saveCategory(resultList);
    } else {
      message.warning("Retrieved empty data");
      setIsLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const onFinish = (value) => {
    console.log("value:", value);
  };

  const showAdd = () => {
    setIsModalOpen(true);
    setOperationType("add");
  };

  const showUpdate = (item) => {
    const { key, categoryName } = item;
    form.setFieldValue("categoryName", categoryName);
    setCategoryId(key);
    setIsModalOpen(true);
    setOperationType("update");
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
    setCategoryId(key);
    setOperationType("delete");
  };

  const toAdd = async (values) => {
    let { categoryName } = values;
    await reqCheckDuplicationCategoryList(categoryName);
    let result = await reqAddCategory({ category: categoryName });
    if (result) {
      message.success("Successfully added a new category");
      form.resetFields();
      getCatagoryList();
      setIsModalOpen(false);
    } else {
      message.error("Add category failed, please try again");
    }
  };

  const toUpdate = async (categoryObj) => {
    let { categoryId, categoryName } = categoryObj;
    let result = await reqUpdateCategory(categoryId, { category: categoryName });
    message.success("Successfully updated category name");
    getCatagoryList();
    setIsModalOpen(false);
  };

  const toDelete = async (categoryObj) => {
    let { categoryId, categoryName } = categoryObj;
    let result = await reqDeleteCategory(categoryId);
    message.success(`Successfully deleted ${categoryName}`);
    getCatagoryList();
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        if (operationType == "add") {
          toAdd(values);
        }
        if (operationType == "update") {
          const categoryName = values.categoryName;
          const categoryObj = { categoryId, categoryName };
          toUpdate(categoryObj);
        }
        return;
      })
      .catch((errorInfo) => {
        console.log(errorInfo);
        message.warning(errorInfo.errorFields[0].errors[0]);
      });
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
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
    <div className="site-card-border-less-wrapper">
      <Card
        title="Category Management"
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
          dataSource={categoryList}
          columns={columns}
          rowKey="key"
          pagination={{ pageSize: PAGE_SIZE, showQuickJumper: true }}
          loading={isLoading}
        />
      </Card>

      <Modal
        title={operationType === "add" ? "Add Category" : "Update Category"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          name="basic"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          form={form}
          onValuesChange={(obj) => {
            form.setFieldsValue({
              categoryName: obj.categoryName.toUpperCase(),
            });
          }}
        >
          <Item
            name="categoryName"
            rules={[
              { required: true, message: "Please input your category name!" },
            ]}
          >
            <Input
              placeholder="Please enter category name"
              style={{ width: "100%" }}
              allowClear
            />
          </Item>
        </Form>
      </Modal>
    </div>
  );
};

export default connect(
  (state) => {
    return {};
  },
  {
    saveCategory: createSaveCategoryAction,
  }
)(Category);
