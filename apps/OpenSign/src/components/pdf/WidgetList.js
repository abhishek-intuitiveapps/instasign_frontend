import React from "react";
import { getWidgetType, isMobile } from "../../constant/Utils";
import { useTranslation } from "react-i18next";

function WidgetList(props) {
  const { t } = useTranslation();
  const isMobile = window.innerWidth < 767;

  return (
    <div
      className={`${
        isMobile
          ? "flex flex-row items-center gap-2"
          : `grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 ${
              props.isPlaceHolderSign ? "lg:grid-cols-4" : "lg:grid-cols-1"
            } gap-3`
      } w-full`}
    >
      {props.updateWidgets.map((item, ind) => {
        return (
          <div key={ind} className="p-0 mx-1">
            <div
              data-tut="isSignatureWidget"
              className="select-none cursor-all-scroll"
              onClick={() => {
                props.addPositionOfSignature &&
                  props.addPositionOfSignature("onclick", item);
              }}
              ref={(element) => !isMobile && item.ref(element)}
              onMouseMove={(e) => !isMobile && props?.handleDivClick(e)}
              onMouseDown={() => !isMobile && props?.handleMouseLeave()}
              onTouchStart={(e) => !isMobile && props?.handleDivClick(e)}
            >
              {item.ref && getWidgetType(item, t(`widgets-name.${item.type}`))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default WidgetList;
