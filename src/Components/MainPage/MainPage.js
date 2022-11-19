import React, { useState, useContext, useEffect } from "react";
import "antd/dist/antd.min.css";

import { PlusOutlined, ShareAltOutlined } from "@ant-design/icons";
import {
  Button,
  Input,
  Select,
  Avatar,
  Card,
  List,
  Form,
  Modal,
  Space,
  message,
} from "antd";

import InfiniteScroll from "react-infinite-scroll-component";
import { useMutation } from "@tanstack/react-query";
import { ColorRing } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import { createGroup, groupInfo } from "../../API/api";
import logoutIcon from "../../Assets/logout.svg";
import * as SC from "./StyledMainPageComponents";
import logo from "../../Assets/logo.png";
import AuthContext from "../../Context/AuthProvider";

const { Search } = Input;
const { Meta } = Card;

export default function MainPage() {
  const { auth, setAuth } = useContext(AuthContext);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [rawData, setRawData] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("My Groups");
  const [loadingGroups, setLoadingGroups] = useState(false);
  const navigate = useNavigate();
  const checkExist = (element, userID) => {
    for (let i = 0; i < element.members.length; i++) {
      if (element.members[i].memberID === userID) {
        return true;
      }
    }
    return false;
  };

  const filterAndSearchData = (allData) => {
    const filteredData = [];
    for (let i = 0; i < allData.length; i++) {
      if (allData[i].groupName.toString().includes(search)) {
        if (
          (filter === "My Groups" && allData[i].creatorID === auth.user._id) ||
          (filter !== "My Groups" &&
            allData[i].creatorID !== auth.user._id &&
            checkExist(allData[i], auth.user._id))
        ) {
          filteredData.push(allData[i]);
        }
      }
    }
    setData(filteredData);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingGroups(true);
        const response = await groupInfo();
        setRawData(response.data);
        setLoadingGroups(false);
        // filterAndSearchData();
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    filterAndSearchData(rawData);
  }, [search, filter, rawData]);

  // handle search
  const onSearch = (value) => setSearch(value);
  // const onClick = () => console.log('click');

  // handle filter
  const handleChange = (value) => {
    console.log(`selected ${value}`);
    if (value === "self") {
      setFilter("My Groups");
    } else {
      setFilter("Other Groups");
    }
  };

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
    form.resetFields();
  };

  const showSuccessMessage = () => {
    message.success("Create group successfully");
  };

  const showExistNameErrorMessage = () => {
    message.error("Group name has already been exist");
  };

  const showUnknownErrorMessage = () => {
    message.error("Create failed. Unknown error");
  };

  const { isLoading, mutateAsync } = useMutation(createGroup, {
    onError: (error) => {
      setVisible(false);
      form.resetFields();
      // alert(error);
      console.log(error);
      if (error.toString().includes("group name has already been used")) {
        showExistNameErrorMessage();
      } else {
        showUnknownErrorMessage();
      }
    },
    onSuccess: () => {
      setVisible(false);
      form.resetFields();
      showSuccessMessage();
      const fetchData = async () => {
        const response = await groupInfo();
        setRawData(response.data);
      };

      fetchData();
    },
  });

  const onSubmit = async (values) => {
    try {
      await mutateAsync({
        groupName: values.groupname,
        creatorID: auth.user._id,
      });
    } catch (error) {
      console.log(error);
    }
  };
  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setAuth(null);
  };
  return (
    <SC.StyledPageContainer>
      <SC.StyledUpperBarContainer>
        <SC.StyledLogoContainer
          onClick={() => navigate(`/`, { replace: true })}
        >
          <img src={logo} alt="logo" />
          <SC.StyledLogoName>
            <b>Retemitnem</b>
          </SC.StyledLogoName>
        </SC.StyledLogoContainer>

        <SC.StyledIconContainer>
          <SC.StyledUserInfoContainer>
            <SC.StyledUserName>{auth.user.fullName}</SC.StyledUserName>
            <SC.StyledEmailName>{auth.user.email}</SC.StyledEmailName>
          </SC.StyledUserInfoContainer>
          <SC.StyledImageContainer
            src={logoutIcon}
            alt="logout"
            onClick={logout}
          />
        </SC.StyledIconContainer>
      </SC.StyledUpperBarContainer>

      <SC.StyledUtilitiesContainer>
        <SC.StyledItemMarginHorizonalLeftContainer>
          <Button
            type="primary"
            shape="round"
            icon={<PlusOutlined />}
            size="large"
            onClick={showModal}
          >
            New Group
          </Button>
        </SC.StyledItemMarginHorizonalLeftContainer>

        <Modal visible={visible} onOk={form.submit} onCancel={handleCancel}>
          <Form
            form={form}
            onFinish={onSubmit}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
          >
            {/* Any input */}
            <Form.Item>
              <SC.StyledGroupTitle>Create a group</SC.StyledGroupTitle>
            </Form.Item>
            <Form.Item label="Group name">
              <Space>
                <Form.Item
                  name="groupname"
                  noStyle
                  rules={[
                    { required: true, message: "Group name is required" },
                  ]}
                >
                  <Input style={{ width: 160 }} placeholder="Please input" />
                </Form.Item>
                {isLoading ? (
                  <ColorRing
                    visible
                    height="25"
                    width="25"
                    ariaLabel="blocks-loading"
                    wrapperStyle={{}}
                    wrapperClass="blocks-wrapper"
                    colors={[
                      "#e15b64",
                      "#f47e60",
                      "#f8b26a",
                      "#abbd81",
                      "#849b87",
                    ]}
                  />
                ) : null}
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        <SC.StyledSearchSortContainer>
          <SC.StyledItemMarginHorizonalRightContainer>
            <Search
              placeholder="input search text"
              onSearch={onSearch}
              enterButton
            />
          </SC.StyledItemMarginHorizonalRightContainer>
          <SC.StyledItemMarginHorizonalRightContainer>
            <Select
              defaultValue="self"
              onChange={handleChange}
              style={{ width: 200 }}
              options={[
                {
                  value: "self",
                  label: "My Groups",
                },
                {
                  value: "others",
                  label: "Other Groups",
                },
              ]}
            />
          </SC.StyledItemMarginHorizonalRightContainer>
        </SC.StyledSearchSortContainer>
      </SC.StyledUtilitiesContainer>

      <SC.StyledGroupTitleContainer>
        <SC.StyledGroupTitle>{filter}</SC.StyledGroupTitle>
      </SC.StyledGroupTitleContainer>

      <div
        id="scrollableDiv"
        style={{
          boxSizing: "border-box",
          height: "1000px",
          margin: "0px 35px 20px 35px",
          maxWidth: "100%",
          overflowX: "hidden",
          padding: "16px 16px",
          border: "1px solid rgba(140, 140, 140, 0.35)",
        }}
      >
        <InfiniteScroll
          style={{ overflowX: "hidden" }}
          dataLength={data.length}
          // next={loadMoreData}
          hasMore={data.length < 12}
          // loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
          // endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
          scrollableTarget="scrollableDiv"
        >
          {loadingGroups ? (
            <SC.StyledCenterContainer>
              <ColorRing
                style={{ margin: "100px 0px 0px 200px" }}
                visible
                height="100"
                width="100"
                ariaLabel="blocks-loading"
                wrapperStyle={{}}
                wrapperClass="blocks-wrapper"
                colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
              />
            </SC.StyledCenterContainer>
          ) : null}
          <List
            grid={{
              gutter: 16,
              xs: 1,
              sm: 2,
              md: 4,
              lg: 4,
              xl: 5,
              xxl: 5,
            }}
            dataSource={data}
            renderItem={(item) => (
              <List.Item>
                {/* <Card title={item.title}>Card content</Card> */}
                {/* <div onClick={() => alert("Hello from here")}> */}
                <Card
                  // style={{ width: 300 }}
                  hoverable
                  cover={
                    <img
                      alt="example"
                      src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                    />
                  }
                  actions={[
                    <ShareAltOutlined
                      key="share"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log(item);
                      }}
                    />,
                  ]}
                  onClick={() => {
                    navigate(`/group/${item._id}`, {
                      replace: false,
                      state: { item },
                    });
                  }}
                >
                  <Meta
                    avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                    title={item.groupName}
                    description={item.creatorName}
                  />
                </Card>
                {/* </div> */}
              </List.Item>
            )}
          />
        </InfiniteScroll>
      </div>
    </SC.StyledPageContainer>
  );
}
