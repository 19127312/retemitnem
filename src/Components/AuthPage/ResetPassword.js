import React, { useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Icon } from "react-icons-kit";
import { eye } from "react-icons-kit/feather/eye";
import { eyeOff } from "react-icons-kit/feather/eyeOff";
import { Color } from "../../Constants/Constant";
import logo from "../../Assets/logo.png";
import loginPagePicture from "../../Assets/loginPagePicture.png";
import { resetPassword } from "../../API/userApi";
import { showMessage } from "../Message";
import * as SC from "./StyledAuthComponents";

export default function ResetPassword() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [type, setType] = useState("password");
  const [icon, setIcon] = useState(eyeOff);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const handleToggle = () => {
    if (type === "password") {
      setIcon(eye);
      setType("text");
    } else {
      setIcon(eyeOff);
      setType("password");
    }
  };
  const resetPasswordMutation = useMutation(resetPassword, {
    onError: (error) => {
      setIsLoading(false);
      showMessage(2, error.message);
    },
    onSuccess: () => {
      setIsLoading(false);
      showMessage(0, "Reset password successfully");
      navigate("/", { replace: true });
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await resetPasswordMutation.mutateAsync({
        userID: id,
        newPassword: data.password,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SC.AuthContainer>
      <SC.AuthFormWrapper>
        <SC.StyledLogoContainer>
          <img src={logo} alt="logo" />
          <SC.StyledLogoName>Retemitnem</SC.StyledLogoName>
        </SC.StyledLogoContainer>
        <SC.StyledHeadline>Reset your password</SC.StyledHeadline>

        <SC.AuthFormContainer onSubmit={handleSubmit(onSubmit)}>
          <SC.StyledInputBox>
            <SC.StyledErrorBox hasError={errors.password}>
              <SC.StyledLabel htmlFor="password">New password</SC.StyledLabel>
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
              Submit
            </SC.StyledButton>
          )}
        </SC.AuthFormContainer>
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
