import React, { useState, useRef, useEffect, useContext } from "react";
import Draggable from "react-draggable";
import { Modal, Input } from "antd";
import { useMutation } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import { LikeOutlined, LikeTwoTone } from "@ant-design/icons";
import * as SC from "./StyledSlideComponent";
import { Color } from "../../Constants/Constant";
import { getQuestions, updateQuestion, sendQuestion } from "../../API/api";
import { showMessage } from "../Message";
import SocketContext from "../../Context/SocketProvider";

const { TextArea } = Input;

function ModalQuestionMember({ open, handleCancel, presentationID }) {
  const { socket } = useContext(SocketContext);
  const [data, setData] = useState([]);
  const [askState, setAskState] = useState(false);
  const [question, setQuestion] = useState("");
  const [disabledMove, setDisabledMove] = useState(false);
  const [disabledSubmit, setDisabledSubmit] = useState(true);
  const [bounds, setBounds] = useState({
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  });
  useEffect(() => {
    const getInitQuestions = async () => {
      const { questions } = await getQuestions({
        presentationID,
      });
      const newQuestions = questions.map((item) => {
        return { ...item, isLiked: false };
      });

      setData(newQuestions);
    };
    getInitQuestions();
    socket.emit("joinQuestionRoom", { _id: `${presentationID}QUESTION` });
  }, [presentationID]);

  useEffect(() => {
    socket.on("onReceiveQuestion", (receiveQuestion) => {
      setData((prev) => [receiveQuestion, ...prev]);
    });

    socket.on("onUpdateQuestion", (updateQuestionItem) => {
      updateQuestionItem.isLiked = false;
      setData((prev) => {
        const newData = prev.map((item) => {
          if (item._id === updateQuestionItem._id) {
            if (item.isLiked) {
              updateQuestionItem.isLiked = true;
            }
            return updateQuestionItem;
          }

          return item;
        });
        return newData;
      });
    });
    return () => {
      socket.off("onReceiveQuestion");
      socket.off("onUpdateQuestion");
    };
  }, []);
  const updateQuestionMutation = useMutation(updateQuestion, {
    onSuccess: (updateQuestionItem) => {
      socket.emit("updateQuestion", {
        _id: `${presentationID}QUESTION`,
        data: updateQuestionItem.question,
      });
    },
  });
  const onUpdateQuestions = async (questionItem) => {
    try {
      await updateQuestionMutation.mutateAsync(questionItem);
    } catch (e) {
      console.log(e);
    }
  };
  const createQuestionMutation = useMutation(sendQuestion, {
    onSuccess: (response) => {
      setQuestion("");
      setAskState(false);
      setDisabledSubmit(true);
      setData((prev) => [
        {
          _id: response.question._id,
          content: response.question.content,
          countLike: 0,
          isLiked: false,
          isAnswered: false,
        },
        ...prev,
      ]);
      socket.emit("sentQuestion", {
        _id: `${presentationID}QUESTION`,
        data: response.question,
      });
    },
    onError: (error) => {
      showMessage(1, error);
    },
  });
  const onCreateQuestion = async (questionItem) => {
    try {
      await createQuestionMutation.mutateAsync(questionItem);
    } catch (e) {
      console.log(e);
    }
  };
  const draggleRef = useRef(null);
  const onStart = (_event, uiData) => {
    const { clientWidth, clientHeight } = window.document.documentElement;
    const targetRect = draggleRef.current?.getBoundingClientRect();
    if (!targetRect) {
      return;
    }
    setBounds({
      left: -targetRect.left + uiData.x,
      right: clientWidth - (targetRect.right - uiData.x),
      top: -targetRect.top + uiData.y,
      bottom: clientHeight - (targetRect.bottom - uiData.y),
    });
  };
  const handleSetQuestion = (e) => {
    setQuestion(e.target.value);
    if (e.target.value.length > 0) {
      setDisabledSubmit(false);
    } else {
      setDisabledSubmit(true);
    }
  };
  const handleClickLike = (id) => {
    const newData = [...data];
    const index = newData.findIndex((item) => item._id === id);
    if (newData[index].isLiked) {
      newData[index].countLike -= 1;
    } else {
      newData[index].countLike += 1;
    }
    onUpdateQuestions({ question: newData[index] });
    newData[index].isLiked = !newData[index].isLiked;
    setData(newData);
  };
  const handleClickSubmit = async () => {
    const newQuestion = {
      content: question,
      presentationID,
    };
    onCreateQuestion(newQuestion);
  };
  const listRender = (
    <div
      id="scrollableDiv"
      style={{
        width: "100%",
        minHeight: "100px",
        maxHeight: "250px",
        overflow: "auto",
        padding: "0 10px",
        backgroundColor: "white",
        marginBottom: "10px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <InfiniteScroll dataLength={data.length} scrollableTarget="scrollableDiv">
        {data
          .filter((item) => item.isAnswered === false)
          .map((item) => {
            return (
              <SC.StyledModalQuestionItemContainer key={item._id}>
                <SC.StyledModalQuestionItemContent>
                  {item.content}
                </SC.StyledModalQuestionItemContent>
                <SC.StyledLikeContainer>
                  {item.isLiked ? (
                    <LikeTwoTone
                      style={{ fontSize: "25px" }}
                      onClick={() => handleClickLike(item._id)}
                    />
                  ) : (
                    <LikeOutlined
                      style={{ fontSize: "25px" }}
                      onClick={() => handleClickLike(item._id)}
                    />
                  )}

                  {item.countLike}
                </SC.StyledLikeContainer>
              </SC.StyledModalQuestionItemContainer>
            );
          })}
      </InfiniteScroll>
    </div>
  );

  const contentModalRender = () => {
    if (askState) {
      return (
        <>
          <SC.StyledTitleModal
            style={{
              color: Color.blue400,
              cursor: "pointer",
              display: "inline",
            }}
            onClick={() => setAskState(false)}
          >
            Back
          </SC.StyledTitleModal>
          <SC.StyledModalQuestionContainer>
            <SC.StyledNoQuestion>Write your question here</SC.StyledNoQuestion>
            <TextArea
              style={{ width: "100%" }}
              maxLength={500}
              autoSize={{ minRows: 5, maxRows: 100 }}
              placeholder="Your question for presenter"
              value={question}
              showCount
              onChange={(e) => handleSetQuestion(e)}
            />
            <SC.StyledButtonModalQuestion
              onClick={() => handleClickSubmit()}
              disabled={disabledSubmit}
            >
              Submit
            </SC.StyledButtonModalQuestion>
          </SC.StyledModalQuestionContainer>
        </>
      );
    }
    return (
      <>
        <SC.StyledTitleModal>Questions from audience</SC.StyledTitleModal>
        <SC.StyledModalQuestionContainer>
          {data.filter((item) => item.isAnswered === false).length === 0 ? (
            <SC.StyledNoQuestion>
              Do you have a question for the presenter? Be the first one to ask!
            </SC.StyledNoQuestion>
          ) : (
            listRender
          )}
          <SC.StyledButtonModalQuestion onClick={() => setAskState(true)}>
            Ask
          </SC.StyledButtonModalQuestion>
        </SC.StyledModalQuestionContainer>
      </>
    );
  };
  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={600}
      centered
      title={
        <div
          style={{
            width: "100%",
            cursor: "move",
          }}
          onMouseOver={() => {
            if (disabledMove) {
              setDisabledMove(false);
            }
          }}
          onMouseOut={() => {
            setDisabledMove(true);
          }}
          // fix eslintjsx-a11y/mouse-events-have-key-events
          // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/mouse-events-have-key-events.md
          onFocus={() => {}}
          onBlur={() => {}}
          // end
        >
          Q&A
        </div>
      }
      modalRender={(modal) => (
        <Draggable
          disabled={disabledMove}
          bounds={bounds}
          onStart={(event, uiData) => onStart(event, uiData)}
        >
          <div ref={draggleRef}>{modal}</div>
        </Draggable>
      )}
    >
      {contentModalRender()}
    </Modal>
  );
}

export default ModalQuestionMember;
