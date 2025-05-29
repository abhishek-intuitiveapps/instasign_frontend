import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import AgreementContent from "./AgreementContent";

function AgreementSign(props) {
  const { t } = useTranslation();
  const [isChecked, setIsChecked] = useState(false);
  const [isShowAgreeTerms, setIsShowAgreeTerms] = useState(false);

  // Get sender and signer details from props
  const { sender, signer } = props;
  const senderName = sender?.Name || "Sender";
  const signerFirstName = signer?.Name ? signer.Name.split(" ")[0] : "there";

  return (
    <>
      <div className="op-modal op-modal-open absolute z-[448] flex items-center justify-center w-full h-full bg-black bg-opacity-30">
        <div className="w-[95%] md:w-[60%] lg:w-[40%] bg-white rounded-lg shadow-lg overflow-y-auto hide-scrollbar text-sm p-6">
          {/* Header */}
          <div className="mb-6 flex justify-center">
            <div className="flex items-center">
              <span className="text-2xl font-bold op-text-primary cursor-pointer">
                <span className="text-primary">Insta</span><span style={{ color: '#002864' }}>sign</span>
              </span>
            </div>
          </div>
          {/* Message Section */}
          <div className="mb-6">
            <div className="font-semibold mb-1">
              Message from <span className="font-bold">{senderName}, Self</span>
            </div>
            <div className="mb-4">
              Hello {signerFirstName},<br /><br />
              Please sign and initial as prompted. Let me know if you have any questions.<br /><br />
              Thanks,<br />
              {senderName}
            </div>
          </div>
          {/* Disclosure Section */}
          <div className="mb-4">
            Please read the{' '}
            <span
              className="underline text-blue-700 cursor-pointer"
              onClick={() => {
                setIsShowAgreeTerms(true);
                props.setIsAgreeTour(false);
              }}
            >
              Electronic Record and Signature Disclosure
            </span>.
          </div>
          {/* Checkbox Section */}
          <div className="flex items-center mb-6">
            <input
              data-tut="IsAgree"
              className="mr-3 op-checkbox op-checkbox-m accent-purple-600"
              type="checkbox"
              checked={isChecked}
              onChange={(e) => {
                setIsChecked(e.target.checked);
                if (e.target.checked) {
                  props.setIsAgreeTour(false);
                }
                props.showFirstWidget();
              }}
            />
            <label className="select-none mt-2 md:text-sm">
              I agree to use electronic records and signatures. <span className="text-pink-600">*</span>
            </label>
          </div>
          {/* Footer Section */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center text-xs text-gray-500 mb-2 md:mb-0">
              {/* Change Language - English (US)
              <span className="ml-1">▼</span> */}
            </div>
            <div className="flex items-center gap-4">
              {/* <button
                className="text-gray-700 border border-gray-300 rounded px-3 py-1 text-sm hover:bg-gray-100"
                type="button"
              >
                Other Options <span className="ml-1">▼</span>
              </button> */}
              <button
                onClick={() => {
                  if (isChecked) {
                    props.setIsAgreeTour(false);
                    props.setIsAgree(true);
                    if (props.kycRequired) {
                      props.setIsKycModalOpen(true);
                    }
                  } else {
                    props.setIsAgreeTour(true);
                  }
                }}
                className="bg-[#002864] hover:bg-[#001a4d] text-white font-semibold rounded px-6 py-2 text-base shadow-md transition-colors duration-150"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
      {isShowAgreeTerms && (
        <AgreementContent
          setIsAgreeTour={props.setIsAgreeTour}
          setIsAgree={props.setIsAgree}
          setIsShowAgreeTerms={setIsShowAgreeTerms}
          showFirstWidget={props.showFirstWidget}
          setIsKycModalOpen={props.setIsKycModalOpen}
          kycRequired={props.kycRequired}
        />
      )}
    </>
  );
}

export default AgreementSign;
