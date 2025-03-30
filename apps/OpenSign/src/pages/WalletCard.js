import React from "react";


export const WalletCard = ({ label, value, icon, loading, id, updatedOn }) => {
    return (
      <div className={`cursor-pointer bg-white p-4 rounded-xl shadow-md w-1/2`}>
        <div className="flex items-center justify-between text-black">
          <div className="font-medium">
            <div className="text-base lg:text-lg">
              {label}
            </div>
            <div className="text-3xl font-bold">
              {loading ? <div className="loader-01"></div> : value}
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="rounded-full bg-base-300 bg-opacity-20 w-[60px] h-[60px] flex justify-center items-center">
              <i className={`${icon} text-[25px] lg:text-[30px]`}></i>
            </span>
            <div className="text-xs font-semibold text-gray-600">
              Walled ID: {id}
            </div>
            <div className="text-xs font-semibold text-gray-600">
              Updated on: {updatedOn}
            </div>
          </div>
        </div>
      </div>
    );
  };
