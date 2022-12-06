import React, { useState } from "react";
import { Popover, Input, Button, Divider } from "antd";
import { CommentOutlined } from "@ant-design/icons";
import InfiniteScroll from "react-infinite-scroll-component";
import * as SC from "./StyledSlideComponent";

function ChatContainer({ chatData }) {
  const [chatList, setChatList] = useState(chatData);
  const loadMoreData = () => {
    setChatList([...chatList, ...chatData]);
    console.log("load more data");
  };
  const content = (
    <SC.StyledRadioContainer>
      <div
        id="scrollableDiv"
        style={{
          height: 400,
          width: 300,
          overflow: "auto",
          padding: "0 16px",
          backgroundColor: "white",
          marginBottom: "10px",
          display: "flex",
          flexDirection: "column-reverse",
        }}
      >
        <InfiniteScroll
          dataLength={chatList.length}
          next={loadMoreData}
          hasMore
          inverse
          scrollableTarget="scrollableDiv"
          endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
          style={{ display: "flex", flexDirection: "column-reverse" }}
          loader={<h4>Loading...</h4>}
          initialScrollY={10}
        >
          {chatList.map((chat, index) => {
            if (chat.isSender) {
              return (
                <SC.StyledChatContainerSender key={chat.sentTime}>
                  <SC.StyledChatItemSender>
                    {chat.content} - #{index}
                  </SC.StyledChatItemSender>
                </SC.StyledChatContainerSender>
              );
            }
            return (
              <SC.StyledChatContainerReceiver key={chat.sentTime}>
                <SC.StyledChatItemReceiver>
                  {chat.content} - #{index}
                </SC.StyledChatItemReceiver>
              </SC.StyledChatContainerReceiver>
            );
          })}
        </InfiniteScroll>
      </div>
      <SC.StyledTopSmallContainer style={{ width: "100%" }}>
        <Input style={{ width: "100%" }} placeholder="Enter chat" />
        <Button type="primary">Sent</Button>
      </SC.StyledTopSmallContainer>
    </SC.StyledRadioContainer>
  );
  return (
    <Popover content={content} title="Chat Box" trigger="click">
      <CommentOutlined style={{ fontSize: "25px", cursor: "pointer" }} />
    </Popover>
  );
}

export default ChatContainer;
