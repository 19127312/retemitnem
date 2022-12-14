import React, { useState, useContext, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import "antd/dist/antd.min.css";
import { Button, Input, Table, Space, Form, Modal } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { ColorRing } from "react-loader-spinner";
import * as SC from "./StyledGroupPageComponents";
import playSlide from "../../Assets/playSlide.png";
import playingBtn from "../../Assets/playingBtn.png";
import {
  createPresentation,
  updatePresentation,
  viewPresentationInfoByGroupID,
  setPlayingPresentation,
  kickPresentations,
} from "../../API/presentationApi";
import { showMessage } from "../Message";
import AuthContext from "../../Context/AuthProvider";
import SocketContext from "../../Context/SocketProvider";

export function GroupDashboardPage({ dashBoardPayload }) {
  const navigate = useNavigate();
  const { socket } = useContext(SocketContext);
  const { Search } = Input;
  const [loadingPresentation, setLoadingPresentation] = useState(false);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [selectedRecord, setSelectedRecord] = useState([]);
  const [search, setSearch] = useState("");
  const { auth } = useContext(AuthContext);
  const [presentations, setPresentations] = useState(null);
  const [currentUserRoleInGroup, setCurrentUserRoleInGroup] = useState(null);
  const [slideData, setSlideData] = useState([]);
  const [rawData, setRawData] = useState([]);

  const handleClickPlay = async (key, name) => {
    if (currentUserRoleInGroup === "member") {
      return;
    }
    let presentation = null;
    for (let i = 0; i < presentations.length; i++) {
      if (presentations[i]._id === key) {
        presentations[i].playSlide = 0;
        presentations[i].isPlayingInGroup = true;
        presentation = presentations[i];
        break;
      }
    }
    for (let i = 0; i < presentations.length; i++) {
      socket.emit("pausePresentation", {
        _id: presentations[i]._id,
      });
    }
    await setPlayingPresentation({
      presentationID: key,
      groupID: dashBoardPayload._id,
    });
    await updatePresentation({ presentation });
    socket.emit("playPresentation", {
      _id: dashBoardPayload._id,
      presentationID: key,
      name,
    });
    navigate(`/slide/${key}`, { replace: false });
  };
  const handleNavigateSlidePage = (key) => {
    if (currentUserRoleInGroup === "member") {
      navigate(`/presentation/${key}`, { replace: false });
    } else {
      navigate(`/slide/${key}`, { replace: false });
    }
  };
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (_, record) => (
        <SC.StyledItemSlideListContainer
          onClick={() => handleNavigateSlidePage(record.key)}
        >
          <SC.StyledImagePlay
            src={record.isPlayingInGroup ? playingBtn : playSlide}
            alt="playSlide"
            onClick={(e) => {
              e.stopPropagation();
              handleClickPlay(record.key, record.name);
            }}
          />

          <SC.StyledItemInfoSlideListContainer>
            <div>{record.name}</div>
            <div>{record.number} slide</div>
          </SC.StyledItemInfoSlideListContainer>
        </SC.StyledItemSlideListContainer>
      ),
    },
    {
      title: "Owner",
      dataIndex: "owner",
      key: "owner",
      width: "25%",
    },
    {
      title: "Created",
      dataIndex: "created",
      key: "created",
      width: "25%",
    },
  ];

  const fetchData = async () => {
    try {
      setLoadingPresentation(true);
      const response = await viewPresentationInfoByGroupID({
        groupID: dashBoardPayload._id,
      });
      setPresentations(response.data);
      const presentationData = response.data.map((item) => {
        return {
          key: item._id,
          name: item.title,
          owner: item.ownerName,
          created: item.createdDate.toString().split("T")[0],
          number: item.slides.length,
          isPlayingInGroup: item.isPlayingInGroup,
        };
      });
      setRawData(presentationData);
      setLoadingPresentation(false);
      // filterAndSearchData();
    } catch (error) {
      console.error(error.message);
    }
  };

  const checkCurrentUserRole = () => {
    for (let i = 0; i < dashBoardPayload.members.length; i++) {
      if (auth?.user?._id === dashBoardPayload.members[i].memberID) {
        setCurrentUserRoleInGroup(dashBoardPayload.members[i].role);
        break;
      }
    }
  };
  const searchData = (allData) => {
    const filteredData = [];
    for (let i = 0; i < allData.length; i++) {
      if (allData[i].name.toString().includes(search)) {
        filteredData.push(allData[i]);
      }
    }
    setSlideData(filteredData);
  };
  useEffect(() => {
    fetchData();
    checkCurrentUserRole();
  }, [dashBoardPayload]);

  useEffect(() => {
    socket.emit("enterGroup", dashBoardPayload._id);
  }, [dashBoardPayload]);

  useEffect(() => {
    searchData(rawData);
  }, [search, rawData]);

  useEffect(() => {
    socket.on("onPlayPresentation", (data) => {
      setRawData((prev) => {
        const newData = prev.map((item) => {
          if (item.key === data._id) {
            return {
              ...item,
              isPlayingInGroup: true,
            };
          }
          return { ...item, isPlayingInGroup: false };
        });
        return newData;
      });
      showMessage(0, `${data.name} is playing at the moment`);
    });
    return () => {
      socket.off("onPlayPresentation");
    };
  }, []);

  // rowSelection objects indicates the need for row selection
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
      setSelectedRecord(selectedRows);
    },
    onSelect: (record, selected, selectedRows) => {
      console.log(record, selected, selectedRows);
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      console.log(selected, selectedRows, changeRows);
    },
  };

  const onSearch = (value) => {
    setSearch(value);
  };

  const deletePresentationsMutation = useMutation(kickPresentations, {
    onError: (error) => {
      console.log(error);
      showMessage(2, "Remove failed. Unknown error");
      setLoadingPresentation(false);
    },
    onSuccess: () => {
      setVisible(false);
      showMessage(0, "Remove selected presentations successfully");
      fetchData();
      setSelectedRecord([]);
      setLoadingPresentation(false);
    },
  });

  const onSubmitDeletePresentations = async () => {
    setLoadingPresentation(true);
    try {
      const arrayPresentationIDs = [];
      for (let i = 0; i < selectedRecord.length; i++) {
        arrayPresentationIDs.push(selectedRecord[i].key);
      }
      await deletePresentationsMutation.mutateAsync({
        presentationIDs: arrayPresentationIDs,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = () => {
    setVisible(false);
    form.resetFields();
  };

  const createPresentationMutation = useMutation(createPresentation, {
    onError: (error) => {
      setVisible(false);
      form.resetFields();

      if (
        error.toString().includes("presentation name has already been used")
      ) {
        showMessage(
          2,
          "Create failed. Presentation name has already been used"
        );
      } else {
        showMessage(2, "Create failed. Unknown error");
      }
      setLoadingPresentation(false);
    },
    onSuccess: () => {
      setVisible(false);
      form.resetFields();
      showMessage(0, "Create presentation successfully");
      fetchData();
      setLoadingPresentation(false);
    },
  });

  const onSubmitCreatePresentation = async (values) => {
    setLoadingPresentation(true);
    try {
      await createPresentationMutation.mutateAsync({
        title: values.title,
        ownerID: auth?.user?._id,
        groupID: dashBoardPayload._id,
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <SC.StyledDashboardContainer>
      <SC.StyledBannerContainer>
        <SC.StyledGroupNameDashboard>
          <b>{dashBoardPayload.groupName}</b>
        </SC.StyledGroupNameDashboard>
        <SC.StyledOwnerSlideNameDashboard>
          <i>{dashBoardPayload.creatorName}</i>
        </SC.StyledOwnerSlideNameDashboard>
      </SC.StyledBannerContainer>
      <SC.StyledButtonDashboardContainer>
        <SC.StyledToolBarDashboardContainer>
          {currentUserRoleInGroup === "member" ? null : (
            <Button
              type="primary"
              shape="round"
              icon={<PlusOutlined />}
              style={{ marginBottom: 16 }}
              onClick={() => setVisible(true)}
            >
              New presentation
            </Button>
          )}
          {selectedRecord.length !== 0 ? (
            <Button
              danger
              type="primary"
              shape="round"
              icon={<DeleteOutlined />}
              style={{ marginLeft: 16 }}
              onClick={() => onSubmitDeletePresentations()}
            >
              Remove From Group
            </Button>
          ) : null}
        </SC.StyledToolBarDashboardContainer>
        <SC.StyledToolBarDashboardContainer>
          <Space direction="vertical">
            <Search
              placeholder="input search text"
              onSearch={onSearch}
              enterButton
            />
          </Space>
        </SC.StyledToolBarDashboardContainer>
      </SC.StyledButtonDashboardContainer>
      <SC.StyledMarginTaleDashboard>
        <Modal open={visible} onOk={form.submit} onCancel={handleCancel}>
          <Form
            form={form}
            onFinish={onSubmitCreatePresentation}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
          >
            <Form.Item>
              <SC.StyledGroupTitle>Create a presentation</SC.StyledGroupTitle>
            </Form.Item>
            <Form.Item label="Presentation name">
              <Space>
                <Form.Item
                  name="title"
                  noStyle
                  rules={[
                    {
                      required: true,
                      message: "Presentation name is required",
                    },
                  ]}
                >
                  <Input style={{ width: 160 }} placeholder="Please input" />
                </Form.Item>
                {createPresentationMutation.isLoading ? (
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

        {loadingPresentation ? (
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
        <Table
          columns={columns}
          rowSelection={
            currentUserRoleInGroup === "member" ? null : rowSelection
          }
          dataSource={slideData}
        />
      </SC.StyledMarginTaleDashboard>
    </SC.StyledDashboardContainer>
  );
}
export default GroupDashboardPage;
