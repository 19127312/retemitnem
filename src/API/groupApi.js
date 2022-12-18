import api from "./api";

const PATH = {
  CREATE_GROUP: "/group/add",
  GROUP_INFO: "/group/info",
  CHANGE_ROLE: "/group/role",
  SEND_LINK_TO_EMAIL: "/group/sendlinktoemail",
  GROUP_DETAIL: "/group/detail",
  DELETE_MEMBER: "/group/deletemember",
  ADD_MEMBER: "/group/addmember",
  CHECK_MEMBER_IN_GROUP: "/group/check",
};

export const checkMemberInGroup = async ({ groupID, memberID }) => {
  try {
    const response = await api.post(PATH.CHECK_MEMBER_IN_GROUP, {
      groupID,
      memberID,
    });
    return response;
  } catch (error) {
    throw Error(error.response.data);
  }
};
