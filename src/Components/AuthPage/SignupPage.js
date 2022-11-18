import React, { useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Icon } from "react-icons-kit";
import { eye } from "react-icons-kit/feather/eye";
import { eyeOff } from "react-icons-kit/feather/eyeOff";
import { useMutation } from "@tanstack/react-query";
// import { useGoogleLogin } from "@react-oauth/google";
import GoogleLoginBtn from "../../Assets/GoogleLoginBtn.png";
import { signup } from "../../API/api";
import * as SC from "./StyledAuthComponents";
import logo from "../../Assets/logo.png";
import loginPagePicture from "../../Assets/loginPagePicture.png";
import { Color } from "../../Constants/Constant";

export default function SingupPage() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const navigate = useNavigate();

  const [serverError, setServerError] = useState("");

  const [type, setType] = useState("password");
  const [icon, setIcon] = useState(eyeOff);

  const handleToggle = () => {
    if (type === "password") {
      setIcon(eye);
      setType("text");
    } else {
      setIcon(eyeOff);
      setType("password");
    }
  };

  const { isLoading, mutateAsync } = useMutation(signup, {
    onError: (error) => {
      setServerError(error.message);
    },
    onSuccess: (responseData) => {
      const { message } = responseData.data;
      navigate("/login", { replace: true, state: { message } });
    },
  });

  const onSubmit = async (values) => {
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

  const gotoLogin = () => {
    navigate("/login", { replace: true, state: { message: "" } });
  };

  const signinWithGoogle = () => {};

  return (
    <SC.AuthContainer>
      <SC.AuthFormWrapper>
        <SC.StyledLogoContainer>
          <img src={logo} alt="logo" />
          <SC.StyledLogoName>Retemitnem</SC.StyledLogoName>
        </SC.StyledLogoContainer>
        <SC.StyledHeadline> Create an account</SC.StyledHeadline>
        {serverError && <SC.StyledError>{serverError}</SC.StyledError>}

        <SC.AuthFormContainer onSubmit={handleSubmit(onSubmit)}>
          <SC.StyledInputBox>
            <SC.StyledErrorBox hasError={errors.fullName}>
              <SC.StyledLabel htmlFor="fullName">Full Name</SC.StyledLabel>
              <SC.StyledInput
                id="fullName"
                {...register("fullName", { required: true, maxLength: 30 })}
                placeholder="Enter your name"
              />
            </SC.StyledErrorBox>
            {errors.fullName?.type === "required" && (
              <SC.StyledErrorMessage>
                Full Name is required
              </SC.StyledErrorMessage>
            )}
          </SC.StyledInputBox>

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
              Sign Up
            </SC.StyledButton>
          )}
        </SC.AuthFormContainer>

        <SC.StyledQuestionSignUp>
          Already have an account ?
        </SC.StyledQuestionSignUp>
        <SC.StyledSignMode onClick={gotoLogin}>Sign In</SC.StyledSignMode>
        <SC.StyledQuestionGoogleLogin>
          Or sign up with
        </SC.StyledQuestionGoogleLogin>
        <input
          type="image"
          src={GoogleLoginBtn}
          alt="googleLogin"
          onClick={signinWithGoogle}
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
