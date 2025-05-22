import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Parse from "parse";
import { 
  flattenPdf, 
  generatePdfName, 
  generateTitleFromFilename, 
  getSecureUrl,
  toDataUrl 
} from "../../constant/Utils";
import { PDFDocument } from "pdf-lib";
import { SaveFileSize } from "../../constant/saveFileSize";
import Loader from "../../primitives/Loader";
import { documentCls } from "../../constant/const";
import { useTranslation } from "react-i18next";

const SignPdfUpload = () => {
  const [dragActive, setDragActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();
  const maxFileSize = 20;
  
  useEffect(() => {
    const setupAnonymousUser = async () => {
      try {
        // Check if user is already logged in
        const currentUser = Parse.User.current();
        if (currentUser) return;

        // Generate random email and name for admin user
        const randomId = Math.random().toString(36).substring(2, 8);
        const adminEmail = `admin_${randomId}@instasign.com`;
        const adminName = `Admin User ${randomId}`;
        const adminPassword = "Admin@123"; // Default password for demo admin

        let user = null;
        let isNewUser = false;
        try {
          // Try to create a new user first
          const newUser = new Parse.User();
          newUser.set("name", adminName);
          newUser.set("email", adminEmail);
          newUser.set("password", adminPassword);
          newUser.set("username", adminEmail);

          await newUser.save();
          isNewUser = true;
        } catch (createError) {
          // If user already exists, try to log in
          if (createError.code === 202 || createError.code === 203) {
            // 202: Username taken, 203: Email taken
            // proceed to login below
          } else {
            throw createError;
          }
        }

        // Always login after signup or if user already exists
        user = await Parse.User.logIn(adminEmail, adminPassword);

        if (isNewUser && user) {
          // Create extended user info
          const params = {
            userDetails: {
              jobTitle: "Admin",
              company: "Demo Company",
              name: adminName,
              email: adminEmail,
              phone: "",
              role: "contracts_Admin",
              timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
            }
          };

          // Call cloud function to set up admin
          await Parse.Cloud.run("addadmin", params);
        }

        // Store user info for logged in user
        const userInfo = user.toJSON();
        localStorage.setItem("UserInformation", JSON.stringify(userInfo));
        localStorage.setItem("accesstoken", user.getSessionToken());
        localStorage.setItem("scriptId", true);
        localStorage.setItem("profileImg", "");

        // Fetch extended user info and tenant details
        try {
          const extUser = await Parse.Cloud.run("getUserDetails");
          if (extUser) {
            const IsDisabled = extUser?.get("IsDisabled") || false;
            if (!IsDisabled) {
              const userRole = extUser?.get("UserRole");
              // Default fallback for role and menu
              let _role = userRole ? userRole.replace("contracts_", "") : "admin";
              localStorage.setItem("_user_role", _role);
              const extInfo_stringify = JSON.stringify([extUser]);
              localStorage.setItem("Extand_Class", extInfo_stringify);
              const extInfo = JSON.parse(JSON.stringify(extUser));
              localStorage.setItem("userEmail", extInfo?.Email);
              localStorage.setItem("username", extInfo?.Name);
              if (extInfo?.TenantId) {
                const tenant = {
                  Id: extInfo?.TenantId?.objectId || "",
                  Name: extInfo?.TenantId?.TenantName || ""
                };
                localStorage.setItem("TenantId", tenant?.Id);
                localStorage.setItem("TenantName", tenant?.Name);
              }
              // Set default landing/page/menu for anonymous admin
              localStorage.setItem("PageLanding", "signaturePdf");
              localStorage.setItem("defaultmenuid", "signaturePdf");
              localStorage.setItem("pageType", "signaturePdf");
            }
          }
        } catch (err) {
          // fallback to default tenant info if getUserDetails fails
          localStorage.setItem("TenantId", "demo_tenant");
          localStorage.setItem("TenantName", "Demo Tenant");
          localStorage.setItem("_user_role", "admin");
          localStorage.setItem("PageLanding", "signaturePdf");
          localStorage.setItem("defaultmenuid", "signaturePdf");
          localStorage.setItem("pageType", "signaturePdf");
        }
      } catch (error) {
        console.error("Error setting up admin user:", error);
        setError("Failed to initialize admin session");
      }
    };
    
    setupAnonymousUser();
  }, []);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      await processFile(e.target.files[0]);
    }
  };

  const getFileAsArrayBuffer = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e.target.error);
      reader.readAsArrayBuffer(file);
    });
  };

  const processFile = async (file) => {
    try {
      setIsSubmitting(true);
      setError("");
      
      // Check file size
      const mb = Math.round(file.size / Math.pow(1024, 2));
      if (mb > maxFileSize) {
        setError(`File size exceeds maximum allowed size of ${maxFileSize} MB`);
        setIsSubmitting(false);
        return;
      }

      // Process different file types
      if (file.type === "application/pdf") {
        await processPdf(file);
      } else if (file.type.includes("image/")) {
        await processImage(file);
      } else {
        setError("Only PDF and image files are supported");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Error processing file:", error);
      setError("An error occurred while processing your file");
      setIsSubmitting(false);
    }
  };

  const processPdf = async (file) => {
    try {
      const size = file.size;
      const name = generatePdfName(16);
      const pdfName = `${name?.split(".")[0]}.pdf`;
      
      // Get file as ArrayBuffer and flatten
      const res = await getFileAsArrayBuffer(file);
      const flatPdf = await flattenPdf(res);
      
      // Create Parse File with ACL
      const parseFile = new Parse.File(pdfName, [...flatPdf], "application/pdf");
      
      // Set ACL for the file
      // const acl = new Parse.ACL();
      // const currentUser = Parse.User.current();
      // if (currentUser) {
      //   acl.setReadAccess(currentUser.id, true);
      //   acl.setWriteAccess(currentUser.id, true);
      // }
      
      // Upload file to Parse Server
      const response = await parseFile.save({
        progress: (progressValue, loaded, total, { type }) => {
          if (type === "upload" && progressValue !== null) {
            const percentCompleted = Math.round((loaded * 100) / total);
            setUploadProgress(percentCompleted);
          }
        }
      });
      
      if (response.url()) {
        const fileRes = await getSecureUrl(response.url());
        if (fileRes.url) {
          // Save file in Parse database as Document
          const title = generateTitleFromFilename(file.name);
          await saveDocument(fileRes.url, title, size);
        } else {
          throw new Error("Could not get secure URL");
        }
      } else {
        throw new Error("File upload failed");
      }
    } catch (error) {
      console.error("Error processing PDF:", error);
      setError("An error occurred while processing your PDF");
      setIsSubmitting(false);
    }
  };

  const processImage = async (file) => {
    try {
      const image = await toDataUrl(file);
      const pdfDoc = await PDFDocument.create();
      let embedImg;
      
      if (file.type === "image/png") {
        embedImg = await pdfDoc.embedPng(image);
      } else {
        embedImg = await pdfDoc.embedJpg(image);
      }

      // Get image dimensions
      const imageWidth = embedImg.width;
      const imageHeight = embedImg.height;
      const page = pdfDoc.addPage([imageWidth, imageHeight]);
      
      page.drawImage(embedImg, {
        x: 0,
        y: 0,
        width: imageWidth,
        height: imageHeight
      });
      
      const size = file.size;
      const name = generatePdfName(16);
      const getFile = await pdfDoc.save({
        useObjectStreams: false
      });
      
      const pdfName = `${name?.split(".")[0]}.pdf`;
      const parseFile = new Parse.File(pdfName, [...getFile], "application/pdf");
      
      // Set ACL for the file
      // const acl = new Parse.ACL();
      // const currentUser = Parse.User.current();
      // if (currentUser) {
      //   acl.setReadAccess(currentUser.id, true);
      //   acl.setWriteAccess(currentUser.id, true);
      // }
      // // Allow read access for admin role
      // acl.setRoleReadAccess("admin", true);
      // acl.setRoleWriteAccess("admin", true);
      // parseFile.setACL(acl);
      
      const response = await parseFile.save({
        progress: (progressValue, loaded, total, { type }) => {
          if (type === "upload" && progressValue !== null) {
            const percentCompleted = Math.round((loaded * 100) / total);
            setUploadProgress(percentCompleted);
          }
        }
      });
      
      if (response.url()) {
        const fileRes = await getSecureUrl(response.url());
        if (fileRes.url) {
          const title = generateTitleFromFilename(file.name);
          await saveDocument(fileRes.url, title, size);
        } else {
          throw new Error("Could not get secure URL");
        }
      } else {
        throw new Error("File upload failed");
      }
    } catch (error) {
      console.error("Error processing image:", error);
      setError("An error occurred while processing your image");
      setIsSubmitting(false);
    }
  };

  const saveDocument = async (fileUrl, title, fileSize) => {
    try {
      // Create a new document object
      const object = new Parse.Object(documentCls);
      
      // Set document properties
      object.set("Name", title);
      object.set("Description", "");
      object.set("Note", "Note to myself");
      object.set("URL", fileUrl);
      
      // Set IsSignyourself flag to true for this flow
      object.set("IsSignyourself", true);
      
      // Set ACL for the document
      const acl = new Parse.ACL();
      const currentUser = Parse.User.current();
      if (currentUser) {
        acl.setReadAccess(currentUser.id, true);
        acl.setWriteAccess(currentUser.id, true);
      }
      // Allow read access for admin role
      acl.setRoleReadAccess("admin", true);
      acl.setRoleWriteAccess("admin", true);
      object.setACL(acl);
      
      // If the user is authenticated, set the Creator pointer
      if (currentUser) {
        object.set("CreatedBy", Parse.User.createWithoutData(currentUser.id));
        
        // Getting extended user data if available
        const ExtCls = localStorage.getItem("Extand_Class") && 
                      JSON.parse(localStorage.getItem("Extand_Class"));
        if (ExtCls && ExtCls[0]) {
          object.set("ExtUserPtr", {
            __type: "Pointer",
            className: "contracts_Users",
            objectId: ExtCls[0].objectId
          });
          
          // Add FileAdapter if it exists
          if (ExtCls[0]?.TenantId?.ActiveFileAdapter) {
            object.set("FileAdapterId", ExtCls[0].TenantId.ActiveFileAdapter);
          }
        }
      }
      
      // Save the document
      const res = await object.save();
      
      // Save file size in storage if tenant ID exists
      const tenantId = localStorage.getItem("TenantId");
      if (tenantId) {
        SaveFileSize(fileSize, fileUrl, tenantId);
      }
      
      // Navigate to the SignYourSelf component with the document ID
      setIsSubmitting(false);
      navigate(`/public-sign/${res.id}`);
      
    } catch (error) {
      console.error("Error saving document:", error);
      setError("An error occurred while creating your document");
      setIsSubmitting(false);
    }
  };

  const handleContactClick = () => {
    navigate("/contact");
  };

  // Show loader when submitting
  if (isSubmitting) {
    return (
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[60vh]">
        <Loader />
        {uploadProgress > 0 && (
          <div className="mt-4 w-64">
            <div className="h-2 rounded-full w-full bg-gray-200">
              <div
                className="h-2 rounded-full bg-blue-500"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-center text-sm mt-1">{uploadProgress}%</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-[#002864] text-center mb-8">eSign Document</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
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
            accept=".pdf, image/*"
          />
        </div>
        
        <p className="text-white text-center text-sm">or drop files here</p>
        <p className="text-white text-center text-xs mt-2">Supports PDF and image files (max {maxFileSize}MB)</p>
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