import React, { useState, useContext, useEffect } from "react";
import { Typography } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import {
  CaretRightOutlined,
  ShareAltOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { TailSpin } from "react-loader-spinner";
import { useMutation } from "@tanstack/react-query";
import * as SC from "./StyledSlideComponent";
import SingleSlide from "./SingleSlide";
import SettingQuestionPage from "./SettingQuestionPage";
import backleft from "../../Assets/backleft.svg";
import AuthContext from "../../Context/AuthProvider";
import Check from "../../Assets/Check.svg";
import { BarChart } from "./BarChart";
import {
  viewPresentationInfoByPresentationID,
  updatePresentation,
} from "../../API/api";
import { showMessage } from "../Message";

const { Paragraph } = Typography;

function SlidePage() {
  const { id } = useParams();
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [presentation, setPresentation] = useState(null);
  const [slides, setSlides] = useState([]);
  const [selectedSlide, setSelectedSlide] = useState(null);
  const [chartQuestion, setChartQuestion] = useState("");
  const [editableStr, setEditableStr] = useState("This is an editable text.");
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        barThickness: 100,
      },
    ],
  });
  const updatePresentationMutation = useMutation(updatePresentation, {
    onError: (error) => {
      showMessage(2, error.message);
    },
  });
  const onChangePresentation = async () => {
    try {
      if (presentation) {
        await updatePresentationMutation.mutateAsync({
          presentation,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await viewPresentationInfoByPresentationID({
          presentationID: id,
        });
        setPresentation(response.data);
        setSlides(response.data.slides);
        setSelectedSlide(response.data.slides[response.data.currentSlide]);
        setEditableStr(response.data.title);
      } catch (error) {
        showMessage(2, error.message);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    setPresentation((prev) => ({ ...prev, slides }));
  }, [slides]);

  useEffect(() => {
    onChangePresentation();
  }, [presentation, selectedSlide]);

  useEffect(() => {
    setChartQuestion(selectedSlide?.question);
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
  }, [selectedSlide]);

  useEffect(() => {
    setPresentation((pre) => ({
      ...pre,
      title: editableStr,
    }));
    console.log(editableStr);
  }, [editableStr]);

  const handleSelectedSlide = (slide, indexSelect) => {
    setSelectedSlide(slide);
    setPresentation((pre) => ({
      ...pre,
      currentSlide: indexSelect,
    }));
  };
  const handleDeleteSlide = (index) => {
    const newSlide = slides.filter((slide) => slide.key !== index);
    if (index < selectedSlide.key) {
      setPresentation((pre) => ({
        ...pre,
        currentSlide: pre.currentSlide - 1,
      }));
    }
    for (let i = index; i < newSlide.length; i++) {
      newSlide[i].key -= 1;
    }
    if (selectedSlide.key === index) {
      setSelectedSlide(newSlide[0]);
      setPresentation((pre) => ({
        ...pre,
        currentSlide: 0,
      }));
    }
    setSlides(newSlide);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`${window.location.host}/presentation/${id}`);
    showMessage(1, "Link copied to clipboard");
  };

  const handlePlay = () => {
    console.log("play slide");
    setPresentation((pre) => ({
      ...pre,
      playSlide: pre.currentSlide,
    }));
  };

  const handleAddSlide = () => {
    const newSlide = {
      question: "",
      options: [{ option: "", optionKey: 0 }],
      key: slides.length,
      answers: [{ answerCount: 0, answerKey: 0 }],
    };
    setSlides([...slides, newSlide]);
  };

  const handleSetQuestion = (question) => {
    const newSlide = slides;
    newSlide[selectedSlide.key].question = question;
    setSelectedSlide((pre) => ({ ...pre, question }));
  };

  const handleOptionChange = (index, value) => {
    const newSlide = slides;
    newSlide[selectedSlide.key].options[index].option = value;
    setSelectedSlide((pre) => ({
      ...pre,
      options: newSlide[selectedSlide.key].options,
    }));
  };

  const handleOptionDelete = (index) => {
    const newSlide = slides;
    newSlide[selectedSlide.key].options.splice(index, 1);
    newSlide[selectedSlide.key].answers.splice(index, 1);

    for (let i = index; i < newSlide[selectedSlide.key].options.length; i++) {
      newSlide[selectedSlide.key].options[i].optionKey -= 1;
      newSlide[selectedSlide.key].answers[i].answerKey -= 1;
    }

    setSelectedSlide((pre) => ({
      ...pre,
      options: newSlide[selectedSlide.key].options,
      answers: newSlide[selectedSlide.key].answers,
    }));
  };

  const handleOptionAdd = () => {
    const newSlide = slides;
    newSlide[selectedSlide.key].options.push({
      option: "",
      optionKey: newSlide[selectedSlide.key].options.length,
    });
    newSlide[selectedSlide.key].answers.push({
      answerCount: 0,
      answerKey: newSlide[selectedSlide.key].answers.length,
    });
    setSelectedSlide((pre) => ({
      ...pre,
      options: newSlide[selectedSlide.key].options,
      answers: newSlide[selectedSlide.key].answers,
    }));
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
            <Paragraph
              style={{
                fontSize: "1rem",
                fontWeight: "bold",
                padding: "0px",
                fontFamily: "Sora",
                margin: "0px",
              }}
              editable={{ onChange: setEditableStr }}
            >
              {editableStr}
            </Paragraph>
            <SC.StyledTopLeftSubTitle>
              {auth.user.email}
            </SC.StyledTopLeftSubTitle>
          </SC.StyledTopLeftInformation>
        </SC.StyledTopSmallContainer>
        <SC.StyledTopSmallContainer>
          {updatePresentationMutation.isLoading ? (
            <TailSpin
              height="20"
              width="20"
              color="#196cff"
              ariaLabel="tail-spin-loading"
              radius="1"
              wrapperStyle={{ marginRight: "10px" }}
              wrapperClass=""
              visible
            />
          ) : (
            <img src={Check} alt="Check" />
          )}
          <SC.StyledTopRightSaving>
            {updatePresentationMutation.isLoading ? "Saving..." : "Saved"}
          </SC.StyledTopRightSaving>
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
              key={slide.key}
              question={slide.question}
              index={index}
              selected={selectedSlide?.key === index}
              onClick={(indexSelect) => handleSelectedSlide(slide, indexSelect)}
              onDelete={(deleteIndex) => handleDeleteSlide(deleteIndex)}
              isPlayed={presentation?.playSlide === index}
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
            question={selectedSlide?.question}
            onQuestionChange={handleSetQuestion}
            options={selectedSlide?.options}
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
