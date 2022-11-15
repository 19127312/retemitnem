import React, { useState } from "react";
import 'antd/dist/antd.css';
import logo from '../../Assets/logo.png';
import * as SC from './StyledMainPageComponents';
import settings from '../../Assets/settings.svg'
import { PlusOutlined } from '@ant-design/icons';
import { Button, Input, Select, Avatar, Card } from 'antd';
import { ShareAltOutlined } from '@ant-design/icons';

const { Search } = Input;
const { Meta } = Card;


export default function MainPage() {
    const [title, setTitle] = useState("My Groups");
    const [showAddButton, setShowAddButton] = useState(true);
    // handle search
    const onSearch = (value) => console.log(value);
    // handle filter
    const handleChange = (value) => {
        console.log(`selected ${value}`);
        if (value == 'self') {
            setTitle("My Groups");
            setShowAddButton(true);
        } else {
            setTitle("Other Groups");
            setShowAddButton(false);
        }
    };



    return (
        <SC.StyledPageContainer>
            <SC.StyledUpperBarContainer>
                <SC.StyledIconContainer>
                    <SC.StyledImageContainer src={logo} alt="logo" />
                    <SC.StyledLogoName>Team space</SC.StyledLogoName>
                </SC.StyledIconContainer>
                <SC.StyledIconContainer>
                    <SC.StyledUserInfoContainer>
                        <SC.StyledUserName>Craig Denis</SC.StyledUserName>
                        <SC.StyledEmailName>craigdenis@email.com</SC.StyledEmailName>
                    </SC.StyledUserInfoContainer>
                    <SC.StyledImageContainer src={settings} alt="settings" />
                </SC.StyledIconContainer>
            </SC.StyledUpperBarContainer>

            <SC.StyledUtilitiesContainer>
                <SC.StyledItemMarginHorizonalLeftContainer>
                    {showAddButton ?
                        <Button type="primary" shape="round" icon={<PlusOutlined />} size="large">
                            New Group
                        </Button> :
                        <Button disabled="true" type="primary" shape="round" icon={<PlusOutlined />} size="large">
                            New Group
                        </Button>}
                </SC.StyledItemMarginHorizonalLeftContainer>
                <SC.StyledSearchSortContainer>
                    <SC.StyledItemMarginHorizonalRightContainer>
                        <Search placeholder="input search text" onSearch={onSearch} enterButton />
                    </SC.StyledItemMarginHorizonalRightContainer>
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
                </SC.StyledSearchSortContainer>
            </SC.StyledUtilitiesContainer>

            <SC.StyledGroupTitleContainer>
                <SC.StyledGroupTitle>{title}</SC.StyledGroupTitle>
            </SC.StyledGroupTitleContainer>
            <Card
                style={{ width: 300 }}
                cover={
                    <img
                        alt="example"
                        src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                    />
                }
                actions={[
                    <ShareAltOutlined key="share" />
                ]}
            >
                <Meta
                    avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                    title="Card title"
                    description="This is the description"
                />
            </Card>
        </SC.StyledPageContainer>
    )
}