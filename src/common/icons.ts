import pdfIcon from "../assets/pdf-icon.png";
import imageIcon from "../assets/image-icon.png";
import audoiIcon from "../assets/audio-icon.png";
import { FileType } from "./types";

export const fileIconMap: Record<FileType, string> = {
  pdf: pdfIcon,
  image: imageIcon,
  audio: audoiIcon,
};
