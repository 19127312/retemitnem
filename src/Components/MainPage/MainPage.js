import React, { useState, useContext, useEffect } from "react";
import "antd/dist/antd.min.css";
import { UserOutlined } from "@ant-design/icons";
import { Input, Form, Modal, Dropdown, Menu } from "antd";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { logout } from "../../API/authApi";
import { changeFullname, changePassword, checkType } from "../../API/userApi";
import * as SC from "./StyledMainPageComponents";
import logo from "../../Assets/logo.png";
import AuthContext from "../../Context/AuthProvider";
import { showMessage } from "../Message";
import GroupListPage from "./GroupListPage";
import PresentationListPage from "./PresentationListPage";

export default function MainPage() {
  const { auth, setAuth } = useContext(AuthContext);

  const [visibleName, setVisibleName] = useState(false);
  const [visiblePassword, setVisiblePassword] = useState(false);

  const [nameForm] = Form.useForm();
  const [passwordForm] = Form.useForm();

  const [type, setType] = useState("local");
  const navigate = useNavigate();

  const items = [
    {
      label: "Groups",
      key: "1",
      children: <GroupListPage />,
    }, // remember to pass the key prop
    {
      label: "Presentations",
      key: "2",
      children: <PresentationListPage />,
    },
  ];
  useEffect(() => {
    const checkTypeMenu = async () => {
      const response = await checkType({ userID: auth?.user?._id });
      setType(response.data.type);
    };

    checkTypeMenu();
  }, [auth]);

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

      <SC.StyledTabContainer>
        <SC.StyledTabs
          defaultActiveKey="1"
          type="card"
          size="large"
          centered
          style={{
            width: "90%",
          }}
          items={items}
        />
      </SC.StyledTabContainer>

      <SC.StyledUtilitiesContainer>
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
      </SC.StyledUtilitiesContainer>
    </SC.StyledPageContainer>
  );
}
