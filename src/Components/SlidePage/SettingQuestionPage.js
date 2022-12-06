import React from "react";
import { PlusOutlined, RedoOutlined } from "@ant-design/icons";
import { Select, Input } from "antd";
import { useDropzone } from "react-dropzone";
import * as SC from "./StyledSlideComponent";
import SingleOption from "./SingleOption";

const { TextArea } = Input;

function SettingQuestionPage({
  question,
  onQuestionChange,
  options,
  onOptionChange,
  onOptionDelete,
  onOptionAdd,
  onResetResult,
  slideType,
  onChangeSlideType,
  subHeading,
  onSubheadingChange,
  onImageChange,
}) {
  const [files, setFiles] = React.useState();

  const handleOptionChange = (index, value) => {
    onOptionChange(index, value);
  };
  const handleOptionDelete = (index) => {
    onOptionDelete(index);
  };
  const handleChangeSlideType = (value) => {
    onChangeSlideType(value);
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFile) => {
      onImageChange(
        acceptedFile.map((file) =>
          Object.assign(file, { preview: URL.createObjectURL(file) })
        )
      );
      setFiles(
        acceptedFile.map((file) =>
          Object.assign(file, { preview: URL.createObjectURL(file) })
        )
      );
    },
    multiple: false,
  });

  let thumbs = null;
  try {
    thumbs = files.map((file) => (
      <img
        key={file.name}
        src={file.preview}
        alt=""
        style={{ width: "100px", height: "100px" }}
      />
    ));
  } catch (e) {
    console.log(e);
  }

  const slideRender = () => {
    if (slideType === "Multiple Choice") {
      return (
        <>
          <SC.StyledQuestionInSlide style={{ marginTop: 10 }}>
            Your Question ?
          </SC.StyledQuestionInSlide>
          <SC.StyledInput
            placeholder="Your question"
            value={question}
            onChange={(e) => onQuestionChange(e.target.value)}
          />
          <SC.StyledOptionResultContainer>
            <SC.StyledQuestionInSlide>Options ?</SC.StyledQuestionInSlide>
            <SC.StyledButton
              icon={<RedoOutlined />}
              size="middle"
              onClick={onResetResult}
              type="primary"
              style={{ margin: "0px" }}
              danger
            >
              Reset Results
            </SC.StyledButton>
          </SC.StyledOptionResultContainer>
          {options?.map((optionItem) => (
            <SingleOption
              key={optionItem.optionKey}
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
        </>
      );
    }
    if (slideType === "Heading") {
      return (
        <>
          <SC.StyledQuestionInSlide style={{ marginTop: 10 }}>
            Your Question ?
          </SC.StyledQuestionInSlide>
          <SC.StyledInput
            placeholder="Your heading"
            value={question}
            onChange={(e) => onQuestionChange(e.target.value)}
          />

          <SC.StyledQuestionInSlide>Subheading</SC.StyledQuestionInSlide>
          <TextArea
            style={{ width: "100%" }}
            maxLength={500}
            autoSize={{ minRows: 5, maxRows: 100 }}
            placeholder="Your subheading"
            value={subHeading}
            showCount
            onChange={(e) => onSubheadingChange(e.target.value)}
          />
          <SC.StyledDragDropImage>
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              Drag drop some files here, or click to select files
            </div>
          </SC.StyledDragDropImage>
          <SC.StyledImageSetting>{thumbs}</SC.StyledImageSetting>
        </>
      );
    }
    if (slideType === "Paragraph") {
      return <>Paragraph</>;
    }
    return null;
  };

  return (
    <SC.StyledSettingContainer>
      <SC.StyledQuestionInSlide>Slide Type</SC.StyledQuestionInSlide>
      <Select
        defaultValue={slideType}
        onChange={handleChangeSlideType}
        style={{ width: "100%" }}
        options={[
          {
            value: "Multiple Choice",
            label: "Multiple Choice",
          },
          {
            value: "Heading",
            label: "Heading",
          },
          {
            value: "Paragraph",
            label: "Paragraph",
          },
        ]}
      />
      {slideRender()}
    </SC.StyledSettingContainer>
  );
}

export default SettingQuestionPage;
