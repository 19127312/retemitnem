import React, { useState, useContext, useEffect } from "react";
import { Radio } from "antd";
// import { useMutation } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import * as SC from "./StyledSlideComponent";
import logo from "../../Assets/logo.png";
import { BarChart } from "./BarChart";
import SocketContext from "../../Context/SocketProvider";
import {
  viewPresentationInfoByPresentationID,
  // updatePresentation,
} from "../../API/api";
import { showMessage } from "../Message";

function PresentationMemberPage() {
  const { id } = useParams();
  const { socket } = useContext(SocketContext);
  const [presentation, setPresentation] = useState(null);
  const [value, setValue] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isNoQuestion, setIsNoQuestion] = useState(false);
  const [isNoOptions, setIsNoOptions] = useState(false);
  const [isError, setIsError] = useState(false);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        barThickness: 100,
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await viewPresentationInfoByPresentationID({
          presentationID: id,
        });
        if (response) {
          setPresentation(response.data);
          socket.emit("join_presentation", id);
          console.log("co");
        } else {
          console.log("khong");
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
      setPresentation(data);
    });
    return () => {
      socket.off("onSubmitResult");
      socket.off("onUpdatePresentation");
    };
  }, []);

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
    }
  };
  return (
    <SC.StyledPresentaionContainer>
      <SC.StyledLogoContainer>
        <img src={logo} alt="logo" />
        <SC.StyledLogoName>Retemitnem</SC.StyledLogoName>
      </SC.StyledLogoContainer>

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
          <SC.StyledSubmitButton disabled onClick={handleSubmit}>
            Submit
          </SC.StyledSubmitButton>
        ) : isSubmitted ? (
          <SC.StyledChartContainer>
            <BarChart
              chartData={chartData}
              chartQuestion={
                presentation?.slides[presentation?.playSlide].question
              }
              index
            />
          </SC.StyledChartContainer>
        ) : (
          <SC.StyledSubmitButton onClick={handleSubmit} disabled={isError}>
            Submit
          </SC.StyledSubmitButton>
        )}
      </SC.StyledRadioContainer>
    </SC.StyledPresentaionContainer>
  );
}

export default PresentationMemberPage;
