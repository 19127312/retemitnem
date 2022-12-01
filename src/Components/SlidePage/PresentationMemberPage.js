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
        setPresentation(response.data);
      } catch (error) {
        showMessage(2, error.message);
      }
    };
    fetchData();
    socket.emit("join_presentation", id);
  }, [id]);

  useEffect(() => {
    const selectedSlide = presentation?.slides[presentation?.playSlide];
    if (selectedSlide?.options.length > 0) {
      setChartData({
        labels: selectedSlide.options.map((option) => option.option),
        datasets: [
          {
            data: selectedSlide.answers.map((answer) => answer.answerCount),
            barThickness: 100,
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
  }, [presentation]);
  // const updatePresentationMutation = useMutation(updatePresentation, {
  //   onError: (error) => {
  //     showMessage(2, error.message);
  //   },
  //   onSuccess: () => {
  //     showMessage(1, "Submit Success");
  //     socket.emit("submit_result", presentation); // Gửi lên server để cập nhật lại slide
  //   },
  // });
  // const onChangePresentation = async () => {
  //   try {
  //     if (presentation) {
  //       await updatePresentationMutation.mutateAsync({
  //         presentation,
  //       });
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
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

    return () => {
      socket.off("onSubmitResult");
    };
  }, []);
  const onChange = (e) => {
    setValue(e.target.value);
    console.log(e.target.value);
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
      {isSubmitted ? (
        <SC.StyledChartContainer>
          <BarChart
            chartData={chartData}
            chartQuestion={
              presentation?.slides[presentation?.playSlide].question
            }
          />
        </SC.StyledChartContainer>
      ) : (
        <SC.StyledRadioContainer>
          <SC.StyledQuestionPresentation>
            {presentation?.slides[presentation?.playSlide].question}
          </SC.StyledQuestionPresentation>
          <Radio.Group
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
          <SC.StyledSubmitButton onClick={handleSubmit}>
            Submit
          </SC.StyledSubmitButton>
        </SC.StyledRadioContainer>
      )}
    </SC.StyledPresentaionContainer>
  );
}

export default PresentationMemberPage;
