import React, {
  useState,
  useEffect,
} from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate } from "react-router";
import Parse from "parse";
import { SaveFileSize } from "../constant/saveFileSize";
import dp from "../assets/images/dp.png";
import Title from "../components/Title";
import sanitizeFileName from "../primitives/sanitizeFileName";
import axios from "axios";
import Tooltip from "../primitives/Tooltip";
import {
  getSecureUrl,
  handleSendOTP,
} from "../constant/Utils";
import ModalUi from "../primitives/ModalUi";
import Loader from "../primitives/Loader";
import { useTranslation } from "react-i18next";
import SelectLanguage from "../components/pdf/SelectLanguage";
import { setPaymentMode } from "../redux/reducers/PaymentReducer";
import countries from "../json/CountriesJson";
import _ from 'lodash';

function UserProfile() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  let UserProfile = JSON.parse(localStorage.getItem("UserInformation"));
  let extendUser = JSON.parse(localStorage.getItem("Extand_Class"));
  const [parseBaseUrl] = useState(localStorage.getItem("baseUrl"));
  const [parseAppId] = useState(localStorage.getItem("parseAppId"));
  const [editmode, setEditMode] = useState(false);
  const [name, SetName] = useState(localStorage.getItem("username"));
  const [Phone, SetPhone] = useState(UserProfile && UserProfile.phone);
  const [Image, setImage] = useState(localStorage.getItem("profileImg"));
  const [isLoader, setIsLoader] = useState(false);
  const [percentage, setpercentage] = useState(0);
  const [company, setCompany] = useState(
    extendUser && extendUser?.[0]?.Company
  );
  const [jobTitle, setJobTitle] = useState(
    extendUser && extendUser?.[0]?.JobTitle
  );
  const [isVerifyModal, setIsVerifyModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpLoader, setOtpLoader] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isKyceeVerified, setIsKyceeVerified] = useState(false);
   
  const dispatch = useDispatch();
  const paymentMode = useSelector((state) => state.payment.mode);
  const [tempPaymentMode, setTempPaymentMode] = useState(paymentMode);
  const djangoUser = JSON.parse(localStorage.getItem('djangoUser'));
  const djangoUrl = 'https://api.dev.instasign.ai';

  useEffect(() => {
    setTempPaymentMode(paymentMode);
  }, [paymentMode]);

  useEffect(() => {
    getUserDetail();
    getDjangoUserDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getDjangoUserDetails = async () => {
    try {
      const djangoToken = localStorage.getItem("django");
      const response = await axios.get(`${djangoUrl}/base/api/v1/get/user/detail/`, {
        headers: {
          Authorization: `Bearer ${djangoToken}`
        }
      });

      const userData = response.data.data[0];
      // Update isPostpaid based on the fetched user data
      // setIsPostpaid(userData.payment_mode === 'post_paid'); // Set isPostpaid based on payment_mode
      setIsKyceeVerified(userData.is_kycee_verified);
      console.log("User data fetched successfully:", userData);
    } catch (error) {
      console.log("Error fetching user details:", error.message);
    }
  }

  const handleKyceeVerifyBtn = async() => {
    try {
      const payload = {
        email: "rishabh@intuitiveapps.com",
        first_name: "rishabh",
        last_name: "bilwal",
        phone_number: "+919910629281",
        verification_type: "instant",
        unique_client_id: "TEST01",
        client_secret: "APxVALVWjQrdNQFIOAKZuvXGGnhOxLrQKVwfBNNOvEEOvShNhaGptvvWBaoFVjyiJqOcVtwitJbslNXMwsmTffedXVfjwamoUfrm",
        type: "prod"
      };

      const response = await axios.post("https://sandbox.kycee.in/api/v1/external/gateway/create/verification", payload);
      
      if (response.data && response.data.data && response.data.data.token) {
        window.open(`https://sandbox.kycee.in/?token=${response.data.data.token}`, '_blank');
        startKyceeVerificationCheck(); // Start checking after opening the new tab
      }
    } catch (error) {
      console.error("Error during Kycee verification:", error);
    }
  }

  const startKyceeVerificationCheck = () => {
    const intervalId = setInterval(async () => {
      try {
        const djangoToken = localStorage.getItem("django");
        const response = await axios.get(`${djangoUrl}/base/api/v1/get/user/detail/`, {
          headers: {
            Authorization: `Bearer ${djangoToken}`
          }
        });

        const userData = response.data.data[0];
        
        // Set isPostpaid based on payment_mode
        // if (userData.payment_mode === 'pre_paid') {
        //   setIsPostpaid(false); // Set to false for Prepaid
        // } else if (userData.payment_mode === 'post_paid') {
        //   setIsPostpaid(true); // Set to true for Postpaid
        // }

        if (userData.is_kycee_verified) {
          setIsKyceeVerified(true);
          clearInterval(intervalId); // Stop checking if verified
        }
      } catch (error) {
        console.log("Error fetching user details:", error.message);
      }
    }, 30000); // 30 seconds

    setTimeout(() => clearInterval(intervalId), 5 * 60 * 1000); // Stop after 5 minutes
  };

  const getUserDetail = async () => {
    setIsLoader(true);
    const currentUser = JSON.parse(JSON.stringify(Parse.User.current()));
    let isEmailVerified = currentUser?.emailVerified || false;
    if (isEmailVerified) {
      setIsEmailVerified(isEmailVerified);
      setIsLoader(false);
    } else {
      try {
        const userQuery = new Parse.Query(Parse.User);
        const user = await userQuery.get(currentUser.objectId, {
          sessionToken: localStorage.getItem("accesstoken")
        });
        if (user) {
          isEmailVerified = user?.get("emailVerified");
          setIsEmailVerified(isEmailVerified);
          setIsLoader(false);
        }
      } catch (e) {
        alert(t("something-went-wrong-mssg"));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let phn = Phone,
      res = "";
    if (!res) {
      setIsLoader(true);
      try {
        const userQuery = Parse.Object.extend("_User");
        const query = new Parse.Query(userQuery);
        await query.get(UserProfile.objectId).then((object) => {
          object.set("name", name);
          object.set("ProfilePic", Image);
          object.set("phone", phn || "");
          object.save().then(
            async (response) => {
              if (response) {
                let res = response.toJSON();
                let rr = JSON.stringify(res);
                localStorage.setItem("UserInformation", rr);
                SetName(res.name);
                SetPhone(res?.phone || "");
                setImage(res.ProfilePic);
                localStorage.setItem("username", res.name);
                localStorage.setItem("profileImg", res.ProfilePic);
                await updateExtUser({
                  Name: res.name,
                  Phone: res?.phone || ""
                });
                await updatePaymentMode(tempPaymentMode ? 'post_paid' : 'pre_paid');
                dispatch(setPaymentMode(tempPaymentMode));
                alert(t("profile-update-alert"));
                setEditMode(false);
                setIsLoader(false);
                //navigate("/dashboard/35KBoSgoAK");
              }
            },
            (error) => {
              alert(t("something-went-wrong-mssg"));
              console.error("Error while updating tour", error);
              setIsLoader(false);
            }
          );
        });
      } catch (error) {
        console.log("err", error);
      }
    }
  };

  // Debounced version of handleSubmit
  const debouncedHandleSubmit = _.debounce(handleSubmit, 300);

  //  `updateExtUser` is used to update user details in extended class
  const updateExtUser = async (obj) => {
    try {
      const extData = JSON.parse(localStorage.getItem("Extand_Class"));
      const ExtUserId = extData[0].objectId;
      const body = {
        Phone: obj?.Phone || "",
        Name: obj.Name,
        JobTitle: jobTitle,
        Company: company,
        Language: obj?.language || "",
      };

      await axios.put(
        parseBaseUrl + "classes/contracts_Users/" + ExtUserId,
        body,
        {
          headers: {
            "Content-Type": "application/json",
            "X-Parse-Application-Id": parseAppId,
            "X-Parse-Session-Token": localStorage.getItem("accesstoken")
          }
        }
      );
      const res = await Parse.Cloud.run("getUserDetails");

      const json = JSON.parse(JSON.stringify([res]));
      const extRes = JSON.stringify(json);
      localStorage.setItem("Extand_Class", extRes);
    } catch (e) {
      console.log("error in save data in contracts_Users class");
    }
  };
  // file upload function
  const fileUpload = async (file) => {
    if (file) {
      await handleFileUpload(file);
    }
  };

  const handleFileUpload = async (file) => {
    const size = file.size;
    const pdfFile = file;
    const fileName = file.name;
    const name = sanitizeFileName(fileName);
    const parseFile = new Parse.File(name, pdfFile);

    try {
      const response = await parseFile.save({
        progress: (progressValue, loaded, total, { type }) => {
          if (type === "upload" && progressValue !== null) {
            const percentCompleted = Math.round((loaded * 100) / total);
            // console.log("percentCompleted ", percentCompleted);
            setpercentage(percentCompleted);
          }
        }
      });
      // // The response object will contain information about the uploaded file
      // console.log("File uploaded:", response);

      if (response?.url()) {
        const fileRes = await getSecureUrl(response?.url());
        if (fileRes?.url) {
          setImage(fileRes?.url);
          setpercentage(0);
          const tenantId = localStorage.getItem("TenantId");
          SaveFileSize(size, fileRes?.url, tenantId);
          return fileRes?.url;
        }
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };
  if (
    localStorage.getItem("accesstoken") === null &&
    localStorage.getItem("pageType") === null
  ) {
    let _redirect = `/`;
    return <Navigate to={_redirect} />;
  }

  //`handleVerifyBtn` function is used to send otp on user mail
  const handleVerifyBtn = async () => {
    setIsVerifyModal(true);
    await handleSendOTP(Parse.User.current().getEmail());
  };

  const handleCloseVerifyModal = async () => {
    setIsVerifyModal(false);
  };
  //`handleVerifyEmail` function is used to verify email with otp
  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    setOtpLoader(true);
    try {
      const resEmail = await Parse.Cloud.run("verifyemail", {
        otp: otp,
        email: Parse.User.current().getEmail()
      });
      if (resEmail?.message === "Email is verified.") {
        setIsEmailVerified(true);
        alert(t("Email-verified-alert-1"));
      } else if (resEmail?.message === "Email is already verified.") {
        setIsEmailVerified(true);
        alert(t("Email-verified-alert-2"));
      }
      setOtp("");
      setIsVerifyModal(false);
    } catch (error) {
      alert(error.message);
    } finally {
      setOtpLoader(false);
    }
  };
  //function to use resend otp for email verification
  const handleResend = async (e) => {
    e.preventDefault();
    setOtpLoader(true);
    await handleSendOTP();
    setOtpLoader(false);
    alert(t("otp-sent-alert"));
  };

  const handleCancel = () => {
    setTempPaymentMode(paymentMode);
    setEditMode(false);
    SetName(localStorage.getItem("username"));
    SetPhone(UserProfile && UserProfile.phone);
    setImage(localStorage.getItem("profileImg"));
    setCompany(extendUser && extendUser?.[0]?.Company);
    setJobTitle(extendUser?.[0]?.JobTitle);
  };

  const updatePaymentMode = async (mode) => {
    try {
      const djangoToken = localStorage.getItem("django");
      const response = await axios.post(`${djangoUrl}/base/api/v1/update/settings/`, {
        payment_mode: mode
      }, {
        headers: {
          Authorization: `Bearer ${djangoToken}`
        }
      });
      console.log("Payment mode updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating payment mode:", error);
    }
  };

  const getCountryName = (countryCode) => {
    const country = countries.find((c) => c.code === countryCode);
    return country ? country.name : countryCode;
  };

  return (
    <React.Fragment>
      <Title title={"Profile"} />
      {isLoader ? (
        <div className="h-[100vh] flex justify-center items-center">
          <Loader />
        </div>
      ) : (
        <div className="flex flex-col items-center w-full relative h-[80vh]">
          <div className="bg-base-100 text-base-content flex flex-col justify-between shadow-md rounded-box w-full p-4">
            <div className="flex flex-row justify-start items-center mb-4">
              <div className="flex flex-col justify-center items-center mr-8">
                <div className="w-[250px] h-[250px] overflow-hidden rounded-full">
                  <img
                    className="object-cover w-full h-full"
                    src={Image === "" ? dp : Image}
                    alt="dp"
                  />
                </div>
                {editmode && (
                  <input
                    type="file"
                    className="op-file-input op-file-input-bordered op-file-input-sm max-w-[270px] mt-4 text-sm"
                    accept="image/png, image/gif, image/jpeg"
                    onChange={(e) => {
                      let files = e.target.files;
                      fileUpload(files[0]);
                    }}
                  />
                )}
                {percentage !== 0 && (
                  <div className="flex items-center gap-x-2 mt-2">
                    <div className="h-2 rounded-full w-[150px] bg-gray-200">
                      <div
                        className="h-2 rounded-full bg-blue-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-black text-sm">{percentage}%</span>
                  </div>
                )}
                <div className="text-base font-semibold pt-4">
                  {localStorage.getItem("_user_role")}
                </div>
              </div>
              <ul className="flex flex-col p-2 text-sm w-full">
                <li
                  className={`flex justify-between items-center border-y-[1px] border-gray-300 break-all ${
                    editmode ? "py-1.5" : "py-2"
                  }`}
                >
                  <span className="font-semibold">{t("name")}:</span>{" "}
                  {editmode ? (
                    <input
                      type="text"
                      value={name}
                      className="op-input op-input-bordered op-input-sm w-[180px] focus:outline-none hover:border-base-content text-sm"
                      onChange={(e) => SetName(e.target.value)}
                    />
                  ) : (
                    <span>{localStorage.getItem("username")}</span>
                  )}
                </li>
                <li
                  className={`flex justify-between items-center border-b-[1px] border-gray-300 break-all ${
                    editmode ? "py-1.5" : "py-2"
                  }`}
                >
                  <span className="font-semibold">{t("phone")}:</span>{" "}
                  {editmode ? (
                    <input
                      type="text"
                      className="op-input op-input-bordered op-input-sm w-[180px] focus:outline-none hover:border-base-content text-sm"
                      onChange={(e) => SetPhone(e.target.value)}
                      value={Phone}
                    />
                  ) : (
                    <span>{UserProfile && UserProfile.phone}</span>
                  )}
                </li>
                <li className="flex justify-between items-center border-b-[1px] border-gray-300 py-2 break-all">
                  <span
                    data-tooltip-id="email-tooltip"
                    className="font-semibold flex gap-1"
                  >
                    {t("email")}:{" "}
                    {editmode && (
                      <Tooltip
                        message={t("email-help")}
                        maxWidth="max-w-[250px]"
                      />
                    )}
                  </span>
                  <span>{UserProfile && UserProfile.email}</span>
                </li>
                <li
                  className={`flex justify-between items-center border-b-[1px] border-gray-300 break-all ${
                    editmode ? "py-1.5" : "py-2"
                  }`}
                >
                  <span className="font-semibold">{t("company")}:</span>{" "}
                  {editmode ? (
                    <input
                      type="text"
                      value={company}
                      className="op-input op-input-bordered op-input-sm w-[180px] focus:outline-none hover:border-base-content text-sm"
                      onChange={(e) => setCompany(e.target.value)}
                    />
                  ) : (
                    <span>{extendUser?.[0].Company}</span>
                  )}
                </li>
                {/* <li
                  className={`flex justify-between items-center border-b-[1px] border-gray-300 break-all ${
                    editmode ? "py-1.5" : "py-2"
                  }`}
                >
                  <span className="font-semibold">{t("job-title")}:</span>{" "}
                  {editmode ? (
                    <input
                      type="text"
                      value={jobTitle}
                      className="op-input op-input-bordered op-input-sm w-[180px] focus:outline-none hover:border-base-content text-sm"
                      onChange={(e) => setJobTitle(e.target.value)}
                    />
                  ) : (
                    <span>{extendUser?.[0]?.JobTitle}</span>
                  )}
                </li> */}
                {/* <li className="flex justify-between items-center border-b-[1px] border-gray-300 py-2 break-all">
                  <span className="font-semibold">{t("Email Verified")}:</span>{" "}
                  <span>
                    {isEmailVerified ? (
                      <span className="bg-green-100 text-green-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
                        Verified
                      </span>
                    ) : (
                      <span className="bg-red-100 text-red-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
                        Not verified (
                        <span
                          onClick={() => handleVerifyBtn()}
                          className="hover:underline text-blue-600 cursor-pointer"
                        >
                          verify
                        </span>
                        )
                      </span>
                    )}
                  </span>
                </li> */}
                <li className="flex justify-between items-center border-b-[1px] border-gray-300 py-2 break-all">
                  <span className="font-semibold">{t("Email Verified")}:</span>{" "}
                  <span className="flex items-center justify-center">
                    {isEmailVerified ? (
                      <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded text-center">
                        Verified
                      </span>
                    ) : (
                      <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded text-center">
                        Not verified (
                        <span
                          onClick={() => handleVerifyBtn()}
                          className="hover:underline text-blue-600 cursor-pointer"
                        >
                          verify
                        </span>
                        )
                      </span>
                    )}
                  </span>
                </li>
                <li className="flex justify-between items-center border-b-[1px] border-gray-300 py-2 break-all">
                  <span className="font-semibold">{t("Identity Verified")}:</span>{" "}
                  <span className="flex items-center justify-center">
                    {isKyceeVerified ? (
                      <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded text-center">
                        Verified
                      </span>
                    ) : (
                      <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded text-center">
                        Not verified (
                        <span
                          onClick={() => handleKyceeVerifyBtn()}
                          className="hover:underline text-blue-600 cursor-pointer"
                        >
                          verify
                        </span>
                        )
                      </span>
                    )}
                  </span>
                </li>
                {/* <li
                  className={`flex justify-between items-center border-b-[1px] border-gray-300 break-all ${
                    editmode ? "py-1.5" : "py-2"
                  }`}
                >
                  <span className="font-semibold">{t("language")}:</span>{" "}
                  <SelectLanguage
                    isProfile={true}
                    updateExtUser={updateExtUser}
                  />
                </li> */}
                <li
                  className={`flex justify-between items-center border-b-[1px] border-gray-300 break-all ${
                    editmode ? "py-1.5" : "py-2"
                  }`}
                >
                  <span className="font-semibold">{t("Country")}:</span>{" "}
                  <span>{getCountryName(djangoUser.country)}</span>
                </li>
                <li className="flex justify-between items-center border-b-[1px] border-gray-300 break-all">
                  <span className="font-semibold">Payment Mode:</span>
                  <div className="flex items-center">
                    <span className="mr-2">{"Prepaid"}</span>
                    <label className={`relative inline-flex mt-2 items-center cursor-pointer ${!editmode ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={tempPaymentMode}
                        onChange={() => {
                          const newPostpaidStatus = !tempPaymentMode;
                          setTempPaymentMode(newPostpaidStatus);
                          console.log("Payment mode changed to:", newPostpaidStatus);
                        }}
                        disabled={!editmode}
                      />
                      <div className={`w-9 h-5 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600 ${!editmode ? 'bg-gray-400' : ''}`}></div>
                    </label>
                    <span className="ml-2">Postpaid</span>
                  </div>
                </li>
              </ul>
            </div>
            <div className="flex justify-center gap-4 pt-4">
              <button
                type="button"
                onClick={(e) => {
                  editmode ? debouncedHandleSubmit(e) : setEditMode(true);
                }}
                className="op-btn text-white op-btn-primary w-[100px]"
              >
                {editmode ? t("save") : t("edit")}
              </button>
              <button
                type="button"
                onClick={() =>
                  editmode ? handleCancel() : navigate("/changepassword")
                }
                className={`op-btn ${
                  editmode ? "op-btn-ghost w-[100px]" : "op-btn-secondary"
                } ${!editmode ? "bg-[#D6DBE5] text-black border border-gray-300 hover:bg-gray-300" : ""}`}
              >
                {editmode ? t("cancel") : t("change-password")}
              </button>
            </div>
          </div>
          {isVerifyModal && (
            <ModalUi
              isOpen
              title={t("otp-verification")}
              handleClose={handleCloseVerifyModal}
            >
              {otpLoader ? (
                <div className="h-[150px] flex justify-center items-center">
                  <Loader />
                </div>
              ) : (
                <form onSubmit={(e) => handleVerifyEmail(e)}>
                  <div className="px-6 py-3 text-base-content">
                    <label className="mb-2">{t("enter-otp")}</label>
                    <input
                      onInvalid={(e) =>
                        e.target.setCustomValidity(t("input-required"))
                      }
                      onInput={(e) => e.target.setCustomValidity("")}
                      required
                      type="tel"
                      pattern="[0-9]{4}"
                      className="w-full op-input op-input-bordered op-input-sm focus:outline-none hover:border-base-content text-xs"
                      placeholder={t("otp-placeholder")}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                    />
                  </div>
                  <div className="px-6 mb-3">
                    <button type="submit" className="op-btn op-btn-primary">
                      {t("verify")}
                    </button>
                    <button
                      className="op-btn op-btn-secondary ml-2"
                      onClick={(e) => handleResend(e)}
                    >
                      {t("resend")}
                    </button>
                  </div>
                </form>
              )}
            </ModalUi>
          )}
        </div>
      )}
    </React.Fragment>
  );
}

export default UserProfile;
