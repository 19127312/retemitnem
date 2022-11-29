import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CaretRightOutlined,
  ShareAltOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import * as SC from "./StyledSlideComponent";
import SingleSlide from "./SingleSlide";
import SettingQuestionPage from "./SettingQuestionPage";
import backleft from "../../Assets/backleft.svg";
import AuthContext from "../../Context/AuthProvider";
import Check from "../../Assets/Check.svg";
import { BarChart } from "./BarChart";

function SlidePage() {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [slides, setSlides] = useState([
    {
      question: "Hello",
      options: [
        { option: "Helo cc", optionKey: 0 },
        { option: "Helo cl", optionKey: 1 },
      ],
      key: 0,
      answers: [
        { answerCount: 22, answerKey: 0 },
        { answerCount: 211, answerKey: 1 },
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
  ]);
  const [selectedSlide, setSelectedSlide] = useState(slides[0]);
  const [chartQuestion, setChartQuestion] = useState("");
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
    setChartQuestion(selectedSlide.question);
    if (selectedSlide.options.length > 0) {
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
  }, [selectedSlide]);

  const handleDelete = (index) => {
    const newSlide = slides.filter((slide) => slide.key !== index);
    for (let i = index; i < newSlide.length; i++) {
      newSlide[i].key -= 1;
    }
    if (selectedSlide.key === index) {
      setSelectedSlide(newSlide[0]);
    }
    setSlides(newSlide);
    setChartData();
  };
  const handleShare = () => {
    console.log("share slide");
  };
  const handlePlay = () => {
    console.log("play slide");
  };
  const handleAddSlide = () => {
    console.log("add slide");
  };
  const handleSetQuestion = (question) => {
    const newSlide = slides;
    newSlide[selectedSlide.key].question = question;
    setSelectedSlide((pre) => ({ ...pre, question }));
    setSlides(newSlide);
  };
  const handleOptionChange = (index, value) => {
    const newSlide = slides;
    newSlide[selectedSlide.key].options[index].option = value;
    setSelectedSlide((pre) => ({
      ...pre,
      options: newSlide[selectedSlide.key].options,
    }));
    setSlides(newSlide);
  };
  const handleOptionDelete = (index) => {
    const newSlide = slides;
    newSlide[selectedSlide.key].options.splice(index, 1);
    for (let i = index; i < newSlide[selectedSlide.key].options.length; i++) {
      newSlide[selectedSlide.key].options[i].optionKey -= 1;
    }
    setSelectedSlide((pre) => ({
      ...pre,
      options: newSlide[selectedSlide.key].options,
    }));
    setSlides(newSlide);
  };
  const handleOptionAdd = () => {
    const newSlide = slides;
    newSlide[selectedSlide.key].options.push({
      option: "",
      optionKey: newSlide[selectedSlide.key].options.length,
    });
    setSelectedSlide((pre) => ({
      ...pre,
      options: newSlide[selectedSlide.key].options,
    }));
    setSlides(newSlide);
  };
  return (
    <SC.StyledPageContainer>
      <SC.StyledTopContainer>
        <SC.StyledTopSmallContainer>
          <SC.StyledTopLeftImage
            src={backleft}
            alt="Back"
            onClick={() => {
              navigate(-1);
            }}
          />
          <SC.StyledTopLeftInformation>
            <SC.StyledTopLeftTitle>Slide ABCD</SC.StyledTopLeftTitle>
            <SC.StyledTopLeftSubTitle>
              {auth.user.email}
            </SC.StyledTopLeftSubTitle>
          </SC.StyledTopLeftInformation>
        </SC.StyledTopSmallContainer>
        <SC.StyledTopSmallContainer>
          <img src={Check} alt="Check" />
          <SC.StyledTopRightSaving>Saved</SC.StyledTopRightSaving>
          <SC.StyledButton
            icon={<ShareAltOutlined />}
            size="large"
            onClick={handleShare}
          >
            Share
          </SC.StyledButton>
          <SC.StyledButton
            type="primary"
            icon={<CaretRightOutlined />}
            size="large"
            style={{ marginRight: "30px" }}
            onClick={handlePlay}
          >
            Present
          </SC.StyledButton>
        </SC.StyledTopSmallContainer>
      </SC.StyledTopContainer>
      <SC.StyledTopContainer>
        <SC.StyledButton
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={handleAddSlide}
        >
          New Slide
        </SC.StyledButton>
      </SC.StyledTopContainer>
      <SC.StyledBodyContainer>
        <SC.StyledLeftContainer>
          {slides.map((slide, index) => (
            <SingleSlide
              question={slide.question}
              index={index}
              selected={selectedSlide.key === index}
              onClick={() => setSelectedSlide(slide)}
              onDelete={(deleteIndex) => handleDelete(deleteIndex)}
            />
          ))}
        </SC.StyledLeftContainer>
        <SC.StyledMidContainer>
          <SC.StyledPrensatationTitle>
            <BarChart chartData={chartData} chartQuestion={chartQuestion} />
          </SC.StyledPrensatationTitle>
        </SC.StyledMidContainer>
        <SC.StyledRightContainer>
          <SettingQuestionPage
            question={selectedSlide.question}
            onQuestionChange={handleSetQuestion}
            options={selectedSlide.options}
            onOptionChange={(index, option) =>
              handleOptionChange(index, option)
            }
            onOptionDelete={(index) => handleOptionDelete(index)}
            onOptionAdd={handleOptionAdd}
          />
        </SC.StyledRightContainer>
      </SC.StyledBodyContainer>
    </SC.StyledPageContainer>
  );
}

export default SlidePage;
