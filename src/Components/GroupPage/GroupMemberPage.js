import React, { useContext, useEffect, useRef, useState } from "react";
import "antd/dist/antd.min.css";
import { ColorRing } from "react-loader-spinner";
import { ReactMultiEmail } from "react-multi-email";
import * as SC from "./StyledGroupPageComponents";
import "react-multi-email/style.css";
import {
  Button,
  Dropdown,
  Form,
  Input,
  Popconfirm,
  Table,
  Space,
  Menu,
} from "antd";
import { PlusOutlined, DownOutlined } from "@ant-design/icons";
import { changeRole } from "../../API/api";

const EditableContext = React.createContext(null);
function EditableRow({ index, ...props }) {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
}

function EditableCell({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);
  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };
  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({
        ...record,
        ...values,
      });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };
  let childNode = children;
  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
        onKeyDown={toggleEdit}
        role="button"
        tabIndex={0}
      >
        {children}
      </div>
    );
  }
  return <td {...restProps}>{childNode}</td>;
}

const styles = {
  fontFamily: "sans-serif",
  width: "420px",
  borderRadius: "10px",
  border: "1px solid #eee",
  background: "#eaf8ff",
  padding: "25px",
  margin: "20px",
};
export function GroupMemberPage() {
  const [visible, setVisible] = useState(false);
  const [emails, setEmails] = useState([]);
  const [dataSource, setDataSource] = useState([
    {
      key: "0",
      name: "Edward King 0",
      role: "Owner",
      address: "London, Park Lane no. 0",
    },
    {
      key: "1",
      name: "Edward King 1",
      role: "Member",
      address: "London, Park Lane no. 1",
    },
  ]);
  const handleCancel = () => {
    setVisible(false);
  };

export function GroupMemberPage({ memberPayload }) {
  const [count, setCount] = useState(2);

  const members = memberPayload.members.map((item) => {
    return {
      name: item.memberName,
      role: item.role,
      email: item.memberEmail,
      id: item.memberID,
    };
  });
  const [dataSource, setDataSource] = useState(members);

  const handleChangeRole = async ({ key }, record) => {
    console.log(key);
    console.log(record);
    const respone = await changeRole({
      groupID: memberPayload._id,
      memberID: record.id,
      role: key.key,
    });
    console.log(respone);
    // const newData = await groupInfo
  };

  const menu = (record) => {
    console.log("record", record);
    return (
      <Menu onClick={(key) => handleChangeRole({ key }, record)}>
        <Menu.Item key="co-owner">Co-owner</Menu.Item>
        <Menu.Item key="member">Member</Menu.Item>
      </Menu>
    );
  };
  const handleDelete = (key) => {
    // const newData = dataSource.filter((item) => item.key !== key);
    // setDataSource(newData);
    console.log(key);
  };
  const defaultColumns = [
    {
      title: "Name",
      dataIndex: "name",
      width: "30%",
    },
    {
      title: "Role",
      dataIndex: "role",
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
            {record.role === "owner" ? null : <a href={() => false}>Delete</a>}
          </Popconfirm>
          {record.role === "owner" ? null : (
            <Dropdown overlay={menu(record)} trigger={["click"]}>
              <a
                href={() => false}
                onClick={(e) => e.preventDefault()}
                style={{ color: "#d46b08", fontWeight: "bold" }}
              >
                Change role <DownOutlined />
              </a>
            </Dropdown>
          )}
        </Space>
      ),
    },
    // {
    //     title: 'operation',
    //     dataIndex: 'operation',
    //     render: () => (
    //         <Dropdown
    //             menu={{
    //                 items,
    //             }}
    //         >
    //             <a>
    //                 More <DownOutlined />
    //             </a>
    //         </Dropdown>
    //     )
    // },
  ];
  const handleAdd = () => {
    // const newData = {
    //   key: count,
    //   name: `Edward King ${count}`,
    //   role: "owner",
    //   address: `London, Park Lane no. ${count}`,
    // };
    // setDataSource([...dataSource, newData]);
    // setCount(count + 1);
    setVisible(true);
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
  const handleOk = () => {
    console.log("values", emails);
  };
  // const onEmailsChange = (email, index, removeEmail) => {

  // };
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
      <Modal visible={visible} onOk={handleOk} onCancel={handleCancel}>
        <SC.StyledGroupTitle>Add new member</SC.StyledGroupTitle>
        <Space>
          <div style={styles}>
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

          {false ? (
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
        columns={columns}
      />
    </div>
  );
}
export default GroupMemberPage;
