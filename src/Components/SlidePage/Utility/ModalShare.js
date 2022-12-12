import React from "react";
import { Modal, Button, Select } from "antd";
import * as SC from "../StyledSlideComponent";
import { showMessage } from "../../Message";

function ModalShare({
  id,
  presentation,
  open,
  handleCancel,
  handleChange,
  guideText,
}) {
  if (!presentation) {
    return null;
  }
  const handleOk = () => {
    navigator.clipboard.writeText(`${window.location.host}/presentation/${id}`);
    showMessage(1, "Link copied to clipboard");
  };
  const handleClickHere = () => {
    if (presentation) {
      navigator.clipboard.writeText(
        `${window.location.host}/joinLink/${presentation.groupID}`
      );
      showMessage(1, "Link copied to clipboard");
    }
  };

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
            <SC.StyledGuideTitle>
              Click{" "}
              <span
                style={{
                  cursor: "pointer",
                  color: "#33a9d4",
                  fontWeight: "bold",
                }}
                onClick={() => {
                  handleClickHere();
                }}
                aria-hidden="true"
              >
                here
              </span>{" "}
              to copy group invitation link.
            </SC.StyledGuideTitle>
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
