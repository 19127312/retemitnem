import api from "./api";

const PATH = {
  PRESENTATION_INFO: "/presentation/viewByGroupID",
  PRESENTATION_INFO_BY_ID: "/presentation/info",
  UPDATE_PRESENTATION: "/presentation/update",
  CREATE_PRESENTATION: "/presentation/add",
  DELETE_PRESENTATIONS: "/presentation/delete",
  PRESENTATION_INFO_BY_USER_ID: "presentation/viewByCurrentLoggedInUser",
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
