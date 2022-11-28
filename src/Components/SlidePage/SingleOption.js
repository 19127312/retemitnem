import React from "react";
import { CloseOutlined } from "@ant-design/icons";
import * as SC from "./StyledSlideComponent";

function SingleOption({ index, option, onOptionDelete, onOptionChange }) {
  const handleDeleteOption = () => {
    onOptionDelete(index);
  };

  return (
    <SC.StyledOptionContainer>
      <SC.StyledOptionInput
        placeholder="Your option"
        value={option}
        onChange={(e) => {
          onOptionChange(e.target.value);
        }}
      />
      <CloseOutlined onClick={handleDeleteOption} />
    </SC.StyledOptionContainer>
  );
}

export default SingleOption;
