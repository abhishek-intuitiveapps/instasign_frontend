import React, { useEffect, useState } from "react";
import Parse from "parse";
import { useDispatch } from "react-redux";
import axios from "axios";
import Title from "../components/Title";
import { NavLink, useNavigate, useLocation } from "react-router";
import login_img from "../assets/images/instasign.jpg";
import { useWindowSize } from "../hook/useWindowSize";
import ModalUi from "../primitives/ModalUi";
import AccountActivationModal from "../components/shared/AccountActivationModal";
import {
  emailRegex,
} from "../constant/const";
import Alert from "../primitives/Alert";
import { appInfo } from "../constant/appinfo";
import { fetchAppInfo } from "../redux/reducers/infoReducer";
import { showTenant } from "../redux/reducers/ShowTenant";
import {
  getAppLogo,
  saveLanguageInLocal,
  usertimezone
} from "../constant/Utils";
import Loader from "../primitives/Loader";
import { useTranslation } from "react-i18next";
import SelectLanguage from "../components/pdf/SelectLanguage";
import env_data from "../env_data.json";


function Login() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { width } = useWindowSize();
  const [showActivationModal, setShowActivationModal] = useState(false);
  const [state, setState] = useState({
    email: "",
    alertType: "success",
    alertMsg: "",
    password: "",
    passwordVisible: false,
    mobile: "",
    phone: "",
    scanResult: "",
    baseUrl: localStorage.getItem("baseUrl"),
    parseAppId: localStorage.getItem("parseAppId"),
    loading: false,
    thirdpartyLoader: false,
  });
  const [userDetails, setUserDetails] = useState({
    Company: "",
    Destination: ""
  });
  const [isModal, setIsModal] = useState(false);
  const [image, setImage] = useState();
  const [errMsg, setErrMsg] = useState();
  const [isChecked, setIsChecked] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  

  useEffect(() => {
    checkUserExt();
    // eslint-disable-next-line
  }, []);

  const checkUserExt = async () => {
    const app = await getAppLogo();
    if (app?.error === "invalid_json") {
      setErrMsg(t("server-down"));
    } else if (
      app?.user === "not_exist"
    ) {
      navigate("/addadmin");
    }
    if (app?.logo) {
      setImage(app?.logo);
    } else {
      setImage(appInfo?.applogo || undefined);
    }
    if (localStorage.getItem("accesstoken")) {
      setState({ ...state, loading: true });
      GetLoginData();
    }
    dispatch(fetchAppInfo());
  };
  const handleChange = (event) => {
    let { name, value } = event.target;
    if (name === "email") {
      value = value?.toLowerCase()?.replace(/\s/g, "");
    }
    setState({ ...state, [name]: value });
  };

  const handleSubmit = async (event) => {
    localStorage.removeItem("accesstoken");
    event.preventDefault();
    if (!emailRegex.test(state.email)) {
      alert("Please enter a valid email address.");
    } else {
      const { email, password } = state;
      if (email && password) {
        try {
          // Send Axios request to get access and refresh tokens
          const response = await axios.post(`https:/${env_data.django_url}/base/api/token/`, {
            email: state.email,
            password: state.password
          });
          
          // Check if account needs activation
          if (response.data.needs_activation) {
            setShowActivationModal(true);
            return;
          }

          const { access, refresh } = response.data;
          localStorage.setItem("django", access);
          localStorage.setItem("djangoRefresh", refresh);

          // Pass the username and password to logIn function
          const user = await Parse.User.logIn(email, password);
          if (user) {
            let _user = user.toJSON();
            localStorage.setItem("UserInformation", JSON.stringify(_user));
            localStorage.setItem("userEmail", email);
            localStorage.setItem("accesstoken", _user.sessionToken);
            localStorage.setItem("scriptId", true);
            if (_user.ProfilePic) {
              localStorage.setItem("profileImg", _user.ProfilePic);
            } else {
              localStorage.setItem("profileImg", "");
            }
            // Check extended class user role and tenantId
            try {
              const userSettings = appInfo.settings;
              await Parse.Cloud.run("getUserDetails")
                .then(async (extUser) => {
                  if (extUser) {
                    const IsDisabled = extUser?.get("IsDisabled") || false;
                    if (!IsDisabled) {
                      const userRole = extUser?.get("UserRole");
                      const menu =
                        userRole &&
                        userSettings.find((menu) => menu.role === userRole);
                      if (menu) {
                        const _currentRole = userRole;
                        const redirectUrl =
                          location?.state?.from ||
                          `/${menu.pageType}/${menu.pageId}`;
                        let _role = _currentRole.replace("contracts_", "");
                        localStorage.setItem("_user_role", _role);
                        const checkLanguage = extUser?.get("Language");
                        if (checkLanguage) {
                          checkLanguage && i18n.changeLanguage(checkLanguage);
                        }

                        const results = [extUser];
                        const extUser_str = JSON.stringify(results);

                        localStorage.setItem("Extand_Class", extUser_str);
                        const extInfo = JSON.parse(JSON.stringify(extUser));
                        localStorage.setItem("userEmail", extInfo.Email);
                        localStorage.setItem("username", extInfo.Name);
                        if (extInfo?.TenantId) {
                          const tenant = {
                            Id: extInfo?.TenantId?.objectId || "",
                            Name: extInfo?.TenantId?.TenantName || ""
                          };
                          localStorage.setItem("TenantId", tenant?.Id);
                          dispatch(showTenant(tenant?.Name));
                          localStorage.setItem("TenantName", tenant?.Name);
                        }
                        localStorage.setItem("PageLanding", menu.pageId);
                        localStorage.setItem("defaultmenuid", menu.menuId);
                        localStorage.setItem("pageType", menu.pageType);
                        
                        // Set loading to true before navigating
                        setState({ ...state, loading: true });
                        setTimeout(() => {
                          navigate(redirectUrl); // Navigate after a short delay to show loading
                        }, 500); // Adjust the delay as needed
                      } else {
                        setIsModal(true);
                      }
                    } else {
                      setState({
                        ...state,
                        alertType: "danger",
                        alertMsg:
                          "You don't have access, please contact the admin."
                      });
                      logOutUser();
                    }
                  } else {
                    setState({
                      ...state,
                      alertType: "danger",
                      alertMsg: "User not found."
                    });
                    logOutUser();
                  }
                })
                .catch((error) => {
                  setState({
                    ...state,
                    alertType: "danger",
                    alertMsg: `Something went wrong.`
                  });
                  console.error("Error while fetching Follow", error);
                });
            } catch (error) {
              setState({
                ...state,
                alertType: "danger",
                alertMsg: `${error.message}`
              });
              console.log(error);
            }

            // Check if both Django and Parse session tokens are available
            const parseSessionToken = localStorage.getItem("accesstoken");
            if (!access || !parseSessionToken) {
              setState({
                ...state,
                alertType: "danger",
                alertMsg: "You must be logged in to both Django and Parse."
              });
              return; // Exit the function if not logged in
            }

          }
        } catch (error) {
          setState({
            ...state,
            alertType: "danger",
            alertMsg: "Invalid username/password or region"
          });
          console.error("Error while logging in user", error);
        }
      }
    }
  };

  const setThirdpartyLoader = (value) => {
    setState({ ...state, thirdpartyLoader: value });
  };
  const thirdpartyLoginfn = async (sessionToken) => {
    const baseUrl = localStorage.getItem("baseUrl");
    const parseAppId = localStorage.getItem("parseAppId");
    const res = await axios.get(baseUrl + "users/me", {
      headers: {
        "X-Parse-Session-Token": sessionToken,
        "X-Parse-Application-Id": parseAppId
      }
    });
    await Parse.User.become(sessionToken).then(() => {
      window.localStorage.setItem("accesstoken", sessionToken);
    });
    if (res.data) {
      let _user = res.data;
      localStorage.setItem("UserInformation", JSON.stringify(_user));
      localStorage.setItem("userEmail", _user.email);
      localStorage.setItem("accesstoken", _user.sessionToken);
      localStorage.setItem("scriptId", true);
      if (_user.ProfilePic) {
        localStorage.setItem("profileImg", _user.ProfilePic);
      } else {
        localStorage.setItem("profileImg", "");
      }
      // Check extended class user role and tenantId
      try {
        const userSettings = appInfo.settings;
        await Parse.Cloud.run("getUserDetails")
          .then(async (extUser) => {
            if (extUser) {
              const IsDisabled = extUser?.get("IsDisabled") || false;
              if (!IsDisabled) {
                const userRole = extUser?.get("UserRole");
                const menu =
                  userRole &&
                  userSettings.find((menu) => menu.role === userRole);
                if (menu) {
                  const _currentRole = userRole;
                  const redirectUrl =
                    location?.state?.from || `/${menu.pageType}/${menu.pageId}`;
                  const _role = _currentRole.replace("contracts_", "");
                  localStorage.setItem("_user_role", _role);
                  const results = [extUser];
                  const extUser_stringify = JSON.stringify(results);
                  localStorage.setItem("Extand_Class", extUser_stringify);
                  const extInfo = JSON.parse(JSON.stringify(extUser));
                  localStorage.setItem("userEmail", extInfo?.Email);
                  localStorage.setItem("username", extInfo?.Name);
                  if (extInfo?.TenantId) {
                    const tenant = {
                      Id: extInfo?.TenantId?.objectId || "",
                      Name: extInfo?.TenantId?.TenantName || ""
                    };
                    localStorage.setItem("TenantId", tenant?.Id);
                    dispatch(showTenant(tenant?.Name));
                    localStorage.setItem("TenantName", tenant?.Name);
                  }
                  localStorage.setItem("PageLanding", menu.pageId);
                  localStorage.setItem("defaultmenuid", menu.menuId);
                  localStorage.setItem("pageType", menu.pageType);
                  
                  // Set loading to true before navigating
                  setState({ ...state, loading: true });
                  setTimeout(() => {
                    navigate(redirectUrl); // Navigate after a short delay to show loading
                  }, 500); // Adjust the delay as needed
                } else {
                  setState({
                    ...state,
                    alertType: "danger",
                    alertMsg: "Role not found."
                  });
                  logOutUser();
                }
              } else {
                setState({
                  ...state,
                  alertType: "danger",
                  alertMsg: "You don't have access, please contact the admin."
                });
                logOutUser();
              }
            } else {
              setState({
                ...state,
                alertType: "danger",
                alertMsg: "User not found."
              });
              logOutUser();
            }
          })
          .catch((err) => {
            console.error("err in fetching extUser", err);
            setState({
              ...state,
              alertType: "danger",
              alertMsg: `${err.message}`
            });
            const payload = { sessionToken: sessionToken };
            handleSubmitbtn(payload);
          });
      } catch (error) {
        setState({
          ...state,
          alertType: "danger",
          alertMsg: `${error.message}`
        });
        console.log(error);
      } finally {
        setThirdpartyLoader(false);
        setState({ ...state, loading: false });
      }
    }
  };

  const GetLoginData = async () => {
    setState({ ...state, loading: true });
    try {
      const user = await Parse.User.become(localStorage.getItem("accesstoken"));
      const _user = user.toJSON();
      localStorage.setItem("UserInformation", JSON.stringify(_user));
      localStorage.setItem("accesstoken", _user.sessionToken);
      localStorage.setItem("scriptId", true);
      if (_user.ProfilePic) {
        localStorage.setItem("profileImg", _user.ProfilePic);
      } else {
        localStorage.setItem("profileImg", "");
      }
      const userSettings = appInfo.settings;
      await Parse.Cloud.run("getUserDetails").then(async (extUser) => {
        if (extUser) {
          const IsDisabled = extUser?.get("IsDisabled") || false;
          if (!IsDisabled) {
            const userRole = extUser.get("UserRole");
            const _currentRole = userRole;
            const menu =
              userRole && userSettings.find((menu) => menu.role === userRole);
            if (menu) {
              const _role = _currentRole.replace("contracts_", "");
              localStorage.setItem("_user_role", _role);
              const redirectUrl =
                location?.state?.from || `/${menu.pageType}/${menu.pageId}`;
              const results = [extUser];
              const extendedInfo_stringify = JSON.stringify(results);
              localStorage.setItem("Extand_Class", extendedInfo_stringify);
              const extInfo = JSON.parse(JSON.stringify(extUser));
              localStorage.setItem("userEmail", extInfo.Email);
              localStorage.setItem("username", extInfo.Name);
              if (extInfo?.TenantId) {
                const tenant = {
                  Id: extInfo?.TenantId?.objectId || "",
                  Name: extInfo?.TenantId?.TenantName || ""
                };
                localStorage.setItem("TenantId", tenant?.Id);
                dispatch(showTenant(tenant?.Name));
                localStorage.setItem("TenantName", tenant?.Name);
              }
              localStorage.setItem("PageLanding", menu.pageId);
              localStorage.setItem("defaultmenuid", menu.menuId);
              localStorage.setItem("pageType", menu.pageType);
              
              // Set loading to true before navigating
              setState({ ...state, loading: true });
              setTimeout(() => {
                navigate(redirectUrl); // Navigate after a short delay to show loading
              }, 500); // Adjust the delay as needed
            } else {
              logOutUser();
            }
          } else {
            setState({
              ...state,
              alertType: "danger",
              alertMsg: "You don't have access, please contact the admin."
            });
            logOutUser();
          }
        } else {
          setState({
            ...state,
            alertType: "danger",
            alertMsg: "User not found."
          });
          logOutUser();
        }
      });
    } catch (error) {
      setState({
        ...state,
        alertType: "danger",
        alertMsg: "Something went wrong, please try again later."
      });
      console.log("err", error);
    } finally {
      setState({ ...state, loading: false });
    }
  };

  const togglePasswordVisibility = () => {
    setState({ ...state, passwordVisible: !state.passwordVisible });
  };

  const handleSubmitbtn = async (e) => {
    e.preventDefault();
    if (userDetails.Destination && userDetails.Company) {
      setThirdpartyLoader(true);
      const payload = { sessionToken: localStorage.getItem("accesstoken") };
      const userInformation = JSON.parse(
        localStorage.getItem("UserInformation")
      );
      if (payload && payload.sessionToken) {
        const params = {
          userDetails: {
            name: userInformation.name,
            email: userInformation.email,
            phone: userInformation?.phone || "",
            role: "contracts_User",
            company: userDetails.Company,
            jobTitle: userDetails.Destination,
            timezone: usertimezone
          }
        };
        const userSignUp = await Parse.Cloud.run("usersignup", params);
        if (userSignUp && userSignUp.sessionToken) {
          const LocalUserDetails = {
            name: userInformation.name,
            email: userInformation.email,
            phone: userInformation?.phone || "",
            company: userDetails.Company,
            jobTitle: userDetails.JobTitle
          };
          localStorage.setItem("userDetails", JSON.stringify(LocalUserDetails));
          thirdpartyLoginfn(userSignUp.sessionToken);
        } else {
          alert(userSignUp.message);
        }
      } else if (
        payload &&
        payload.message.replace(/ /g, "_") === "Internal_server_err"
      ) {
        alert(t("server-error"));
      }
    } else {
      setState({
        ...state,
        alertType: "warning",
        alertMsg: "Please fill required details."
      });
      setTimeout(() => setState((prev) => ({ ...prev, alertMsg: "" })), 2000);
    }
  };

  const logOutUser = async () => {
    setIsModal(false);
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
  };

  const handleToggle = () => {
    setIsChecked(!isChecked);
  };

  const handleActivateAccount = async ({ otp, cinFile }) => {
    try {
      const formData = new FormData();
      formData.append('otp', otp);
      formData.append('cin_certificate', cinFile);
      
      const response = await axios.post(
        `${env_data.django_url}/base/api/activate-account/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        setShowActivationModal(false);
        // Retry login after successful activation
        handleSubmit(new Event('submit'));
      } else {
        setState({
          ...state,
          alertType: "danger",
          alertMsg: "Account activation failed. Please try again."
        });
      }
    } catch (error) {
      setState({
        ...state,
        alertType: "danger",
        alertMsg: error.response?.data?.message || "Account activation failed. Please try again."
      });
    }
  };

  return (
    <>
      <Title title={"Login"} />
      {state.loading ? (
        <div className="h-screen flex justify-center items-center">
          <Loader />
        </div>
      ) : (
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex h-screen">
            <Title title={"Login Page"} />
            <div className="hidden md:flex flex-none w-2/5 justify-center items-center bg-blue-500 overflow-hidden">
              <img src={login_img} alt="Login Illustration" className="object-cover w-full h-full" />
            </div>
            <div className="flex-1 flex justify-center items-center bg-white">
              <div className="w-full max-w-md p-8">
                <h1 className="text-2xl font-bold text-left mb-6">{t("Sign In")}</h1>
                <form onSubmit={handleSubmit} aria-label="Login Form">
                  <fieldset className="mb-3 relative">
                    <div className="relative w-full max-w-md">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        <i className="fa fa-envelope"></i>
                      </div>
                      <input
                        id="email"
                        type="email"
                        placeholder={t("Email")}
                        className="w-full py-2 px-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        name="email"
                        autoComplete="username"
                        value={state.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </fieldset>
                  <fieldset className="mb-3 relative">
                    <div className="relative w-full max-w-md">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        <i className="fa fa-lock"></i>
                      </div>
                      <input
                        id="password"
                        type={state.passwordVisible ? "text" : "password"}
                        placeholder={t("Password")}
                        className="w-full py-2 px-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={state.password}
                        name="password"
                        autoComplete="current-password"
                        onChange={handleChange}
                        required
                      />
                      <div 
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                        onClick={togglePasswordVisibility}
                      >
                        <i className={`fa ${state.passwordVisible ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                      </div>
                    </div>
                  </fieldset>
                  <div className="flex items-center justify-between mb-4">
                    <label className="flex items-center cursor-pointer">
                      <div className="relative">
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={isChecked}
                          onChange={handleToggle}
                          onFocus={() => setIsFocused(true)}
                          onBlur={() => setIsFocused(false)}
                        />
                        <div 
                          className={`w-5 h-5 border transition-colors ${
                            isChecked ? 'bg-blue-500 border-blue-500' : 'bg-white border-gray-300'
                          } ${
                            isFocused ? 'ring-2 ring-blue-500 ring-opacity-50 rounded-md' : 'rounded-md'
                          }`}
                        >
                          {isChecked && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={4}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <span className="ml-2">Keep me logged in</span>
                    </label>
                    <NavLink to="/forgetpassword" className="text-blue-500 hover:underline">
                      {t("Forgot Password")}
                    </NavLink>
                  </div>
                  <div className="grid grid-cols-1 gap-1 text-center">
                    <button
                      type="submit"
                      className="w-full bg-blue-600 text-white font-bold py-3 rounded-md hover:bg-blue-700 transition duration-200"
                    >
                      {t("Sign In")}
                    </button>
                  </div>
                </form>
                <div className="text-center mt-2">
                  <span className="text-sm">
                    {t("Don't have an account?")} <NavLink to="/signup" className="text-blue-500 hover:underline">{t("Sign up")}</NavLink>
                  </span>
                </div>
                {state.alertMsg && (
                  <Alert type={state.alertType}>{state.alertMsg}</Alert>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      <AccountActivationModal
        isOpen={showActivationModal}
        onClose={() => setShowActivationModal(false)}
        onActivate={handleActivateAccount}
      />
    </>
  );
}

export default Login;
