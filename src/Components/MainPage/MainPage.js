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
  Menu,
  Dropdown,
} from "antd";
import InfiniteScroll from "react-infinite-scroll-component";
import { useMutation } from "@tanstack/react-query";
import { ColorRing } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import { logout } from "../../API/authApi";
import { groupInfo, createGroup, addMember } from "../../API/groupApi";
import { changeFullname, changePassword, checkType } from "../../API/userApi";
import * as SC from "./StyledMainPageComponents";
import logo from "../../Assets/logo.png";
import AuthContext from "../../Context/AuthProvider";
import { showMessage } from "../Message";

const { Search } = Input;
const { Meta } = Card;

export default function MainPage() {
  const { auth, setAuth, imageUrls } = useContext(AuthContext);
  const [visible, setVisible] = useState(false);
  const [visibleName, setVisibleName] = useState(false);
  const [visiblePassword, setVisiblePassword] = useState(false);
  const [form] = Form.useForm();
  const [nameForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [data, setData] = useState([]);
  const [rawData, setRawData] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All Groups");
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [type, setType] = useState("local");
  const navigate = useNavigate();

  useEffect(() => {
    const checkTypeMenu = async () => {
      const response = await checkType({ userID: auth?.user?._id });
      setType(response.data.type);
    };

    checkTypeMenu();
  }, [auth]);

  const checkExist = (element, userID) => {
    for (let i = 0; i < element.members.length; i++) {
      if (element.members[i].memberID === userID) {
        return true;
      }
    }
    return false;
  };

  const logoutAction = async () => {
    localStorage.removeItem("accessToken");
    await logout({ refreshToken: localStorage.getItem("refreshToken") });
    localStorage.removeItem("refreshToken");
    setAuth(null);
  };

  const handleNameCancel = () => {
    setVisibleName(false);
    nameForm.resetFields();
  };

  const handlePasswordCancel = () => {
    setVisiblePassword(false);
    nameForm.resetFields();
  };
  const handleUserMenu = async ({ key }) => {
    const value = key.key;
    if (value === "3") {
      logoutAction();
    } else if (value === "2") {
      setVisiblePassword(true);
    } else {
      setVisibleName(true);
    }
  };

  const userMenu = (
    <Menu onClick={(key) => handleUserMenu({ key })}>
      <Menu.Item key="1">Change your name</Menu.Item>
      {type === "local" && <Menu.Item key="2">Change your password</Menu.Item>}
      <Menu.Divider />
      <Menu.Item key="3">Logout</Menu.Item>
    </Menu>
  );

  const filterAndSearchData = (allData) => {
    const filteredData = [];
    for (let i = 0; i < allData.length; i++) {
      if (allData[i].groupName.toString().includes(search)) {
        if (
          (filter === "My Groups" &&
            allData[i].creatorID === auth?.user?._id) ||
          (filter === "Other Groups" &&
            allData[i].creatorID !== auth?.user?._id &&
            checkExist(allData[i], auth?.user?._id)) ||
          (filter === "All Groups" && checkExist(allData[i], auth?.user?._id))
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
            memberID: auth?.user?._id,
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

  // handle filter
  const handleChange = (value) => {
    if (value === "self") {
      setFilter("My Groups");
    } else if (value === "others") {
      setFilter("Other Groups");
    } else if (value === "all") {
      setFilter("All Groups");
    }
  };

  const handleCancel = () => {
    setVisible(false);
    form.resetFields();
  };
  const createGroupMutation = useMutation(createGroup, {
    onError: (error) => {
      setVisible(false);
      form.resetFields();
      if (error.toString().includes("group name has already been used")) {
        showMessage(2, "Group name has already been used");
      } else {
        showMessage(2, "Create failed. Unknown error");
      }
      setLoadingGroups(false);
    },
    onSuccess: () => {
      setVisible(false);
      form.resetFields();
      showMessage(0, "Create group successfully");
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
      await createGroupMutation.mutateAsync({
        groupName: values.groupname,
        creatorID: auth?.user?._id,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const changeNameMutation = useMutation(changeFullname, {
    onError: (error) => {
      setVisibleName(false);
      nameForm.resetFields();
      // alert(error);
      console.log(error);
      // if (error.toString().includes("group name has already been used")) {
      //   showExistNameErrorMessage();
      // } else {
      //   showUnknownErrorMessage();
      // }
    },
    onSuccess: (response) => {
      setVisibleName(false);
      nameForm.resetFields();
      showMessage(0, "Update name successfully");
      // update current auth
      setAuth((preState) => ({
        ...preState,
        user: { ...preState.user, fullName: response.data.fullName },
      }));
    },
  });

  const onNameSubmit = async (values) => {
    try {
      await changeNameMutation.mutateAsync({
        userID: auth?.user?._id,
        newName: values.fullname,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const changePasswordMutation = useMutation(changePassword, {
    onError: (error) => {
      setVisiblePassword(false);
      passwordForm.resetFields();
      // alert(error);
      console.log(error);
      if (error.toString().includes("409")) {
        showMessage(
          2,
          "Update failed. Your input password doesn't match your current password"
        );
      } else {
        showMessage(2, "Update failed. Unknown error");
      }
    },
    onSuccess: () => {
      setVisiblePassword(false);
      passwordForm.resetFields();
      showMessage(0, "Update password successfully");
    },
  });

  const onPasswordSubmit = async (values) => {
    try {
      await changePasswordMutation.mutateAsync({
        userID: auth?.user?._id,
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
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
            <SC.StyledUserName>{auth?.user?.fullName}</SC.StyledUserName>
            <SC.StyledEmailName>{auth?.user?.email}</SC.StyledEmailName>
          </SC.StyledUserInfoContainer>
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
            onClick={() => setVisible(true)}
          >
            New Group
          </Button>
        </SC.StyledItemMarginHorizonalLeftContainer>

        <Modal open={visible} onOk={form.submit} onCancel={handleCancel}>
          <Form
            form={form}
            onFinish={onSubmitCreateGroup}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
          >
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
                {createGroupMutation.isLoading ? (
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

        <Modal
          open={visibleName}
          onOk={nameForm.submit}
          onCancel={handleNameCancel}
        >
          <Form
            form={nameForm}
            onFinish={onNameSubmit}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            scrollToFirstError
          >
            {/* Any input */}
            <Form.Item>
              <SC.StyledGroupTitle>Update your Full Name</SC.StyledGroupTitle>
            </Form.Item>
            <Form.Item
              name="fullname"
              label="Full Name"
              autoComplete="off"
              initialValue={auth?.user?.fullName}
              rules={[
                {
                  required: true,
                  message: "Please input your full name",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          open={visiblePassword}
          onOk={passwordForm.submit}
          onCancel={handlePasswordCancel}
        >
          <Form
            form={passwordForm}
            onFinish={onPasswordSubmit}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            scrollToFirstError
          >
            <Form.Item>
              <SC.StyledGroupTitle>Update your Password</SC.StyledGroupTitle>
            </Form.Item>
            <Form.Item
              name="oldPassword"
              label="Current Password"
              autoComplete="off"
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Please input your current password!",
                },
                { min: 6, message: "Password must be minimum 6 characters." },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              name="newPassword"
              label="New Password"
              autoComplete="off"
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Please input your new password!",
                },
                { min: 6, message: "Password must be minimum 6 characters." },
              ]}
            >
              <Input.Password />
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
          hasMore={data.length < 12}
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
                <Card
                  hoverable
                  cover={
                    <img
                      width="262"
                      height="159"
                      alt="example"
                      src={
                        imageUrls[Math.floor(Math.random() * imageUrls.length)]
                      }
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
                        showMessage(1, "Link copied to clipboard");
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
              </List.Item>
            )}
          />
        </InfiniteScroll>
      </div>
    </SC.StyledPageContainer>
  );
}
