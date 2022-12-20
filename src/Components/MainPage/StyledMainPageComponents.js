import styled from "styled-components";
import { Tabs } from "antd";

export const StyledPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  max-width: 100%;
  overflow-x: hidden;
`;

export const StyledIconContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

export const StyledLogoContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
  margin-left: 10px;
  justify-content: flex-start;
  cursor: pointer;
`;
export const StyledUpperBarContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 10px 25px;
`;

export const StyledUserInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
`;

export const StyledImageContainer = styled.img`
  padding: 10px 10px;
`;

export const StyledUtilitiesContainer = styled.div`
  margin-top: 25px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const StyledSearchSortContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const StyledItemMarginHorizonalRightContainer = styled.div`
  margin: 0px 35px 0px 0px;
`;

export const StyledItemMarginHorizonalLeftContainer = styled.div`
  margin: 0px 0px 0px 35px;
`;

export const StyledGroupTitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 15px 0px 0px 35px;
`;

export const StyledCenterContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 15px 10px 15px 10px;
  align-items: center;
`;

// text

// export const StyledLogoName = styled.h1`
//     font-family: Sora; /* Heading */
//     font-size: 18px;
//     line-height: 28px;
//     color: #171A1FFF;
// `;

export const StyledUserName = styled.h1`
  font-family: Public Sans;
  font-size: 14px;
  line-height: 22px;
  color: #171a1fff;
  margin: 0px 0px 0px 0px;
`;

export const StyledEmailName = styled.h1`
  font-family: Public Sans; /* Body */
  font-size: 12px;
  line-height: 20px;
  color: #565e6cff;
  margin: 0px 0px 0px 0px;
`;

export const StyledGroupTitle = styled.h1`
  font-family: Public Sans; /* Body */
  font-size: 20px;
  line-height: 30px;
  color: #171a1fff;
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
