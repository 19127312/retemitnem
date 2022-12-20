import React from "react";
import { Modal, Button, Select } from "antd";
import * as SC from "../StyledSlideComponent";
import { showMessage } from "../../Message";

function ModalCollaboration({
  id,
  presentation,
  open,
  handleCancel,
  handleChange,
}) {
  if (!presentation) {
    return null;
  }
  const handleOk = () => {
    navigator.clipboard.writeText(`${window.location.host}/presentation/${id}`);
    showMessage(1, "Link copied to clipboard");
  };

  return (
    <Modal
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      width={1000}
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
      <SC.StyledGroupTitle>Presentation Collaborators</SC.StyledGroupTitle>
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
    </Modal>
  );
}

export default ModalCollaboration;
