import React from "react";
import { Dropdown } from "antd";
import { CaretRightOutlined } from "@ant-design/icons";
import { Color } from "../../../Constants/Constant";
import * as SC from "../StyledSlideComponent";

function SingleSlide({
  index,
  selected,
  onClick,
  onDelete,
  question,
  isPlayed,
}) {
  const handleClick = () => {
    onClick(index);
  };
  const items = [
    {
      label: "Delete this slide",
      danger: true,
      key: "1",
    },
  ];
  return (
    <Dropdown
      menu={{
        items,
        onClick: (e) => {
          if (e.key === "1") {
            onDelete(index);
          }
        },
      }}
      trigger={["contextMenu"]}
    >
      <SC.StyledSingleSlideContainer onClick={handleClick} selected={selected}>
        {isPlayed ? (
          <CaretRightOutlined
            style={{ color: Color.blue400, fontSize: "20px" }}
          />
        ) : null}
        <SC.StyledInsideSlideContainer selected={selected}>
          <SC.StyledNumberSlide>{question}</SC.StyledNumberSlide>
        </SC.StyledInsideSlideContainer>
      </SC.StyledSingleSlideContainer>
    </Dropdown>
  );
}

export default SingleSlide;
