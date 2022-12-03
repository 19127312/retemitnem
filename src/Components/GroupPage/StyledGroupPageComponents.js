import styled from "styled-components";
import { Tabs } from "antd";

export const StyledPageContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const StyledTopContainer = styled.div`
  // display: flex;
  // flex-direction: row;
  // justify-content: space-between;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 10px 25px;
`;

export const StyledLogoContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
  margin-left: 10px;
  justify-content: flex-start;
  cursor: pointer;
`;

export const StyledLogoName = styled.h1`
  font-size: 18px;
  font-family: "Sora", sans-serif;
  line-height: 1rem;
  align-self: start;
  margin-left: 10px;
  margin-top: 20px;
`;

export const StyledTabContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
`;

export const StyledIconShare = styled.div`
  margin-top: 20px;
  margin-right: 20px;
`;

export const StyledTabs = styled(Tabs)`
  .ant-tabs-nav .ant-tabs-tab:nth-child(2) {
    margin-left: 0px !important;
  }

  .ant-tabs-nav .ant-tabs-tab {
    border-radius: 0px !important;
    font-size: 16px !important;
  }

  .ant-tabs-ink-bar {
    height: 5px;
    background: transparent;
  }

  .ant-tabs-ink-bar::after {
    content: " ";
    position: absolute;
    left: 50%;
    right: 0;
    bottom: 0;
    height: 5px;
    background: red;
    width: 20px;
    transform: translateX(-50%);
  }

  .ant-tabs-nav {
    margin: 0px !important;
  }

  .ant-tabs-content-holder {
    border-width: 0px;
    border-color: #f0f0f0;
    border-style: solid;
    border-top-style: none;
    padding: 1rem;
  }
`;
export const StyledBannerContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  background: #535ce8ff;
  width: 100%;
  height: 165px;
  border: solid 1.5px gray;
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 18px 50px -10px;
`;

export const StyledGroupNameDashboard = styled.div`
  font-family: Public Sans;
  font-size: 32px;
  line-height: 48px;
  color: #ffffff;
`;

export const StyledOwnerSlideNameDashboard = styled.div`
  font-family: Public Sans;
  font-size: 14px;
  line-height: 22px;
  color: #ffffff;
`;

export const StyledDashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const StyledButtonDashboardContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 40px;
  justify-content: space-between;
`;

export const StyledToolBarDashboardContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const StyledItemMarginHorizonalRightContainer = styled.div`
  margin: 0px 0px 0px 20px;
`;

export const StyledItemSlideListContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
`;

export const StyledItemInfoSlideListContainer = styled.div`
  display: flex;
  flex-direction: column;
  cursor: pointer;
`;

export const StyledImagePlay = styled.img`
  width: 30px;
  height: 30px;
  margin-right: 10px;
  cursor: pointer;
`;

export const StyledMarginTaleDashboard = styled.div`
  margin-top: 10px;
`;

export const StyledGroupTitle = styled.h1`
  font-family: Public Sans; /* Body */
  font-size: 20px;
  line-height: 30px;
  color: #171a1fff;
`;

export const StyledEmailInputContainer = styled.div`
  font-family: Public Sans; /* Body */";
  width: "600px";
  border: "1px solid #eee";
  background: "#f3f3f3";
  padding: "25px";
  margin: "20px";
`;

export const styles = {
  fontFamily: "sans-serif",
  width: "420px",
  borderRadius: "10px",
  border: "1px solid #eee",
  background: "#eaf8ff",
  padding: "25px",
  margin: "20px",
};

export const StyledCenterContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 15px 10px 15px 10px;
  align-items: center;
`;
