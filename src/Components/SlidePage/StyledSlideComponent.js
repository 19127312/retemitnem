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
export const StyledPrensatationTitle = styled.div`
  background-color: white;
  width: 90%;
  height: 90%;
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
  padding: 10px 0px 0px 0px;
  font-family: "Sora", sans-serif;
`;
export const StyledInput = styled(Input)`
  width: 100%;
  margin: 10px 0px;
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
