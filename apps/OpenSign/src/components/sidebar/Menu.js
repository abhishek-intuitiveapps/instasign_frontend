import React from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router";

const Menu = ({ item, isOpen, closeSidebar }) => {
  const { t } = useTranslation();
  return (
    <li key={item.title} role="none" className="my-0.5">
      <NavLink
        to={
          item.pageType
            ? `/${item.pageType}/${item.objectId}`
            : `/${item.objectId}`
        }
        className={({ isActive }) =>
          `${
            isActive ? "bg-base-200 text-base-content op-text-primary" : ""
          } flex items-center text-left p-3 lg:p-4 text-base-content hover:text-[#002864] focus:text-[#002864] hover:bg-base-200 hover:no-underline focus:outline-none`
        }
        
        onClick={closeSidebar}
        tabIndex={isOpen ? 0 : -1}
        role="menuitem"
      >
        <i className={`${item.icon} text-[18px] mt-1 hover:text-[#002864] focus:text-[#002864]`} aria-hidden="true"></i>
        <span className="ml-3 lg:ml-4 hover:text-[#002864] focus:text-[#002864]">{t(`${item.title}`)}</span>
      </NavLink>
    </li>
  );
};

export default Menu;
