import React, { useState } from "react";
import { useNavigate } from "react-router";

const SignPdfUpload = () => {
  const [dragActive, setDragActive] = useState(false);
  const navigate = useNavigate();
  
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // Handle file upload logic here
      console.log("File dropped:", e.dataTransfer.files);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      // Handle file upload logic here
      console.log("File selected:", e.target.files);
    }
  };

  const handleContactClick = () => {
    navigate("/contact");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-[#002864] text-center mb-8">eSign PDF</h1>
      
      <div 
        className={`border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center bg-blue-400 bg-opacity-80 transition-all ${dragActive ? "border-[#2563EB] bg-opacity-90" : "border-gray-300"}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex justify-center mb-4">
          <div className="flex space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <path d="M9 15h6"></path>
              <path d="M9 18h6"></path>
              <path d="M9 12h2"></path>
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <path d="M9 15h6"></path>
              <path d="M9 18h6"></path>
              <path d="M9 12h2"></path>
            </svg>
          </div>
        </div>
        
        <div className="mb-6">
          <label htmlFor="file-upload" className="cursor-pointer bg-white text-sm py-2 px-6 rounded-md font-medium text-[#002864] hover:bg-gray-100 flex items-center shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            CHOOSE FILES
          </label>
          <input 
            id="file-upload" 
            type="file" 
            className="hidden" 
            onChange={handleFileChange} 
            accept=".pdf"
            multiple
          />
        </div>
        
        <p className="text-white text-center text-sm">or drop files here</p>
      </div>
      
      <div className="mt-8 grid md:grid-cols-2 gap-8">
  <div>
    <p className="text-base text-[#002864] mb-4">Entrepreneur, freelancer, or team lead? InstaSign helps you close deals faster with secure, professional eSignatures—often within hours. No setup or login required to start.</p>
    <p className="text-sm text-gray-600 mb-4">Looking for a custom plan for your team? <span className="text-[#2563EB] cursor-pointer hover:underline" onClick={handleContactClick}>Get in touch</span>.</p>
  </div>

  <div className="space-y-4">
    <div className="flex items-center">
      <div className="text-green-500 mr-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <span className="text-gray-700">Legally binding, globally accepted signatures</span>
    </div>

    <div className="flex items-center">
      <div className="text-green-500 mr-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <span className="text-gray-700">Real-time tracking of contract status</span>
    </div>

    <div className="flex items-center">
      <div className="text-green-500 mr-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <span className="text-gray-700">Seamless collaboration with signers</span>
    </div>
  </div>
</div>

      
      <div className="mt-16 text-center">
        <h2 className="text-3xl font-bold text-[#002864] mb-4">Instant Signatures, Instant Progress</h2>
        <p className="text-gray-600 max-w-3xl mx-auto">
            Speed up your workflow, simplify approvals, and keep your business moving forward with the fast, secure, and effortless eSignature solution from InstaSign.
        </p>
        </div>
    </div>
  );
};

export default SignPdfUpload; 