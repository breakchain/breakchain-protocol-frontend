import PoppinsWOFF from "../assets/fonts/Poppins-Regular.woff";
import PoppinsBoldWOFF from "../assets/fonts/Poppins-Bold.woff";
import PoppinsSemiBoldWOFF from "../assets/fonts/Poppins-SemiBold.woff";
import PoppinsItalicWOFF from "../assets/fonts/Poppins-Italic.woff";
import PoppinsLightWOFF from "../assets/fonts/Poppins-Light.woff";
import PoppinsMediumWOFF from "../assets/fonts/Poppins-Medium.woff";

const poppins = {
  fontFamily: "Poppins",
  fontStyle: "normal",
  fontDisplay: "swap",
  fontWeight: 400,
  src: `
		local('Poppins'),
		local('Poppins-Regular'),
		url(${PoppinsWOFF}) format('woff')
	`,
  unicodeRange:
    "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF",
};

const poppinsLight = {
  fontFamily: "Poppins",
  fontStyle: "normal",
  fontDisplay: "swap",
  fontWeight: 300,
  src: `
		local('Poppins'),
		local('Poppins-Light'),
		url(${PoppinsLightWOFF}) format('woff')
	`,
  unicodeRange:
    "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF",
};

const poppinsMedium = {
  fontFamily: "Poppins",
  fontStyle: "medium",
  fontDisplay: "swap",
  fontWeight: 500,
  src: `
		local('Poppins'),
		local('Poppins-Medium'),
		url(${PoppinsMediumWOFF}) format('woff')
	`,
  unicodeRange:
    "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF",
};

const poppinsSemiBold = {
  fontFamily: "Poppins",
  fontStyle: "normal",
  fontDisplay: "swap",
  fontWeight: 600,
  src: `
		local('Poppins-SemiBold'),
		local('Poppins-SemiBold'),
		url(${PoppinsSemiBoldWOFF}) format('woff')
	`,
  unicodeRange:
    "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF",
};

const poppinsBold = {
  fontFamily: "Poppins",
  fontStyle: "bold",
  fontDisplay: "swap",
  fontWeight: 700,
  src: `
		local('Poppins-Bold'),
		local('Poppins-Bold'),
		url(${PoppinsBoldWOFF}) format('woff')
	`,
  unicodeRange:
    "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF",
};

const poppinsItalic = {
  fontFamily: "Poppins",
  fontStyle: "italic",
  fontDisplay: "swap",
  fontWeight: 400,
  src: `
		local('Poppins-Italic'),
		local('Poppins-Italic'),
		url(${PoppinsItalicWOFF}) format('woff')
	`,
  unicodeRange:
    "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF",
};

const fonts = [poppins, poppinsLight, poppinsMedium, poppinsBold, poppinsItalic];

export default fonts;
