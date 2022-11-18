import React from 'react';
import "antd/dist/antd.min.css";
import { Button, Input, Table, Space, Select, Popconfirm } from 'antd';
import { useContext, useEffect, useRef, useState } from 'react';
import * as SC from "./StyledGroupPageComponents";
import { PlusOutlined, AudioOutlined, DownOutlined } from '@ant-design/icons';
import playSlide from '../../Assets/playSlide.png'
export const GroupDashboardPage = ({dashBoardPayload}) => {

    const { Search } = Input;
    const suffix = (
        <AudioOutlined
            style={{
                fontSize: 16,
                color: '#1890ff',
            }}
        />
    );
    const handleClick = (key) => {
        console.log(key.name);
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (_, record) =>
                <SC.StyledItemSlideListContainer>
                    <SC.StyledImagePlay src={playSlide} alt="playSlide" onClick={() => handleClick(record.key)} />
                    <SC.StyledItemInfoSlideListContainer>
                        <div>{record.name}</div>
                        <div>{record.number} slide</div>
                    </SC.StyledItemInfoSlideListContainer>
                </SC.StyledItemSlideListContainer>
        },
        {
            title: 'Owner',
            dataIndex: 'owner',
            key: 'owner',
            width: '12%',
        },
        {
            title: 'Modified',
            dataIndex: 'modified',
            key: 'modified',
            width: '20%',
        },
        {
            title: 'Created',
            dataIndex: 'created',
            key: 'created',
            width: '20%',
        },
    ];
    const [data, setData] = useState([
        {
            key: 1,
            name: 'John Brown sr.',
            owner: 'owner1',
            modified: '5 minutes ago',
            created: '2 days ago',
            number: 1
        },
        {
            key: 2,
            name: 'Joe Black',
            owner: 'owner2',
            modified: '10 minutes ago',
            created: '2 years ago',
            number: 10
        },
    ]);

    // rowSelection objects indicates the need for row selection
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
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
        console.log(`selected ${value}`);
        if (value == 'self') {

        } else {

        }
    };

    return (
        <SC.StyledDashboardContainer>
            <SC.StyledBannerContainer>
                <SC.StyledGroupNameDashboard><b>{dashBoardPayload.groupName}</b></SC.StyledGroupNameDashboard>
                <SC.StyledOwnerSlideNameDashboard><i>{dashBoardPayload.creatorName}</i></SC.StyledOwnerSlideNameDashboard>
            </SC.StyledBannerContainer>
            <SC.StyledButtonDashboardContainer>
                <Button type="primary" shape="round" icon={<PlusOutlined />} style={{ marginBottom: 16 }}>Add slide</Button>
                <SC.StyledToolBarDashboardContainer>
                    <Space direction="vertical">
                        <Search placeholder="input search text" onSearch={onSearch} enterButton />
                    </Space>
                    <SC.StyledItemMarginHorizonalRightContainer>
                        <Select
                            defaultValue="self"
                            onChange={handleChange}
                            style={{ width: 200 }}
                            options={[
                                {
                                    value: 'self',
                                    label: 'My Groups',
                                },
                                {
                                    value: 'others',
                                    label: 'Other Groups',
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
                    dataSource={data}
                />
            </SC.StyledMarginTaleDashboard>
        </SC.StyledDashboardContainer >
    )
};
export default GroupDashboardPage;