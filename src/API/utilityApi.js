const PATH = {
  GET_IMAGES:
    "https://api.nasa.gov/planetary/apod?api_key=MKbBo8HveCvt4DHggM8VbUQQYbDspW6L9v5u5Le6",
};
export const getRandomImagesUrl = async (quantity) => {
  try {
    const imageUrlArray = [];
    fetch(`${PATH.GET_IMAGES}&count=${quantity}`)
      .then((response) => response.json())
      .then((data) => {
        for (let i = 0; i < data.length; i++) {
          imageUrlArray.push(data[i].url);
        }
      });
    return imageUrlArray;
  } catch (error) {
    throw Error(error.response.data);
  }
};
