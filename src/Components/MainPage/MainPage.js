import React, { useState, useContext } from "react";
import 'antd/dist/antd.min.css';
import logo from '../../Assets/logo.png';
import * as SC from './StyledMainPageComponents';
import settings from '../../Assets/settings.svg'
import { PlusOutlined } from '@ant-design/icons';
import { Button, Input, Select, Avatar, Card, List, Form, Modal, Space, message } from 'antd';
import { ShareAltOutlined } from '@ant-design/icons';
import InfiniteScroll from 'react-infinite-scroll-component';
import { createGroup } from "../../API/api";
import useAuth from "../../Hooks/useAuth";
import { useMutation } from '@tanstack/react-query';
import { ThreeDots } from 'react-loader-spinner';
import { Color } from '../../Constants/Constant';
import { ColorRing } from 'react-loader-spinner';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../Context/AuthProvider'

const { Search } = Input;
const { Meta } = Card;



export default function MainPage() {
    const navigate = useNavigate();
    const { auth, setAuth } = useContext(AuthContext);

    const [title, setTitle] = useState("My Groups");
    const [showAddButton, setShowAddButton] = useState(true);
    const [visible, setVisible] = useState(false);
    const [form] = Form.useForm();

    // handle search
    const onSearch = (value) => console.log(value);
    // const onClick = () => console.log('click');

    // handle filter
    const handleChange = (value) => {
        console.log(`selected ${value}`);
        if (value === 'self') {
            setTitle("My Groups");
            setShowAddButton(true);
        } else {
            setTitle("Other Groups");
            setShowAddButton(false);
        }
    };

    const data = [
        {
            title: 'Title 1',
        },
        {
            title: 'Title 2',
        },
        {
            title: 'Title 3',
        },
        {
            title: 'Title 4',
        },
        {
            title: 'Title 5',
        },
        {
            title: 'Title 6',
        },
        {
            title: 'Title 1',
        },
        {
            title: 'Title 2',
        },
        {
            title: 'Title 3',
        },
        {
            title: 'Title 4',
        },
        {
            title: 'Title 5',
        },
        {
            title: 'Title 6',
        },
        {
            title: 'Title 1',
        },
        {
            title: 'Title 2',
        },
        {
            title: 'Title 3',
        },
        {
            title: 'Title 4',
        },
        {
            title: 'Title 5',
        },
        {
            title: 'Title 6',
        },
        {
            title: 'Title 1',
        },
        {
            title: 'Title 2',
        },
        {
            title: 'Title 3',
        },
        {
            title: 'Title 4',
        },
        {
            title: 'Title 5',
        },
        {
            title: 'Title 6',
        },
    ];

    const showModal = () => {
        setVisible(true)
    }

    const handleCancel = () => {
        setVisible(false);
        form.resetFields();
    };

    const showSuccessMessage = () => {
        message.success('Create group successfully');
    };

    const showExistNameErrorMessage = () => {
        message.error('Group name has already been exist');
    };

    const showUnknownErrorMessage = () => {
        message.error('Create failed. Unknown error');
    };

    const { isLoading, mutateAsync } = useMutation(
        createGroup,
        {
            onError: (error) => {
                setVisible(false);
                form.resetFields();
                // alert(error);
                console.log(error);
                if (error.toString().includes('group name has already been used')) {
                    showExistNameErrorMessage();
                }
                else {
                    showUnknownErrorMessage();
                }
            },
            onSuccess: (responseData) => {
                setVisible(false);
                form.resetFields();
                showSuccessMessage();
            },

        }
    );

    const onSubmit = async (values) => {
        try {
            await mutateAsync({
                groupName: values.groupname,
                creatorID: auth.user._id
            });
        } catch (error) {

        }
    }
    const logout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setAuth(null)
    }
    return (
        <SC.StyledPageContainer>
            <SC.StyledUpperBarContainer>
                <SC.StyledIconContainer>
                    <SC.StyledImageContainer src={logo} alt="logo" />
                    <SC.StyledLogoName>Team space</SC.StyledLogoName>
                </SC.StyledIconContainer>
                <SC.StyledIconContainer>
                    <SC.StyledUserInfoContainer>
                        <SC.StyledUserName>{auth.user.fullName}</SC.StyledUserName>
                        <SC.StyledEmailName>{auth.user.email}</SC.StyledEmailName>
                    </SC.StyledUserInfoContainer>
                    <SC.StyledImageContainer src={settings} alt="settings" onClick={logout} />
                </SC.StyledIconContainer>
            </SC.StyledUpperBarContainer>

            <SC.StyledUtilitiesContainer>
                <SC.StyledItemMarginHorizonalLeftContainer>
                    {showAddButton ?
                        <Button type="primary" shape="round" icon={<PlusOutlined />} size="large" onClick={showModal}>
                            New Group
                        </Button> :
                        <Button disabled="true" type="primary" shape="round" icon={<PlusOutlined />} size="large">
                            New Group
                        </Button>}
                </SC.StyledItemMarginHorizonalLeftContainer>


                <Modal visible={visible} onOk={form.submit} onCancel={handleCancel}>
                    <Form form={form} onFinish={onSubmit} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                        {/* Any input */}
                        <Form.Item>
                            <SC.StyledGroupTitle>Create a group</SC.StyledGroupTitle>
                        </Form.Item>
                        <Form.Item label="Group name">
                            <Space>
                                <Form.Item
                                    name="groupname"
                                    noStyle
                                    rules={[{ required: true, message: 'Group name is required' }]}
                                >
                                    <Input style={{ width: 160 }} placeholder="Please input" />
                                </Form.Item>
                                {
                                    isLoading ? <ColorRing
                                        visible={true}
                                        height="25"
                                        width="25"
                                        ariaLabel="blocks-loading"
                                        wrapperStyle={{}}
                                        wrapperClass="blocks-wrapper"
                                        colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
                                    /> : null
                                }
                            </Space>

                        </Form.Item>
                    </Form>
                </Modal>


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

            <div
                id="scrollableDiv"
                style={{
                    boxSizing: 'border-box',
                    height: '1000px',
                    margin: '0px 35px 20px 35px',
                    maxWidth: '100%',
                    overflowX: 'hidden',
                    padding: '16px 16px',
                    border: '1px solid rgba(140, 140, 140, 0.35)',
                }}
            >
                <InfiniteScroll
                    style={{ overflowX: 'hidden' }}
                    dataLength={data.length}
                    // next={loadMoreData}
                    hasMore={data.length < 12}
                    // loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
                    // endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
                    scrollableTarget="scrollableDiv"

                >
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
                        renderItem={item => (
                            <List.Item>
                                {/* <Card title={item.title}>Card content</Card> */}
                                <Card
                                    // style={{ width: 300 }}
                                    cover={
                                        <img
                                            alt="example"
                                            src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                                        />
                                    }
                                    actions={[
                                        <ShareAltOutlined key="share" onClick={() => {
                                            console.log(item)
                                        }} />
                                    ]}
                                >
                                    <Meta
                                        avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                                        title={item.title}
                                        description="This is the description"
                                    />
                                </Card>
                            </List.Item>
                        )}
                    />
                </InfiniteScroll>
            </div>

        </SC.StyledPageContainer>
    )
}