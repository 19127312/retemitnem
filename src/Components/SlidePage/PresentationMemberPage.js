import React, { useState, useEffect } from "react";
import { Radio } from "antd";
import { useParams } from "react-router-dom";
import * as SC from "./StyledSlideComponent";
import logo from "../../Assets/logo.png";
import { BarChart } from "./BarChart";

function PresentationMemberPage() {
  const { id } = useParams();
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
    console.log("id", id);
    const data = {
      title: "Presentation Title",
      currentSlide: 0,
      slides: [
        {
          questionType: "MCQ",
          question: "Hello",
          options: [
            {
              option: "Helo cc",
              optionKey: 0,
            },
            { option: "Helo cl", optionKey: 1 },
          ],
          key: 0,
          answers: [
            { answerCount: 2, answerKey: 0 },
            { answerCount: 21, answerKey: 1 },
          ],
        },
        { question: "There", options: [], key: 1 },
        { question: "You", options: [], key: 2 },
        { question: "Dump", options: [], key: 3 },
        { question: "Mortha", options: [], key: 4 },
        { question: "", options: [], key: 5 },
        { question: "He", options: [], key: 6 },
        { question: "Hi", options: [], key: 7 },
        { question: "Hu", options: [], key: 8 },
        { question: "Ha", options: [], key: 9 },
        { question: "Ho", options: [], key: 10 },
        { question: "Kaa", options: [], key: 11 },
      ],
    };
    setPresentation(data);
  }, []);

  useEffect(() => {
    const selectedSlide = presentation?.slides[presentation?.currentSlide];
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

  const onChange = (e) => {
    setValue(e.target.value);
    console.log(e.target.value);
  };
  const handleSubmit = () => {
    if (value !== null) {
      console.log(value);
      setIsSubmitted(true);
      setPresentation((prev) => ({
        ...prev,
        slides: prev.slides.map((slide) => {
          if (slide.key === prev.currentSlide) {
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
              presentation?.slides[presentation?.currentSlide].question
            }
          />
        </SC.StyledChartContainer>
      ) : (
        <SC.StyledRadioContainer>
          <SC.StyledQuestionPresentation>
            {presentation?.slides[presentation?.currentSlide].question}
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
            {presentation?.slides[presentation?.currentSlide].options.map(
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
