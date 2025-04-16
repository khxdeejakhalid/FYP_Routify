import { imageRegistry } from "./imageRegistry";

export const getImageSource = (path) => {
  return imageRegistry[path] || imageRegistry["quiz01/Question01.png"];
};

export const getRandomQuizNumber = () => {
  return Math.floor(Math.random() * 8) + 1;
};
