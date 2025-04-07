import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const AccountActivationModal = ({ isOpen, onClose, onActivate }) => {
  const { t } = useTranslation();
  const [cinFile, setCinFile] = useState(null);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setCinFile(file);
  };

  const handleOtpChange = (index, value) => {
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleResendOtp = () => {
    // Implement OTP resend logic here
  };

  const handleSubmit = () => {
    const otpValue = otp.join("");
    onActivate({ otp: otpValue, cinFile });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">Activate your account</h2>
        
        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            A One-Time Password (OTP) has been sent to your registered email.
          </p>
          
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Upload CIN Certificate
            </label>
            <div className="flex items-center">
              <button
                onClick={() => document.getElementById("cin-file").click()}
                className="bg-white border border-gray-300 rounded px-4 py-2 hover:bg-gray-50"
              >
                Choose File
              </button>
              <span className="ml-3 text-gray-600">
                {cinFile ? cinFile.name : "No file chosen"}
              </span>
              <input
                type="file"
                id="cin-file"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Please enter the OTP below.
            </label>
            <div className="flex gap-2 justify-between">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  className="w-12 h-12 text-center border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              ))}
            </div>
            <p className="mt-2 text-gray-600">
              If you have not received the OTP, please click the{" "}
              <button
                onClick={handleResendOtp}
                className="text-blue-600 hover:underline"
              >
                Resend OTP
              </button>{" "}
              link.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Activate Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountActivationModal; 