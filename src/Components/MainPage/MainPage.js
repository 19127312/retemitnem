import React, { useState, useContext, useEffect } from "react";
import "antd/dist/antd.min.css";

import {
  PlusOutlined,
  ShareAltOutlined,
  UserOutlined,
} from "@ant-design/icons";
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
  Menu,
  Dropdown,
} from "antd";
import InfiniteScroll from "react-infinite-scroll-component";
import { useMutation } from "@tanstack/react-query";
import { ColorRing } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import { createGroup, groupInfo, addMember } from "../../API/api";
// import logoutIcon from "../../Assets/logout.svg";
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
  const [filter, setFilter] = useState("All Groups");
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

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setAuth(null);
  };

  const handleUserMenu = async ({ key }) => {
    const value = key.key;
    if (value === "2") {
      logout();
    }
  };

  const userMenu = (
    <Menu onClick={(key) => handleUserMenu({ key })}>
      <Menu.Item key="1">Manage your information</Menu.Item>
      <Menu.Divider />
      <Menu.Item key="2">Logout</Menu.Item>
    </Menu>
  );

  const filterAndSearchData = (allData) => {
    const filteredData = [];
    for (let i = 0; i < allData.length; i++) {
      if (allData[i].groupName.toString().includes(search)) {
        if (
          (filter === "My Groups" && allData[i].creatorID === auth.user._id) ||
          (filter === "Other Groups" &&
            allData[i].creatorID !== auth.user._id &&
            checkExist(allData[i], auth.user._id)) ||
          (filter === "All Groups" && checkExist(allData[i], auth.user._id))
        ) {
          filteredData.push(allData[i]);
        }
      }
    }
    setData(filteredData);
  };

  useEffect(() => {
    const joinGroupID = async () => {
      try {
        const groupID = localStorage.getItem("groupID");

        if (groupID) {
          localStorage.removeItem("groupID");
          await addMember({
            groupID,
            memberID: auth.user._id,
          });
        }
      } catch (error) {
        console.log(error);
      }
    };

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
    joinGroupID();
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
    } else if (value === "others") {
      setFilter("Other Groups");
    } else if (value === "all") {
      setFilter("All Groups");
    }
  };

  const showCopySuccessMessage = () => {
    message.info("Copied to clipboard");
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
      setLoadingGroups(false);
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
      setLoadingGroups(false);
    },
  });

  const onSubmitCreateGroup = async (values) => {
    setLoadingGroups(true);
    try {
      await mutateAsync({
        groupName: values.groupname,
        creatorID: auth.user._id,
      });
    } catch (error) {
      console.log(error);
    }
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
          {/* <SC.StyledImageContainer
            src={logoutIcon}
            alt="logout"
            onClick={logout}
          /> */}
          <div>
            <Dropdown.Button
              style={{ float: "right" }}
              className="dropdown-btn"
              overlay={userMenu}
              icon={
                <UserOutlined
                  style={{
                    fontSize: "28px",
                    backgroundColor: "#f0f0f0",
                    borderRadius: "50%",
                  }}
                />
                // <Avatar src="https://joeschmoe.io/api/v1/random" />
              }
            />
          </div>
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
            onFinish={onSubmitCreateGroup}
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
              defaultValue="all"
              onChange={handleChange}
              style={{ width: 200 }}
              options={[
                {
                  value: "all",
                  label: "All Groups",
                },
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
                        navigator.clipboard.writeText(
                          `${window.location.host}/joinLink/${item._id}`
                        );
                        showCopySuccessMessage();
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
