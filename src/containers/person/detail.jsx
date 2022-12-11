import React from "react";
import { Button, Card, List, message } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
import dayjs from "dayjs";

import { reqPersonById, reqCategoryById } from "../../api";
import "./detail.css";

const Detail = (props) => {
  const [name, setName] = React.useState("");
  const [phonenumber, setPhonenumber] = React.useState("");
  const [carplate, setCarplate] = React.useState("");
  const [categoryId, setCategoryId] = React.useState("");
  const [categoryName, setCategoryName] = React.useState("");
  const [registeredAt, setRegisteredAt] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // console.log(props.match.params.id);
    // console.log(props.personList);
    // console.log(props.categoryList);
    const { id } = props.match.params; // this is the ID that pass into by URL
    const reduxPersonList = props.personList;
    const reduxCategoryList = props.categoryList;

    let myCategoryId; //predefine categoryId variable
    if (reduxPersonList.length) {
      //Set Person information from redux
      let result = reduxPersonList.find((item) => item.key == id);
      if (result) {
        const { carplate, category, name, phonenumber, registeredAt } = result;
        myCategoryId = category;
        setName(name);
        setPhonenumber(phonenumber);
        setCarplate(carplate);
        setCategoryId(category);
        setRegisteredAt(registeredAt);
      }
      if (reduxCategoryList.length) {
        //Set Category information from redux
        let result = reduxCategoryList.find((item) => item.key == myCategoryId);
        setCategoryName(result.categoryName);
        setIsLoading(false);
      } else {
        //Set Category information from firebase request
        getCategoryById(myCategoryId);
      }
    } else {
      //Set Person information & Category Name from firebase request
      getPageData(id);
    }
  }, []);

  const getPageData = async (id) => {
    const { type } = await getPersonById(id); //set person information, include category id
    getCategoryById(type); //transform category id -> category name
  };

  const getPersonById = async (id) => {
    let result = await reqPersonById(id);
    if (result.exists()) {
      const { carplate, createdAt, name, phonenumber, type } = result.data();
      setName(name);
      setPhonenumber(phonenumber);
      setCarplate(carplate);
      setCategoryId(type);
      setRegisteredAt(dayjs(createdAt.toDate()).format("YYYY-MM-DD HH:mm:ss"));
      return result.data();
    } else {
      message.warning("Connection to database failed");
    }
  };

  const getCategoryById = async (id) => {
    let result = await reqCategoryById(id);
    if (result.exists()) {
      const { type } = result.data();
      setCategoryName(type);
      setIsLoading(false);
    } else {
      message.warning("Connection to database failed");
    }
  };

  const data = [
    {
      title: "Name",
      content: name,
    },
    {
      title: "Phone No",
      content: phonenumber,
    },
    {
      title: "Car Plate",
      content: carplate,
    },
    {
      title: "Category",
      content: categoryName,
    },
    {
      title: "Registered At",
      content: registeredAt,
    },
  ];

  return (
    <div className="site-card-border-less-wrapper">
      <Card
        loading={isLoading}
        title={
          <div className="left-top">
            <Button
              type="link"
              size="medium"
              onClick={() => {
                props.history.goBack();
              }}
            >
              <LeftOutlined style={{ fontSize: "20px" }} />
            </Button>
            <span>Person Detail</span>
          </div>
        }
        bordered={false}
      >
        {/* detail {props.match.params.id} */}
        <List
          bordered
          dataSource={data}
          renderItem={(item) => {
            return (
              <>
                <List.Item>
                  <span className="person-title">{item.title} :</span>
                  <span>{item.content}</span>
                </List.Item>
              </>
            );
          }}
        />
      </Card>
    </div>
  );
};

export default connect((state) => ({
  personList: state.personList,
  categoryList: state.categoryList,
}))(Detail);
