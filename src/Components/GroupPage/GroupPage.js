import "antd/dist/antd.min.css";
// import { Tabs } from "antd";
import { ShareAltOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import GroupMemberPage from "./GroupMemberPage";
import GroupDashboardPage from "./GroupDashboardPage";
import * as SC from "./StyledGroupPageComponents";
import logo from "../../Assets/logo.png";
import { showMessage } from "../Message";

export function GroupPage() {
  const { state } = useLocation();
  const { item } = state;
  const navigate = useNavigate();
  const items = [
    {
      label: "Slides",
      key: "1",
      children: <GroupDashboardPage dashBoardPayload={item} />,
    }, // remember to pass the key prop
    {
      label: "Members",
      key: "2",
      children: <GroupMemberPage memberPayload={item} />,
    },
  ];
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
          <ShareAltOutlined
            style={{ fontSize: 30 }}
            onClick={() => {
              navigator.clipboard.writeText(
                `${window.location.host}/joinLink/${item._id}`
              );
              showMessage(1, "Link copied to clipboard");
            }}
          />
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
          items={items}
        />
      </SC.StyledTabContainer>
    </SC.StyledPageContainer>
  );
}
export default GroupPage;
