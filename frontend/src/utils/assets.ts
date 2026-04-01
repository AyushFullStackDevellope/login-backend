import logoLight from "../assets/logo-light.png";
import logoDark from "../assets/logo-dark.png";
import logoOne from "../assets/logo-one.png";
import logoTwo from "../assets/logo-two.png";
import logoThree from "../assets/logo-three.png";
import logoFour from "../assets/logo-four.png";
import logoFive from "../assets/image.png";

export { logoLight, logoDark };
export const INSTITUTE_LOGOS = [logoOne, logoTwo, logoThree, logoFour, logoFive];

export const getInstituteLogo = (name: string, index: number) => {
  const nameLower = (name || "").toLowerCase();
  
  if (nameLower.includes("xavier")) return logoOne;
  if (nameLower.includes("christ")) return logoTwo;
  if (nameLower.includes("delhi")) return logoThree;
  if (nameLower.includes("niit")) return logoFour;
  if (nameLower.includes("amity")) return logoFive;
  
  return INSTITUTE_LOGOS[index % INSTITUTE_LOGOS.length];
};
