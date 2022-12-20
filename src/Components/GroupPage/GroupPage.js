import "antd/dist/antd.min.css";
import { Modal } from "antd";
import { useEffect, useState, useContext } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  ShareAltOutlined,
  DeleteTwoTone,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import { ColorRing } from "react-loader-spinner";
import { useNavigate, useParams } from "react-router-dom";
import GroupMemberPage from "./GroupMemberPage";
import GroupDashboardPage from "./GroupDashboardPage";
import * as SC from "./StyledGroupPageComponents";
import logo from "../../Assets/logo.png";
import { showMessage } from "../Message";
import { deleteGroup, viewGroupInfo } from "../../API/groupApi";
import AuthContext from "../../Context/AuthProvider";

export function GroupPage() {
  const { id } = useParams();
  const { confirm } = Modal;
  const [group, setGroup] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { auth } = useContext(AuthContext);
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

  const deleteGroupMutation = useMutation(deleteGroup, {
    onError: (error) => {
      showMessage(2, "Delete failed, Unknown error");
      console.log(error);
      setLoading(false);
    },
    onSuccess: () => {
      showMessage(0, "Delete group successfully");
      setLoading(false);
      navigate(`/`, { replace: true });
    },
  });
  const handleOK = async () => {
    await deleteGroupMutation.mutateAsync({
      groupID: id,
    });
  };
  const showConfirm = () => {
    confirm({
      title: "Do you Want to delete this group?",
      icon: <ExclamationCircleFilled />,
      content: "This action cannot be undone",
      onOk() {
        setLoading(true);
        handleOK();
      },
      onCancel() {},
    });
  };

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

        {group && (
          <SC.StyledIconShare>
            {group.creatorID !== auth.user._id ? null : (
              <DeleteTwoTone
                twoToneColor="#eb2f96"
                style={{ fontSize: 30, marginRight: "30px" }}
                onClick={() => {
                  showConfirm();
                }}
              />
            )}
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
        )}
      </SC.StyledTopContainer>
      {loading ? (
        <SC.StyledCenterContainer>
          <ColorRing
            style={{ margin: "100px 0px 0px 200px" }}
            visible
            height="100"
            width="100"
            ariaLabel="blocks-loading"
            wrapperStyle={{}}
            wrapperClass="blocks-wrapper"
            colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
          />
        </SC.StyledCenterContainer>
      ) : null}
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
