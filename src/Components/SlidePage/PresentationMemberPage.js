import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import * as SC from "./StyledSlideComponent";
import logo from "../../Assets/logo.png";

function PresentationMemberPage() {
  const { id } = useParams();
  const [presentation, setPresentation] = useState(null);
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
            { option: "Helo cc", optionKey: 0 },
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
  return (
    <SC.StyledPresentaionContainer>
      <SC.StyledLogoContainer>
        <img src={logo} alt="logo" />
        <SC.StyledLogoName>Retemitnem</SC.StyledLogoName>
      </SC.StyledLogoContainer>
      <SC.StyledQuestionPresentation>
        {presentation?.slides[presentation?.currentSlide].question}
      </SC.StyledQuestionPresentation>
    </SC.StyledPresentaionContainer>
  );
}

export default PresentationMemberPage;
