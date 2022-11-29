import React, { useContext, useState } from "react";
import { ReactMultiEmail } from "react-multi-email";
import "antd/dist/antd.min.css";
import { Button, Dropdown, Popconfirm, Table, Space, Menu, Modal } from "antd";
import { useMutation } from "@tanstack/react-query";
import { PlusOutlined, DownOutlined } from "@ant-design/icons";
import { ColorRing } from "react-loader-spinner";
import { changeRole, sendlinktoemail, deleteMember } from "../../API/api";
import * as SC from "./StyledGroupPageComponents";
import "react-multi-email/style.css";
import AuthContext from "../../Context/AuthProvider";
import { showMessage } from "../Message";
import { EditableCell, EditableRow } from "./SettingTable";

export function GroupMemberPage({ memberPayload }) {
  const [emails, setEmails] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const { auth } = useContext(AuthContext);

  const members = memberPayload.members.map((item) => {
    return {
      name: item.memberName,
      role: item.role,
      email: item.memberEmail,
      id: item.memberID,
    };
  });
  const [dataSource, setDataSource] = useState(members);
  const currentMember = members.filter((item) => {
    return item.id === auth.user._id;
  });

  const changeRoleMutation = useMutation(changeRole, {
    onError: (error) => {
      console.log(error);
    },
    onSuccess: (response) => {
      const updatedMembers = response.data.members.map((item) => {
        return {
          name: item.memberName,
          role: item.role,
          email: item.memberEmail,
          id: item.memberID,
        };
      });
      setDataSource(updatedMembers);
      showMessage(0, "Change role successfully");
    },
  });

  const deleteMemberMutation = useMutation(deleteMember, {
    onError: (error) => {
      console.log(error);
    },
    onSuccess: (response) => {
      const updatedMembers = response.data.members.map((item) => {
        return {
          name: item.memberName,
          role: item.role,
          email: item.memberEmail,
          id: item.memberID,
        };
      });
      setDataSource(updatedMembers);
      showMessage(0, "Delete member successfully");
    },
  });

  const handleChangeRole = async ({ key }, record) => {
    setSelectedRow(record.id);
    await changeRoleMutation.mutateAsync({
      groupID: memberPayload._id,
      memberID: record.id,
      role: key.key,
    });
  };

  const menu = (record) => {
    return (
      <Menu onClick={(key) => handleChangeRole({ key }, record)}>
        <Menu.Item key="co-owner">Co-owner</Menu.Item>
        <Menu.Item key="member">Member</Menu.Item>
      </Menu>
    );
  };
  const handleDelete = async (record) => {
    setSelectedRow(record.id);
    await deleteMemberMutation.mutateAsync({
      groupID: memberPayload._id,
      memberID: record.id,
    });
  };
  const defaultLimitedColumns = [
    {
      title: "Name",
      dataIndex: "name",
      width: "30%",
    },
    {
      title: "Role",
      dataIndex: "role",
      width: "10%",
    },
    {
      title: "Email",
      dataIndex: "email",
      width: "30%",
    },
  ];
  const defaultColumns = [
    {
      title: "Name",
      dataIndex: "name",
      width: "30%",
    },
    {
      title: "Role",
      dataIndex: "role",
      width: "10%",
    },
    {
      title: "Email",
      dataIndex: "email",
      width: "30%",
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
            {record.role === "owner" ? null : <a href="null">Delete</a>}
          </Popconfirm>
          {record.role === "owner" ? null : (
            <Dropdown overlay={menu(record)} trigger={["click"]}>
              <a
                href="null"
                onClick={(e) => e.preventDefault()}
                style={{ color: "#d46b08", fontWeight: "bold" }}
              >
                Change role <DownOutlined />
              </a>
            </Dropdown>
          )}
          {changeRoleMutation.isLoading && record.id === selectedRow ? (
            <ColorRing
              visible
              height="15"
              width="15"
              ariaLabel="blocks-loading"
              wrapperStyle={{}}
              wrapperClass="blocks-wrapper"
              colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
            />
          ) : null}
        </Space>
      ),
    },
  ];
  const handleCancel = () => {
    setVisible(false);
  };
  const handleAdd = () => {
    setVisible(true);
  };
  const sendLinkToEmailMutation = useMutation(sendlinktoemail, {
    onError: (error) => {
      setVisible(false);
      console.log(error);
    },
    onSuccess: () => {
      setVisible(false);
      showMessage(0, "Send link successfully");
    },
  });

  const handleOk = async () => {
    try {
      await sendLinkToEmailMutation.mutateAsync({
        groupID: memberPayload._id,
        emailList: emails,
      });
    } catch (error) {
      console.log(error);
    }
  };
  const handleSave = (row) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);
  };
  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };
  const limitedColumns = defaultLimitedColumns.map((col) => {
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
  return (
    <div>
      <Button
        onClick={handleAdd}
        type="primary"
        shape="round"
        icon={<PlusOutlined />}
        style={{ marginBottom: 16 }}
      >
        Add member
      </Button>
      <Modal open={visible} onOk={handleOk} onCancel={handleCancel}>
        <SC.StyledGroupTitle>Add new member</SC.StyledGroupTitle>
        <Space>
          <div style={SC.styles}>
            <ReactMultiEmail
              placeholder="Input your Email Address"
              emails={emails}
              onChange={(_emails) => {
                setEmails(_emails);
              }}
              getLabel={(email, index, removeEmail) => {
                return (
                  <div data-tag key={index}>
                    {email}
                    <span
                      data-tag-handle
                      role="button"
                      tabIndex={0}
                      onClick={() => removeEmail(index)}
                      onKeyDown={() => removeEmail(index)}
                    >
                      ×
                    </span>
                  </div>
                );
              }}
            />
          </div>

          {sendLinkToEmailMutation.isLoading ? (
            <ColorRing
              visible
              height="25"
              width="25"
              ariaLabel="blocks-loading"
              wrapperStyle={{}}
              wrapperClass="blocks-wrapper"
              colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
            />
          ) : null}
        </Space>
      </Modal>
      <Table
        components={components}
        rowClassName={() => "editable-row"}
        bordered
        dataSource={dataSource}
        columns={
          !currentMember[0].role.toString().includes("member")
            ? columns
            : limitedColumns
        }
      />
    </div>
  );
}
export default GroupMemberPage;
