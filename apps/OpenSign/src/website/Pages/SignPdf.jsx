import React from "react";
import SignPdfUpload from "../components/SignPdfUpload";
import Title from "../../components/Title";

const SignPdf = () => {
  return (
    <div className="min-h-screen pt-20 bg-white">
      <Title title="eSign" drive={false} />
      <SignPdfUpload />
    </div>
  );
};

export default SignPdf; 