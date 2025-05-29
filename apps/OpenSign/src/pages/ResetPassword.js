import React, { useEffect, useState } from "react";
import Title from "../components/Title";
import { Link, useNavigate, useLocation } from "react-router";
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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";

function ResetPassword() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const auth = queryParams.get('auth');
  const id = queryParams.get('id');
  const [state, setState] = useState({ password: "", confirmPassword: "", hideNav: "" });
  const [resetStatus, setResetStatus] = useState("");
  const [image, setImage] = useState();
  const [linkExpired, setLinkExpired] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const djangoURL = process.env.REACT_APP_DJANGO_URL;
//   const apiURL = "https://api.dev.instasign.ai";

  const handleChange = (event) => {
    const { name, value } = event.target;
    setState({ ...state, [name]: value });
  };

  const resize = () => {
    let currentHideNav = window.innerWidth <= 760;
    if (currentHideNav !== state.hideNav) {
      setState({ ...state, hideNav: currentHideNav });
    }
  };

  const checkLinkExpiry = async () => {
    if (!auth || !id) return;
    
    try {
      setLoading(true);
      const result = await axios.post(`${djangoURL}/base/api/v1/check/expiry/`, {
        auth: auth,
        id: id
      });
      
      if (!result.data.status) {
        setLinkExpired(true);
        toast.error(result.data.message || "This reset link has expired. Please request a new one.");
      } else {
        setUserEmail(result.data.data.email);
      }
    } catch (err) {
      console.error("Error checking link expiry:", err);
      setLinkExpired(true);
      toast.error("Failed to validate reset link. Please request a new one.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (state.password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }
    
    if (state.password !== state.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    
    try {
      // Try Parse Server API
      const parseResult = await Parse.Cloud.run('updatepassword', {
        email: userEmail,
        new_password: state.password
      });
      
      // Try Django API
      const djangoResult = await axios.post(`${djangoURL}/base/api/v1/reset/password/`, {
        auth: auth,
        id: id,
        new_password: state.password
      });
      
      if (parseResult.success || djangoResult.data.success) {
        setResetStatus("success");
        toast.success("Password reset successfully!");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        toast.error("Failed to reset password.");
        setResetStatus("failed");
      }
    } catch (err) {
      console.log("err ", err);
      toast.error("Failed to reset password. Please try again.");
      setResetStatus("failed");
    } finally {
      setTimeout(() => setResetStatus(""), 1000);
    }
  };

  useEffect(() => {
    dispatch(fetchAppInfo());
    // saveLogo();
    resize();
    checkLinkExpiry();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
    // eslint-disable-next-line
  }, [auth, id]);
  const saveLogo = async () => {
    try {
      await Parse.User.logOut();
    } catch (err) {
      console.log("err while logging out ", err);
    }
      setImage(appInfo?.applogo || undefined);
  };

  // If auth or id is missing, show error message or redirect
  if (!auth || !id) {
    return (
      <div className="flex h-screen justify-center items-center">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold mb-4 text-red-600">{t("Invalid Reset Link")}</h2>
          <p className="mb-4">{t("The password reset link is invalid or has expired.")}</p>
          <Link to="/login" className="bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200">
            {t("Back to Login")}
          </Link>
        </div>
      </div>
    );
  }

  // If link is expired, show error message
  if (linkExpired) {
    return (
      <div className="flex h-screen justify-center items-center">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold mb-4 text-red-600">{t("Link Expired")}</h2>
          <p className="mb-4">{t("This password reset link has expired. Please request a new one.")}</p>
          <Link to="/forgetpassword" className="bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200">
            {t("Request New Link")}
          </Link>
        </div>
      </div>
    );
  }
  
  // Show loading state
  if (loading) {
    return (
      <div className="flex h-screen justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4">{t("Validating your reset link...")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <div className="hidden md:flex flex-none w-2/5 justify-center items-center bg-blue-500 overflow-hidden">
            <img src={login_img} alt="Login Illustration" className="object-cover w-full h-full" />
          </div>
      <div className="flex-1 flex justify-center items-center bg-white">
        <div className="w-full max-w-md p-8">
          <Title title="Reset password page" />
          {resetStatus === "success" && (
            <Alert type="success">{t("Password reset successfully!")}</Alert>
          )}
          {resetStatus === "failed" && (
            <Alert type={"danger"}>{t("Failed to reset password. Please try again.")}</Alert>
          )}
          <form onSubmit={handleSubmit}>
            <h2 className="text-2xl font-bold text-left mb-6">{t("Reset Password")}</h2>
            {/* <div className="w-full my-4 op-card bg-base-100 shadow-md outline outline-1 outline-slate-300/50"> */}
              <fieldset className="mb-3 relative">
                <div className="relative w-full max-w-md mb-4">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    <i className="fa fa-lock"></i>
                  </div>
                  <input
                    type="password"
                    name="password"
                    placeholder={t("New Password")}
                    className="w-full py-2 px-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={state.password}
                    onChange={handleChange}
                    onInvalid={(e) =>
                      e.target.setCustomValidity(t("input-required"))
                    }
                    onInput={(e) => e.target.setCustomValidity("")}
                    required
                    minLength={8}
                  />
                </div>
                
                <div className="relative w-full max-w-md">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    <i className="fa fa-lock"></i>
                  </div>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder={t("Confirm Password")}
                    className="w-full py-2 px-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={state.confirmPassword}
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
                {t("Reset Password")}
              </button>
              <div className="text-gray-600 mt-4">
                <p>
                  {t("Remember your password?")} <Link to="/login" className="text-blue-600 hover:underline">{t("Sign in")}</Link>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default ResetPassword;
