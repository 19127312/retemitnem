import React, { useState, useContext, useEffect, useRef } from "react";
import { Radio } from "antd";
// import { useMutation } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { QuestionCircleOutlined } from "@ant-design/icons";
import * as SC from "./StyledSlideComponent";
import logo from "../../Assets/logo.png";
import { BarChart } from "./BarChart";
import SocketContext from "../../Context/SocketProvider";
import {
  checkMemberInGroup,
  viewPresentationInfoByPresentationID,
  // updatePresentation,
} from "../../API/api";
import { showMessage } from "../Message";
import AuthContext from "../../Context/AuthProvider";
import ChatContainer from "./ChatContainer";
import ModalQuestionMember from "./ModalQuestionMember";

function PresentationMemberPage() {
  const { id } = useParams();
  const { socket } = useContext(SocketContext);
  const [presentation, setPresentation] = useState(null);
  const [value, setValue] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isNoQuestion, setIsNoQuestion] = useState(false);
  const [isNoOptions, setIsNoOptions] = useState(false);
  const [isError, setIsError] = useState(false);
  const [openQuestion, setOpenQuestion] = useState(false);
  const playSlideRef = useRef(null);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        barThickness: 100,
      },
    ],
  });
  const [isVisible, setIsVisible] = useState(true);
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await viewPresentationInfoByPresentationID({
          presentationID: id,
        });
        if (response) {
          setPresentation(response.data);
          playSlideRef.current = response.data.playSlide;
          socket.emit("join_presentation", id);
          console.log("SET PLAYSIDE", response.data.playSlide);
        }
      } catch (error) {
        showMessage(2, error.message);
        setIsError(true);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    const selectedSlide = presentation?.slides[presentation?.playSlide];
    if (selectedSlide?.options.length > 0) {
      setChartData({
        labels: selectedSlide.options.map((option) => option.option),
        datasets: [
          {
            data: selectedSlide.answers.map((answer) => answer.answerCount),
            backgroundColor: selectedSlide.answers.map((answer) =>
              answer.answerKey === value ? "red" : "#9BD0F5"
            ),
            barThickness:
              selectedSlide.options.length < 7
                ? 100
                : 300 / selectedSlide.options.length,
          },
        ],
      });
    } else {
      setChartData({
        labels: [],
        datasets: [
          {
            data: [],
            barThickness: 100,
          },
        ],
      });
    }

    if (presentation?.slides[presentation?.playSlide].question === "") {
      setIsNoQuestion(true);
    }
    let countFlag = 0;
    for (
      let i = 0;
      i < presentation?.slides[presentation?.playSlide].options.length;
      i++
    ) {
      if (
        presentation?.slides[presentation?.playSlide].options[i].option === ""
      ) {
        countFlag++;
      }
    }
    setIsNoOptions(false);
    if (
      countFlag === presentation?.slides[presentation?.playSlide].options.length
    ) {
      setIsNoOptions(true);
    }
  }, [presentation]);

  useEffect(() => {
    // onChangePresentation();
    if (presentation) {
      socket.emit("submit_result", presentation); // Gửi lên server để cập nhật lại slide
    }
  }, [isSubmitted]);

  useEffect(() => {
    socket.on("onSubmitResult", (data) => {
      setPresentation((prev) => ({
        ...prev,
        slides: data.slides,
      }));
    });

    socket.on("onUpdatePresentation", (data) => {
      if (data.playSlide !== playSlideRef.current) {
        playSlideRef.current = data.playSlide;
        setValue(null);
        setIsSubmitted(false);
      }
      setPresentation(data);
    });
    return () => {
      socket.off("onSubmitResult");
      socket.off("onUpdatePresentation");
    };
  }, []);

  useEffect(() => {
    const checkMemberExistInGroup = async () => {
      try {
        const response = await checkMemberInGroup({
          groupID: presentation.groupID,
          memberID: auth.user._id,
        });
        if (response.data.includes("not")) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
      } catch (error) {
        console.error(error.message);
      }
    };
    if (presentation) {
      if (auth.user === null) {
        if (presentation.isPrivate === true) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
      } else {
        checkMemberExistInGroup();
      }
    }
  }, [presentation]);

  const onChange = (e) => {
    setValue(e.target.value);
  };

  const handleSubmit = () => {
    if (value !== null) {
      setIsSubmitted(true);
      setPresentation((prev) => ({
        ...prev,
        slides: prev.slides.map((slide) => {
          if (slide.key === prev.playSlide) {
            return {
              ...slide,
              answers: slide.answers.map((answer) => {
                if (answer.answerKey === value) {
                  return { ...answer, answerCount: answer.answerCount + 1 };
                }
                return answer;
              }),
            };
          }
          return slide;
        }),
      }));
      setPresentation((prev) => {
        return prev;
      });
    }
  };
  const renderPage = (slideType) => {
    if (!isVisible) {
      return (
        <SC.StyledQuestionPresentation>
          This is a private presentation
        </SC.StyledQuestionPresentation>
      );
    }
    if (isVisible && slideType === "Multiple Choice") {
      return (
        <SC.StyledRadioContainer>
          {isNoQuestion ? (
            <SC.StyledQuestionPresentation>
              No question title
            </SC.StyledQuestionPresentation>
          ) : (
            <SC.StyledQuestionPresentation>
              {presentation?.slides[presentation?.playSlide].question}
            </SC.StyledQuestionPresentation>
          )}
          {isNoOptions ? (
            <SC.StyledQuestionPresentation>
              No options available
            </SC.StyledQuestionPresentation>
          ) : (
            <Radio.Group
              disabled={isSubmitted}
              onChange={onChange}
              value={value}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                width: "100%",
              }}
            >
              {presentation?.slides[presentation?.playSlide].options.map(
                (option) => (
                  <Radio
                    key={option.optionKey}
                    value={option.optionKey}
                    style={SC.radioStyled}
                  >
                    {option.option}
                  </Radio>
                )
              )}
            </Radio.Group>
          )}
          {/* eslint-disable-next-line */}
          {isNoOptions || isNoQuestion ? (
            <SC.StyledSubmitButton disabled onClick={() => handleSubmit()}>
              Submit
            </SC.StyledSubmitButton>
          ) : isSubmitted ? (
            <BarChart
              chartData={chartData}
              chartQuestion={
                presentation?.slides[presentation?.playSlide].question
              }
              index
              fullWidth={false}
            />
          ) : (
            <SC.StyledSubmitButton
              onClick={() => handleSubmit()}
              disabled={isError}
            >
              Submit
            </SC.StyledSubmitButton>
          )}
        </SC.StyledRadioContainer>
      );
    }
    if (isVisible && slideType === "Heading") {
      return (
        <SC.StyledRadioContainer>
          {isNoQuestion ? (
            <SC.StyledQuestionPresentation>
              No question title
            </SC.StyledQuestionPresentation>
          ) : (
            <>
              {presentation?.slides[presentation?.playSlide].image ? (
                <img
                  src={presentation?.slides[presentation?.playSlide].image}
                  alt="img"
                  style={{ width: "550px", height: "400px", marginTop: "10px" }}
                />
              ) : null}
              <SC.StyledQuestionMemberPresentation>
                {presentation?.slides[presentation?.playSlide].question}
              </SC.StyledQuestionMemberPresentation>
              <SC.StyledParagraphSlidePage style={{ color: "gray" }}>
                {presentation?.slides[presentation?.playSlide].subHeading}
              </SC.StyledParagraphSlidePage>
            </>
          )}
        </SC.StyledRadioContainer>
      );
    }
    if (isVisible && slideType === "Paragraph") {
      return (
        <SC.StyledRadioContainer>
          {isNoQuestion ? (
            <SC.StyledQuestionPresentation>
              No question title
            </SC.StyledQuestionPresentation>
          ) : (
            <>
              {presentation?.slides[presentation?.playSlide].image ? (
                <img
                  src={presentation?.slides[presentation?.playSlide].image}
                  alt="img"
                  style={{
                    width: "550px",
                    height: "400px",
                    marginTop: "10px",
                  }}
                />
              ) : null}
              <SC.StyledQuestionMemberPresentation>
                {presentation?.slides[presentation?.playSlide].question}
              </SC.StyledQuestionMemberPresentation>
              <SC.StyledParagraphSlidePage style={{ color: "gray" }}>
                {presentation?.slides[presentation?.playSlide].subHeading}
              </SC.StyledParagraphSlidePage>
            </>
          )}
        </SC.StyledRadioContainer>
      );
    }
    return null;
  };
  return (
    <SC.StyledPresentaionContainer>
      <ModalQuestionMember
        open={openQuestion}
        handleCancel={() => setOpenQuestion(false)}
        presentationID={id}
      />
      <SC.StyledLogoContainer>
        <img src={logo} alt="logo" />
        <SC.StyledLogoName>Retemitnem</SC.StyledLogoName>
      </SC.StyledLogoContainer>
      {presentation &&
        renderPage(presentation.slides[presentation.playSlide].questionType)}
      <SC.StyledBottomChatContainer show="Member">
        <QuestionCircleOutlined
          style={{ fontSize: "25px", cursor: "pointer" }}
          onClick={() => setOpenQuestion(true)}
        />
        <ChatContainer presentationID={id} chatSide="Member" />
      </SC.StyledBottomChatContainer>
    </SC.StyledPresentaionContainer>
  );
}

export default PresentationMemberPage;
