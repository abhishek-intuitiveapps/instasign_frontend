import React, { useState } from "react";


export const WalletCard = ({ label, value, icon, loading, id, updatedOn, onClick, toolTipMessage }) => {
    const [isHovered, setIsHovered] = useState(false);
    
    return (
      // <div  className={`cursor-pointer bg-white p-4 rounded-xl shadow-md w-1/2`}>
        <div onClick={onClick} className="col-span-12 md:col-span-6 lg:col-span-6">
          <div 
            className={`${isHovered ? 'op-bg-primary' : 'bg-white'} op-card w-full h-[140px] px-3 pt-4 mb-3 shadow-md transition-colors duration-300`} 
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            data-tut="tourcard1"
          >
            <div className="cursor-pointer">
              <div className={`flex items-center justify-start gap-5 ${isHovered ? 'text-white' : 'text-black'}`}>
                <span className="rounded-full bg-base-300 bg-opacity-20 w-[60px] h-[60px] self-start flex justify-center items-center">
                  <i className={`${icon} text-[25px] lg:text-[30px]`}></i>
                </span>
                <div className="font-medium">
                  <div className="text-base lg:text-lg">{label}</div>
                  <div className="text-2xl font-light">{value}</div>
                </div>
              </div>
              <div className="text-xs absolute top-3 right-2">
                <a data-tooltip-id="Need your Signature" data-tooltip-content={`${toolTipMessage}`} className="z-50">
                  <sup>
                    <i className="fa-light fa-question rounded-full border-[1px] py-[1.5px] px-[4px] text-[13px]" 
                       style={{ 
                         borderColor: isHovered ? 'white' : 'black', 
                         color: isHovered ? 'white' : 'black' 
                       }}></i>
                  </sup>
                </a>
              </div>
            </div>
          </div>
        </div>
      // </div>
    );
  };
