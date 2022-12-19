import "antd/dist/antd.min.css";
// import { Tabs } from "antd";
import { useEffect, useState } from "react";
import { ShareAltOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import GroupMemberPage from "./GroupMemberPage";
import GroupDashboardPage from "./GroupDashboardPage";
import * as SC from "./StyledGroupPageComponents";
import logo from "../../Assets/logo.png";
import { showMessage } from "../Message";
import { viewGroupInfo } from "../../API/groupApi";

export function GroupPage() {
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  const navigate = useNavigate();
  const items = [
    {
      label: "Presentations",
      key: "1",
      children: <GroupDashboardPage dashBoardPayload={group} />,
    }, // remember to pass the key prop
    {
      label: "Members",
      key: "2",
      children: <GroupMemberPage memberPayload={group} />,
    },
  ];
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await viewGroupInfo({
          groupID: id,
        });
        setGroup(data);
      } catch (error) {
        showMessage(2, error.message);
      }
    };
    fetchData();
  }, [id]);
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
                `${window.location.host}/joinLink/${group._id}`
              );
              showMessage(1, "Link copied to clipboard");
            }}
          />
        </SC.StyledIconShare>
      </SC.StyledTopContainer>
      {group && (
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
      )}
    </SC.StyledPageContainer>
  );
}
export default GroupPage;
