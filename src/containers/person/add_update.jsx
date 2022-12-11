import React from "react";
import { Button, Card, List, message, Form, Input, Select } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
import RichTextEditor from "./rich_text_editor";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import {
  reqCategoryList,
  reqAddPerson,
  reqPersonById,
  reqUpdatePerson,
} from "../../api";

const { Option } = Select;

const AddUpdate = (props) => {
  const [form] = Form.useForm();

  const [categoryList, setCategoryList] = React.useState([]);
  const [operationType, setOperationType] = React.useState("add");
  const [personId, setPersonId] = React.useState("");
  const [myName, setName] = React.useState("111");
  const [carplate, setCarplate] = React.useState("");
  const [phonenumber, setPhonenumber] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [categoryName, setCategoryName] = React.useState("");
  const [registeredAt, setRegisteredAt] = React.useState("");
  const [detail, setDetail] = React.useState("");

  const richTextEditor = React.useRef(null);

  React.useEffect(() => {
    const { categoryList, personList } = props;
    const { id } = props.match.params;
    //get categoryList from redux
    if (categoryList.length) setCategoryList(categoryList);
    //get categorryList from firebase
    else getCategoryList();

    if (id) {
      setOperationType("update");
      // get person from redux
      if (personList.length) {
        let result = personList.find((item) => {
          return item.key == id;
        });
        if (result) {
          console.log(result);
          const {
            key,
            name,
            carplate,
            phonenumber,
            category,
            categoryName,
            registeredAt,
            detail,
          } = result;
          setPersonId(key);
          setName(name);
          setCarplate(carplate);
          setPhonenumber(phonenumber);
          setCategory(category);
          setCategoryName(categoryName);
          setRegisteredAt(registeredAt);

          form.setFieldsValue({
            name,
            carplate: carplate,
            phonenumber: phonenumber,
            type: category,
            detail,
          });

          //set wysiwyg content
          if (detail) richTextEditor.current.setRichText(detail);
        }
      } else {
        // get person from firebase
        getPersonById(id);
      }
    }
  }, []);

  const getPersonById = async (id) => {
    let result = await reqPersonById(id);
    if (result.exists()) {
      const { carplate, createdAt, name, phonenumber, type, detail } =
        result.data();
      setName(name);
      setCarplate(carplate);
      setPhonenumber(phonenumber);
      setCategory(type);
      setRegisteredAt(createdAt);
      setDetail(detail);
      console.log(detail);
      form.setFieldsValue({
        name,
        carplate,
        phonenumber,
        type,
        detail,
      });

      //set wysiwyg content
    } else {
      message.warning("Person with id: " + id + " doesn't exist");
    }
  };

  const getCategoryList = async () => {
    let result = await reqCategoryList();

    if (!result.empty) {
      const resultList = result.docs.map((doc) => ({
        key: doc.id,
        categoryName: doc.data().type,
      }));
      setCategoryList(resultList.reverse());
    }
  };

  const onFinish = async (values) => {
    let detail = richTextEditor.current.getRichText();
    if (operationType === "add") {
      await reqAddPerson({ ...values, detail });
      message.success("Successfully added " + values.name);
    } else if (operationType === "update") {
      await reqUpdatePerson(personId, { ...values, detail });
      message.success("Successfully updated " + values.name);
    }
    props.history.replace("/admin/management/person");
  };

  const onFinishFailed = (errorInfo) => {
    message.error(errorInfo.errorFields[0].errors);
    console.log("Failed:", errorInfo);
  };

  return (
    <Card
      title={
        <div>
          <Button
            type="link"
            size="medium"
            onClick={() => {
              props.history.goBack();
            }}
          >
            <LeftOutlined style={{ fontSize: "20px" }} />
          </Button>
          <span>
            {operationType === "update" ? "Edit Person " : "Registration Form"}
          </span>
        </div>
      }
      bordered={false}
    >
      <Form
        name="basic"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        form={form}
        onValuesChange={(obj) => {
          if (obj.name) {
            form.setFieldsValue({
              name: obj.name.toUpperCase(),
            });
          }
          if (obj.carplate) {
            form.setFieldsValue({
              carplate: obj.carplate.toUpperCase(),
            });
          }
        }}
        labelCol={{
          md: 3,
        }}
        wrapperCol={{
          md: 10,
        }}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please input your name!" }]}
        >
          <Input style={{ width: "100%" }} placeholder="Insert your name" />
        </Form.Item>
        <Form.Item
          label="Carplate"
          name="carplate"
          rules={[{ required: true, message: "Please input your carplate!" }]}
        >
          <Input style={{ width: "100%" }} placeholder="Insert your carplate" />
        </Form.Item>
        <Form.Item
          label="Phone No"
          name="phonenumber"
          rules={[
            { required: true, message: "Please input your phone number!" },
          ]}
        >
          <Input style={{ width: "100%" }} placeholder="eg 0109858785" />
        </Form.Item>
        <Form.Item
          label="Category"
          name="type"
          rules={[{ required: true, message: "Please select your category!" }]}
        >
          <Select
            placeholder="Select your category"
            // onChange={onGenderChange}
            allowClear
          >
            {/* <Option value="">Please Select Category</Option> */}
            {categoryList.map((item) => {
              return (
                <Option key={item.key} value={item.key}>
                  {item.categoryName}
                </Option>
              );
            })}
          </Select>
        </Form.Item>

        <Form.Item
          label="Person Detail"
          name="detail"
          wrapperCol={{
            md: 14,
          }}
        >
          <RichTextEditor ref={richTextEditor} />
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 3,
          }}
        >
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default connect((state) => ({
  categoryList: state.categoryList,
  personList: state.personList,
}))(AddUpdate);
