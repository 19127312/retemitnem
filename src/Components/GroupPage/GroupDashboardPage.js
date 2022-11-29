import React, { useState, useEffect } from "react";
import "antd/dist/antd.min.css";
import { Button, Input, Table, Space, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { ColorRing } from "react-loader-spinner";
import * as SC from "./StyledGroupPageComponents";
import playSlide from "../../Assets/playSlide.png";
import { viewPresentationInfoByGroupID } from "../../API/api";

export function GroupDashboardPage({ dashBoardPayload }) {
  const navigate = useNavigate();
  const { Search } = Input;
  const [loadingPresentation, setLoadingPresentation] = useState(false);
  // const [visible, setVisible] = useState(false);
  // const [form] = Form.useForm();
  const handleClickPlay = (key) => {
    console.log(key.name);
  };
  const handleNavigateSlidePage = (key) => {
    console.log("Choose presentation", key);
    navigate(`/slide/${key}`, { replace: false });
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
          <SC.StyledItemInfoSlideListContainer
            onClick={() => handleNavigateSlidePage(record.key)}
          >
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
  const [slideData, setSlideData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingPresentation(true);
        const response = await viewPresentationInfoByGroupID({
          groupID: dashBoardPayload._id,
        });
        const presentationData = response.data.map((item) => {
          return {
            key: item._id,
            name: item.title,
            owner: item.ownerName,
            created: item.createdDate.toString().split("T")[0],
            number: item.slides.length,
          };
        });
        setSlideData(presentationData);
        // setSlideData(response.data);
        setLoadingPresentation(false);
        // filterAndSearchData();
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchData();
  }, []);

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

  // const handleAddSlide = () => {
  //   setSlideData([]);
  // };

  // const handleCancel = () => {
  //   setVisible(false);
  //   form.resetFields();
  // };

  // const createGroupMutation = useMutation(createGroup, {
  //   onError: (error) => {
  //     setVisible(false);
  //     form.resetFields();
  //     showMessage(2, "Create failed. Unknown error");
  //     setLoadingPresentation(false);
  //   },
  //   onSuccess: () => {
  //     setVisible(false);
  //     form.resetFields();
  //     showMessage(0, "Create group successfully");
  //     const fetchData = async () => {
  //       try {
  //         setLoadingPresentation(true);
  //         const response = await viewPresentationInfoByGroupID({
  //           groupID: dashBoardPayload._id,
  //         });
  //         const presentationData = response.data.map((item) => {
  //           return {
  //             key: item._id,
  //             name: item.title,
  //             owner: item.ownerName,
  //             created: item.createdDate.toString().split("T")[0],
  //             number: item.slides.length,
  //           };
  //         });
  //         setSlideData(presentationData);
  //         // setSlideData(response.data);
  //         setLoadingPresentation(false);
  //         // filterAndSearchData();
  //       } catch (error) {
  //         console.error(error.message);
  //       }
  //     };
  //     fetchData();
  //     setLoadingPresentation(false);
  //   },
  // });

  // const onSubmitCreateGroup = async (values) => {
  //   setLoadingPresentation(true);
  //   try {
  //     await createGroupMutation.mutateAsync({
  //       groupName: values.groupname,
  //       creatorID: auth?.user?._id,
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
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
          // onClick={() => setVisible(true)}
        >
          New presentation
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
