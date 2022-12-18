import api from "./api";

const PATH = {
  INIT_CHAT: "/chat",
  MORE_CHAT: "/chat/more",
};

export const getChatHistoryInit = async ({ presentationID }) => {
  try {
    const response = await api.get(`${PATH.INIT_CHAT}/${presentationID}`);
    return response.data;
  } catch (error) {
    throw Error(error.response.data);
  }
};

export const getMoreChat = async ({ presentationID, lastChatID }) => {
  try {
    const response = await api.post(PATH.MORE_CHAT, {
      presentationID,
      lastChatID,
    });
    return response.data;
  } catch (error) {
    throw Error(error.response.data);
  }
};

export const sendChat = async ({ presentationID, isSender, content }) => {
  try {
    const response = await api.post(PATH.INIT_CHAT, {
      presentationID,
      isSender,
      content,
    });
    return response.data;
  } catch (error) {
    throw Error(error.response.data);
  }
};
