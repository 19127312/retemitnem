import "antd/dist/antd.min.css";
import { Tabs } from "antd";
import { ShareAltOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import GroupMemberPage from "./GroupMemberPage";
import GroupDashboardPage from "./GroupDashboardPage";
import * as SC from "./StyledGroupPageComponents";
import logo from "../../Assets/logo.png";

export function GroupPage() {
  const { state } = useLocation();
  const { item } = state;
  const navigate = useNavigate();

  return (
    <SC.StyledPageContainer>
      <SC.StyledTopContainer>
        <SC.StyledLogoContainer
          onClick={() => navigate(`/`, { replace: false })}
        >
          <img src={logo} alt="logo" />
          <SC.StyledLogoName>
            <b>Retemitnem</b>
          </SC.StyledLogoName>
        </SC.StyledLogoContainer>

        <SC.StyledIconShare>
          <ShareAltOutlined style={{ fontSize: 30 }} />
        </SC.StyledIconShare>
      </SC.StyledTopContainer>
      <SC.StyledTabContainer>
        <SC.StyledTabs
          defaultActiveKey="1"
          type="card"
          size="large"
          centered
          style={{
            height: "20rem",
            width: "80%",
          }}
        >
          <Tabs.TabPane tab="Dashboard" key="1">
            <GroupDashboardPage dashBoardPayload={item} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Member" key="2">
            <GroupMemberPage memberPayload={item} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Calendar" key="3">
            Content of Tab Pane 3
          </Tabs.TabPane>
        </SC.StyledTabs>
      </SC.StyledTabContainer>
    </SC.StyledPageContainer>
  );
}
export default GroupPage;
