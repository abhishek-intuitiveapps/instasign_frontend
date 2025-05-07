import React, { useState, useEffect } from "react";
import GetDashboard from "../components/dashboard/GetDashboard";
import { useNavigate, useParams } from "react-router";
import Title from "../components/Title";
import { useDispatch } from "react-redux";
import { saveTourSteps } from "../redux/reducers/TourStepsReducer";
import dashboardJson from "../json/dashboardJson";
import Loader from "../primitives/Loader";
import ModalUi from "../primitives/ModalUi";
import { useTranslation } from "react-i18next";

const Dashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [dashboard, setdashboard] = useState({});
  const [loading, setloading] = useState(true);

  // account activation modal
  const [activationModal, setActivationModal] = useState(true);
  const [otpScreen, setOtpScreen] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("accesstoken")) {
      if (id !== undefined) {
        getDashboard(id);
      } else {
        getDashboard(localStorage.getItem("PageLanding"));
      }
    } else {
      navigate("/login", { replace: true, state: { from: "" } });
    }
    // eslint-disable-next-line
  }, [id]);

  const getDashboard = async (id) => {
    try {
      const dashboard = dashboardJson.find((x) => x.id === id);
      setdashboard(dashboard);
      const dashboardTour = dashboard.columns
        .filter((col) => {
          if (col.widget.data && col.widget.data.tourSection) {
            return col;
          }
        })
        .map((col) => {
          return {
            selector: `[data-tut=${col.widget.data.tourSection}]`,
            content: t(`tour-mssg.${col.widget.label}`),
            position: "top"
            // style: { backgroundColor: "#abd4d2" },
          };
        });
      dispatch(saveTourSteps(dashboardTour));
      setloading(false);
    } catch (e) {
      console.error("Problem", e);
      setloading(false);
    }
  };

  // account activation modal
  const handleLogout = () => {
    // Handle logout functionality here
    console.log("Logout clicked");
  };

  const handleActivateAccount = () => {
    setOtpScreen(true);
  };

  const handleResendOTP = () => {
    console.log("Resend OTP clicked");
  };

  return (
    <React.Fragment>
      <Title title="Dashboard" />
      {loading ? (
        <div className="h-[300px] w-full bg-white flex justify-center items-center rounded-md">
          <Loader />
        </div>
      ) : (
        <GetDashboard dashboard={dashboard} />
      )}

      {/* account activation modal */}
      <ModalUi
        isOpen={activationModal}
        title="Activate your account"
        handleClose={() => setActivationModal(false)}
        showClose={true}
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
                Logout
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
                Logout
              </button>
            </div>
          </div>
        )}
      </ModalUi>
    </React.Fragment>
  );
};

export default Dashboard;
