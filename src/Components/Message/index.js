import { message } from "antd";

export const showMessage = (index, text) => {
  switch (index) {
    case 0:
      message.success(text);
      break;
    case 1:
      message.info(text);
      break;
    case 2:
      message.error(text);
      break;
    default:
      message.error("Unknown error");
  }
};
