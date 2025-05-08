import React, { useState, useEffect } from "react";
import dp from "../assets/images/dp.png";
import FullScreenButton from "./FullScreenButton";
import { useNavigate } from "react-router";
import Parse from "parse";
import { useWindowSize } from "../hook/useWindowSize";
import {
  getAppLogo,
  openInNewTab,
  saveLanguageInLocal
} from "../constant/Utils";
import { useTranslation } from "react-i18next";
const Header = ({ showSidebar, setIsMenu, isPendingVerification }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { width } = useWindowSize();
  const username = localStorage.getItem("username") || "";
  const image = localStorage.getItem("profileImg") || dp;
  const [isOpen, setIsOpen] = useState(false);
  const [applogo, setAppLogo] = useState(
    localStorage.getItem("appLogo") || " "
  );
  const [isOpenSettings, setIsOpenSettings] = useState(false);
  const Extand_Class = localStorage.getItem("Extand_Class");
  const extClass = Extand_Class && JSON.parse(Extand_Class);
  let userRole = "contracts_User";
  if (extClass && extClass.length > 0) {
    userRole = extClass[0].UserRole;
  }

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (width <= 768) {
      setIsMenu(false);
    }
  };
  useEffect(() => {
    initializeHead();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  async function initializeHead() {
      const applogo = await getAppLogo();
      if (applogo?.logo) {
        setAppLogo(applogo?.logo);
      } else {
        setAppLogo(localStorage.getItem("appLogo") || "");
      }
  }

  const closeDropdown = async () => {
    setIsOpen(false);
    try {
      await Parse.User.logOut();
    } catch (err) {
      console.log("Err while logging out", err);
    }
    let appdata = localStorage.getItem("userSettings");
    let applogo = localStorage.getItem("appLogo");
    let defaultmenuid = localStorage.getItem("defaultmenuid");
    let PageLanding = localStorage.getItem("PageLanding");
    let baseUrl = localStorage.getItem("baseUrl");
    let appid = localStorage.getItem("parseAppId");

    localStorage.clear();
    saveLanguageInLocal(i18n);
    localStorage.setItem("appLogo", applogo);
    localStorage.setItem("defaultmenuid", defaultmenuid);
    localStorage.setItem("PageLanding", PageLanding);
    localStorage.setItem("userSettings", appdata);
    localStorage.setItem("baseUrl", baseUrl);
    localStorage.setItem("parseAppId", appid);

    navigate("/login");
  };

  //handle to close profile drop down menu onclick screen
  useEffect(() => {
    const closeMenuOnOutsideClick = (e) => {
      if (isOpen && !e.target.closest("#profile-menu")) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", closeMenuOnOutsideClick);

    return () => {
      // Cleanup the event listener when the component unmounts
      document.removeEventListener("click", closeMenuOnOutsideClick);
    };
  }, [isOpen]);

  return (
    <div>
      <div className="op-navbar bg-base-100 shadow">
        <div className="flex-1 ml-2">
          <div className="h-[25px] md:h-[40px] w-auto overflow-hidden">
            <img
              className="object-contain h-full w-auto"
              src={applogo}
              alt="img"
            />
          </div>
        </div>
        {/* <div id="profile-menu" className="flex-none gap-2 flex items-center">
          
          <FullScreenButton />
          {width >= 768 && (
            <div
              onClick={toggleDropdown}
              className="cursor-pointer w-[35px] h-[35px] rounded-full ring-[1px] ring-offset-2 ring-gray-400 overflow-hidden"
            >
              <img
                className="w-full h-full object-cover"
                src={image}
                alt="img"
              />
            </div>
          )}
          {width >= 768 && (
            <div
              onClick={toggleDropdown}
              className="cursor-pointer text-base-content text-sm"
            >
              {username && username.split(" ")[0]}
            </div>
          )}
          <div className="op-dropdown op-dropdown-end" id="profile-menu">
            <div
              tabIndex={0}
              role="button"
              onClick={toggleDropdown}
              className="op-btn op-btn-ghost op-btn-xs w-[10px] h-[20px] hover:bg-transparent"
            >
              <i
                tabIndex={0}
                role="button"
                className="fa-light fa-angle-down text-base-content"
              ></i>
            </div>
            <ul
              tabIndex={0}
              className={`mt-3 z-[1] p-2 shadow op-menu op-menu-sm op-dropdown-content text-base-content bg-base-100 rounded-box w-52 ${
                isOpen ? "" : "hidden"
              }`}
            >
              <li
                onClick={() => {
                  setIsOpen(false);
                  navigate("/profile");
                }}
                className="flex"
              >
                <span className="flex">
                  <i className="fa-light fa-user" style={{ width: "24px" }}></i>
                  <span className="ml-2">{t("profile")}</span>
                </span>
              </li>
              <li
                onClick={() => {
                  setIsOpen(false);
                  navigate("/report/contacts");
                }}
                className="flex"
              >
                <span className="flex">
                  <i className="fa-light fa-address-book" style={{ width: "24px" }}></i>
                  <span className="ml-2">{t("Contacts")}</span>
                </span>
              </li>
              <li
                onClick={() => {
                  setIsOpenSettings(!isOpenSettings);
                }}
                className="flex justify-between"
              >
                <span className="flex">
                  <i className="fa-light fa-cog" style={{ width: "24px" }}></i>
                  <span className="ml-2">{t("Settings")}</span>
                  <i
                  className="fa-light fa-angle-down ml-12 text-base-content cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpenSettings(!isOpenSettings);
                  }}
                />
                </span>
                
              </li>
              {isOpenSettings && (
                <>
                  <li className="ml-4 flex" onClick={() => navigate("/managesign")}>
                    <span className="flex">
                      <i className="fa-light fa-signature" style={{ width: "24px" }}></i>
                      <span className="ml-2">{t("My Signature")}</span>
                    </span>
                  </li>
                  {userRole === "contracts_Admin" || userRole === "contracts_OrgAdmin" ? (
                    <>
                      <li className="ml-4 flex" onClick={() => navigate("/preferences")}>
                        <span className="flex">
                          <i className="fa-light fa-sliders-h" style={{ width: "24px" }}></i>
                          <span className="ml-2">{t("Preferences")}</span>
                        </span>
                      </li>
                      <li className="ml-4 flex" onClick={() => navigate("/users")}>
                        <span className="flex">
                          <i className="fa-light fa-users" style={{ width: "24px" }}></i>
                          <span className="ml-2">{t("Users")}</span>
                        </span>
                      </li>
                    </>
                  ) : null}
                </>
              )}
              <li
                onClick={() => {
                  setIsOpen(false);
                  navigate("/changepassword");
                }}
                className="flex"
              >
                <span className="flex">
                  <i className="fa-light fa-lock" style={{ width: "24px" }}></i>
                  <span className="ml-2">{t("change-password")}</span>
                </span>
              </li>
              <li onClick={closeDropdown} className="flex">
                <span className="flex">
                  <i className="fa-light fa-arrow-right-from-bracket" style={{ width: "24px" }}></i>
                  <span className="ml-2">{t("log-out")}</span>
                </span>
              </li>
            </ul>
          </div>
        </div> */}
{/* 
        {!isPendingVerification && ( */}
          <div className="flex-none gap-2 flex items-center" id="profile-menu">
            <div className="op-dropdown op-dropdown-end relative">
              <div
                tabIndex={0}
                role="button"
                onClick={toggleDropdown}
                className="flex items-center gap-2 cursor-pointer"
              >
                <div className={`w-[35px] h-[35px] rounded-full ring-[1px] ring-offset-2 ring-gray-400 overflow-hidden ${width < 768 ? 'hidden' : ''}`}>
                  <img
                    className="w-full h-full object-cover"
                    src={image}
                    alt="profile"
                  />
                </div>
                <div className={`text-base-content text-sm ${width < 768 ? 'hidden' : ''}`}>
                  {username && username.split(" ")[0]}
                </div>
                <i className="fa-light fa-angle-down text-base-content"></i>
              </div>

              <ul
                tabIndex={0}
                className={`absolute right-0 mt-3 z-[1] p-2 shadow op-menu op-menu-sm op-dropdown-content text-base-content bg-base-100 rounded-box w-52 ${
                  isOpen ? "" : "hidden"
                }`}
              >
                <li
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/profile");
                  }}
                  className="flex"
                >
                  <span className="flex">
                    <i
                      className="fa-light fa-user"
                      style={{ width: "24px" }}
                    ></i>
                    <span className="ml-2">{t("profile")}</span>
                  </span>
                </li>
                <li
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/changepassword");
                  }}
                  className="flex"
                >
                  <span className="flex">
                    <i
                      className="fa-light fa-lock"
                      style={{ width: "24px" }}
                    ></i>
                    <span className="ml-2">{t("change-password")}</span>
                  </span>
                </li>
                <li onClick={closeDropdown} className="flex">
                  <span className="flex">
                    <i
                      className="fa-light fa-arrow-right-from-bracket"
                      style={{ width: "24px" }}
                    ></i>
                    <span className="ml-2">{t("log-out")}</span>
                  </span>
                </li>
              </ul>
            </div>
          </div>
        {/* )} */}

        <div className="flex-none">
            <button
              className="op-btn op-btn-square op-btn-ghost focus:outline-none hover:bg-transparent op-btn-sm no-animation"
              onClick={showSidebar}
            >
              <i className="fa-light fa-bars text-xl text-base-content"></i>
            </button>
          </div>
      </div>
    </div>
  );
};

export default Header;
