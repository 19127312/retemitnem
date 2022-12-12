import React, { useState, useEffect, useContext } from "react";
import { Modal } from "antd";
import {
  LikeTwoTone,
  UpCircleTwoTone,
  DownCircleTwoTone,
} from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import * as SC from "../StyledSlideComponent";
import {
  getQuestions,
  updateQuestion,
  deleteQuestions,
} from "../../../API/api";
import SocketContext from "../../../Context/SocketProvider";

function ModalQuestionHost({
  open,
  handleCancel,
  presentationID,
  setQANotification,
}) {
  const { socket } = useContext(SocketContext);

  const [selectedMode, setSelectedMode] = useState("Questions");
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [data, setData] = useState([]);
  const [showData, setShowData] = useState([]);
  useEffect(() => {
    socket.on("onReceiveQuestion", (receiveQuestion) => {
      setQANotification(true);
      setData((prev) => {
        if (prev.length === 0) {
          setSelectedQuestion(receiveQuestion);
        }
        return [receiveQuestion, ...prev];
      });
    });

    socket.on("onUpdateQuestion", (updateQuestionItem) => {
      console.log(updateQuestionItem);
      setData((prev) => {
        const newData = prev.map((item) => {
          if (item._id === updateQuestionItem._id) {
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
  useEffect(() => {
    const getInitQuestions = async () => {
      const { questions } = await getQuestions({
        presentationID,
      });
      const numberNotAnswered = questions.filter(
        (item) => !item.isAnswered
      ).length;

      if (numberNotAnswered > 0) {
        setSelectedQuestion(questions[0]);
      }
      setData(questions);
      setShowData(questions.filter((item) => !item.isAnswered));
    };
    getInitQuestions();
  }, [presentationID]);

  useEffect(() => {
    if (selectedMode === "Questions") {
      setShowData(data.filter((item) => !item.isAnswered));
    } else {
      setShowData(data.filter((item) => item.isAnswered));
    }
  }, [selectedMode, data]);

  const updateQuestionMutation = useMutation(updateQuestion, {
    onSuccess: (updateQuestionItem) => {
      socket.emit("updateQuestion", {
        _id: `${presentationID}`,
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
  const deleteQuestionsMutation = useMutation(deleteQuestions, {
    onSuccess: () => {
      setData((prev) => {
        const newData = prev.filter((item) => !item.isAnswered);
        return newData;
      });
    },
  });

  const onDeleteQuestions = async () => {
    try {
      const arrayQuestionsIDs = [];
      for (let i = 0; i < showData.length; i++) {
        arrayQuestionsIDs.push(showData[i]._id);
      }
      await deleteQuestionsMutation.mutateAsync({
        questionsIDs: arrayQuestionsIDs,
      });
    } catch (error) {
      console.log(error);
    }
  };
  const handleClickItem = (item) => {
    setSelectedQuestion(item);
  };
  const handleMarkAsAnswered = (item) => {
    setData((prev) => {
      const index = prev.findIndex((i) => i._id === item._id);
      const newData = [...prev];
      newData[index].isAnswered = !newData[index].isAnswered;
      onUpdateQuestions({ question: newData[index] });
      return newData;
    });
  };
  const handleUp = () => {
    const index = showData.findIndex(
      (item) => item._id === selectedQuestion._id
    );
    console.log("index", index);

    if (index === 0) return;
    if (index === -1) {
      setSelectedQuestion(showData[0]);
      return;
    }
    setSelectedQuestion(showData[index - 1]);
  };
  const handleDown = () => {
    const index = showData.findIndex(
      (item) => item._id === selectedQuestion._id
    );
    console.log("index", index);
    if (index === showData.length - 1) return;
    if (index === -1) {
      setSelectedQuestion(showData[0]);
      return;
    }
    setSelectedQuestion(showData[index + 1]);
  };

  const listQuestionRender = () => {
    if (showData.length === 0)
      return (
        <SC.StyledQuestionTitle style={{ marginTop: "10px" }}>
          {selectedMode === "Questions"
            ? "No questions from the audience"
            : "No answered question"}
        </SC.StyledQuestionTitle>
      );
    return showData.map((item) => {
      return (
        <SC.StyledQuestionItem
          onClick={() => handleClickItem(item)}
          key={item._id}
        >
          <SC.StyledQuestionItemContent>
            <SC.StyledQuestionTitle
              onClick={(e) => {
                e.stopPropagation();
                handleClickItem(item);
              }}
              isSelected={selectedQuestion._id === item._id}
            >
              {item.content}
            </SC.StyledQuestionTitle>
            <SC.StyledQuestionSubTitle
              onClick={(e) => {
                e.stopPropagation();
                handleMarkAsAnswered(item);
              }}
            >
              {selectedMode === "Questions"
                ? "Mark as Answered"
                : "Restore Question"}
            </SC.StyledQuestionSubTitle>
          </SC.StyledQuestionItemContent>
          <SC.StyledLikeContainer>
            <LikeTwoTone style={{ fontSize: "18px" }} />
            {item.countLike}
          </SC.StyledLikeContainer>
        </SC.StyledQuestionItem>
      );
    });
  };
  const mainQuestionRender = () => {
    return (
      <>
        <SC.StyledNavigationContainer>
          <UpCircleTwoTone
            style={{ fontSize: "35px", cursor: "pointer" }}
            onClick={() => handleUp()}
          />
        </SC.StyledNavigationContainer>
        <SC.StyledMainQuestionContainer>
          {selectedQuestion && (
            <>
              <SC.StyledMainQuestion>
                {selectedQuestion.content}
              </SC.StyledMainQuestion>
              <SC.StyledLikeModifyContainer>
                <SC.StyledLikeNumber>
                  {selectedQuestion.countLike}
                </SC.StyledLikeNumber>
                <LikeTwoTone style={{ fontSize: "35px" }} />
              </SC.StyledLikeModifyContainer>
              {selectedQuestion.isAnswered ? (
                <SC.StyledAnswerButton>Answered</SC.StyledAnswerButton>
              ) : (
                <SC.StyledAlreadyAnswer
                  onClick={() => handleMarkAsAnswered(selectedQuestion)}
                >
                  Press to mark as answered
                </SC.StyledAlreadyAnswer>
              )}
            </>
          )}
        </SC.StyledMainQuestionContainer>
        <SC.StyledNavigationContainer>
          <DownCircleTwoTone
            style={{ fontSize: "35px", cursor: "pointer" }}
            onClick={() => handleDown()}
          />
        </SC.StyledNavigationContainer>
      </>
    );
  };
  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      footer={null}
      centered
      width={1200}
      title={
        <div
          style={{
            width: "100%",
          }}
        >
          Q&A
        </div>
      }
    >
      <SC.StyledQuestionContainer>
        <SC.StyledLeftQuestionContainer>
          <SC.StyledLeftTopQuestionContainer>
            {showData.length !== 0 && selectedMode === "Answered" && (
              <SC.StyledDeleteContainer onClick={() => onDeleteQuestions()}>
                Delete All
              </SC.StyledDeleteContainer>
            )}
            {listQuestionRender()}
          </SC.StyledLeftTopQuestionContainer>
          <SC.StyledLeftBottomQuestionContainer>
            <SC.StyledBottomItem
              isSelected={selectedMode === "Questions"}
              onClick={() => setSelectedMode("Questions")}
            >
              Questions
            </SC.StyledBottomItem>
            <SC.StyledBottomItem
              isSelected={selectedMode === "Answered"}
              onClick={() => setSelectedMode("Answered")}
            >
              Answered
            </SC.StyledBottomItem>
          </SC.StyledLeftBottomQuestionContainer>
        </SC.StyledLeftQuestionContainer>
        <SC.StyledRightQuestionContainer>
          {data.length === 0 ? (
            <SC.StyledMainQuestion> No question</SC.StyledMainQuestion>
          ) : (
            mainQuestionRender()
          )}
        </SC.StyledRightQuestionContainer>
      </SC.StyledQuestionContainer>
    </Modal>
  );
}

export default ModalQuestionHost;
