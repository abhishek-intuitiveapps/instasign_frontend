import React, {useState, useRef, useEffect} from 'react';
import ModalUi from './ModalUi';
import { useNavigate } from 'react-router';
import Parse from 'parse';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const AccountActivationModal = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [activationModal, setActivationModal] = useState(true);
    const [otpScreen, setOtpScreen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileError, setFileError] = useState('');
    const [uploadStatus, setUploadStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [otpValues, setOtpValues] = useState(Array(6).fill(''));
    const [isOtpVerified, setIsOtpVerified] = useState(false);
    const [otpLoading, setOtpLoading] = useState(false);
    const [otpError, setOtpError] = useState('');
    const otpInputRefs = useRef([]);
    const djangoToken = localStorage.getItem('django');
    const djangoUrl = process.env.REACT_APP_DJANGO_URL;
    const apiBaseUrl = 'https://api.dev.instasign.ai';
    
    // Get Django user to check status
    const djangoUser = JSON.parse(localStorage.getItem('djangoUser'));
    const isPendingCin = djangoUser?.status === 'pending_cin';
    const uploadedFileName = djangoUser?.cin_certificate || '';

    const [editMode, setEditMode] = useState(false);

    // Add this helper function to extract filename from URL
    const getFileNameFromUrl = (url) => {
        if (!url) return '';
        const parts = url.split('/');
        return parts[parts.length - 1];
    };

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
    
    const requestOtp = async () => {
        setOtpLoading(true);
        setOtpError('');
        try {
            const response = await axios.get(`${apiBaseUrl}/base/api/v1/otp/verification/`, {
                headers: {
                    'Authorization': `Bearer ${djangoToken}`
                }
            });
            
            if (response.status === 200) {
                return true;
            } else {
                setOtpError('Failed to send OTP. Please try again.');
                return false;
            }
        } catch (error) {
            setOtpError(`Error sending OTP: ${error.message}`);
            return false;
        } finally {
            setOtpLoading(false);
        }
    };
    
    const handleActivateAccount = async () => {
        const success = await requestOtp();
        if (success) {
            setOtpScreen(true);
        }
    };
    
    const handleResendOTP = async () => {
        await requestOtp();
    };

    const verifyOtp = async (manualOtp = null) => {
        setOtpLoading(true);
        setOtpError('');
        try {
            // Use manually provided OTP if available, otherwise use state
            const otp = manualOtp || otpValues.join('');
            console.log("Submitting OTP:", otp); // Debug log
            
            const response = await axios.post(`${apiBaseUrl}/base/api/v1/otp/verification/`, 
                { otp },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${djangoToken}`
                    }
                }
            );
            
            if (response.status === 200) {
                setIsOtpVerified(true);
                return true;
            } else {
                setOtpError('OTP verification failed. Please try again.');
                return false;
            }
        } catch (error) {
            setOtpError(`Error verifying OTP: ${error.message}`);
            return false;
        } finally {
            setOtpLoading(false);
        }
    };

    const handleOtpChange = (index, value) => {
        // Allow only numeric values
        if (value !== '' && !/^\d+$/.test(value)) {
            return;
        }

        // Create a new array with the current value updated
        const newOtpValues = [...otpValues];
        newOtpValues[index] = value;
        setOtpValues(newOtpValues);

        // Move to the next input field if a digit is entered
        if (value !== '' && index < 5) {
            otpInputRefs.current[index + 1].focus();
        }

        // For the last digit (index 5), ensure we include it in the OTP verification
        if (index === 5 && value !== '') {
            // Create a complete OTP array with the latest input
            const completeOtp = [...newOtpValues];
            completeOtp[5] = value; // Ensure the last digit is included
            
            // Check if we have all 6 digits
            if (completeOtp.every(val => val !== '')) {
                // Verify with the complete OTP string directly
                const completeOtpString = completeOtp.join('');
                verifyOtp(completeOtpString);
            }
        }
        // For non-last digits, only call verify if all fields are filled
        else if (newOtpValues.every(val => val !== '') && newOtpValues.length === 6) {
            verifyOtp();
        }
    };

    const handleKeyDown = (index, e) => {
        // Handle backspace: move focus to previous input if current is empty
        if (e.key === 'Backspace' && otpValues[index] === '' && index > 0) {
            otpInputRefs.current[index - 1].focus();
        }
    };
    
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFileError('');
        setUploadStatus('');
        
        if (!file) {
            setSelectedFile(null);
            return;
        }
        
        const fileType = file.type;
        const validTypes = ['application/pdf'];
        
        if (!validTypes.includes(fileType)) {
            setFileError('Only PDF files are allowed');
            setSelectedFile(null);
            return;
        }
        
        setSelectedFile(file);
    };
    
    const uploadCertificate = async () => {
        if (!selectedFile) {
            setFileError('Please select a file to upload');
            return;
        }
        
        setLoading(true);
        setUploadStatus('');
        setFileError('');
        
        try {
            // Convert file to base64
            const reader = new FileReader();
            
            const base64Promise = new Promise((resolve, reject) => {
                reader.onload = () => {
                    // Get base64 string (remove the data:application/pdf;base64, part)
                    // const base64String = reader.result.split(',')[1];
                    const base64String = reader.result;
                    resolve(base64String);
                };
                reader.onerror = (error) => reject(error);
            });
            
            reader.readAsDataURL(selectedFile);
            
            const base64Data = await base64Promise;
            
            // Send the base64 data to the API using axios
            const response = await axios.post(`${apiBaseUrl}/base/api/v1/upload/certificate/`, {
                certificate: base64Data
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${djangoToken}`
                }
            });
            
            if (response.status === 200) {
                setUploadStatus('Certificate uploaded successfully');
                // Refresh user data to get updated status
                try {
                    const userResponse = await axios.get(`${apiBaseUrl}/base/api/v1/get/user/detail/`, {
                        headers: {
                            Authorization: `Bearer ${djangoToken}`
                        }
                    });
                    
                    const userData = userResponse.data.data[0];
                    localStorage.setItem("djangoUser", JSON.stringify(userData));
                } catch (error) {
                    console.error("Error refreshing user data:", error);
                }
            } else {
                setFileError(`Upload failed: ${response.data.message || 'Unknown error'}`);
            }
        } catch (error) {
            setFileError(`Error uploading certificate: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

  return (
    <ModalUi
      isOpen={activationModal}
      title="Activate your account"
      handleClose={() => {}}
      showClose={false}
    >
      {isPendingCin ? (
        // Document uploaded screen - waiting for validation
        <div className="p-5">
          {/* <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Activate your account</h2>
          </div> */}
          <p className="mb-6">
            Your account will be activated once your document is validated.
          </p>
          {uploadedFileName && (
            <div className="mb-8">
              <p className="font-medium mb-2">File Name:</p>
              <div className="flex items-center">
                <span>{getFileNameFromUrl(uploadedFileName)}</span>
                <button 
                  onClick={() => setEditMode(true)} 
                  className="ml-2 text-blue-500 hover:text-blue-600 focus:outline-none"
                >
                  <i className="fal fa-edit"></i>
                </button>
              </div>
              {editMode && (
                <div className="mt-4">
                  <div className="flex items-center">
                    <label htmlFor="new-file-upload" className="cursor-pointer border border-gray-300 px-4 py-2 rounded-l-md bg-gray-50 whitespace-nowrap">
                      Choose File
                    </label>
                    <input 
                      id="new-file-upload" 
                      type="file" 
                      accept="application/pdf" 
                      className="hidden" 
                      onChange={handleFileChange}
                    />
                    <div className="border border-gray-300 mb-2 border-l-0 px-4 py-2 rounded-r-md flex-1 overflow-hidden">
                      <p className="truncate">{selectedFile ? selectedFile.name : 'No file chosen'}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Only PDF files are accepted</p>
                  {fileError && <p className="text-red-500 text-sm mt-1">{fileError}</p>}
                  {uploadStatus && <p className="text-green-500 text-sm mt-1">{uploadStatus}</p>}
                  <div className="flex gap-2 mt-3">
                    <button
                      className="rounded-md bg-blue-500 text-white px-4 py-2 disabled:bg-blue-300"
                      onClick={async () => {
                        const prevStatus = uploadStatus;
                        await uploadCertificate();
                        // Only close edit mode if upload was successful
                        if (uploadStatus !== prevStatus && !fileError) {
                          setEditMode(false);
                        }
                      }}
                      disabled={!selectedFile || loading}
                    >
                      {loading ? 'Uploading...' : 'Upload'}
                    </button>
                    <button
                      className="rounded-md border border-gray-300 bg-white px-4 py-2"
                      onClick={() => setEditMode(false)}
                    >
                      Close
                    </button>
                  </div>
                  
                </div>
              )}
            </div>
          )}
          <div className="flex justify-end mt-8">
            <button 
              className="rounded-md bg-red-500 text-white px-6 py-2"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      ) : !otpScreen ? (
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
              disabled={otpLoading}
            >
              {otpLoading ? 'Sending OTP...' : 'Activate Account'}
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
            <h3 className="font-medium mb-3">Please enter the OTP below.</h3>
            <div className="flex gap-2 justify-center">
              {[...Array(6)].map((_, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  className="border border-gray-300 rounded-md w-14 h-12 text-center text-xl"
                  placeholder="-"
                  value={otpValues[index]}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  ref={(ref) => (otpInputRefs.current[index] = ref)}
                  disabled={otpLoading}
                />
              ))}
            </div>
            {otpError && <p className="text-red-500 text-sm mt-2 text-center">{otpError}</p>}
            {isOtpVerified && <p className="text-green-500 text-sm mt-2 text-center">OTP verified successfully!</p>}
          </div>
          <p className="mb-6">
            If you didn't get the OTP, click Resend OTP.{" "}
            <button 
              className="text-blue-600 font-semibold"
              onClick={handleResendOTP}
              disabled={otpLoading}
            >
              Resend OTP
            </button>{" "}
            .
          </p>
          <div className="mb-6">
            <h3 className="font-medium mb-3">Upload CIN Certificate</h3>
            <div className={`flex flex-col ${!isOtpVerified ? 'opacity-50 pointer-events-none' : ''}`}>
              <div className="flex items-center">
                <label htmlFor="file-upload" className={`cursor-pointer mt-2 border border-gray-300 px-4 py-2 rounded-l-md bg-gray-50 whitespace-nowrap ${!isOtpVerified ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                  Choose File
                </label>
                <input 
                  id="file-upload" 
                  type="file" 
                  accept=".pdf,.docx,application/pdf" 
                  className="hidden" 
                  onChange={handleFileChange}
                  disabled={!isOtpVerified}
                />
                <div className="border border-gray-300 border-l-0 px-4 py-2 rounded-r-md flex-1 overflow-hidden">
                  <p className="truncate">{selectedFile ? selectedFile.name : 'No file chosen'}</p>
                </div>
              </div>
              {fileError && <p className="text-red-500 text-sm mt-1">{fileError}</p>}
              {uploadStatus && <p className="text-green-500 text-sm mt-1">{uploadStatus}</p>}
              <button
                className="mt-3 rounded-md bg-blue-500 text-white px-4 py-2 disabled:bg-blue-300"
                onClick={uploadCertificate}
                disabled={!selectedFile || loading || !isOtpVerified}
              >
                {loading ? 'Uploading...' : 'Upload Certificate'}
              </button>
              <p className="text-xs text-gray-500 mt-1">Only PDF and DOCX files are accepted</p>
              {!isOtpVerified && <p className="text-yellow-500 text-sm mt-2">Please verify OTP to enable certificate upload</p>}
            </div>
          </div>
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