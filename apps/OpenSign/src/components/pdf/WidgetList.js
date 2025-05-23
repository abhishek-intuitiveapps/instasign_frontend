import React from "react";
import { getWidgetType, isMobile } from "../../constant/Utils";
import { useTranslation } from "react-i18next";

function WidgetList(props) {
  const { t } = useTranslation();
  const isMobile = window.innerWidth < 767;

  return (
    <div className={`flex flex-row items-center gap-2 ${!isMobile ? "flex-wrap" : ""}`}>
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
