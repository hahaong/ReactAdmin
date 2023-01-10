import React from "react";
import { Card, Button, Select, Input, Table, message ,Modal} from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
import dayjs from "dayjs";

import {
  reqPersonList,
  reqSearchPersonList,
  reqCategoryById,
  reqDeletePerson
} from "../../api/index";
import { createSavePersonAction } from "../../redux/actions_creators/person_action";
import { PAGE_SIZE } from "../../config";

const Person = (props) => {
  const[isModalOpen, setIsModalOpen] = React.useState(false)
  const[personName, setPersonName] = React.useState("") //display name in Modal
  const[personId, setPersonId] = React.useState("") //Id to remove person from registration collection

  const [isLoading, setIsLoading] = React.useState(true);
  const [personList, setPersonList] = React.useState([]);
  const [currentPageNumber, setCurrentPageNumber] = React.useState("1");
  const [totalDataCount, setTotalDataCount] = React.useState("");
  const [keyword, setKeyword] = React.useState("");
  const [searchType, setSearchType] = React.useState("name");

  React.useEffect(() => {
    getPersonList();
  }, []);

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = async () => {
    let result = await reqDeletePerson(personId)
    message.success("Successfully remove " + personName)
    setIsModalOpen(false);
    getPersonList()
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const getPersonList = async (currentPage = 1, myKeyword = keyword) => {
    setIsLoading(true); //when user press search, page is loading

    let result;
    if (myKeyword) {
      result = await reqSearchPersonList(currentPage, searchType, myKeyword);
    } else {
      result = await reqPersonList(currentPage);
    }
    let { currentPageData, currentPageNumber, totalDataCount } = result;

    let resultList = currentPageData.map(async (doc) => {
      return {
        key: doc.id,
        name: doc.data().name,
        carPlate: doc.data().carPlate,
        phoneNumber: doc.data().phoneNumber,
        category: doc.data().category,
        categoryName: await getCategoryById(doc.data().category),
        detail : doc.data().detail,
        registeredAt: dayjs(doc.data().createdAt.toDate()).format(
          "YYYY-MM-DD HH:mm:ss"
        ),
      };
    });

    let localPersonList = [];
    for (var i = 0; i < resultList.length; i++) {
      let person = await resultList[i];
      localPersonList.push(person);
    }
    setPersonList([...localPersonList]);
    setCurrentPageNumber(currentPageNumber);
    setTotalDataCount(totalDataCount);

    //Save the item array to redux
    props.savePerson(localPersonList);

    setIsLoading(false);  
  };

  const getCategoryById = async (id) => {
    let result = await reqCategoryById(id);
    if (result.exists()) {
      const { category } = result.data();
      return category;
    } else {
      message.warning("Connection to database failed");
    }
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
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      render: (phoneNumber) => phoneNumber,
    },
    {
      title: "Category",
      dataIndex: "categoryName",
      key: "category",
      align: "categoryName",
    },
    {
      title: "Registered At",
      dataIndex: "registeredAt",
      key: "registeredAt",
      align: "center",
      width: "15%",
    },
    {
      title: "Operation",
      // dataIndex: "operation",
      key: "operation",
      align: "center",
      width: "20%",
      render: (item) => {
        return (
          <div>
            <Button
              type="link"
              onClick={() => {
                props.history.push(
                  `/admin/management/person/detail/${item.key}`
                );
              }}
              size={"small"}
            >
              View
            </Button>
            <Button
              type="link"
              onClick={() => {
                props.history.push(
                  `/admin/management/person/add_update/${item.key}`
                );
              }}
              size={"small"}
            >
              Edit
            </Button>
            <Button
              type="link"
              onClick={() => {
                setPersonName(item.name)
                setPersonId(item.key)
                showModal()
              }}
              danger
              size={"small"}
            >
              Remove
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
                  value: "carPlate",
                  label: "Search by Car Plate",
                },
                {
                  value: "phoneNumber",
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
          <Button
            type="primary"
            onClick={() => {
              props.history.push("/admin/management/person/add_update");
            }}
            icon={<PlusOutlined />}
          >
            Register
          </Button>
        }
        bordered={false}
      >
        <Table
          loading={isLoading}
          dataSource={personList}
          columns={columns}
          bordered
          rowKey="key"
          pagination={{
            total: totalDataCount,
            current: currentPageNumber,
            pageSize: PAGE_SIZE,
            onChange: (value) => getPersonList(value)
          }}
        />
      </Card>


      <Modal
        title="Remove Person"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {`Are you sure to remove ${personName}?`}
      </Modal>



    </div>
  );
};

export default connect(
  (state) => {
    return {};
  },
  {
    savePerson: createSavePersonAction,
  }
)(Person);
