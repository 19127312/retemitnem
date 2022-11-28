import React from "react";
import { PlusOutlined } from "@ant-design/icons";
import * as SC from "./StyledSlideComponent";
import SingleOption from "./SingleOption";

function SettingQuestionPage({
  question,
  onQuestionChange,
  options,
  onOptionChange,
  onOptionDelete,
  onOptionAdd,
}) {
  const handleOptionChange = (index, value) => {
    onOptionChange(index, value);
  };
  const handleOptionDelete = (index) => {
    onOptionDelete(index);
  };
  return (
    <SC.StyledSettingContainer>
      <SC.StyledQuestionInSlide>Your Question ?</SC.StyledQuestionInSlide>
      <SC.StyledInput
        placeholder="Your question"
        value={question}
        onChange={(e) => onQuestionChange(e.target.value)}
      />
      <SC.StyledQuestionInSlide>Options ?</SC.StyledQuestionInSlide>
      {options.map((optionItem) => (
        <SingleOption
          index={optionItem.optionKey}
          option={optionItem.option}
          onOptionDelete={(indexDelete) => handleOptionDelete(indexDelete)}
          onOptionChange={(value) =>
            handleOptionChange(optionItem.optionKey, value)
          }
        />
      ))}
      <SC.StyledButton
        icon={<PlusOutlined />}
        size="large"
        onClick={onOptionAdd}
        style={{ marginTop: "10px", padding: "0px", width: "100%" }}
        type="primary"
      >
        New Option
      </SC.StyledButton>
    </SC.StyledSettingContainer>
  );
}

export default SettingQuestionPage;
