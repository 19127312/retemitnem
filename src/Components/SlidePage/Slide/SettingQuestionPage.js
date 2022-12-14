import React from "react";
import { PlusOutlined, RedoOutlined } from "@ant-design/icons";
import { Select, Input } from "antd";
import { useDropzone } from "react-dropzone";
import * as SC from "../StyledSlideComponent";
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
  image,
  onImageChange,
}) {
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
    onDrop: async (acceptedFile) => {
      const cloudinaryURL = `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/upload`;
      const formData = new FormData();
      formData.append("file", acceptedFile[0]);
      formData.append(
        "upload_preset",
        process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET
      );
      const respond = await fetch(cloudinaryURL, {
        method: "POST",
        body: formData,
      });
      const data = await respond.json();
      onImageChange(data.url);
    },
    multiple: false,
  });
  const handleRemoveImage = () => {
    onImageChange("");
  };
  const slideRender = () => {
    if (slideType === "Multiple Choice") {
      return (
        <>
          <SC.StyledQuestionInSlide style={{ marginTop: 10 }}>
            Your Question ?
          </SC.StyledQuestionInSlide>
          <SC.StyledInput
            maxLength={60}
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
            Heading
          </SC.StyledQuestionInSlide>
          <SC.StyledInput
            maxLength={60}
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
          <SC.StyledDragDropImageContainer>
            <SC.StyledDragDropImage {...getRootProps()}>
              <input {...getInputProps()} />
              Drag drop some files here, or click to select files
            </SC.StyledDragDropImage>

            {image ? (
              <>
                <SC.StyledRemoveImageButton
                  danger
                  type="text"
                  onClick={handleRemoveImage}
                >
                  Remove
                </SC.StyledRemoveImageButton>
                <SC.StyledImageSetting>
                  <img
                    src={image}
                    alt=""
                    height={100}
                    width={100}
                    style={{ marginLeft: "110px" }}
                  />
                </SC.StyledImageSetting>
              </>
            ) : null}
          </SC.StyledDragDropImageContainer>
        </>
      );
    }
    if (slideType === "Paragraph") {
      return (
        <>
          <SC.StyledQuestionInSlide style={{ marginTop: 10 }}>
            Heading
          </SC.StyledQuestionInSlide>
          <SC.StyledInput
            maxLength={60}
            placeholder="Your heading"
            value={question}
            onChange={(e) => onQuestionChange(e.target.value)}
          />

          <SC.StyledQuestionInSlide>Paragraph</SC.StyledQuestionInSlide>
          <TextArea
            style={{ width: "100%" }}
            maxLength={500}
            autoSize={{ minRows: 5, maxRows: 100 }}
            placeholder="Your paragraph"
            value={subHeading}
            showCount
            onChange={(e) => onSubheadingChange(e.target.value)}
          />
          <SC.StyledDragDropImageContainer>
            <SC.StyledDragDropImage {...getRootProps()}>
              <input {...getInputProps()} />
              Drag drop some files here, or click to select files
            </SC.StyledDragDropImage>
            {image ? (
              <>
                <SC.StyledRemoveImageButton
                  danger
                  type="text"
                  onClick={handleRemoveImage}
                >
                  Remove
                </SC.StyledRemoveImageButton>
                <SC.StyledImageSetting>
                  <img
                    src={image}
                    alt=""
                    height={100}
                    width={100}
                    style={{ marginLeft: "110px" }}
                  />
                </SC.StyledImageSetting>
              </>
            ) : null}
          </SC.StyledDragDropImageContainer>
        </>
      );
    }
    return null;
  };

  return (
    <SC.StyledSettingContainer>
      <SC.StyledQuestionInSlide>Slide Type</SC.StyledQuestionInSlide>
      <Select
        onChange={handleChangeSlideType}
        value={slideType}
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
