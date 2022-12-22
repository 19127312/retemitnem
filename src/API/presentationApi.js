import api from "./api";

const PATH = {
  PRESENTATION_INFO: "/presentation/viewByGroupID",
  PRESENTATION_INFO_BY_ID: "/presentation/info",
  UPDATE_PRESENTATION: "/presentation/update",
  CREATE_PRESENTATION: "/presentation/add",
  DELETE_PRESENTATIONS: "/presentation/delete",
  PRESENTATION_INFO_BY_USER_ID: "presentation/viewByCurrentLoggedInUser",
  SET_PLAYING_PRESENTATION: "/presentation/setPlayingInGroup",
  VIEW_COLLABORATORS: "/presentation/collaborator",
  VALID_COLLABORATORS: "presentation/isValidCollaborator",
  KICK_PRESENTATIONS: "/presentation/kick",
};

export const viewPresentationInfoByGroupID = async ({ groupID }) => {
  try {
    const response = await api.get(`${PATH.PRESENTATION_INFO}/${groupID}`);
    return response;
  } catch (error) {
    throw Error(error.response.data);
  }
};

export const viewPresentationInfoByPresentationID = async ({
  presentationID,
}) => {
  try {
    const response = await api.get(
      `${PATH.PRESENTATION_INFO_BY_ID}/${presentationID}`
    );
    return response;
  } catch (error) {
    console.log(error);
    throw Error(error.response.data.errorMessage);
  }
};

export const updatePresentation = async ({ presentation }) => {
  try {
    const response = await api.post(PATH.UPDATE_PRESENTATION, { presentation });
    return response;
  } catch (error) {
    throw Error(error.response.data);
  }
};

export const createPresentation = async ({ title, ownerID, groupID }) => {
  try {
    const response = await api.post(PATH.CREATE_PRESENTATION, {
      title,
      ownerID,
      groupID,
    });
    return response;
  } catch (error) {
    throw Error(error.response.data);
  }
};

export const deletePresentations = async ({ presentationIDs }) => {
  try {
    const response = await api.post(PATH.DELETE_PRESENTATIONS, {
      presentationIDs,
    });
    return response;
  } catch (error) {
    throw Error(error.response.data);
  }
};

export const viewPresentationInfoByCurrentLoggedInUser = async ({ userID }) => {
  try {
    const response = await api.get(
      `${PATH.PRESENTATION_INFO_BY_USER_ID}/${userID}`
    );
    return response;
  } catch (error) {
    throw Error(error.response.data);
  }
};

export const setPlayingPresentation = async ({ groupID, presentationID }) => {
  console.log(groupID, presentationID);
  try {
    const response = await api.post(PATH.SET_PLAYING_PRESENTATION, {
      groupID,
      presentationID,
    });
    return response;
  } catch (error) {
    throw Error(error.response.data);
  }
};

export const viewCollaborators = async ({ presentationID }) => {
  try {
    const response = await api.get(
      `${PATH.VIEW_COLLABORATORS}/${presentationID}`
    );
    return response;
  } catch (error) {
    console.log(error);
    throw Error(error.response.data.errorMessage);
  }
};

export const isValidCollaborator = async ({
  email,
  currentUserEmail,
  presentationID,
}) => {
  try {
    const response = await api.get(
      `${PATH.VALID_COLLABORATORS}/${email}/${currentUserEmail}/${presentationID}`
    );
    return response;
  } catch (error) {
    throw Error(error.response.data);
  }
};

export const kickPresentations = async ({ presentationIDs }) => {
  try {
    const response = await api.post(PATH.KICK_PRESENTATIONS, {
      presentationIDs,
    });
    return response;
  } catch (error) {
    throw Error(error.response.data);
  }
};
