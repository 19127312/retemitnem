import React, { useState, useEffect } from "react";
import { Popover, Input, Button, Divider } from "antd";
import { CommentOutlined } from "@ant-design/icons";
import InfiniteScroll from "react-infinite-scroll-component";
import * as SC from "./StyledSlideComponent";
import { getChatHistoryInit, getMoreChat } from "../../API/api";

function ChatContainer({ presentationID }) {
  const [chatList, setChatList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastChatID, setLastChatID] = useState(0);
  const loadMoreData = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    try {
      const response = await getMoreChat({ presentationID, lastChatID });
      console.log(response);
      // setChatList([...chatList, ...response.data]);
      // setLastChatID(response.data[response.data.length - 1].id);
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
    console.log("load more data");
  };
  useEffect(() => {
    const getChatHistory = async () => {
      const response = await getChatHistoryInit({
        presentationID,
      });
      // setChatList(response.data);
      setChatList(response.data.chats);
      setLastChatID(response.data.chats[response.data.chats.length - 1]._id);
    };
    getChatHistory();
  }, [presentationID]);
  console.log("LAST CHAT", lastChatID);
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
          {chatList.map((chat) => {
            if (chat.isSender) {
              return (
                <SC.StyledChatContainerSender key={chat.sentTime}>
                  <SC.StyledChatItemSender>
                    {chat.content} - #{chat.sentTime}
                  </SC.StyledChatItemSender>
                </SC.StyledChatContainerSender>
              );
            }
            return (
              <SC.StyledChatContainerReceiver key={chat.sentTime}>
                <SC.StyledChatItemReceiver>
                  {chat.content} - #{chat.sentTime}
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
