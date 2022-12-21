import React, { useState, useContext } from "react";
import { ThreeDots, ColorRing } from "react-loader-spinner";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Icon } from "react-icons-kit";
import { eye } from "react-icons-kit/feather/eye";
import { eyeOff } from "react-icons-kit/feather/eyeOff";
import { Modal, Form, Space, Input } from "antd";
import { useMutation } from "@tanstack/react-query";
import { useGoogleLogin } from "@react-oauth/google";
import * as SC from "./StyledAuthComponents";
import { login, loginGG, forgotPassword } from "../../API/authApi";
import logo from "../../Assets/logo.png";
import loginPagePicture from "../../Assets/loginPagePicture.png";
import { Color } from "../../Constants/Constant";
import AuthContext from "../../Context/AuthProvider";
import GoogleLoginBtn from "../../Assets/GoogleLoginBtn.png";
import { showMessage } from "../Message";

export default function LoginPage() {
  const message = useLocation().state?.message;

  const { setAuth } = useContext(AuthContext);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const navigate = useNavigate();

  const [serverError, setServerError] = useState("");
  const [messageSignUp, setMessageSignUp] = useState(message || "");

  const [type, setType] = useState("password");
  const [icon, setIcon] = useState(eyeOff);
  const [forgotPasswordPopup, setForgotPasswordPopup] = useState(false);
  const [loadingForgotPassword, setLoadingForgotPassword] = useState(false);

  const [form] = Form.useForm();

  const handleToggle = () => {
    if (type === "password") {
      setIcon(eye);
      setType("text");
    } else {
      setIcon(eyeOff);
      setType("password");
    }
  };

  const { isLoading, mutateAsync } = useMutation(login, {
    onError: (error) => {
      setServerError(error.message);
    },
    onSuccess: (responseData) => {
      const { accessToken, user, refreshToken } = responseData.data;
      setAuth({ user, accessToken, refreshToken });
    },
  });

  const onSubmit = async (values) => {
    setMessageSignUp("");
    try {
      await mutateAsync({
        fullName: values.fullName,
        email: values.email,
        password: values.password,
      });
    } catch (error) {
      console.log(error);
    }
  };
  const gotoSignup = () => {
    navigate("/register", { replace: true });
  };
  const handleForgotPassword = () => {
    setForgotPasswordPopup(true);
  };
  const handleCancelForgotPassword = () => {
    setForgotPasswordPopup(false);
  };
  const forgotPasswordMutation = useMutation(forgotPassword, {
    onError: (error) => {
      setForgotPasswordPopup(false);
      form.resetFields();
      console.log(error.toString());
      if (error.toString().includes("This account is login with Google")) {
        showMessage(2, "This account is login with Google");
      } else if (error.toString().includes("Email is not exist")) {
        showMessage(2, "Email is not exist");
      } else {
        showMessage(2, "Reset fail. Unknown error");
      }
      setLoadingForgotPassword(false);
    },
    onSuccess: () => {
      setForgotPasswordPopup(false);
      form.resetFields();
      showMessage(0, "Please check your email to reset password");
      setLoadingForgotPassword(false);
    },
  });

  const onSubmitForgotPassword = async (values) => {
    setLoadingForgotPassword(true);
    try {
      await forgotPasswordMutation.mutateAsync({
        email: values.title,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const response = await loginGG(tokenResponse.access_token);

      const { accessToken, user, refreshToken } = response.data;
      setAuth({ user, accessToken, refreshToken });
    },
    onError: (error) => console.log(error),
  });
  return (
    <SC.AuthContainer>
      <SC.AuthFormWrapper>
        <SC.StyledLogoContainer>
          <img src={logo} alt="logo" />
          <SC.StyledLogoName>Retemitnem</SC.StyledLogoName>
        </SC.StyledLogoContainer>
        <SC.StyledHeadline>Login to your account</SC.StyledHeadline>
        {serverError && <SC.StyledError>{serverError}</SC.StyledError>}
        {messageSignUp && (
          <SC.StyledSignupMessage>{messageSignUp}</SC.StyledSignupMessage>
        )}

        <SC.AuthFormContainer onSubmit={handleSubmit(onSubmit)}>
          <SC.StyledInputBox>
            <SC.StyledErrorBox hasError={errors.email}>
              <SC.StyledLabel htmlFor="email">Email</SC.StyledLabel>
              <SC.StyledInput
                id="email"
                {...register("email", {
                  required: true,
                  pattern: /^\S+@\S+$/i,
                })}
                placeholder="abc@gmail.com"
              />
            </SC.StyledErrorBox>
            {errors.email?.type === "required" && (
              <SC.StyledErrorMessage>Email is required</SC.StyledErrorMessage>
            )}
            {errors.email?.type === "pattern" && (
              <SC.StyledErrorMessage>Invalid Email</SC.StyledErrorMessage>
            )}
          </SC.StyledInputBox>
          <SC.StyledInputBox>
            <SC.StyledErrorBox hasError={errors.password}>
              <SC.StyledLabel htmlFor="password">Password</SC.StyledLabel>
              <SC.StyledInputRowContainer>
                <SC.StyledInput
                  id="password"
                  {...register("password", { required: true, minLength: 6 })}
                  placeholder="Enter your password"
                  type={type}
                />
                <SC.StyledInputPasswordIcon onClick={handleToggle}>
                  <Icon icon={icon} size={20} />
                </SC.StyledInputPasswordIcon>
              </SC.StyledInputRowContainer>
            </SC.StyledErrorBox>
            {errors.password?.type === "required" && (
              <SC.StyledErrorMessage>
                Password is required
              </SC.StyledErrorMessage>
            )}
            {errors.password?.type === "minLength" && (
              <SC.StyledErrorMessage>
                Password must be at least 6 digit!
              </SC.StyledErrorMessage>
            )}
          </SC.StyledInputBox>

          {isLoading ? (
            <ThreeDots
              height="80"
              width="80"
              radius="9"
              color={Color.primary}
              ariaLabel="three-dots-loading"
              wrapperStyle={{}}
              wrapperClassName=""
              visible
            />
          ) : (
            <SC.StyledButton marginSize={1} onClick={handleSubmit}>
              Sign In
            </SC.StyledButton>
          )}
        </SC.AuthFormContainer>
        <SC.StyledForgotPasswordButton onClick={handleForgotPassword}>
          Forgot password ?
        </SC.StyledForgotPasswordButton>
        <Modal
          open={forgotPasswordPopup}
          onOk={form.submit}
          onCancel={handleCancelForgotPassword}
        >
          <Form
            form={form}
            onFinish={onSubmitForgotPassword}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
          >
            <Form.Item>
              <SC.StyledGroupTitle>Forgot Password</SC.StyledGroupTitle>
            </Form.Item>
            <Form.Item label="Your email">
              <Space>
                <Form.Item
                  name="title"
                  noStyle
                  rules={[
                    {
                      required: true,
                      pattern: /^\S+@\S+$/i,
                      message: "Please check your input",
                    },
                  ]}
                >
                  <Input style={{ width: 160 }} placeholder="Please input" />
                </Form.Item>
                {loadingForgotPassword ? (
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
        <SC.StyledQuestionSignUp>
          Already have an account ?
        </SC.StyledQuestionSignUp>
        <SC.StyledSignMode onClick={gotoSignup}>Sign Up</SC.StyledSignMode>
        <SC.StyledQuestionGoogleLogin>
          Or sign in with
        </SC.StyledQuestionGoogleLogin>
        <input
          type="image"
          src={GoogleLoginBtn}
          alt="googleLogin"
          onClick={loginWithGoogle}
        />
      </SC.AuthFormWrapper>
      <SC.AuthContainerImage>
        <img src={loginPagePicture} alt="Login Page " />
        <SC.StyledImagePhrase>
          Welcome to Education Platform
        </SC.StyledImagePhrase>
        <SC.StyledImageSecondPhrase>For everyone</SC.StyledImageSecondPhrase>
      </SC.AuthContainerImage>
    </SC.AuthContainer>
  );
}
