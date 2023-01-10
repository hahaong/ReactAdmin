import React from "react";
import { Button, Card, List, message } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
import dayjs from "dayjs";

import { reqPersonById, reqCategoryById } from "../../api";
import "./detail.css";

const Detail = (props) => {
  const [name, setName] = React.useState("");
  const [phoneNumber, setPhonenumber] = React.useState("");
  const [carplate, setCarplate] = React.useState("");
  const [categoryId, setCategoryId] = React.useState("");
  const [categoryName, setCategoryName] = React.useState("");
  const [registeredAt, setRegisteredAt] = React.useState("");
  const [detail, setDetail] = React.useState("");

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
        const { carplate, category, name, phoneNumber, registeredAt,detail } = result;
        myCategoryId = category;
        setName(name);
        setPhonenumber(phoneNumber);
        setCarplate(carplate);
        setCategoryId(category);
        setRegisteredAt(registeredAt);
        setDetail(detail)
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
    const category = await getPersonById(id); //set person information, include category id
    getCategoryById(category); //transform category id -> category name
  };

  const getPersonById = async (id) => {
    let result = await reqPersonById(id);
    if (result.exists()) {
      const { carplate, createdAt, name, phoneNumber, category,detail } = result.data();
      setName(name);
      setPhonenumber(phoneNumber);
      setCarplate(carplate);
      setCategoryId(category);
      setRegisteredAt(dayjs(createdAt.toDate()).format("YYYY-MM-DD HH:mm:ss"));
      setDetail(detail)
      console.log(detail)
      return category;
    } else {
      message.warning("Connection to database failed");
    }
  };

  const getCategoryById = async (id) => {
    let result = await reqCategoryById(id);
    if (result.exists()) {
      const { category } = result.data();
      setCategoryName(category);
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
      content: phoneNumber,
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
    {
      title : "Detail",
      content : detail,
    }
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
                  <span style={{width:"30%", alignSelf:"flex-start"}} className="person-title">{item.title} :</span>
                  <span dangerouslySetInnerHTML={{__html:item.content}}></span>
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
