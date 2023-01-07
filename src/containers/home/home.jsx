import React from "react";
import {
  Avatar,
  Button,
  List,
  Skeleton,
  message,
  Card,
  Select,
  Input,
  Drawer,
  Row,
  Col,
  Modal,
  DatePicker,
  Form,
  Space,
} from "antd";
import dayjs from "dayjs";
import { SearchOutlined, FilterOutlined } from "@ant-design/icons";
import {
  reqCarparkList,
  reqPersonById,
  reqCategoryById,
  reqCategoryList,
  reqCarparkListWithinDate,
  reqSearchPerson,
} from "../../api/index";
import "./home.css";

// const fakeDataUrl = `https://randomuser.me/api/?results=${count}&inc=name,gender,email,nat,picture&noinfo`;
const { Option } = Select;
const DescriptionItem = ({ title, content }) => (
  <div className="site-description-item-profile-wrapper">
    <p className="site-description-item-profile-p-label">{title}:</p>
    {content}
  </div>
);

const allMonth = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function Home() {
  const [initLoading, setInitLoading] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [openMoreInformationDrawer, setOpenMoreInformationDrawer] =
    React.useState(false);
  const [openFilterDrawer, setOpenFilterDrawer] = React.useState(false);

  const [carparkList, setCarparkList] = React.useState([]);
  const [ownerData, setOwnerData] = React.useState([]);
  const [carparkData, setCarparkData] = React.useState([]);
  const [categoryList, setCategoryList] = React.useState([]);

  const [basicOrAdvanceSearch, setBasicOrAdvanceSearch] =
    React.useState("basic");

  const [keyword, setKeyword] = React.useState("");
  const [displayNumber, setDisplayNumber] = React.useState(5);
  const [displayRecentSixMonth, setDisplayRecentSixMonth] = React.useState([]);
  const [displayCurrentMonth, setDisplayCurrentMonth] = React.useState();

  const [currentPageNumber, setcurrentPageNumber] = React.useState(1);
  const [test1, setTest1] = React.useState(1);

  
  const dateFormat = "YYYY-MM-DD";
  const [form] = Form.useForm();

  React.useEffect(() => {
    form.setFieldValue("date", [
      dayjs("2022-12-15", dateFormat),
      dayjs("2022-12-18", dateFormat),
    ]);
    // form.setFieldValue("name", "ONGREAL");
    form.setFieldValue("carPlate", "QQQ2357");

    getCategoryList();
    getCarparkList();
   

    // setDisplayRecentSixMonth([
    //   ...allMonth.slice(startIndex, currentMonth),
    // ]);
  }, []);

  const showMoreInformationDrawer = () => {
    setOpenMoreInformationDrawer(true);
  };

  const moreInformationDrawerOnClose = () => {
    setOpenMoreInformationDrawer(false);
  };

  const showFilterDrawer = () => {
    setOpenFilterDrawer(true);
  };

  const FilterDrawerOnClose = () => {
    setOpenFilterDrawer(false);
  };

  const testfunc =  async() =>{
    console.log(test1)
  }

  const getCarparkList = async (
    pageNumber = currentPageNumber,
    pageDataCount = displayNumber
  ) => {
    let result = await reqCarparkList({
      currentPageNumber: pageNumber,
      pageSize: pageDataCount,
      basicOrAdvanceSearch,
    }); //first param is page number, second param is number of data returned per request
    const { currentPageData, currentPageNumber, totalDataCount, isMore } =
      result;
    console.log(isMore);

// boundary

    let resultList = currentPageData.map(async (doc) => {
      const { carPlate, image, ownerID, createdAt, enterOrExit } = doc.data();
      let record = {
        key: doc.id,
        carPlate: carPlate,
        image: image,
        enterOrExit:enterOrExit,
        ownerID: ownerID ? ownerID : {},
        createdAtTimeStamp: createdAt,
        createdAt: dayjs(createdAt.toDate()).format("YYYY-MM-DD HH:mm:ss"),
        ownerData: ownerID ? await getPersonById(ownerID) : {},
      };
      return record;
    });

    console.log(resultList);
    let localCarparkList = [];
    for (var i = 0; i < resultList.length; i++) {
      let record = await resultList[i];
      localCarparkList.push(record);
    }
    console.log(localCarparkList);
    setCarparkList([...localCarparkList]);
    setCarparkData([...localCarparkList]);
    setInitLoading(false);
    setLoading(!isMore); //true or false
    console.log("isMore:", isMore);
  };

  const getPersonById = async (id) => {
    console.log(id);
    let result = await reqPersonById("1MhNyElGxdaf05VZkMRK");
    console.log(result.data());
    if (result.exists()) {
      const { createdAt, category } = result.data();
      return {
        ...result.data(),
        createdAt: dayjs(createdAt.toDate()).format("YYYY-MM-DD HH:mm:ss"),
        categoryName: await getCategoryById(category),
      };
    } else {
      return {};
      // message.warning("Search Person By Id failed");
    }
  };

  const getCategoryById = async (id) => {
    let result = await reqCategoryById(id);
    console.log(result.data());
    const { category } = result.data();
    // console.log(category);
    return category;
  };

  const getCategoryList = async () => {
    let result = await reqCategoryList();
    if (!result.empty) {
      const resultList = result.map((doc) => ({
        key: doc.id,
        categoryName: doc.data().category,
      }));
      resultList.push({ key: "unauthorized", categoryName: "UNAUTHORIZED" });
      setCategoryList(resultList.reverse());
    }
  };

  const onLoadMore = async () => {
    setcurrentPageNumber(currentPageNumber + 1);
    setLoading(true); //when loading is true, the "loading more" button is hidden
    setCarparkList(
      carparkData.concat(
        [...new Array(displayNumber)].map(() => ({
          loading: true,
          carPlate: {},
          createdAt: {},
          image: {},
          ownerID: {},
          ownerData: {},
          name: {},
          picture: {},
        }))
      )
    );
    console.log("currentPageNumber:", currentPageNumber + 1);
    console.log("displayNumber:" + displayNumber);

    await getCarparkList(currentPageNumber + 1);
  };

  const loadMore =
    !initLoading && !loading ? (
      <div
        style={{
          textAlign: "center",
          marginTop: 12,
          height: 32,
          lineHeight: "32px",
        }}
      >
        <Button onClick={onLoadMore}>loading more</Button>
      </div>
    ) : null;

  const onFinish = async (values) => {

    setTest1(2);
    testfunc()
    
    let collectedFormData = {
      ...values,
      startDate: values.date[0].$d,
      endDate: values.date[1].$d,
    };

    console.log("state basic or advance:" + basicOrAdvanceSearch);
    // FilterDrawerOnClose()
    // reqCarparkListWithinDate()

    console.log("Success:", collectedFormData);
    let size = Object.keys(collectedFormData).length;
    console.log("Success size:", size);

    console.log("Date1:", collectedFormData.startDate);
    console.log("Date2:", collectedFormData.endDate);

    // console.log("category of carPlate" :)

    // need to create a array to append according to number of field
    let searchPersonConstraint = [
      { formsearchData: "name", operator: "==", databasesearchData:"name" , data: collectedFormData.name},
      { formsearchData: "phoneNumber", operator: "==", databasesearchData:"phoneNumber" , data: collectedFormData.phoneNumber},
      { formsearchData: "category", operator: "==", databasesearchData:"category", data: collectedFormData.category },
    ];

    console.log(searchPersonConstraint)

    let searchPersonData = [];
    searchPersonConstraint.forEach((obj) => {
      if (typeof obj.data != "undefined") {
        searchPersonData.push({
          searchData: obj.databasesearchData,
          operator: obj.operator,
          data: obj.data,
        });
      }
    });

    console.log(searchPersonData)
    let resultPersonListId = [];
    let resultPersonList = [];
    if(searchPersonData.length != 0){
      resultPersonList = await reqSearchPerson(searchPersonData);
    }

    // search owner first....
    resultPersonList.forEach((doc) => {
      resultPersonListId.push(doc.id);
    });
    console.log(resultPersonListId);

    // need to create a array to append according to number of field
    let searchCarParkConstraint = [
      { formsearchData: "carPlate", operator: "==" , databasesearchData:"carPlate" , data:collectedFormData.carPlate},
      { formsearchData: "enterOrExit", operator: "==" , databasesearchData:"enterOrExit" , data:collectedFormData.enterOrExit},
      { formsearchData: "owner", operator: "in" , databasesearchData:"ownerID" , data:resultPersonListId},
      { formsearchData: "startDate", operator: ">=" , databasesearchData:"createdAt" , data:collectedFormData.startDate},
      { formsearchData: "endDate", operator: "<=" , databasesearchData:"createdAt" , data:collectedFormData.endDate},
    ];
    let searchCarParkData = [];
    console.log(searchCarParkConstraint[2].data)

    searchCarParkConstraint.forEach((obj) => {
      if ((typeof obj.data !== "undefined") && (resultPersonListId instanceof Array ? obj.data.length != 0 : 1)) {
        searchCarParkData.push({
          searchData: obj.databasesearchData,
          operator: obj.operator,
          data: obj.data,
        });
      }
    });

    console.log(searchCarParkData)

    const result = await reqCarparkList({
      currentPageNumber:1,
      displayNumber,
      basicOrAdvanceSearch,
      searchCarParkData
    });
    
    let { currentPageData, currentPageNumber, totalDataCount, isMore } =result;
    console.log(currentPageData)
    currentPageData.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
    });

    let resultList = currentPageData.map(async (doc) => {
      const { carPlate, image, ownerID, createdAt,enterOrExit } = doc.data();
      let record = {
        key: doc.id,
        carPlate: carPlate,
        image: image,
        enterOrExit:enterOrExit,
        ownerID: ownerID ? ownerID : {},
        createdAtTimeStamp: createdAt,
        createdAt: dayjs(createdAt.toDate()).format("YYYY-MM-DD HH:mm:ss"),
        ownerData: ownerID ? await getPersonById(ownerID) : {},
      };
      return record;
    });


    // let localCarparkList = [];
    // resultCarParkList.forEach((doc) => {
    //   localCarparkList.push({ key: doc.id, ...doc.data() });
    //   console.log(doc.id, " => ", doc.data());
    // });
    // console.log(localCarparkList);
    // setCarparkList([...localCarparkList]);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="site-card-border-less-wrapper">
      <Card
        title={
          <div>
            <Select
              placeholder="List number"
              style={{
                width: "20%",
              }}
              onChange={(value) => {
                setDisplayNumber(value);
              }}
              options={[
                {
                  value: 5,
                  label: "5",
                },
                {
                  value: 10,
                  label: "10",
                },
                {
                  value: 50,
                  label: "50",
                },
                {
                  value: 100,
                  label: "100",
                },
              ]}
            />

            <Select
              placeholder="Month"
              style={{
                width: "20%",
              }}
              onChange={(value) => {
                setDisplayNumber(value);
              }}
              options={[
                ...displayRecentSixMonth,
                { value: "all", label: "All" },
              ]}
            />
            <Input
              placeholder="Please enter Car Plate to search"
              style={{ margin: "0 10px", width: "40%" }}
              allowClear
              onChange={(obj) => {
                setKeyword(obj.searchData.value.toUpperCase());
                if (obj.searchData.value == "") {
                  // getPersonList(1, "");
                }
              }}
              value={keyword}
            />
            <Button
              type="primary"
              onClick={() => {
                // getPersonList();
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
            onClick={showFilterDrawer}
            icon={<FilterOutlined />}
          >
            Filter
          </Button>
        }
        bordered={false}
      >
        <List
          style={{ overflow: "hidden", padding: "5px" }}
          className="demo-loadmore-list"
          loading={initLoading}
          itemLayout="horizontal"
          loadMore={loadMore}
          dataSource={carparkList}
          renderItem={(item) => (
            <List.Item
              actions={
                //make sure this ownerID is null or {}
                Object.keys(item.ownerID).length == 0
                  ? []
                  : [
                      <a
                        key="list-loadmore-more"
                        onClick={() => {
                          setOwnerData(item.ownerData);
                          console.log(item.ownerData);
                          showMoreInformationDrawer();
                        }}
                      >
                        more
                      </a>,
                    ]
              }
            >
              <Skeleton avatar title={false} loading={item.loading} active>
                <List.Item.Meta
                  style={{ alignItems: "center" }}
                  avatar={
                    <Avatar
                      shape="square"
                      style={{ width: "120px", height: "60px" }}
                      src={
                        <img
                          style={{ objectFit: "contain" }}
                          src={item.image}
                        ></img>
                      }
                    />
                  }
                  title={<span>{item.carPlate}</span>}
                  description={
                    <div>
                      {Object.keys(item.ownerID).length == 0 ? (
                        <span style={{ color: "red" }}>UNAUTHORIZED</span>
                      ) : (
                        item.ownerData.categoryName
                      )}
                      <br />
                      <span>Exit</span>
                    </div>
                  }
                />
              </Skeleton>
            </List.Item>
          )}
        />
      </Card>

      <Drawer
        title="More Information"
        placement="right"
        width={640}
        onClose={moreInformationDrawerOnClose}
        open={openMoreInformationDrawer}
      >
        <p
          className="site-description-item-profile-p"
          style={{
            marginBottom: 24,
          }}
        >
          Person Profile
        </p>

        <Row>
          <Col span={12}>
            <DescriptionItem title="Full Name" content={ownerData.name} />
          </Col>
          <Col span={12}>
            <DescriptionItem title="Phone No" content={ownerData.phoneNumber} />
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <DescriptionItem title="Car Plate" content={ownerData.carPlate} />
          </Col>
          <Col span={12}>
            <DescriptionItem
              title="Category"
              content={ownerData.categoryName}
            />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <DescriptionItem
              title="Register At"
              content={ownerData.createdAt}
            />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <DescriptionItem
              title="Detail"
              content={
                <span
                  dangerouslySetInnerHTML={{ __html: ownerData.detail }}
                ></span>
              }
            />
          </Col>
        </Row>
      </Drawer>

      <Drawer
        title="Filter Search"
        width={640}
        onClose={FilterDrawerOnClose}
        open={openFilterDrawer}
        bodyStyle={{
          paddingBottom: 80,
        }}
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          onValuesChange={(obj) => {
            if (obj.carPlate) {
              form.setFieldsValue({
                carPlate: obj.carPlate.toUpperCase(),
              });
            }
            if (obj.name) {
              form.setFieldsValue({
                name: obj.name.toUpperCase(),
              });

            }
          }}
        >
          <Row>
            <Col span={24}>
              <Form.Item name="carPlate" label="Car Plate">
                <Input placeholder="Please enter car plate number" allowClear/>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item name="name" label="Name">
                <Input placeholder="Please enter owner name" allowClear/>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item name="category" label="Category">
                {/* load category from firebase */}
                <Select placeholder="Please choose the category" allowClear>
                  {categoryList.map((item) => {
                    return (
                      <Option key={item.key} value={item.key}>
                        {item.categoryName}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item name="phoneNumber" label="Phone Number"
              rules={[
                {
                  pattern: /^[0-9]+$/,
                  message:
                    "Phone Number must be composed of numbers",
                },
              ]}
              >
                <Input placeholder="Please enter owner phone number" allowClear/>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item name="enterOrExit" label="Enter Or Exit">
                {/* load category from firebase */}
                <Select
                  placeholder="Please choose the car access type"
                  allowClear
                >
                  <Option key={"enter"} value={"enter"}>
                    Enter
                  </Option>
                  <Option key={"exit"} value={"exit"}>
                    Exit
                  </Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item
                name="date"
                label="Date"
                rules={[
                  {
                    required: true,
                    message: "Please choose the starting and end date",
                  },
                ]}
              >
                <DatePicker.RangePicker
                  style={{
                    width: "100%",
                  }}
                  getPopupContainer={(trigger) => trigger.parentElement}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row style={{ paddingTop: "12px" }}>
            <Col span={6}>
              <Space>
                <Button onClick={() => {}}>Clear All</Button>

                <Button
                  onClick={() => {
                    setBasicOrAdvanceSearch("advance");
                  }}
                  type="primary"
                  htmlType="submit"
                >
                  Search
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Drawer>
    </div>
  );
}
