import logo from "../assets/images/new_instasign_logo.svg";
import fev_icon from "../assets/images/fev_icon.png"

export function serverUrl_fn() {
  let baseUrl;
    baseUrl = process.env.REACT_APP_SERVERURL
      ? process.env.REACT_APP_SERVERURL
      : window.location.origin + "/app";

  return baseUrl;
}
export const appInfo = {
  // applogo: logo,
  applogo: logo,
  appId: process.env.REACT_APP_APPID ? process.env.REACT_APP_APPID : "IntuitiveApps",
  baseUrl: serverUrl_fn(),
  defaultRole: "contracts_User",
  fbAppId: process.env.REACT_APP_FBAPPID
    ? `${process.env.REACT_APP_FBAPPID}`
    : "",
  fev_Icon:
    fev_icon,
  googleClietId: process.env.REACT_APP_GOOGLECLIENTID
    ? `${process.env.REACT_APP_GOOGLECLIENTID}`
    : "",
  metaDescription:
    "The fastest way to sign PDFs & request signatures from others.",
  settings: [
    {
      role: "contracts_Admin",
      menuId: "VPh91h0ZHk",
      pageType: "dashboard",
      pageId: "35KBoSgoAK",
      extended_class: "contracts_Users"
    },
    {
      role: "contracts_OrgAdmin",
      menuId: "VPh91h0ZHk",
      pageType: "dashboard",
      pageId: "35KBoSgoAK",
      extended_class: "contracts_Users"
    },
    {
      role: "contracts_Editor",
      menuId: "H9vRfEYKhT",
      pageType: "dashboard",
      pageId: "35KBoSgoAK",
      extended_class: "contracts_Users"
    },
    {
      role: "contracts_User",
      menuId: "H9vRfEYKhT",
      pageType: "dashboard",
      pageId: "35KBoSgoAK",
      extended_class: "contracts_Users"
    }
  ]
};
