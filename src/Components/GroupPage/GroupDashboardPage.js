import React, { useState } from "react";
import "antd/dist/antd.min.css";
import { Button, Input, Table, Space, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import * as SC from "./StyledGroupPageComponents";
import playSlide from "../../Assets/playSlide.png";

export function GroupDashboardPage({ dashBoardPayload }) {
  const { Search } = Input;
  const handleClickPlay = (key) => {
    console.log(key.name);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (_, record) => (
        <SC.StyledItemSlideListContainer>
          <SC.StyledImagePlay
            src={playSlide}
            alt="playSlide"
            onClick={() => handleClickPlay(record.key)}
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
      width: "12%",
    },
    {
      title: "Modified",
      dataIndex: "modified",
      key: "modified",
      width: "20%",
    },
    {
      title: "Created",
      dataIndex: "created",
      key: "created",
      width: "20%",
    },
  ];
  const [slideData, setSlideData] = useState([
    {
      key: 1,
      name: "John Brown sr.",
      owner: "owner1",
      modified: "5 minutes ago",
      created: "2 days ago",
      number: 1,
    },
    {
      key: 2,
      name: "Joe Black",
      owner: "owner2",
      modified: "10 minutes ago",
      created: "2 years ago",
      number: 10,
    },
  ]);

  // rowSelection objects indicates the need for row selection
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
    },
    onSelect: (record, selected, selectedRows) => {
      console.log(record, selected, selectedRows);
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      console.log(selected, selectedRows, changeRows);
    },
  };

  const onSearch = (value) => console.log(value);
  const handleChange = (value) => {
    if (value === "self") {
      console.log(`selected ${value}`);
    } else {
      console.log(`selected ${value}`);
    }
  };

  const handleAddSlide = () => {
    setSlideData([]);
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
        <Button
          type="primary"
          shape="round"
          icon={<PlusOutlined />}
          style={{ marginBottom: 16 }}
          onClick={() => handleAddSlide()}
        >
          Add slide
        </Button>
        <SC.StyledToolBarDashboardContainer>
          <Space direction="vertical">
            <Search
              placeholder="input search text"
              onSearch={onSearch}
              enterButton
            />
          </Space>
          <SC.StyledItemMarginHorizonalRightContainer>
            <Select
              defaultValue="self"
              onChange={handleChange}
              style={{ width: 200 }}
              options={[
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
        </SC.StyledToolBarDashboardContainer>
      </SC.StyledButtonDashboardContainer>
      <SC.StyledMarginTaleDashboard>
        <Table
          columns={columns}
          rowSelection={{
            ...rowSelection,
          }}
          dataSource={slideData}
        />
      </SC.StyledMarginTaleDashboard>
    </SC.StyledDashboardContainer>
  );
}
export default GroupDashboardPage;
