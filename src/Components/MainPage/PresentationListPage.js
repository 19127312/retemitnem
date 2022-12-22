import React, { useState, useContext, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import "antd/dist/antd.min.css";
import { Button, Input, Table, Space, Form, Modal, Popconfirm } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { ColorRing } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import * as SC from "../GroupPage/StyledGroupPageComponents";
import {
  createPresentation,
  deletePresentations,
  // updatePresentation,
  viewPresentationInfoByCurrentLoggedInUser,
} from "../../API/presentationApi";
import { showMessage } from "../Message";
import AuthContext from "../../Context/AuthProvider";

export function PresentationListPage() {
  const { Search } = Input;
  const navigate = useNavigate();
  const [loadingPresentation, setLoadingPresentation] = useState(false);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [search, setSearch] = useState("");
  const { auth } = useContext(AuthContext);
  const [slideData, setSlideData] = useState([]);
  const [rawData, setRawData] = useState([]);

  const fetchData = async () => {
    try {
      console.log(auth.user._id);
      setLoadingPresentation(true);
      const response = await viewPresentationInfoByCurrentLoggedInUser({
        userID: auth.user._id,
      });
      const presentationData = response.data.map((item) => {
        return {
          key: item._id,
          name: item.title,
          owner: item.ownerName,
          ownerID: item.ownerID,
          created: item.createdDate.toString().split("T")[0],
          number: item.slides.length,
        };
      });
      setRawData(presentationData);
      setLoadingPresentation(false);
      // filterAndSearchData();
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleNavigateSlidePage = (key) => {
    navigate(`/slide/${key}`, { replace: false });
  };

  const deletePresentationsMutation = useMutation(deletePresentations, {
    onError: (error) => {
      console.log(error);
      showMessage(2, "Delete failed. Unknown error");
      setLoadingPresentation(false);
    },
    onSuccess: () => {
      setVisible(false);
      showMessage(0, "Delete selected presentations successfully");
      fetchData();
      setLoadingPresentation(false);
    },
  });
  const handleDelete = async (record) => {
    setLoadingPresentation(true);
    await deletePresentationsMutation.mutateAsync({
      presentationIDs: [record.key],
    });
  };
  const defaultColumns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (_, record) => (
        <SC.StyledItemSlideListContainer
          onClick={() => handleNavigateSlidePage(record.key)}
        >
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
    {
      title: "Operation",
      dataIndex: "operation",
      render: (_, record) => (
        <Space size="middle">
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => handleDelete(record)}
          >
            {record.ownerID !== auth.user._id ? null : (
              <a href="null">Delete</a>
            )}
          </Popconfirm>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {}, []);
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
    searchData(rawData);
  }, [search, rawData]);

  const onSearch = (value) => {
    setSearch(value);
  };

  const handleSave = (row) => {
    const newData = [...slideData];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setSlideData(newData);
  };

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });
  const handleCancel = () => {
    setVisible(false);
    form.resetFields();
  };

  const createPresentationMutation = useMutation(createPresentation, {
    onError: (error) => {
      setVisible(false);
      form.resetFields();
      console.log(error);
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
        groupID: "notAssigned",
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <SC.StyledDashboardContainer>
      <SC.StyledButtonDashboardContainer>
        <SC.StyledToolBarDashboardContainer>
          <Button
            type="primary"
            shape="round"
            icon={<PlusOutlined />}
            style={{ marginBottom: 16 }}
            onClick={() => setVisible(true)}
          >
            New presentation
          </Button>
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
          bordered
          rowClassName={() => "editable-row"}
          // rowSelection={
          //   currentUserRoleInGroup === "member" ? null : rowSelection
          // }
          dataSource={slideData}
        />
      </SC.StyledMarginTaleDashboard>
    </SC.StyledDashboardContainer>
  );
}
export default PresentationListPage;
