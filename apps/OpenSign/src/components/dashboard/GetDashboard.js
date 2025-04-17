import React, { Suspense, lazy, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { WalletCard } from "../../pages/WalletCard";
import { useSelector } from "react-redux";
import Parse from "parse";
const DashboardButton = lazy(() => import("./DashboardButton"));
const DashboardCard = lazy(() => import("./DashboardCard"));
const DashboardReport = lazy(() => import("./DashboardReport"));

const buttonList = [
  {
    label: "Sign yourself",
    redirectId: "sHAnZphf69",
    redirectType: "Form",
    icon: "fa-light fa-pen-nib"
  },
  {
    label: "Request signatures",
    redirectId: "8mZzFxbG1z",
    redirectType: "Form",
    icon: "fa-light fa-paper-plane"
  }
];
const GetDashboard = (props) => {
  const { t } = useTranslation();
  const [walletDetails, setWalletDetails] = useState(null);
  const djangoUrl = process.env.REACT_APP_DJANGO_URL;
  const djangoToken = localStorage.getItem("django");
  const [userList, setUserList] = useState([]);
  const navigate = useNavigate();
  const paymentMode = useSelector((state) => state.payment.mode);
  const djangoUser = JSON.parse(localStorage.getItem('djangoUser'));
  const [hoveredCards, setHoveredCards] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);
  

  const fetchWalletDetails = async () => {
    try {
      const response = await axios.get(`${djangoUrl}/base/api/v1/get/wallet/`, {
        headers: {
          Authorization: `Bearer ${djangoToken}`,
        },
      });
      if (response.data.status) {
        console.log("Wallet details fetched successfully:", response.data.data);
        setWalletDetails(response.data.data);
      } else {
        console.error("Failed to fetch wallet details:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching wallet details:", error);
    }
  };

  async function fetchUserList() {
    try {
      // setIsLoader(true);
      const extUser =
        localStorage.getItem("Extand_Class") &&
        JSON.parse(localStorage.getItem("Extand_Class"))?.[0];

      if (extUser) {
        const admin =
          extUser?.UserRole &&
          (extUser?.UserRole === "contracts_Admin" ||
            extUser?.UserRole === "contracts_OrgAdmin")
            ? true
            : false;
        setIsAdmin(admin);
      }
      console.log("this is existing user :",extUser);
      const res = await Parse.Cloud.run("getuserlistbyorg", {
        organizationId: extUser.OrganizationId.objectId
      });
      const _userRes = JSON.parse(JSON.stringify(res));
      setUserList(_userRes);
      console.log("this is userList :",_userRes)
    } catch (err) {
      console.log("Err in fetch userlist", err);
      // setIsAlert({ type: "danger", msg: t("something-went-wrong-mssg") });
    }
    //  finally {
    //   setTimeout(() => setIsAlert({ type: "success", msg: "" }), 1500);
    //   setIsLoader(false);
    // }
  }

  useEffect(() => {
    fetchWalletDetails();
    fetchUserList();
  }, []);

  // console.log("this is user list", userList);

  const Button = ({ label, redirectId, redirectType, icon }) => (
    <DashboardButton
      Icon={icon}
      Label={label}
      Data={{ Redirect_type: redirectType, Redirect_id: redirectId }}
    />
  );
  const renderSwitchWithTour = (col, index) => {
    switch (col.widget.type) {
      case "Card":
        return (
          <div
            className={`${hoveredCards[index] ? 'op-bg-primary' : 'bg-white'} op-card w-full h-[140px] px-3 pt-4 mb-3 shadow-md transition-colors duration-300`}
            onMouseEnter={() => setHoveredCards(prev => ({...prev, [index]: true}))}
            onMouseLeave={() => setHoveredCards(prev => ({...prev, [index]: false}))}
            data-tut={col.widget.data.tourSection}
          >
            <Suspense
              fallback={
                <div className="h-[150px] w-full flex justify-center items-center">
                  {t("loading")}
                </div>
              }
            >
              <DashboardCard
                Icon={col.widget.icon}
                Label={col.widget.label}
                Format={col.widget.format && col.widget.format}
                Data={col.widget.data}
                FilterData={col.widget.filter}
                isHovered={hoveredCards[index]}
              />
            </Suspense>
          </div>
        );
      case "report": {
        return (
          <div data-tut={col.widget.data.tourSection}>
            <Suspense fallback={<div>please wait</div>}>
              <div className="mb-3 md:mb-0">
                <DashboardReport Record={col.widget} />
              </div>
            </Suspense>
          </div>
        );
      }
      default:
        return <></>;
    }
  };
  const renderSwitch = (col, index) => {
    switch (col.widget.type) {
      case "Card":
        return (
          <div
            className={`${hoveredCards[`non-tour-${index}`] ? 'op-bg-primary' : 'bg-white'} op-card w-full h-[140px] px-3 pt-4 mb-3 shadow-md transition-colors duration-300`}
            onMouseEnter={() => setHoveredCards(prev => ({...prev, [`non-tour-${index}`]: true}))}
            onMouseLeave={() => setHoveredCards(prev => ({...prev, [`non-tour-${index}`]: false}))}
          >
            <Suspense fallback={<div>please wait</div>}>
              <DashboardCard
                Icon={col.widget.icon}
                Label={col.widget.label}
                Format={col.widget.format && col.widget.format}
                Data={col.widget.data}
                FilterData={col.widget.filter}
                isHovered={hoveredCards[`non-tour-${index}`]}
              />
            </Suspense>
          </div>
        );
      case "report": {
        return (
          <Suspense fallback={<div>please wait</div>}>
            <div className="mb-3 md:mb-0">
              <DashboardReport Record={col.widget} />
            </div>
          </Suspense>
        );
      }
      default:
        return <></>;
    }
  };
  return (
    <div>
      {/* <div className="mb-3">
        <div
          data-tut={"tourbutton"}
          className="flex flex-col md:flex-row gap-4"
        >
          {buttonList.map((btn) => (
            <Button
              key={btn.label}
              label={btn.label}
              redirectType={btn.redirectType}
              redirectId={btn.redirectId}
              icon={btn.icon}
            />
          ))}
        </div>
      </div> */}
      
      
      <div className="grid grid-cols-12 w-full gap-x-4">
        {walletDetails && paymentMode === false && (
            <WalletCard 
              label="Company Credits" 
              onClick={() => {
                navigate("/wallet");
              }}
              value={walletDetails[0].available_allotment} // Use available_allotment from wallet details
              icon="fa-light fa-money-bill-wave" 
              loading={false} 
              id={walletDetails[0].wallet_id} // Use wallet_id from wallet details
              updatedOn={walletDetails[0].updated_at} // Use updated_at from wallet details
            />
        )}
        {djangoUser?.is_main_admin && (<WalletCard 
          label="Users" 
          onClick={() => {
            navigate("/users");
          }}
          value={userList.length} // Use available_allotment from wallet details
          icon="fa-light fa-users fa-fw" 
          loading={false} 
          id={0} // Use wallet_id from wallet details
          updatedOn={0} // Use updated_at from wallet details
        />)}
        {props?.dashboard?.columns?.map((col, i) =>
          col.widget.data && col.widget.data.tourSection ? (
            <div key={i} className={col?.colsize}>
              {renderSwitchWithTour(col, i)}
            </div>
          ) : (
            <div key={i} className={col?.colsize}>
              {renderSwitch(col, i)}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default GetDashboard;
