import React, { useEffect, useState } from "react";
import { Modal, Button, Select } from "antd";
import * as SC from "../StyledSlideComponent";
import { showMessage } from "../../Message";
import { viewAllGroupOfOwnerPresentation } from "../../../API/groupApi";

function ModalShare({
  id,
  presentation,
  open,
  handleCancel,
  handleChange,
  handleChangeGroupID,
  guideText,
}) {
  if (!presentation) {
    return null;
  }
  const [options, setOptions] = useState([]);
  const [defaultOption, setDefaultOption] = useState("Pick a group");
  useEffect(() => {
    // const options = [];
    // const groups = JSON.parse(localStorage.getItem("groups"));
    // groups.forEach((group) => {
    //   options.push({
    //     value: group.groupID,
    //     label: group.groupName,
    //   });
    // });
    // setOptions(options);
    const fetchData = async () => {
      try {
        const response = await viewAllGroupOfOwnerPresentation({
          ownerID: presentation.ownerID,
        });
        const initialOptions = [];
        response.forEach((group) => {
          initialOptions.push({
            value: group._id,
            label: group.groupName,
          });
          if (presentation.groupID === group._id) {
            setDefaultOption(group.groupName);
          }
        });
        setOptions(initialOptions);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [presentation]);

  const handleOk = () => {
    navigator.clipboard.writeText(`${window.location.host}/presentation/${id}`);
    showMessage(1, "Link copied to clipboard");
  };
  // const handleClickHere = () => {
  //   if (presentation) {
  //     navigator.clipboard.writeText(
  //       `${window.location.host}/joinLink/${presentation.groupID}`
  //     );
  //     showMessage(1, "Link copied to clipboard");
  //   }
  // };
  console.log("options", options);
  return (
    <Modal
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={[
        <Button
          // key="submit"
          type="primary"
          // loading={loading}
          onClick={handleOk}
        >
          Copy Presentation Link
        </Button>,
        <Button key="back" onClick={handleCancel}>
          Done
        </Button>,
      ]}
    >
      <SC.StyledGroupTitle>Share Presentation</SC.StyledGroupTitle>
      <SC.StyledSelectContainer>
        <SC.StyledGuideTitle>Visibility options</SC.StyledGuideTitle>
        <Select
          defaultValue={presentation.isPrivate ? "private" : "public"}
          style={{ width: 220 }}
          onChange={handleChange}
          options={[
            {
              value: "private",
              label: "Private",
            },
            {
              value: "public",
              label: "Public",
            },
          ]}
        />
      </SC.StyledSelectContainer>
      <SC.StyledCenterContainer>
        {guideText === true ? (
          <>
            <SC.StyledGuideTitle>
              Shared with specific people on a group.
            </SC.StyledGuideTitle>
            <SC.StyledSelectContainer style={{ width: "90%" }}>
              <SC.StyledGuideTitle>Choose Group</SC.StyledGuideTitle>
              <Select
                defaultValue={options.length > 0 ? defaultOption : "No group"}
                style={{ width: 220 }}
                onChange={handleChangeGroupID}
                options={options}
              />
            </SC.StyledSelectContainer>
          </>
        ) : (
          <SC.StyledGuideTitle>
            Anyone who has the link can access. No sign-in required
          </SC.StyledGuideTitle>
        )}
      </SC.StyledCenterContainer>
    </Modal>
  );
}

export default ModalShare;
