import React, { useState, useEffect, useContext } from "react";
import { Modal, Button, Table, Form, Space, Input, Popconfirm } from "antd";
import { ColorRing } from "react-loader-spinner";
import { PlusOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import * as SC from "../StyledSlideComponent";
import { showMessage } from "../../Message";
import AuthContext from "../../../Context/AuthProvider";
import {
  isValidCollaborator,
  viewCollaborators,
} from "../../../API/presentationApi";

function ModalCollaboration({
  id,
  presentation,
  open,
  handleCancel,
  handleCollab,
  handleDeleteCollab,
}) {
  if (!presentation) {
    return null;
  }
  const [collabratorData, setCollabratorData] = useState([]);
  const [loadingCollab, setLoadingCollab] = useState(false);
  const [form] = Form.useForm();
  const { auth } = useContext(AuthContext);

  const fetchData = async () => {
    try {
      setLoadingCollab(true);
      const response = await viewCollaborators({
        presentationID: id,
      });
      const collaborators = response.data.map((item) => {
        return {
          key: item.id,
          name: item.fullName,
          email: item.email,
        };
      });
      setCollabratorData(collaborators);
      setLoadingCollab(false);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, [presentation]);

  const handleSave = (row) => {
    const newData = [...collabratorData];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setCollabratorData(newData);
  };

  const handleDelete = async (record) => {
    console.log(record.key);
    handleDeleteCollab(record.key);
    fetchData();
  };
  const defaultColumns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "50%",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: "50%",
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
            <a href="null">Delete</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

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

  const addCollaboratorsMutation = useMutation(isValidCollaborator, {
    onError: (error) => {
      console.log(error);
      form.resetFields();
      if (error.toString().includes("You cannot add yourself")) {
        showMessage(2, "You cannot add yourself");
      } else if (
        error.toString().includes("This collaborator has already existed")
      ) {
        showMessage(2, "This collaborator has already existed");
      } else {
        showMessage(2, "Collaborator not found");
      }
      setLoadingCollab(false);
    },
    onSuccess: (responseData) => {
      form.resetFields();
      showMessage(0, "Add collaborators successfully");
      handleCollab(responseData.data.collaboratorID);
      fetchData();
      setLoadingCollab(false);
    },
  });

  const onSubmitAddCollaborators = async (values) => {
    setLoadingCollab(true);
    try {
      await addCollaboratorsMutation.mutateAsync({
        email: values.collaboratorEmail,
        currentUserEmail: auth.user.email,
        presentationID: presentation._id,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      // width={1000}
      footer={[
        <Button
          // key="submit"
          type="primary"
          // loading={loading}
          onClick={handleCancel}
        >
          Done
        </Button>,
      ]}
    >
      <SC.StyledGroupTitle>Presentation Collaborators</SC.StyledGroupTitle>
      <SC.StyledAddCollabContainer>
        <Form form={form} onFinish={onSubmitAddCollaborators}>
          <Form.Item label="Collaborator Email">
            <Space>
              <Form.Item
                name="collaboratorEmail"
                noStyle
                rules={[
                  { required: true, message: "Collaborator Email is required" },
                ]}
              >
                <Input style={{ width: 200 }} placeholder="Please input" />
              </Form.Item>
              {addCollaboratorsMutation.isLoading ? (
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
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="medium"
          onClick={form.submit}
        >
          Add
        </Button>
      </SC.StyledAddCollabContainer>
      <SC.StyledDashboardContainer>
        {/* <SC.StyledGuideTitle>Visibility options</SC.StyledGuideTitle> */}
        {loadingCollab ? (
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
          dataSource={collabratorData}
        />
      </SC.StyledDashboardContainer>
    </Modal>
  );
}

export default ModalCollaboration;
