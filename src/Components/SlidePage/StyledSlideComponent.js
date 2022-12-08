import styled from "styled-components";
import { Button, Input } from "antd";
import { Color } from "../../Constants/Constant";

export const StyledPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;
export const StyledTopContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  height: 100%;
  width: 100%;
  justify-content: space-between;
  padding: 2.5px 0px 2.5px 0px;
  align-items: center;
  background-color: white;
  border-bottom: 1px solid ${Color.gray200};
`;
export const StyledBodyContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex: 15;
  height: 80%;
  width: 100%;
  justify-content: center;
  align-items: center;
  background-color: blue;
`;
export const StyledLeftContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  justify-content: flex-start;
  align-items: center;
  background-color: white;
  padding: 5px;
  flex: 2;
  overflow: auto;
  &::-webkit-scrollbar {
    width: 0.3rem;
    &-thumb {
      background-color: ${Color.blue100};
      width: 0.2rem;
      border-radius: 1rem;
    }
  }
`;
export const StyledRightContainer = styled.div`
  height: 100%;
  width: 100%;

  background-color: white;
  flex: 4;
  overflow: auto;
  &::-webkit-scrollbar {
    width: 0.3rem;
    &-thumb {
      background-color: ${Color.blue100};
      width: 0.2rem;
      border-radius: 1rem;
    }
  }
`;
export const StyledMidContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
  background-color: ${Color.gray600};
  flex: 11;
`;

export const StyledSingleSlideContainer = styled.div`
  display: flex;
  flex-direction: row;
  min-height: 6rem;
  width: 100%;
  justify-content: end;
  align-items: center;
  background-color: ${(props) => (props.selected ? Color.blue100 : "white")};
  padding-right: 10px;
  cursor: pointer;
  border-left: ${(props) =>
    props.selected ? `3px solid ${Color.blue400}` : "none"};
`;
export const StyledNumberSlide = styled.p`
  font-size: 15px;
  padding: 2px;
  margin: 0px;
  font-style: normal;
  font-family: "Public Sans", sans-serif;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  overflow: hidden;
`;
export const StyledInsideSlideContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 90%;
  width: 90%;
  justify-content: center;
  transition: 0.5s ease-in-out;

  align-items: center;
  border: ${(props) =>
    props.selected
      ? `2px solid ${Color.blue300}`
      : `2px solid ${Color.gray300}`};
  background-color: white;
`;

export const StyledTopSmallContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

export const StyledTopLeftInformation = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  align-items: flex-start;
  padding-left: 20px;
`;
export const StyledTopLeftTitle = styled.div`
  font-size: 1rem;
  font-weight: bold;
  padding: 0px;
  font-family: "Sora", sans-serif;
`;
export const StyledTopLeftSubTitle = styled.div`
  font-size: 0.8rem;
  padding: 0px;
  font-weight: 300;
  font-style: normal;
  font-family: "Public Sans", sans-serif;
  color: rgba(16, 24, 52, 0.5);
`;
export const StyledTopRightSaving = styled.div`
  font-size: 0.85rem;
  padding: 0px;
  font-style: normal;
  font-family: "Public Sans", sans-serif;
  color: rgba(16, 24, 52, 0.5);
  margin-right: 20px;
`;
export const StyledTopLeftImage = styled.img`
  cursor: pointer;
`;
export const StyledButton = styled(Button)`
  margin: 0px 5px;
`;
export const StyledPrensatationContainer = styled.div`
  position: relative;
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  width: 90%;
  height: 90%;
  padding: 20px;
`;
export const StyledSettingContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 10px 25px 10px 20px;
`;
export const StyledQuestionInSlide = styled.div`
  font-size: 1rem;
  font-weight: bold;
  padding: 5px;
  margin-top: 10px;
  font-family: "Sora", sans-serif;
`;
export const StyledInput = styled(Input)`
  width: 100%;
  height: 40px;
`;
export const StyledOptionContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0px;
`;
export const StyledOptionInput = styled(Input)`
  width: 80%;
  height: 40px;
`;
export const StyledPresentaionContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  justify-content: center;
  align-items: center;
  background-color: white;
`;
export const StyledLogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const StyledLogoName = styled.h1`
  font-size: 2.5rem;
  font-family: "Sora", sans-serif;
  line-height: 2rem;
  margin-left: 10px;
  margin-bottom: 0px;
  font-style: bold;
`;
export const StyledQuestionPresentation = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  font-family: "Sora", sans-serif;
  margin-bottom: 20px;
  margin-top: 10px;
`;
export const StyledSubmitButton = styled(Button)`
  margin-top: 20px;
  width: 40%;
  height: 50px;
  background-color: ${Color.blue400};
  color: white;
  border-radius: 10px;
`;

