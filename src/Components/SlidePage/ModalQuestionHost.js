import React from "react";
import { Modal } from "antd";

function ModalQuestionHost({ open, handleCancel }) {
  return (
    <Modal open={open} onCancel={handleCancel} footer={null} centered>
      Hello
    </Modal>
  );
}

export default ModalQuestionHost;
