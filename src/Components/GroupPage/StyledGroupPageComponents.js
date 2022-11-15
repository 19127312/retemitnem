import styled from "styled-components";
import { Tabs } from "antd"
export const StyledPageContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

export const StyledTopContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;

export const StyledLogoContainer = styled.div`
    display: flex;
    align-items: center;
    margin-top: 10px;
    margin-left : 10px;
    justify-content: flex-start;
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
    display : flex;
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
    border-width: 1px;
    border-color: #f0f0f0;
    border-style: solid;
    border-top-style: none;
    padding: 1rem;
  }

 
`;