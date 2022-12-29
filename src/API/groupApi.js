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
  DELETE: "group/delete",
  GROUP_INFO_BY_OWNER: "/group/infoOwner",
  CHECK_CURRENT_ROLE: "group/checkRole",
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
export const viewGroupInfo = async ({ groupID }) => {
  try {
    const respone = await api.get(`${PATH.GROUP_DETAIL}/${groupID}`);
    return respone;
  } catch (error) {
    throw Error(error.response.data);
  }
};

export const groupInfo = async () => {
  try {
    const response = await api.get(PATH.GROUP_INFO);
    return response;
  } catch (error) {
    throw Error(error.response.data);
  }
};

export const createGroup = async ({ groupName, creatorID }) => {
  try {
    const response = await api.post(PATH.CREATE_GROUP, {
      groupName,
      creatorID,
    });
    return response;
  } catch (error) {
    throw Error(error.response.data);
  }
};
export const changeRole = async ({ groupID, memberID, role }) => {
  try {
    const response = await api.post(PATH.CHANGE_ROLE, {
      groupID,
      memberID,
      role,
    });
    return response;
  } catch (error) {
    throw Error(error.response.data);
  }
};
export const deleteMember = async ({ groupID, memberID }) => {
  try {
    const response = await api.post(PATH.DELETE_MEMBER, {
      groupID,
      memberID,
    });
    return response;
  } catch (error) {
    throw Error(error.response.data);
  }
};
export const sendlinktoemail = async ({ groupID, emailList }) => {
  try {
    const response = await api.post(PATH.SEND_LINK_TO_EMAIL, {
      groupID,
      emailList,
    });
    return response;
  } catch (error) {
    throw Error(error.response.data);
  }
};
export const addMember = async ({ groupID, memberID }) => {
  try {
    const response = await api.post(PATH.ADD_MEMBER, {
      groupID,
      memberID,
    });
    return response;
  } catch (error) {
    throw Error(error.response.data);
  }
};

export const deleteGroup = async ({ groupID }) => {
  try {
    const response = await api.post(PATH.DELETE, {
      groupID,
    });
    return response;
  } catch (error) {
    throw Error(error.response.data);
  }
};
export const viewAllGroupOfOwnerPresentation = async ({ ownerID }) => {
  try {
    const response = await api.post(PATH.GROUP_INFO_BY_OWNER, {
      ownerID,
    });
    return response.data;
  } catch (error) {
    throw Error(error.response.data);
  }
};

export const checkMemberRoleInGroup = async ({ groupID, memberID }) => {
  try {
    const response = await api.post(PATH.CHECK_CURRENT_ROLE, {
      groupID,
      memberID,
    });
    return response;
  } catch (error) {
    throw Error(error.response.data);
  }
};
