import React, {useState} from 'react';
import ModalUi from './ModalUi';
import { useNavigate } from 'react-router';
import Parse from 'parse';
import { useTranslation } from 'react-i18next';

const AccountActivationModal = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [activationModal, setActivationModal] = useState(true);
    const [otpScreen, setOtpScreen] = useState(false);

    const handleLogout = async () => {
        try {
            await Parse.User.logOut();
        } catch (err) {
            console.log("Err while logging out", err);
        }
        
        // Preserve necessary items in localStorage
        let appdata = localStorage.getItem("userSettings");
        let applogo = localStorage.getItem("appLogo");
        let defaultmenuid = localStorage.getItem("defaultmenuid");
        let PageLanding = localStorage.getItem("PageLanding");
        let baseUrl = localStorage.getItem("baseUrl");
        let appid = localStorage.getItem("parseAppId");
        
        localStorage.clear();
        
        // Restore preserved items
        localStorage.setItem("appLogo", applogo);
        localStorage.setItem("defaultmenuid", defaultmenuid);
        localStorage.setItem("PageLanding", PageLanding);
        localStorage.setItem("userSettings", appdata);
        localStorage.setItem("baseUrl", baseUrl);
        localStorage.setItem("parseAppId", appid);
        
        navigate("/login");
    };
    
    const handleActivateAccount = () => {
        setOtpScreen(true);
    };
    
    const handleResendOTP = () => {
        console.log("Resend OTP clicked");
        // Add API call to resend OTP here
    };
    

  return (
    <ModalUi
      isOpen={activationModal}
      title="Activate your account"
      handleClose={() => {}}
      showClose={false}
    >
      {!otpScreen ? (
        <div className="p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Welcome to Instasign!</h2>
          </div>
          <p className="mb-8">
            To access your account, please activate your account. If you do not see an activation email in your inbox, please check your spam or junk folder.
          </p>
          <div className="flex justify-center gap-4 mt-8">
            <button 
              className="rounded-md bg-red-500 text-white px-6 py-2"
              onClick={handleLogout}
            >
              {t("log-out")}
            </button>
            <button 
              className="rounded-md border border-gray-300 bg-white px-6 py-2"
              onClick={handleActivateAccount}
            >
              Activate Account
            </button>
          </div>
        </div>
      ) : (
        <div className="p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Account Activation</h3>
          </div>
          <p className="mb-6">
            A One-Time Password (OTP) has been sent to your registered email.
          </p>
          <div className="mb-6">
            <h3 className="font-medium mb-3">Upload CIN Certificate</h3>
            <div className="flex items-center">
              <button className="border border-gray-300 px-4 py-2 rounded-l-md">Choose File</button>
              <div className="border border-gray-300 border-l-0 px-4 py-2 rounded-r-md flex-grow">No file chosen</div>
            </div>
          </div>
          <div className="mb-6">
            <h3 className="font-medium mb-3">Please enter the OTP below.</h3>
            <div className="flex gap-2 justify-center">
              {[...Array(6)].map((_, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  className="border border-gray-300 rounded-md w-14 h-12 text-center text-xl"
                  placeholder="-"
                />
              ))}
            </div>
          </div>
          <p className="mb-6">
            If you have not received the OTP, please click the{" "}
            <button 
              className="text-blue-600 font-semibold"
              onClick={handleResendOTP}
            >
              Resend OTP
            </button>{" "}
            link.
          </p>
          <div className="flex justify-end mt-8">
            <button 
              className="rounded-md bg-red-500 text-white px-6 py-2"
              onClick={handleLogout}
            >
              {t("log-out")}
            </button>
          </div>
        </div>
      )}
    </ModalUi>
  )
}

export default AccountActivationModal