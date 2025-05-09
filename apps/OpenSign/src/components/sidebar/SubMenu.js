import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router";
import axios from "axios";

const Submenu = ({ item, closeSidebar, toggleSubmenu, submenuOpen }) => {
  const { t } = useTranslation();
  const { title, icon, children } = item;
  
  // const [paymentMode, setPaymentMode] = useState(null);
  const paymentMode = useSelector((state) => state.payment.mode);
  const djangoUser = JSON.parse(localStorage.getItem('djangoUser'));
  


  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     try {
  //       const response = await axios.get("https://api.tasign.ai/base/api/v1/get/user/detail/", {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem('django')}`,
  //         },
  //       });
  //       setPaymentMode(response.data.data[0].payment_mode);
  //     } catch (error) {
  //       console.error("Error fetching user data:", error);
  //     }
  //   };

  //   fetchUserData();
  // }, []);

  // Determine if any child menu is active
  const isAnyChildActive = children.some(childItem => {
    const path = childItem.pageType
      ? `/${childItem.pageType}/${childItem.objectId}`
      : `/${childItem.objectId}`;
    return window.location.pathname === path;
  });

  return (
    <li role="none" className="my-0.5 group">
      <button
        onClick={() => toggleSubmenu(item.title)}
        className={`flex items-center text-left p-3 lg:p-4 text-base-content hover:text-base-content focus:bg-base-200 hover:bg-base-200 hover:no-underline focus:outline-none group ${
          isAnyChildActive ? "op-text-primary" : ""
        }`}
        aria-expanded={submenuOpen}
        aria-haspopup="true"
        aria-controls={`submenu-${title}`}
      >
        <i className={`${icon} text-[18px] mt-1 group-hover:text-[#002864] group-focus:text-[#002864]`}></i>
        <div className="flex justify-between items-center w-full">
          <span className="ml-3 lg:ml-4 group-hover:text-[#002864] group-focus:text-[#002864]">{t(`${item.title}`)}</span>
          <i
            className={`group-hover:text-[#002864] ${
              submenuOpen[item.title]
                ? "fa-light fa-angle-down"
                : "fa-light fa-angle-right"
            } mt-1`}
            aria-hidden="true"
          ></i>
        </div>
      </button>
      {submenuOpen[item.title] && (
        <ul id={`submenu-${title}`} role="menu" aria-label={`${title} submenu`}>
          {children
            .filter(childItem => 
              ((paymentMode === true && childItem.title !== 'Wallet') || 
              (paymentMode === false && childItem.title !== 'Billing') || 
              (paymentMode !== true && paymentMode !== false)) &&
              !(childItem.title === 'Users' && djangoUser?.is_main_admin === false)
            )
            .map((childItem) => (
              <li key={childItem.title} role="none" className="my-0.5">
                <NavLink
                  to={
                    childItem.pageType
                      ? `/${childItem.pageType}/${childItem.objectId}`
                      : `/${childItem.objectId}`
                  }
                  className={({ isActive }) =>
                    `${
                      isActive ? "bg-base-200 text-base-content op-text-primary" : ""
                    } flex items-center text-left pl-6 md:pl-8 py-2 text-sm cursor-pointer text-base-content hover:text-[#002864] focus:text-[#002864] hover:bg-base-200 focus:bg-base-200 hover:no-underline focus:outline-none`
                  }
                  onClick={closeSidebar}
                  role="menuitem"
                  tabIndex={submenuOpen ? 0 : -1}
                >
                  <div className="flex items-center w-full">
                    <i
                      className={`${childItem.icon} text-[18px] mt-1 hover:text-[#002864] focus:text-[#002864]`}
                      style={{ width: "24px", textAlign: "center" }}
                      aria-hidden="true"
                    ></i>
                    <span className="ml-3 lg:ml-4 flex-1 hover:text-[#002864] focus:text-[#002864]">
                      {t(`${childItem.title}`)}
                    </span>
                  </div>
                </NavLink>
              </li>
            ))}
        </ul>
      )}
    </li>
  );
};

export default Submenu;
