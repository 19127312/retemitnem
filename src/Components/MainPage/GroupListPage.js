import "antd/dist/antd.min.css";
// import { Tabs } from "antd";
import { useEffect, useState, useContext } from "react";
import { ShareAltOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
// import { viewGroupInfo } from "../../API/groupApi";
import {
  Button,
  Input,
  Select,
  Avatar,
  Card,
  List,
  Form,
  Modal,
  Space,
} from "antd";
import InfiniteScroll from "react-infinite-scroll-component";
import { ColorRing } from "react-loader-spinner";
import { showMessage } from "../Message";
import { groupInfo, createGroup, addMember } from "../../API/groupApi";
import * as SC from "./StyledMainPageComponents";
import image1 from "../../Assets/Background/1.jpg";
import image2 from "../../Assets/Background/2.jpg";
import image3 from "../../Assets/Background/3.jpg";
import image4 from "../../Assets/Background/4.jpg";
import image5 from "../../Assets/Background/5.jpg";
import AuthContext from "../../Context/AuthProvider";

const { Search } = Input;
const { Meta } = Card;
export function GroupListPage() {
  const { auth } = useContext(AuthContext);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [rawData, setRawData] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All Groups");
  const [loadingGroups, setLoadingGroups] = useState(false);
  const navigate = useNavigate();
  const images = [image1, image2, image3, image4, image5];

  const checkExist = (element, userID) => {
    for (let i = 0; i < element.members.length; i++) {
      if (element.members[i].memberID === userID) {
        return true;
      }
    }
    return false;
  };
  const fetchData = async () => {
    try {
      setLoadingGroups(true);
      const response = await groupInfo();
      setRawData(response.data);
      setLoadingGroups(false);
      // filterAndSearchData();
    } catch (error) {
      console.error(error.message);
    }
  };
  const filterAndSearchData = (allData) => {
    const filteredData = [];
    for (let i = 0; i < allData.length; i++) {
      if (allData[i].groupName.toString().includes(search)) {
        if (
          (filter === "My Groups" &&
            allData[i].creatorID === auth?.user?._id) ||
          (filter === "Other Groups" &&
            allData[i].creatorID !== auth?.user?._id &&
            checkExist(allData[i], auth?.user?._id)) ||
          (filter === "All Groups" && checkExist(allData[i], auth?.user?._id))
        ) {
          filteredData.push(allData[i]);
        }
      }
    }
    setData(filteredData);
  };

  useEffect(() => {
    const joinGroupID = async () => {
      try {
        const groupID = localStorage.getItem("groupID");

        if (groupID) {
          localStorage.removeItem("groupID");
          await addMember({
            groupID,
            memberID: auth?.user?._id,
          });
          fetchData();
        }
      } catch (error) {
        console.log(error);
      }
    };

    joinGroupID();
    fetchData();
  }, []);

  useEffect(() => {
    filterAndSearchData(rawData);
  }, [search, filter, rawData]);

  // handle search
  const onSearch = (value) => setSearch(value);

  // handle filter
  const handleChange = (value) => {
    if (value === "self") {
      setFilter("My Groups");
    } else if (value === "others") {
      setFilter("Other Groups");
    } else if (value === "all") {
      setFilter("All Groups");
    }
  };

  const handleCancel = () => {
    setVisible(false);
    form.resetFields();
  };
  const createGroupMutation = useMutation(createGroup, {
    onError: (error) => {
      setVisible(false);
      form.resetFields();
      if (error.toString().includes("group name has already been used")) {
        showMessage(2, "Group name has already been used");
      } else {
        showMessage(2, "Create failed. Unknown error");
      }
      setLoadingGroups(false);
    },
    onSuccess: () => {
      setVisible(false);
      form.resetFields();
      showMessage(0, "Create group successfully");
      fetchData();
      setLoadingGroups(false);
    },
  });

  const onSubmitCreateGroup = async (values) => {
    setLoadingGroups(true);
    try {
      await createGroupMutation.mutateAsync({
        groupName: values.groupname,
        creatorID: auth?.user?._id,
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <SC.StyledPageContainer>
      <SC.StyledUtilitiesContainer>
        <SC.StyledItemMarginHorizonalLeftContainer>
          <Button
            type="primary"
            shape="round"
            icon={<PlusOutlined />}
            size="large"
            onClick={() => setVisible(true)}
          >
            New Group
          </Button>
        </SC.StyledItemMarginHorizonalLeftContainer>

        <Modal open={visible} onOk={form.submit} onCancel={handleCancel}>
          <Form
            form={form}
            onFinish={onSubmitCreateGroup}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
          >
            <Form.Item>
              <SC.StyledGroupTitle>Create a group</SC.StyledGroupTitle>
            </Form.Item>
            <Form.Item label="Group name">
              <Space>
                <Form.Item
                  name="groupname"
                  noStyle
                  rules={[
                    { required: true, message: "Group name is required" },
                  ]}
                >
                  <Input style={{ width: 160 }} placeholder="Please input" />
                </Form.Item>
                {createGroupMutation.isLoading ? (
                  <ColorRing
                    visible
                    height="25"
                    width="25"
                    ariaLabel="blocks-loading"
                    wrapperStyle={{}}
                    wrapperClass="blocks-wrapper"
                    colors={[
                      "#e15b64",
                      "#f47e60",
                      "#f8b26a",
                      "#abbd81",
                      "#849b87",
                    ]}
                  />
                ) : null}
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        <SC.StyledSearchSortContainer>
          <SC.StyledItemMarginHorizonalRightContainer>
            <Search
              placeholder="input search text"
              onSearch={onSearch}
              enterButton
            />
          </SC.StyledItemMarginHorizonalRightContainer>
          <SC.StyledItemMarginHorizonalRightContainer>
            <Select
              defaultValue="all"
              onChange={handleChange}
              style={{ width: 200 }}
              options={[
                {
                  value: "all",
                  label: "All Groups",
                },
                {
                  value: "self",
                  label: "My Groups",
                },
                {
                  value: "others",
                  label: "Other Groups",
                },
              ]}
            />
          </SC.StyledItemMarginHorizonalRightContainer>
        </SC.StyledSearchSortContainer>
      </SC.StyledUtilitiesContainer>

      <SC.StyledGroupTitleContainer>
        <SC.StyledGroupTitle>{filter}</SC.StyledGroupTitle>
      </SC.StyledGroupTitleContainer>

      <div
        id="scrollableDiv"
        style={{
          boxSizing: "border-box",
          height: "100%",
          margin: "0px 35px 20px 35px",
          maxWidth: "100%",
          overflowX: "hidden",
          padding: "16px 16px",
          border: "1px solid rgba(140, 140, 140, 0.35)",
        }}
      >
        <InfiniteScroll
          style={{ overflowX: "hidden" }}
          dataLength={data.length}
          hasMore={data.length < 12}
          scrollableTarget="scrollableDiv"
        >
          {loadingGroups ? (
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
          <List
            grid={{
              gutter: 16,
              xs: 1,
              sm: 2,
              md: 4,
              lg: 4,
              xl: 5,
              xxl: 5,
            }}
            dataSource={data}
            renderItem={(item) => (
              <List.Item>
                <Card
                  hoverable
                  cover={
                    <img
                      width="262"
                      height="159"
                      alt="example"
                      // src={
                      //   imageUrls[Math.floor(Math.random() * imageUrls.length)]
                      // }
                      src={images[Math.floor(Math.random() * images.length)]}
                    />
                  }
                  actions={[
                    <ShareAltOutlined
                      key="share"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigator.clipboard.writeText(
                          `${window.location.host}/joinLink/${item._id}`
                        );
                        showMessage(1, "Link copied to clipboard");
                      }}
                    />,
                  ]}
                  onClick={() => {
                    navigate(`/group/${item._id}`, {
                      replace: false,
                      state: { item },
                    });
                  }}
                >
                  <Meta
                    avatar={
                      <Avatar
                        src={images[Math.floor(Math.random() * images.length)]}
                      />
                    }
                    title={item.groupName}
                    description={item.creatorName}
                  />
                </Card>
              </List.Item>
            )}
          />
        </InfiniteScroll>
      </div>
    </SC.StyledPageContainer>
  );
}
export default GroupListPage;
