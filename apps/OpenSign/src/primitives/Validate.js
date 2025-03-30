import React, { useState, useEffect } from "react";
import Parse from "parse";
import { Outlet, useNavigate, useLocation } from "react-router";
import ModalUi from "./ModalUi";
import { useTranslation } from "react-i18next";
import axios from "axios";

const Validate = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const location = useLocation();
  const [isUserValid, setIsUserValid] = useState(true);
  const djangoUrl = 'http://localhost:8000';

  useEffect(() => {
    (async () => {
      // First check Django token validity
      const isDjangoValid = await getRefreshToken();
      
      // Only proceed with validation if Parse access token exists
      if (localStorage.getItem("accesstoken")) {
        try {
          // If Django refresh token is invalid/expired, mark user as invalid
          // This ensures user is logged out even if Parse token is valid
          if (!isDjangoValid) {
            setIsUserValid(false);
            return;
          }
          
          // Get stored user details from Parse localStorage
          const userDetails = JSON.parse(
            localStorage.getItem(
              `Parse/${localStorage.getItem("parseAppId")}/currentUser`
            )
          );

          // Validate Parse session token by attempting to fetch user
          const userQuery = new Parse.Query(Parse.User);
          const user = await userQuery.get(userDetails?.objectId, {
            sessionToken: localStorage.getItem("accesstoken")
          });

          // Update user validity based on Parse response
          setIsUserValid(user ? true : false);
        } catch (error) {
          // If any error occurs during validation, mark user as invalid
          setIsUserValid(false);
        }
      }
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLoginBtn = async () => {
    try {
      // Attempt to logout from Parse
      await Parse.User.logOut();
    } catch (err) {
      console.log("err ", err);
    } finally {
      // Clear all authentication tokens
      localStorage.removeItem("accesstoken");
      localStorage.removeItem("django");
      localStorage.removeItem("djangoRefresh");
      // Redirect to login page
      navigate("/login", { replace: true, state: { from: location } });
    }
  };

  const getRefreshToken = async () => {
    // Check if refresh token exists
    const refreshToken = localStorage.getItem("djangoRefresh");
    if (!refreshToken) {
      console.error("No refresh token found in localStorage");
      return false;
    }

    try {
      // Attempt to refresh Django token
      const response = await axios.post(`${djangoUrl}/base/api/token/refresh/`, {
        refresh: refreshToken
      }, {
        headers: {
          "Content-Type": "application/json"
        }
      });

      // Store new access token if refresh successful
      localStorage.setItem("django", response.data.access);
      console.log("Token refreshed successfully");
      return true;
    } catch (error) {
      console.error("Error refreshing token:", error);
      // Clear Django tokens if refresh fails
      localStorage.removeItem("djangoRefresh");
      localStorage.removeItem("django");
      return false;
    }
  };

  return isUserValid ? (
    <div>
      <Outlet />
    </div>
  ) : (
    <ModalUi showHeader={false} isOpen={true} showClose={false}>
      <div className="flex flex-col justify-center items-center py-4 md:py-5 gap-5">
        <p className="text-xl font-medium">{this("session-expired")}</p>
        <button onClick={handleLoginBtn} className="op-btn op-btn-neutral">
          {t("login")}
        </button>
      </div>
    </ModalUi>
  );
};

export default Validate;
