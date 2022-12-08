import React, { useState, useContext, useEffect } from "react";
import { Typography } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import {
  CaretRightOutlined,
  ShareAltOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  LeftOutlined,
  RightOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import { TailSpin } from "react-loader-spinner";
import { useMutation } from "@tanstack/react-query";
// import { FullScreen, useFullScreenHandle } from "react-full-screen";
import * as SC from "./StyledSlideComponent";
import SingleSlide from "./SingleSlide";
import SettingQuestionPage from "./SettingQuestionPage";
import backleft from "../../Assets/backleft.svg";
import AuthContext from "../../Context/AuthProvider";
import SocketContext from "../../Context/SocketProvider";
import Check from "../../Assets/Check.svg";
import { BarChart } from "./BarChart";
import {
  viewPresentationInfoByPresentationID,
  updatePresentation,
} from "../../API/api";
import { showMessage } from "../Message";
import ChatContainer from "./ChatContainer";
import ModalShare from "./ModalShare";
import ModalQuestionHost from "./ModalQuestionHost";

const { Paragraph } = Typography;

function SlidePage() {
  const { id } = useParams();
  const { auth } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const navigate = useNavigate();
  const [presentation, setPresentation] = useState(null);
  const [slides, setSlides] = useState([]);
  const [selectedSlide, setSelectedSlide] = useState(null);
  const [chartQuestion, setChartQuestion] = useState("");
  const [editableStr, setEditableStr] = useState("This is an editable text.");
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [openShare, setOpenShare] = useState(false);
  const [openQuestion, setOpenQuestion] = useState(false);
  const [guideText, setGuideText] = useState(null);
  const [qaNotification, setQANotification] = useState(false);
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
    onSuccess: () => {
      socket.emit("updatePresentation", presentation);
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
  // const handle = useFullScreenHandle();
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
        setGuideText(response.data.isPrivate);
      } catch (error) {
        showMessage(2, error.message);
      }
    };
    fetchData();
    socket.emit("join_presentation", id);
  }, [id]);

  useEffect(() => {
    socket.on("onSubmitResult", (data) => {
      setPresentation((prev) => ({
        ...prev,
        slides: data.slides,
      }));
      setSlides(data.slides);
      setSelectedSlide(data.slides[data.currentSlide]);
    });

    return () => {
      socket.off("onSubmitResult");
    };
  }, []);
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
  }, [selectedSlide]);

  useEffect(() => {
    setPresentation((pre) => ({
      ...pre,
      title: editableStr,
    }));
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
    setOpenShare(true);
  };

  const handlePlay = () => {
    setPresentation((pre) => ({
      ...pre,
      playSlide: pre.currentSlide,
    }));
    // handle.enter();
    setIsFullScreen(true);
  };

  const handleLeft = () => {
    if (presentation.playSlide <= 0) {
      showMessage(1, "You are in the first slide");
    } else {
      setPresentation((pre) => ({
        ...pre,
        playSlide: pre.playSlide - 1,
        currentSlide: pre.playSlide - 1,
      }));
      setSelectedSlide(presentation.slides[presentation.playSlide - 1]);
    }
  };
  const handleRight = () => {
    if (presentation.playSlide >= presentation.slides.length - 1) {
      showMessage(1, "You have reached the end of the presentation");
    } else {
      setPresentation((pre) => ({
        ...pre,
        playSlide: pre.playSlide + 1,
        currentSlide: pre.playSlide + 1,
      }));
      setSelectedSlide(presentation.slides[presentation.playSlide + 1]);
    }
  };

  const handleAddSlide = () => {
    const newSlide = {
      questionType: "Multiple Choice",
      question: "",
      options: [{ option: "", optionKey: 0 }],
      key: slides.length,
      answers: [{ answerCount: 0, answerKey: 0 }],
      subHeading: "",
      image: "",
    };
    setSlides([...slides, newSlide]);
  };

  const handleSetQuestion = (question) => {
    const newSlide = slides;
    newSlide[selectedSlide.key].question = question;
    setSelectedSlide((pre) => ({ ...pre, question }));
  };

  const handleSetSubheading = (subHeading) => {
    const newSlide = slides;
    newSlide[selectedSlide.key].subHeading = subHeading;
    setSelectedSlide((pre) => ({ ...pre, subHeading }));
  };

  const handleSetImage = (image) => {
    const newSlide = slides;
    newSlide[selectedSlide.key].image = image;
    setSelectedSlide((pre) => ({ ...pre, image }));
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

  const handleResetResult = () => {
    const newSlide = slides;
    newSlide[selectedSlide.key].answers = newSlide[
      selectedSlide.key
    ].options.map((option) => ({
      answerCount: 0,
      answerKey: option.optionKey,
    }));
    setSelectedSlide((pre) => ({
      ...pre,
      answers: newSlide[selectedSlide.key].answers,
    }));
  };
  const handleSetSlideType = (type) => {
    const newSlide = slides;
    newSlide[selectedSlide.key].questionType = type;
    setSelectedSlide((pre) => ({
      ...pre,
      questionType: type,
    }));
  };

  const presentationRender = (slideType) => {
    if (slideType === "Multiple Choice") {
      return (
        <BarChart
          chartData={chartData}
          chartQuestion={chartQuestion}
          index={false}
          fullWidth
        />
      );
    }
    if (slideType === "Heading") {
      return (
        <SC.StyledHeadingSlidePageContainer>
          <SC.StyledHeadingSlidePage>
            {selectedSlide.question}
          </SC.StyledHeadingSlidePage>
          <div>{selectedSlide.subHeading}</div>
          {selectedSlide.image ? (
            <img src={selectedSlide.image} alt="" height={300} width={300} />
          ) : null}
        </SC.StyledHeadingSlidePageContainer>
      );
    }
    if (slideType === "Paragraph") {
      return <>Paragraph</>;
    }
    return null;
  };

  const handleChange = (value) => {
    if (value === "private") {
      setPresentation((prev) => ({
        ...prev,
        isPrivate: true,
      }));
      setGuideText(true);
    } else {
      setPresentation((prev) => ({
        ...prev,
        isPrivate: false,
      }));
      setGuideText(false);
    }
  };

  const middleRender = () => {
    return (
      <SC.StyledMidContainer>
        <ModalShare
          id={id}
          presentation={presentation}
          open={openShare}
          guideText={guideText}
          handleCancel={() => setOpenShare(false)}
          handleChange={handleChange}
        />
        <ModalQuestionHost
          open={openQuestion}
          handleCancel={() => setOpenQuestion(false)}
          presentationID={id}
          setQANotification={setQANotification}
        />
        <SC.StyledPrensatationContainer>
          {selectedSlide && presentationRender(selectedSlide.questionType)}
          <SC.StyledLeftRightContainer>
            <LeftOutlined
              onClick={() => {
                handleLeft();
              }}
            />
            <RightOutlined
              onClick={() => {
                handleRight();
              }}
            />
          </SC.StyledLeftRightContainer>
          <SC.StyledBottomChatContainer show="Host">
            <SC.StyledChatIconContainer
              onClick={() => setQANotification(false)}
            >
              <QuestionCircleOutlined
                style={{ fontSize: "25px", cursor: "pointer" }}
                onClick={() => setOpenQuestion(true)}
              />
              {qaNotification && (
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
            <ChatContainer presentationID={id} chatSide="Host" />
          </SC.StyledBottomChatContainer>
        </SC.StyledPrensatationContainer>
      </SC.StyledMidContainer>
    );
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
          style={{ marginLeft: "27px" }}
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

        {/* <FullScreen handle={handle}> */}

        {isFullScreen ? (
          <SC.StyledFullScreenContainer>
            {middleRender()}
          </SC.StyledFullScreenContainer>
        ) : (
          <>{middleRender()}</>
        )}

        {/* </FullScreen> */}

        <SC.StyledRightContainer>
          {selectedSlide && (
            <SettingQuestionPage
              slideType={selectedSlide?.questionType}
              question={selectedSlide?.question}
              onQuestionChange={handleSetQuestion}
              options={selectedSlide?.options}
              subHeading={selectedSlide?.subHeading}
              onSubheadingChange={handleSetSubheading}
              onImageChange={handleSetImage}
              image={selectedSlide?.image}
              onOptionChange={(index, option) =>
                handleOptionChange(index, option)
              }
              onOptionDelete={(index) => handleOptionDelete(index)}
              onOptionAdd={handleOptionAdd}
              onResetResult={handleResetResult}
              onChangeSlideType={(type) => handleSetSlideType(type)}
            />
          )}
        </SC.StyledRightContainer>
      </SC.StyledBodyContainer>
    </SC.StyledPageContainer>
  );
}

export default SlidePage;
