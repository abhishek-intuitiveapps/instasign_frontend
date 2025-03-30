import React, { useEffect, useState } from "react";
import Title from "../components/Title";
import { Link, useNavigate } from "react-router";
// import login_img from "../assets/images/login_img.svg";
import login_img from "../assets/images/instasign.jpg"
import Parse from "parse";
import Alert from "../primitives/Alert";
import { appInfo } from "../constant/appinfo";
import { useDispatch } from "react-redux";
import { fetchAppInfo } from "../redux/reducers/infoReducer";
import {
  emailRegex,
} from "../constant/const";
import { useTranslation } from "react-i18next";

function ForgotPassword() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [state, setState] = useState({ email: "", password: "", hideNav: "" });
  const [sentStatus, setSentStatus] = useState("");
  const [image, setImage] = useState();

  const handleChange = (event) => {
    let { name, value } = event.target;
    if (name === "email") {
      value = value?.toLowerCase()?.replace(/\s/g, "");
    }
    setState({ ...state, [name]: value });
  };

  const resize = () => {
    let currentHideNav = window.innerWidth <= 760;
    if (currentHideNav !== state.hideNav) {
      setState({ ...state, hideNav: currentHideNav });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!emailRegex.test(state.email)) {
      alert("Please enter a valid email address.");
    } else {
      localStorage.setItem("appLogo", appInfo.applogo);
      localStorage.setItem("userSettings", JSON.stringify(appInfo.settings));
      if (state.email) {
        const username = state.email;
        try {
          await Parse.User.requestPasswordReset(username);
          setSentStatus("success");
        } catch (err) {
          console.log("err ", err.code);
          setSentStatus("failed");
        } finally {
          setTimeout(() => setSentStatus(""), 1000);
        }
      }
    }
  };

  useEffect(() => {
    dispatch(fetchAppInfo());
    saveLogo();
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
    // eslint-disable-next-line
  }, []);
  const saveLogo = async () => {
    try {
      await Parse.User.logOut();
    } catch (err) {
      console.log("err while logging out ", err);
    }
      setImage(appInfo?.applogo || undefined);
  };
  return (
    <div className="flex h-screen">
      <div className="hidden md:flex flex-none w-2/5 justify-center items-center bg-blue-500 overflow-hidden">
            <img src={login_img} alt="Login Illustration" className="object-cover w-full h-full" />
          </div>
      <div className="flex-1 flex justify-center items-center bg-white">
        <div className="w-full max-w-md p-8">
          <Title title="Forgot password page" />
          {sentStatus === "success" && (
            <Alert type="success">{t("reset-password-alert-1")}</Alert>
          )}
          {sentStatus === "failed" && (
            <Alert type={"danger"}>{t("reset-password-alert-2")}</Alert>
          )}
          <form onSubmit={handleSubmit}>
            <h2 className="text-2xl font-bold text-left mb-6">{t("Forgot Password")}</h2>
            {/* <div className="w-full my-4 op-card bg-base-100 shadow-md outline outline-1 outline-slate-300/50"> */}
              <fieldset className="mb-3 relative">
                <div className="relative w-full max-w-md">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    <i className="fa fa-envelope"></i>
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder={t("Email")}
                    className="w-full py-2 px-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={state.email}
                    onChange={handleChange}
                    onInvalid={(e) =>
                      e.target.setCustomValidity(t("input-required"))
                    }
                    onInput={(e) => e.target.setCustomValidity("")}
                    required
                  />
                </div>
                <hr className="my-2 border-none" />
              </fieldset>
            {/* </div> */}
            <div className="grid grid-cols-1 gap-1 text-center">
              <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-md hover:bg-blue-700 transition duration-200">
                {t("submit")}
              </button>
              <div className="text-gray-600 mt-4">
                <p className="mb-2">
                  {t("Don't have an account?")} <Link to="/signup" className="text-blue-600 hover:underline">{t("Sign Up")}</Link>
                </p>
                <p>
                  {t("Already have an account?")} <Link to="/login" className="text-blue-600 hover:underline">{t("Sign in")}</Link>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
