import React from "react";
import { Card, Button, Select, Input, Table } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";

import { reqPersonList, reqSearchPersonList } from "../../api/index";
import { PAGE_SIZE } from "../../config";

const Product = () => {
  const [personList, setPersonList] = React.useState([]);
  const [currentPageNumber, setCurrentPageNumber] = React.useState("1");
  const [totalPageNumber, setTotalPageNumber] = React.useState("");
  const [keyword, setKeyword] = React.useState("");
  const [searchType, setSearchType] = React.useState("name");

  React.useEffect(() => {
    getPersonList();
  }, []);

  const getPersonList = async (currentPage = 1, myKeyword = keyword) => {
    let result;
    if (myKeyword) {
      result = await reqSearchPersonList(currentPage, searchType, myKeyword);
    } else {
      result = await reqPersonList(currentPage, myKeyword);
    }
    let { currentPageData, currentPageNumber, totalPageNumber } = result;
    const resultList = currentPageData.map((doc) => ({
      key: doc.id,
      name: doc.data().name,
      carPlate: doc.data().carplate,
      phoneNo: doc.data().phonenumber,
      category: doc.data().type,
    }));
    setPersonList(resultList);
    setCurrentPageNumber(currentPageNumber);
    setTotalPageNumber(totalPageNumber);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Car Plate",
      dataIndex: "carPlate",
      key: "carPlate",
    },
    {
      title: "Phone No",
      dataIndex: "phoneNo",
      key: "phoneNo",
      render: (phoneNo) => "+6" + phoneNo,
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      align: "center",
    },
    {
      title: "Operation",
      // dataIndex: "operation",
      key: "operation",
      align: "center",
      width: "15%",
      render: (a) => {
        return (
          <div>
            <Button type="link" onClick={() => {}}>
              View
            </Button>
            <br />
            <Button type="link" onClick={() => {}}>
              Edit
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="site-card-border-less-wrapper">
      <Card
        title={
          <div>
            <Select
              defaultValue="Search by Name"
              style={{
                width: 170,
              }}
              onChange={(value) => {
                setSearchType(value);
              }}
              options={[
                {
                  value: "name",
                  label: "Search by Name",
                },
                {
                  value: "carplate",
                  label: "Search by Carplate",
                },
                {
                  value: "phonenumber",
                  label: "Search by Phone No",
                },
              ]}
            />
            <Input
              placeholder="Please enter keyword to search"
              style={{ margin: "0 10px", width: "30%" }}
              allowClear
              onChange={(obj) => {
                setKeyword(obj.target.value.toUpperCase());
                if (obj.target.value == "") {
                  getPersonList(1, "");
                }
              }}
              onPressEnter={getPersonList}
              value={keyword}
            />
            <Button
              type="primary"
              onClick={() => {
                getPersonList();
              }}
              icon={<SearchOutlined />}
            >
              Search
            </Button>
          </div>
        }
        extra={
          <Button type="primary" onClick={() => {}} icon={<PlusOutlined />}>
            Add
          </Button>
        }
        bordered={false}
      >
        <Table
          dataSource={personList}
          columns={columns}
          bordered
          rowKey="key"
          pagination={{
            total: totalPageNumber,
            current: currentPageNumber,
            pageSize: PAGE_SIZE,
            onChange: value => getPersonList(value)
          }}
        />
      </Card>
    </div>
  );
};

export default Product;
