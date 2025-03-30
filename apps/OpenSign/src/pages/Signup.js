import React, { useEffect, useState } from "react";
import Parse from "parse";
import axios from "axios";
import { useDispatch } from "react-redux";
import Title from "../components/Title";
import { NavLink, useNavigate, useLocation } from "react-router";
import login_img from "../assets/images/instasign.jpg";
import { useWindowSize } from "../hook/useWindowSize";
import ModalUi from "../primitives/ModalUi";
import { emailRegex } from "../constant/const";
import Alert from "../primitives/Alert";
import { appInfo } from "../constant/appinfo";
import { fetchAppInfo } from "../redux/reducers/infoReducer";
import { showTenant } from "../redux/reducers/ShowTenant";
import { getAppLogo, saveLanguageInLocal, usertimezone } from "../constant/Utils";
import Loader from "../primitives/Loader";
import { useTranslation } from "react-i18next";
import SelectLanguage from "../components/pdf/SelectLanguage";
import countries from "../json/CountriesJson";

function SignUp() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { width } = useWindowSize();
  const [state, setState] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    country: "",
    companyName: "",
    alertType: "success",
    alertMsg: "",
    passwordVisible: false,
    confirmPasswordVisible: false,
    loading: false,
    thirdpartyLoader: false,
    confirmPasswordVisible: false,
    confirmPassword: "",
  });
  const [isCompanySignup, setIsCompanySignup] = useState("no");
  const djangoUrl = 'https://api.instasign.ai';

  // Add state for form fields
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    country: "",
    companyName: "",
    companySignup: "no",
  });

  const [lengthValid, setLengthValid] = useState(false);
  const [caseDigitValid, setCaseDigitValid] = useState(false);
  const [specialCharValid, setSpecialCharValid] = useState(false);

  useEffect(() => {
    checkUserExt();
    const fetchIPAddress = async () => {
      try {
        const ipResponse = await axios.get('https://api.ipify.org?format=json');
        const ipAddress = ipResponse.data.ip;

        const fetchCountry = async () => {
          try {
            const response = await axios.get(`https://ipapi.co/${ipAddress}/json/`);
            const countryName = response.data.country_name;
            
            // Find the country code from the countries list
            const country = countries.find(c => c.name === countryName);
            
            if (country) {
              setFormData(prevFormData => ({
                ...prevFormData,
                country: country.code
              }));
            }
          } catch (error) {
            console.error("Error fetching country:", error);
          }
        };

        fetchCountry();
      } catch (error) {
        console.error("Error fetching IP address:", error);
      }
    };

    fetchIPAddress();
    // eslint-disable-next-line
  }, []);

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

  const checkUserExt = async () => {
    const app = await getAppLogo();
    if (app?.error === "invalid_json") {
      setErrMsg(t("server-down"));
    } else if (
      app?.user === "not_exist"
    )
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

  // Handle change for form fields
  const handleChange = (event) => {
    const { name, value } = event.target;
    
    // Capitalize the first letter of the input value, except for the email field
    const capitalizedValue = name === "email" ? value : value.charAt(0).toUpperCase() + value.slice(1);

    // Check if the field is password or confirmPassword
    if (name === "password" || name === "confirmPassword") {
      setFormData({ ...formData, [name]: value }); // Update state for password fields
    } else {
      setFormData({ ...formData, [name]: capitalizedValue }); // Update state for other fields
    }
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setFormData({ ...formData, password: newPassword });
    // Check conditions separately
    setLengthValid(newPassword.length >= 8);
    setCaseDigitValid(
      /[a-z]/.test(newPassword) &&
      /[A-Z]/.test(newPassword) &&
      /\d/.test(newPassword)
    );
    setSpecialCharValid(/[!@#$%^&*()\-_=+{};:,<.>]/.test(newPassword));
  };

  const handleNavigation = async (sessionToken) => {
    const res = await Parse.User.become(sessionToken);
    if (res) {
      const _user = JSON.parse(JSON.stringify(res));
      // console.log("_user ", _user);
      try {
        const response = await axios.post(`${djangoUrl}/base/api/token/`, {
          email: formData.email,
          password: formData.password
        }, {
          headers: {
            'Content-Type': 'application/json', // Example header
          }
        });
        console.log(response.data);
        const { access, refresh } = response.data; // Destructure access and refresh tokens
        
        // Store tokens in local storage with new names
        localStorage.setItem("django", access);
        localStorage.setItem("djangoRefresh", refresh);
      } catch (error) {
        console.log("Error during token retrieval:", error);
        const msg = error.message || t("something-went-wrong-mssg");
        setState({ loading: false, alertType: "danger", alertMsg: msg });
      }
      localStorage.setItem("accesstoken", sessionToken);
      localStorage.setItem("UserInformation", JSON.stringify(_user));
      localStorage.setItem("accesstoken", _user.sessionToken);
      localStorage.setItem("scriptId", true);
      if (_user.ProfilePic) {
        localStorage.setItem("profileImg", _user.ProfilePic);
      } else {
        localStorage.setItem("profileImg", "");
      }
      // Check extended class user role and tenentId
      try {
        const userSettings = appInfo.settings;
        const extUser = await Parse.Cloud.run("getUserDetails");
        if (extUser) {
          const IsDisabled = extUser?.get("IsDisabled") || false;
          if (!IsDisabled) {
            const userRole = extUser?.get("UserRole");
            const menu =
              userRole && userSettings.find((menu) => menu.role === userRole);
            if (menu) {
              const _currentRole = userRole;
              const _role = _currentRole.replace("contracts_", "");
              localStorage.setItem("_user_role", _role);
              const extInfo_stringify = JSON.stringify([extUser]);
              localStorage.setItem("Extand_Class", extInfo_stringify);
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
              setState({
                loading: false,
                alertType: "success",
                alertMsg: t("registered-user-successfully")
              });
              navigate(`/${menu.pageType}/${menu.pageId}`);
            } else {
              setState({
                loading: false,
                alertType: "danger",
                alertMsg: t("role-not-found")
              });
            }
          } else {
            setState({
              loading: false,
              alertType: "danger",
              alertMsg: t("do-not-access")
            });
          }
        }
      } catch (error) {
        console.log("error in fetch extuser", error);
        const msg = error.message || t("something-went-wrong-mssg");
        setState({ loading: false, alertType: "danger", alertMsg: msg });
      } finally {
        setTimeout(() => setState({ loading: false, alertMsg: "" }), 2000);
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission

    if (!emailRegex.test(formData.email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (lengthValid && caseDigitValid && specialCharValid) {
      setState({ ...state, loading: true });
      const userDetails = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phoneNumber,
        company: formData.companyName,
        jobTitle: "", // You can add this if needed
      };

      try {
        // Attempt to create user on Instasign
        const response = await axios.post(`${djangoUrl}/base/api/v1/register/`, {
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone_number: formData.phoneNumber,
          password: formData.password,
          country: formData.country,
          company_name: formData.companyName,
          user_type: "admin"
        }, {
          headers: {
            'Content-Type': 'application/json', // Ensure the content type is set correctly 
          }
        });
        console.log("Registration response:", response.data);

        // Attempt to create user on Parse
        const user = new Parse.User();
        user.set("name", userDetails.name);
        user.set("email", userDetails.email);
        user.set("password", formData.password);
        user.set("phone", userDetails.phone);
        user.set("username", userDetails.email);

        const userRes = await user.save();
        if (userRes) {
          const params = {
            userDetails: {
              jobTitle: "", // Add job title if needed
              company: userDetails.company,
              name: userDetails.name,
              email: userDetails.email,
              phone: userDetails.phone,
              role: "contracts_Admin",
              timezone: usertimezone,
            },
          };
          const usersignup = await Parse.Cloud.run("addadmin", params);
          if (usersignup) {
            // Call handleNavigation with the session token
            await handleNavigation(userRes.getSessionToken());
          } else {
            throw new Error("Failed to create user on Parse.");
          }
        } else {
          throw new Error("Failed to save user on Parse.");
        }
      } catch (error) {
        console.log("Error during signup", error);
        setErrMsg("Error during signup: " + error.message);
      } finally {
        setState({ ...state, loading: false });
      }
    } else {
      alert("Please ensure your password meets the requirements.");
    }
  };

  // const newHandleSubmit = (event) => {
  //   event.preventDefault()
  //   console.log(formData);
  // }

  const togglePasswordVisibility = (field) => {
    if (field === "password") {
      setState({ ...state, passwordVisible: !state.passwordVisible });
    } else if (field === "confirmPassword") {
      setState({ ...state, confirmPasswordVisible: !state.confirmPasswordVisible });
    }
  };

  return (
    <>
      {state.loading ? (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
          <Loader />
        </div>
      ) : (
        <div className="flex h-screen">
          <Title title={"Signup Page"} />
          <div className="hidden md:flex flex-none w-2/5 justify-center items-center bg-blue-500 overflow-hidden">
  <img src={login_img} alt="Login Illustration" className="object-cover w-full h-full" />
</div>
          <div className="flex-1 flex justify-center items-center bg-white">
            <div className="w-full max-w-2xl p-8">
              <h1 className="text-2xl font-bold text-left mb-6">{t("Sign Up")}</h1>
              <form onSubmit={handleSubmit} aria-label="Login Form">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <fieldset className="relative">
                    <input
                      id="firstName"
                      type="text"
                      placeholder="First Name"
                      className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </fieldset>
                  <fieldset className="relative">
                    <input
                      id="lastName"
                      type="text"
                      placeholder="Last Name"
                      className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </fieldset>
                  <fieldset className="relative">
                    <input
                      id="email"
                      type="email"
                      placeholder="Email"
                      className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </fieldset>
                  <fieldset className="relative">
                    <input
                      id="phoneNumber"
                      type="tel"
                      placeholder="Phone Number"
                      className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      required
                    />
                  </fieldset>
                  <fieldset className="relative">
                    <div className="relative w-full max-w-md">
                      <input
                        id="password"
                        type={state.passwordVisible ? "text" : "password"}
                        placeholder="Password"
                        className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        name="password"
                        value={formData.password}
                        autoComplete="current-password"
                        onChange={handlePasswordChange}
                        required
                      />
                      <div 
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                        onClick={() => togglePasswordVisibility("password")}
                      >
                        <i className={`fa ${state.passwordVisible ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                      </div>
                    </div>
                  </fieldset>
                  <fieldset className="relative">
                    <div className="relative w-full max-w-md">
                      <input
                        id="confirmPassword"
                        type={state.confirmPasswordVisible ? "text" : "password"}
                        placeholder="Confirm Password"
                        className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                      />
                      <div 
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                        onClick={() => togglePasswordVisibility("confirmPassword")}
                      >
                        <i className={`fa ${state.confirmPasswordVisible ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                      </div>
                    </div>
                  </fieldset>
                  <fieldset className="relative">
                    <div className="relative w-full">
                      <select
                        className="w-full cursor-pointer py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        required
                      >
                        {countries.map((country) => (
                          <option key={country.code} value={country.name}>
                            {country.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </fieldset>
                </div>
                <div className="mb-4">
                  <span className="font-bold">Sign up as company:</span>
                  <label className="ml-2 font-bold">
                    <input
                      type="radio"
                      name="companySignup"
                      value="yes"
                      onChange={handleChange}
                    />
                    <span className="ml-1">Yes</span>
                  </label>
                  <label className="ml-2 font-bold">
                    <input
                      type="radio"
                      name="companySignup"
                      value="no"
                      onChange={handleChange}
                      defaultChecked
                    />
                    <span className="ml-1">No</span>
                  </label>
                </div>
                <fieldset className="mb-4 relative">
                  <input
                    id="companyName"
                    type="text"
                    placeholder="Company Name"
                    className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    disabled={formData.companySignup === "no"}
                  />
                </fieldset>
                <div className="grid grid-cols-1 gap-1 text-center mb-6">
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white font-bold py-3 rounded-md hover:bg-blue-700 transition duration-200"
                  >
                    Sign Up
                  </button>
                </div>
              </form>
              <div className="text-center mt-2">
                <span className="text-sm cursor-pointer">
                  {t("Already have an account?")} <NavLink to="/login" className="text-blue-500 hover:underline">{t("Login")}</NavLink>
                </span>
              </div>
              {state.alertMsg && (
                <Alert type={state.alertType}>{state.alertMsg}</Alert>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SignUp;