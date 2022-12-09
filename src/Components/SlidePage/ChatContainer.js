import React, { useState, useEffect, useContext } from "react";
import { Popover, Input, Button, Divider } from "antd";
import { useMutation } from "@tanstack/react-query";
import { CommentOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import InfiniteScroll from "react-infinite-scroll-component";
import * as SC from "./StyledSlideComponent";
import { getChatHistoryInit, getMoreChat, sendChat } from "../../API/api";
import SocketContext from "../../Context/SocketProvider";

function ChatContainer({ presentationID, chatSide }) {
  const { socket } = useContext(SocketContext);
  const [chatList, setChatList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastChatID, setLastChatID] = useState(0);
  const [hasMoreChat, setHasMoreChat] = useState(true);
  const [chatInput, setChatInput] = useState("");
  const [notification, setNotification] = useState(false);
  const loadMoreData = async () => {
    console.log("isLoading", loading);
    if (loading) {
      return;
    }
    setLoading(true);
    try {
      const { chats } = await getMoreChat({ presentationID, lastChatID });

      if (chats.length === 0) {
        setHasMoreChat(false);
        setLoading(false);
        return;
      }
      if (chatSide === "Member") {
        const newChats = chats.map((chat) => {
          if (chat.isSender) {
            return { ...chat, isSender: false, isTeacher: true };
          }
          return chat;
        });
        setChatList([...chatList, ...newChats]);
      } else {
        setChatList([...chatList, ...chats]);
      }
      setLastChatID(chats[chats.length - 1]._id);
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };
  useEffect(() => {
    const getChatHistory = async () => {
      const { chats } = await getChatHistoryInit({
        presentationID,
      });
      // setChatList(response.data);
      if (chats.length === 0) {
        setHasMoreChat(false);
        setLoading(false);
        return;
      }
      if (chatSide === "Member") {
        const newChats = chats.map((chat) => {
          if (chat.isSender) {
            return { ...chat, isSender: false, isTeacher: true };
          }
          return chat;
        });
        setChatList(newChats);
        setLastChatID(chats[chats.length - 1]._id);
        return;
      }
      setChatList(chats);
      setLastChatID(chats[chats.length - 1]._id);
    };
    getChatHistory();
    socket.emit("joinRoom", { _id: `${presentationID}CHAT` });
  }, [presentationID]);
  useEffect(() => {
    socket.on("onReceiveMessage", (chat) => {
      setNotification(true);
      if (chatSide === "Member" && chat.isSender) {
        setChatList((prev) => [
          { ...chat, isSender: false, isTeacher: true },
          ...prev,
        ]);
      } else {
        setChatList((prev) => [chat, ...prev]);
      }
    });
    return () => {
      socket.off("onReceiveMessage");
    };
  }, []);
  const sendMessageMutation = useMutation(sendChat, {
    onSuccess: ({ chat }) => {
      socket.emit("sentMessage", {
        _id: `${chat.presentationID}CHAT`,
        ...chat,
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });
  const onSentMessage = async (chatItem) => {
    try {
      await sendMessageMutation.mutateAsync(chatItem);
    } catch (e) {
      console.log(e);
    }
  };
  const handleSendChat = async () => {
    if (chatInput === "") return;
    const chatItem = {
      isSender: chatSide !== "Member",
      content: chatInput,
      presentationID,
    };
    try {
      await onSentMessage(chatItem);
      // await sendChat(chatItem);
      setChatInput("");
      setChatList([
        {
          isSender: true,
          content: chatInput,
        },
        ...chatList,
      ]);
    } catch (e) {
      console.log(e);
    }
  };
  const content = () => {
    return (
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
            hasMore={hasMoreChat}
            inverse
            scrollableTarget="scrollableDiv"
            endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
            style={{ display: "flex", flexDirection: "column-reverse" }}
            loader={<h4>Loading...</h4>}
            initialScrollY={10}
          >
            {chatList.map((chat) => {
              return (
                <SC.StyledChatContainer
                  key={chat.sentTime}
                  isSender={chat.isSender}
                  isTeacher={chat.isTeacher}
                >
                  <SC.StyledChatItem
                    isSender={chat.isSender}
                    isTeacher={chat.isTeacher}
                  >
                    {chat.content}
                  </SC.StyledChatItem>
                </SC.StyledChatContainer>
              );
            })}
          </InfiniteScroll>
        </div>
        <SC.StyledTopSmallContainer style={{ width: "100%" }}>
          <Input
            style={{ width: "100%" }}
            placeholder="Enter chat"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onPressEnter={handleSendChat}
          />
          <Button type="primary" onClick={handleSendChat}>
            Sent
          </Button>
        </SC.StyledTopSmallContainer>
      </SC.StyledRadioContainer>
    );
  };
  return (
    <Popover content={content} title="Chat Box" trigger="click">
      <SC.StyledChatIconContainer onClick={() => setNotification(false)}>
        <CommentOutlined style={{ fontSize: "25px", cursor: "pointer" }} />
        {notification && (
          <ExclamationCircleFilled
            style={{
              fontSize: "15px",
              color: "red",
              position: "absolute",
              top: -5,
              right: -5,
            }}
          />
        )}
      </SC.StyledChatIconContainer>
    </Popover>
  );
}

export default ChatContainer;
