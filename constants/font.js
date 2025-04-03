import { Dimensions, PixelRatio } from "react-native";

const { width, height } = Dimensions.get("window");

const baseWidth = 375;
const baseHeight = 812;

export const scaleFont = (size) => {
  return Math.round((size * width) / baseWidth);
};

export const scalePadding = (size) => Math.round((size * width) / baseWidth);

export const scalePaddingVertical = (size) =>
  Math.round((size * height) / baseHeight);

export const scalePaddingHorizontal = (size) =>
  Math.round((size * width) / baseWidth);