export const radioStyled = {
  border: "1px solid black",
  display: "block",
  lineHeight: "30px",
  marginBottom: "10px",
  borderRadius: "10px",
  width: "40%",
  minHeight: "50px",
  paddingLeft: "20px",
  fontSize: "16px",
  fontFamily: "Sora",
};

export const StyledRadioContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

export const StyledChartContainer = styled.div`
  width: 100%;
  height: 100%;
`;
export const StyledOptionResultContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin: 10px 0px;
`;

export const StyledBottomChatContainer = styled.div`
  display: flex;
  flex-direction: row;
  position: absolute;
  bottom: 50px;
  right: ${(props) => (props.show === "Member" ? "150px" : "40px")};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;
export const StyledChatItemReceiver = styled.div`
  max-width: 80%;
  overflow-wrap: break-word;
  padding: 0.5rem 1rem;
  margin: 0.25rem;
  font-size: 1rem;
  border-radius: 1rem;
  color: black;
  background-color: ${Color.gray300};
`;

export const StyledChatItem = styled.div`
  max-width: 80%;
  overflow-wrap: break-word;
  padding: 0.5rem 1rem;
  margin: 0.25rem;
  font-size: 1rem;
  border-radius: 1rem;
  color: ${(props) => {
    if (props.isTeacher) {
      return "white";
    }
    if (props.isSender) {
      return "white";
    }
    return "black";
  }};
  background-color: ${(props) => {
    if (props.isTeacher) {
      return Color.orange;
    }
    if (props.isSender) {
      return Color.blue400;
    }
    return Color.gray300;
  }};
`;
export const StyledChatContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: ${(props) =>
    props.isTeacher || !props.isSender ? "flex-start" : "flex-end"};
`;

export const StyledGroupTitle = styled.h1`
  font-family: Public Sans; /* Body */
  font-size: 20px;
  line-height: 30px;
  color: #171a1fff;
`;

export const StyledGuideTitle = styled.p`
  font-family: Public Sans; /* Body */
  font-size: 14px;
  line-height: 20px;
  color: #171a1fff;
`;

export const StyledSelectContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 20px 25px;
  align-items: center;
`;

export const StyledCenterContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 20px 10px 0px 10px;
  align-items: center;
`;

export const StyledLeftRightContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 50%;
  margin: 0px 0px 20px 0px;
`;

export const StyledFullScreenContainer = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 10;
  overflow: visible;
  background: lime;
`;

export const StyledBarContainer = styled.div`
  flex: 10;
  width: ${(props) => (props.fullWidth ? "100%" : "60%")};
  height: 90%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const StyledDragDropImage = styled.div`
  width: 100%;
  height: 100%;
  border: 1px dashed blue;
  border-radius: 10px;
  padding: 10px;
  text-align: center;
`;

export const StyledDragDropImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-top: 10px;
  align-items: center;
  width: 100%;
`;

export const StyledImageSetting = styled.div`
  width: 100%;
  height: 100%;
  align-items: center;
  margin-top: 20px;
`;

export const StyledHeadingSlidePageContainer = styled.div`
  flex: 10;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const StyledHeadingSlidePage = styled.text`
  font-size: 2rem;
  font-weight: bold;
  margin: 100px 0px 10px 0px;
  font-family: "Sora", sans-serif;
  text-align: center;
  word-wrap: break-word;
  padding: 10px;
  width: 600px;
`;

export const StyledChatIconContainer = styled.div`
  position: relative;
  width: 25px;
  height: 25px;
`;

export const StyledTitleModal = styled.div`
  font-size: 1rem;
  font-weight: bold;
  font-family: "Sora", sans-serif;
  padding: 0 10px 10px 10px;
  self-align: flex-start;
`;
export const StyledNoQuestion = styled.div`
  font-size: 1rem;
  font-weight: light;
  font-family: "Sora", sans-serif;
`;

export const StyledModalQuestionContainer = styled(StyledRadioContainer)`
  margin: 0px 0px 0px 0px;
  padding: 10px;
`;

export const StyledButtonModalQuestion = styled(Button)`
  margin-top: 20px;
  width: 100%;
  height: 40px;
  background-color: ${Color.blue400};
  color: white;
  border-radius: 10px;
`;

export const StyledModalQuestionItemContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 0px 0px 0px 0px;
  padding: 10px;
  height: 80px;
  border-bottom: 1px solid ${Color.gray300};
`;
export const StyledModalQuestionItemContent = styled.div`
  font-size: 1rem;
  font-weight: light;
  font-family: "Public Sans", sans-serif;
`;

export const StyledLikeContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const StyledEscapeButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  position: absolute;
  top: 50px;
  right: ${(props) => (props.show === "Member" ? "150px" : "40px")};
  display: flex;
  align-items: center;
  justify-content: center;
`;
