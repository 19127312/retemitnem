import api from "./api";

const PATH = {
  GET_QUESTIONS: "/question",
  UPDATE_QUESTION: "/question/update",
  DELETE_QUESTION: "/question/delete",
};
export const getQuestions = async ({ presentationID }) => {
  try {
    const response = await api.get(`${PATH.GET_QUESTIONS}/${presentationID}`);
    return response.data;
  } catch (error) {
    throw Error(error.response.data);
  }
};

export const sendQuestion = async ({ presentationID, content }) => {
  try {
    const response = await api.post(PATH.GET_QUESTIONS, {
      presentationID,
      content,
    });
    return response.data;
  } catch (error) {
    throw Error(error.response.data);
  }
};

export const updateQuestion = async ({ question }) => {
  try {
    const response = await api.post(PATH.UPDATE_QUESTION, { question });
    return response.data;
  } catch (error) {
    throw Error(error.response.data);
  }
};

export const deleteQuestions = async ({ questionsIDs }) => {
  try {
    const response = await api.post(PATH.DELETE_QUESTION, {
      questionsIDs,
    });
    return response;
  } catch (error) {
    throw Error(error.response.data);
  }
};
