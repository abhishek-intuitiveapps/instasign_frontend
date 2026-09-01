import React, { useState, useRef, useEffect } from "react";
import { PDFDocument } from "pdf-lib";
import "../styles/signature.css";
import RenderPdf from "../components/pdf/RenderPdf";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useDrop } from "react-dnd";
import SignPad from "../components/pdf/SignPad";
import WidgetComponent from "../components/pdf/WidgetComponent";
import {
  randomId,
  defaultWidthHeight,
  onSaveImage,
  onSaveSign,
  calculateInitialWidthHeight,
  convertPdfArrayBuffer,
  getBase64FromUrl,
  getContainerScale,
  multiSignEmbed,
  getDate,
  textWidget,
  convertBase64ToFile,
  generatePdfName,
  compressedFileSize
} from "../constant/Utils";
import PdfZoom from "../components/pdf/PdfZoom";
import { useTranslation } from "react-i18next";
import Loader from "../primitives/Loader";
import ModalUi from "../primitives/ModalUi";
import Title from "../components/Title";

function PublicSign() {
  // Define SVG components to replace heroicons
  const CheckCircleIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  );
  
  const ChevronRightIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
    </svg>
  );

  const { t } = useTranslation();
  const divRef = useRef(null);
  const nodeRef = useRef(null);
  const imageRef = useRef(null);
  const pdfRef = useRef();
  const numPages = 1;
  const [pdfDetails, setPdfDetails] = useState([]);
  const [isSignPad, setIsSignPad] = useState(false);
  const [allPages, setAllPages] = useState(null);
  const [pdfUrl, setPdfUrl] = useState();
  const [xyPosition, setXyPosition] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [image, setImage] = useState(null);
  const [isImageSelect, setIsImageSelect] = useState(false);
  const [signature, setSignature] = useState();
  const [isStamp, setIsStamp] = useState(false);
  const [signBtnPosition, setSignBtnPosition] = useState([]);
  const [xySignature, setXYSignature] = useState({});
  const [dragKey, setDragKey] = useState();
  const [fontSize, setFontSize] = useState();
  const [fontColor, setFontColor] = useState();
  const [signKey, setSignKey] = useState();
  const [imgWH, setImgWH] = useState({});
  const [pdfNewWidth, setPdfNewWidth] = useState();
  const [pdfOriginalWH, setPdfOriginalWH] = useState([]);
  const [isUiLoading, setIsUiLoading] = useState(false);
  const [isLoading, setIsLoading] = useState({
    isLoad: false,
    message: ""
  });
  const [isAlert, setIsAlert] = useState({ isShow: false, alertMessage: "" });
  const [isDragging, setIsDragging] = useState(false);
  const [selectWidgetId, setSelectWidgetId] = useState("");
  const [pdfArrayBuffer, setPdfArrayBuffer] = useState("");
  const [pdfBase64Url, setPdfBase64Url] = useState("");
  const [containerWH, setContainerWH] = useState({});
  const [scale, setScale] = useState(1);
  const [zoomPercent, setZoomPercent] = useState(0);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isInitial, setIsInitial] = useState(false);
  const [widgetType, setWidgetType] = useState("");
  const [pdfLoad, setPdfLoad] = useState(false);
  const [isResize, setIsResize] = useState(false);
  const [isUploadPdf, setIsUploadPdf] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isShowingHelp, setIsShowingHelp] = useState(false);
  const [documentName, setDocumentName] = useState("");

  const [, drop] = useDrop({
    accept: "BOX",
    drop: (item, monitor) => addPositionOfSignature(item, monitor),
    collect: (monitor) => ({ isOver: !!monitor.isOver() })
  });

  const index = xyPosition?.findIndex((object) => {
    return object.pageNumber === pageNumber;
  });

  useEffect(() => {
    const updateSize = () => {
      if (divRef.current) {
        const pdfWidth = divRef.current.offsetWidth;
        setPdfNewWidth(pdfWidth);
        setContainerWH({
          width: divRef.current.offsetWidth,
          height: divRef.current.offsetHeight
        });
        setScale(1);
        setZoomPercent(0);
      }
    };

    // Use setTimeout to wait for the transition to complete
    const timer = setTimeout(updateSize, 100);
    return () => clearTimeout(timer);
  }, [divRef.current]);

  // Use effect to set document name when file is uploaded
  useEffect(() => {
    if (uploadedFile) {
      setDocumentName(uploadedFile.name);
    }
  }, [uploadedFile]);

  const hasUnsavedWorkRef = useRef(false);

  useEffect(() => {
    hasUnsavedWorkRef.current =
      !isCompleted &&
      (isFileUploaded ||
        !!uploadedFile ||
        !!pdfArrayBuffer ||
        xyPosition.length > 0);
  }, [isCompleted, isFileUploaded, uploadedFile, pdfArrayBuffer, xyPosition]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (!hasUnsavedWorkRef.current) return;
      event.preventDefault();
      event.returnValue = "";
      return "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  // Handle file upload
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setIsLoading({
        isLoad: true,
        message: "Uploading PDF..."
      });
      setUploadedFile(file);
      
      try {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const arrayBuffer = e.target.result;
          const base64Data = await getBase64FromUrl(URL.createObjectURL(file));
          
          setPdfArrayBuffer(arrayBuffer);
          setPdfBase64Url(base64Data);
          setIsFileUploaded(true);
          setIsLoading({
            isLoad: false,
            message: ""
          });
        };
        reader.readAsArrayBuffer(file);
      } catch (error) {
        console.error("Error loading PDF:", error);
        setIsAlert({
          isShow: true,
          alertMessage: "Error uploading PDF. Please try again."
        });
        setIsLoading({
          isLoad: false,
          message: ""
        });
      }
    } else {
      setIsAlert({
        isShow: true,
        alertMessage: "Please upload a valid PDF file."
      });
    }
  };

  const getWidgetValue = (type) => {
    switch (type) {
      case "name":
        return "";
      case "company":
        return "";
      case "job title":
        return "";
      case "email":
        return "";
      case "checkbox":
        return true;
      case "date":
        return getDate();
      default:
        return "";
    }
  };

  const addWidgetOptions = (type) => {
    switch (type) {
      case "signature":
        return { name: "signature" };
      case "stamp":
        return { name: "stamp" };
      case "checkbox":
        return { name: "checkbox" };
      case textWidget:
        return { name: "text" };
      case "initials":
        return { name: "initials" };
      case "name":
        return {
          name: "name",
          defaultValue: getWidgetValue(type),
          validation: { type: "text", pattern: "" }
        };
      case "company":
        return {
          name: "company",
          defaultValue: getWidgetValue(type),
          validation: { type: "text", pattern: "" }
        };
      case "job title":
        return {
          name: "job title",
          defaultValue: getWidgetValue(type),
          validation: { type: "text", pattern: "" }
        };
      case "date":
        return {
          name: "date",
          response: getDate(),
          validation: { format: "MM/dd/yyyy", type: "date-format" }
        };
      case "image":
        return { name: "image" };
      case "email":
        return {
          name: "email",
          defaultValue: getWidgetValue(type),
          validation: { type: "email", pattern: "" }
        };
      default:
        return {};
    }
  };

  // Add position of signature after dropping
  const addPositionOfSignature = (item, monitor) => {
    const key = randomId();
    let dropData = [];
    let dropObj = {};
    let filterDropPos = xyPosition?.filter(
      (data) => data.pageNumber === pageNumber
    );
    const dragTypeValue = item?.text ? item.text : monitor.type;
    const widgetValue = getWidgetValue(dragTypeValue);
    const widgetTypeExist = ["name", "company", "job title", "email"].includes(
      dragTypeValue
    );
    const containerScale = getContainerScale(
      pdfOriginalWH,
      pageNumber,
      containerWH
    );

    if (item === "onclick") {
      // `getBoundingClientRect()` is used to get accurate measurement height of the div
      const divHeight = divRef.current.getBoundingClientRect().height;
      const getWidth = widgetTypeExist
        ? calculateInitialWidthHeight(dragTypeValue, widgetValue).getWidth
        : defaultWidthHeight(dragTypeValue).width;
      const getHeight = defaultWidthHeight(dragTypeValue).height;

      dropObj = {
        xPosition: getWidth / 2 + containerWH.width / 2,
        yPosition: getHeight + divHeight / 2,
        isStamp:
          (dragTypeValue === "stamp" || dragTypeValue === "image") && true,
        key: key,
        type: dragTypeValue,
        scale: containerScale,
        Width: getWidth,
        Height: getHeight,
        options: addWidgetOptions(dragTypeValue)
      };
      dropData.push(dropObj);
    } else {
      const offset = monitor.getClientOffset();
      const containerRect = document
        .getElementById("container")
        .getBoundingClientRect();

      const x = offset.x - containerRect.left;
      const y = offset.y - containerRect.top;
      const getXPosition = signBtnPosition[0] ? x - signBtnPosition[0].xPos : x;
      const getYPosition = signBtnPosition[0] ? y - signBtnPosition[0].yPos : y;
      const getWidth = widgetTypeExist
        ? calculateInitialWidthHeight(widgetValue).getWidth
        : defaultWidthHeight(dragTypeValue).width;
      const getHeight = defaultWidthHeight(dragTypeValue).height;
      dropObj = {
        xPosition: getXPosition / (containerScale * scale),
        yPosition: getYPosition / (containerScale * scale),
        isStamp:
          (dragTypeValue === "stamp" || dragTypeValue === "image") && true,
        key: key,
        type: dragTypeValue,
        Width: getWidth / (containerScale * scale),
        Height: getHeight / (containerScale * scale),
        options: addWidgetOptions(dragTypeValue),
        scale: containerScale
      };
      dropData.push(dropObj);
    }

    if (filterDropPos?.length > 0) {
      const index = xyPosition?.findIndex((object) => {
        return object.pageNumber === pageNumber;
      });
      const updateData = filterDropPos?.[0].pos;
      const newSignPos = updateData.concat(dropData);
      let xyPos = { pageNumber: pageNumber, pos: newSignPos };
      xyPosition?.splice(index, 1, xyPos);
    } else {
      const xyPos = { pageNumber: pageNumber, pos: dropData };
      setXyPosition((prev) => [...prev, xyPos]);
    }

    if (
      dragTypeValue === "signature" ||
      dragTypeValue === "stamp" ||
      dragTypeValue === "image" ||
      dragTypeValue === "initials"
    ) {
      setIsSignPad(true);
    }
    if (dragTypeValue === "stamp" || dragTypeValue === "image") {
      setIsStamp(true);
    } else if (dragTypeValue === "initials") {
      setIsInitial(true);
    }
    setWidgetType(dragTypeValue);
    setSelectWidgetId(key);
    setSignKey(key);
  };

  // Function to sign the PDF
  async function embedWidgetsData() {
    let showAlert = false, isSignatureExist = false;
    
    try {
      for (let i = 0; i < xyPosition?.length; i++) {
        const requiredWidgets = xyPosition[i].pos.filter(
          (position) => position.type !== "checkbox"
        );
        if (requiredWidgets && requiredWidgets?.length > 0) {
          let checkSigned;
          for (let i = 0; i < requiredWidgets?.length; i++) {
            checkSigned = requiredWidgets[i]?.options?.response;
            if (!checkSigned) {
              const checkSignUrl = requiredWidgets[i]?.pos?.SignUrl;
              let checkDefaultSigned = requiredWidgets[i]?.options?.defaultValue;
              if (!checkSignUrl && !checkDefaultSigned && !showAlert) {
                showAlert = true;
              }
            }
          }
        }
        // Check if signature widget exists
        if (!isSignatureExist) {
          isSignatureExist = xyPosition[i].pos.some(
            (data) => data?.type === "signature"
          );
        }
      }
      
      if (xyPosition.length === 0 || !isSignatureExist) {
        setIsAlert({
          isShow: true,
          alertMessage: "Please add at least one signature to the document."
        });
        return;
      } else if (showAlert) {
        setIsAlert({
          isShow: true,
          alertMessage: "Please sign all signature fields."
        });
        return;
      } else {
        setIsUiLoading(true);
        
        try {
          // Load PDFDocument from the existing PDF bytes
          const pdfDoc = await PDFDocument.load(pdfArrayBuffer);
          
          // Embed signatures into PDF
          const isSignYourSelfFlow = true;
          const pdfBytes = await multiSignEmbed(
            xyPosition,
            pdfDoc,
            isSignYourSelfFlow,
            scale
          );
          
          if (!pdfBytes?.error) {
            // Convert modified PDF to downloadable format
            const pdfName = generatePdfName(16);
            const signedPdfUrl = await convertBase64ToFile(
              pdfName,
              pdfBytes,
              "signed_"
            );
            
            setPdfUrl(signedPdfUrl);
            setIsCompleted(true);
            setIsUiLoading(false);
            
            // Offer download
            setIsAlert({
              isShow: true,
              alertMessage: "Document signed successfully! You can now download it.",
              isDownload: true,
              downloadUrl: signedPdfUrl
            });
          } else {
            setIsUiLoading(false);
            setIsAlert({
              isShow: true,
              alertMessage: "There was an issue with the PDF. Please try a different file."
            });
          }
        } catch (err) {
          setIsUiLoading(false);
          if (err && err.message.includes("is encrypted.")) {
            setIsAlert({
              isShow: true,
              alertMessage: "This PDF is encrypted and cannot be processed. Please provide an unencrypted PDF."
            });
          } else {
            console.log("Error in signing:", err.message);
            if (err?.message?.includes("password")) {
              setIsAlert({
                isShow: true,
                alertMessage: "This PDF is password protected. Please remove the password and try again."
              });
            } else {
              setIsAlert({
                isShow: true,
                alertMessage: "Something went wrong while processing the document. Please try again."
              });
            }
          }
        }
      }
    } catch (err) {
      console.log("Error in embedding signatures:", err);
      setIsUiLoading(false);
      setIsAlert({
        isShow: true,
        alertMessage: "Something went wrong. Please try again."
      });
    }
  };

  // Handle signature tab drag
  const handleTabDrag = (key) => {
    setDragKey(key);
    setIsDragging(true);
  };

  // Handle signature tab drop
  const handleStop = (event, dragElement) => {
    setFontSize();
    setFontColor();
    if (!isResize && isDragging && dragElement) {
      event.preventDefault();
      const containerScale = getContainerScale(
        pdfOriginalWH,
        pageNumber,
        containerWH
      );
      if (dragKey >= 0) {
        const filterDropPos = xyPosition?.filter(
          (data) => data.pageNumber === pageNumber
        );
        if (filterDropPos?.length > 0) {
          const getXYdata = xyPosition[index].pos;
          const getPosData = getXYdata;
          const addSign = getPosData.map((url) => {
            if (url.key === dragKey) {
              return {
                ...url,
                xPosition: dragElement.x / (containerScale * scale),
                yPosition: dragElement.y / (containerScale * scale)
              };
            }
            return url;
          });

          const newUpdateUrl = xyPosition.map((obj, ind) => {
            if (ind === index) {
              return { ...obj, pos: addSign };
            }
            return obj;
          });
          setXyPosition(newUpdateUrl);
        }
      }
    }
    setTimeout(() => {
      setIsDragging(false);
    }, 200);
  };

  // Get PDF page details
  const pageDetails = async (pdf) => {
    let pdfWHObj = [];
    const totalPages = pdf?.numPages;
    for (let index = 0; index < totalPages; index++) {
      const getPage = await pdf.getPage(index + 1);
      const scale = 1;
      const { width, height } = getPage.getViewport({ scale });
      pdfWHObj.push({ pageNumber: index + 1, width, height });
    }
    setPdfOriginalWH(pdfWHObj);
    setPdfLoad(true);
  };

  // Handle page change
  function changePage(offset) {
    setSignBtnPosition([]);
    setPageNumber((prevPageNumber) => prevPageNumber + offset);
  }

  // Handle image upload
  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      compressedFileSize(file, setImgWH, setImage);
    }
  };

  // Save uploaded image as stamp
  const saveImage = () => {
    const getImage = onSaveImage(xyPosition, index, signKey, imgWH, image);
    setXyPosition(getImage);
  };

  // Save signature
  const saveSign = (type, isDefaultSign, width, height, typedSignature) => {
    const isTypeText = width && height ? true : false;
    const signatureImg = signature;
    let imgWH = { width: width ? width : "", height: height ? height : "" };
    setIsSignPad(false);
    setIsImageSelect(false);
    setImage();
    
    const getUpdatePosition = onSaveSign(
      type,
      xyPosition,
      index,
      signKey,
      signatureImg,
      imgWH,
      isDefaultSign,
      isTypeText,
      typedSignature
    );

    setXyPosition(getUpdatePosition);
  };

  // Capture position on hover/touch widgets button
  const handleDivClick = (e) => {
    const isTouchEvent = e.type.startsWith("touch");
    const divRect = e.currentTarget.getBoundingClientRect();
    let mouseX, mouseY;
    if (isTouchEvent) {
      const touch = e.touches[0]; // Get the first touch point
      mouseX = touch.clientX - divRect.left;
      mouseY = touch.clientY - divRect.top;
      setSignBtnPosition([{ xPos: mouseX, yPos: mouseY }]);
    } else {
      mouseX = e.clientX - divRect.left;
      mouseY = e.clientY - divRect.top;
      const xyPosition = { xPos: mouseX, yPos: mouseY };
      setXYSignature(xyPosition);
    }
  };

  // Capture position on mouse leave
  const handleMouseLeave = () => {
    setSignBtnPosition([xySignature]);
  };

  // Delete signature block
  const handleDeleteSign = (key) => {
    const updateResizeData = [];
    let filterData = xyPosition[index].pos.filter((data) => data.key !== key);
    
    // Delete and update block position
    if (filterData.length > 0) {
      updateResizeData.push(filterData);
      const newUpdatePos = xyPosition.map((obj, ind) => {
        if (ind === index) {
          return { ...obj, pos: updateResizeData[0] };
        }
        return obj;
      });

      setXyPosition(newUpdatePos);
    } else {
      const getRemainPage = xyPosition.filter(
        (data) => data.pageNumber !== pageNumber
      );

      if (getRemainPage && getRemainPage.length > 0) {
        setXyPosition(getRemainPage);
      } else {
        setXyPosition([]);
      }
    }
  };

  const handleDownload = () => {
    if (pdfUrl) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = 'signed_document.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Add this function to handle moving through the steps
  const goToNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Add this function to handle going back
  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Add this function to render the progress steps
  const renderSteps = () => {
    const steps = [
      { number: 1, name: "Upload Document" },
      { number: 2, name: "Add Signature" },
      { number: 3, name: "Sign & Download" }
    ];
    
    return (
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step) => (
            <div 
              key={step.number} 
              className={`flex flex-col items-center ${step.number === currentStep ? 'text-blue-600' : 'text-gray-400'}`}
            >
              <div 
                className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${
                  step.number === currentStep 
                    ? 'border-blue-600 bg-blue-50' 
                    : step.number < currentStep 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-300'
                } mb-1`}
              >
                {step.number < currentStep ? (
                  <CheckCircleIcon className="w-6 h-6 text-green-500" />
                ) : (
                  <span>{step.number}</span>
                )}
              </div>
              <span className="text-xs">{step.name}</span>
            </div>
          ))}
        </div>
        <div className="relative mt-2">
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200">
            <div 
              className="h-full bg-blue-600 transition-all duration-300" 
              style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    );
  };

  // Add this helper function for step 1 content
  const renderStep1 = () => (
    <div className="mb-6">
      <p className="mb-4">Upload a PDF document to sign:</p>
      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-base-200 hover:bg-base-300">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
          </svg>
          <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
          <p className="text-xs text-gray-500">PDF file only (max 10MB)</p>
        </div>
        <input 
          type="file" 
          className="hidden" 
          accept="application/pdf" 
          onChange={(e) => {
            if (e.target.files[0] && e.target.files[0].size > 10 * 1024 * 1024) {
              setIsAlert({
                isShow: true,
                alertMessage: "File size exceeds 10MB limit. Please upload a smaller file."
              });
              return;
            }
            handleFileUpload(e);
            if (e.target.files[0]) {
              goToNextStep();
            }
          }} 
        />
      </label>
      <div className="mt-6 text-sm text-gray-500">
        <p className="mb-2"><strong>Note:</strong> No login required. Your document is processed entirely in your browser and is not uploaded to any server.</p>
        <p>For security reasons, please ensure your PDF does not contain sensitive information that should not be shared.</p>
      </div>
    </div>
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <Title title={"Public Document Signing"} />
      <div>
        {isUiLoading && (
          <div className="absolute h-[100vh] w-full z-[999] flex flex-col justify-center items-center bg-[#e6f2f2] bg-opacity-80">
            <Loader />
            <span style={{ fontSize: "13px", fontWeight: "bold" }}>
              Processing your document...
            </span>
          </div>
        )}
        
        <div className="relative op-card overflow-hidden flex flex-col md:flex-row justify-between bg-base-300">
          {/* Sidebar for document upload */}
          <div className="w-full md:w-[23%] bg-base-100 overflow-y-auto hide-scrollbar">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Public Document Signing</h2>
                <button 
                  className="text-blue-600 text-sm flex items-center"
                  onClick={() => setIsShowingHelp(!isShowingHelp)}
                >
                  {isShowingHelp ? "Hide Help" : "Need Help?"}
                </button>
              </div>
              
              {isShowingHelp && (
                <div className="bg-blue-50 p-3 rounded-lg mb-4 text-sm">
                  <h3 className="font-semibold mb-2">How to use this tool:</h3>
                  <ol className="list-decimal pl-4 space-y-1">
                    <li>Upload your PDF document</li>
                    <li>Drag signature fields onto the document</li>
                    <li>Create your signature using draw, type, or upload</li>
                    <li>Click "Sign Document" to finalize</li>
                    <li>Download your signed document</li>
                  </ol>
                </div>
              )}
              
              {renderSteps()}
              
              {!isFileUploaded ? (
                renderStep1()
              ) : (
                <>
                  <div className="mb-4">
                    <p className="font-semibold mb-2">Current document:</p>
                    <div className="flex items-center bg-gray-50 p-2 rounded">
                      <svg className="w-8 h-8 text-gray-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd"></path>
                      </svg>
                      <span className="truncate flex-1">{documentName}</span>
                    </div>
                    <button 
                      className="mt-2 px-4 py-2 bg-base-300 text-gray-700 rounded-lg hover:bg-base-200 text-sm w-full"
                      onClick={() => {
                        setIsFileUploaded(false);
                        setUploadedFile(null);
                        setXyPosition([]);
                        setPdfUrl(null);
                        setIsCompleted(false);
                        setCurrentStep(1);
                      }}
                    >
                      Change document
                    </button>
                  </div>
                  
                  {currentStep === 2 && !isCompleted && (
                    <div>
                      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-4">
                        <p className="text-sm">Drag and drop signature fields from below onto your document, then click on them to sign.</p>
                      </div>
                      
                      <WidgetComponent
                        pdfUrl={pdfUrl}
                        handleDivClick={handleDivClick}
                        handleMouseLeave={handleMouseLeave}
                        xyPosition={xyPosition}
                        isSignYourself={true}
                        addPositionOfSignature={addPositionOfSignature}
                        isMailSend={false}
                      />
                      
                      <div className="mt-4 flex space-x-2">
                        <button 
                          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 flex-1"
                          onClick={goToPreviousStep}
                        >
                          Back
                        </button>
                        <button 
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg flex-1 hover:bg-blue-700 disabled:bg-blue-300"
                          onClick={goToNextStep}
                          disabled={xyPosition.length === 0}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {currentStep === 3 && !isCompleted && (
                    <div>
                      <div className="bg-blue-50 border-l-4 border-blue-400 p-3 mb-4">
                        <p className="text-sm">Review your document and click "Sign Document" to finalize.</p>
                      </div>
                      
                      <div className="mt-4 flex space-x-2">
                        <button 
                          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 flex-1"
                          onClick={goToPreviousStep}
                        >
                          Back
                        </button>
                        <button 
                          className="px-6 py-2 bg-blue-600 text-white rounded-lg flex-1 hover:bg-blue-700"
                          onClick={embedWidgetsData}
                        >
                          {t("sign-document")}
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {isCompleted && (
                    <div className="mt-4">
                      <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4 rounded-r-lg">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <CheckCircleIcon className="h-5 w-5 text-green-500" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-green-800">
                              Document signed successfully!
                            </p>
                          </div>
                        </div>
                      </div>
                      <button 
                        className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mb-3"
                        onClick={handleDownload}
                      >
                        Download Signed Document
                      </button>
                      <button 
                        className="w-full px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                        onClick={() => {
                          setIsFileUploaded(false);
                          setUploadedFile(null);
                          setXyPosition([]);
                          setPdfUrl(null);
                          setIsCompleted(false);
                          setCurrentStep(1);
                        }}
                      >
                        Sign Another Document
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          
          {/* Main PDF view */}
          <div className="w-full md:w-[77%] flex">
            {isFileUploaded ? (
              <>
                <div className="w-full">
                  <div className="flex justify-between items-center p-4 bg-base-200">
                    <div className="flex items-center">
                      <button 
                        onClick={() => changePage(-1)} 
                        disabled={pageNumber <= 1}
                        className="op-btn op-btn-ghost"
                      >
                        Previous
                      </button>
                      <span className="mx-2">
                        Page {pageNumber} of {allPages || 1}
                      </span>
                      <button 
                        onClick={() => changePage(1)} 
                        disabled={pageNumber >= allPages}
                        className="op-btn op-btn-ghost"
                      >
                        Next
                      </button>
                    </div>
                    
                    <div className="flex items-center">
                      <button 
                        onClick={() => clickOnZoomIn()} 
                        className="op-btn op-btn-ghost"
                        title="Zoom In"
                      >
                        <i className="fa-light fa-magnifying-glass-plus text-gray-500"></i>
                      </button>
                      <span className="mx-2 text-sm">{Math.round(scale * 100)}%</span>
                      <button 
                        onClick={() => clickOnZoomOut()} 
                        className="op-btn op-btn-ghost"
                        disabled={zoomPercent <= 0}
                        title="Zoom Out"
                      >
                        <i className="fa-light fa-magnifying-glass-minus text-gray-500"></i>
                      </button>
                    </div>
                  </div>
                  
                  <div ref={divRef} className="h-full">
                    {containerWH?.width && containerWH?.height && (
                      <RenderPdf
                        pageNumber={pageNumber}
                        pdfOriginalWH={pdfOriginalWH}
                        pdfNewWidth={pdfNewWidth}
                        drop={drop}
                        nodeRef={nodeRef}
                        handleTabDrag={handleTabDrag}
                        handleStop={handleStop}
                        isDragging={isDragging}
                        setIsSignPad={setIsSignPad}
                        setIsStamp={setIsStamp}
                        handleDeleteSign={handleDeleteSign}
                        setSignKey={setSignKey}
                        pdfDetails={pdfDetails}
                        setIsDragging={setIsDragging}
                        xyPosition={xyPosition}
                        pdfRef={pdfRef}
                        pdfUrl={pdfUrl}
                        numPages={numPages}
                        pageDetails={pageDetails}
                        pdfLoad={pdfLoad}
                        setPdfLoad={setPdfLoad}
                        setXyPosition={setXyPosition}
                        index={index}
                        containerWH={containerWH}
                        setIsInitial={setIsInitial}
                        setWidgetType={setWidgetType}
                        setSelectWidgetId={setSelectWidgetId}
                        selectWidgetId={selectWidgetId}
                        setScale={setScale}
                        scale={scale}
                        pdfBase64Url={pdfBase64Url}
                        fontSize={fontSize}
                        setFontSize={setFontSize}
                        fontColor={fontColor}
                        setFontColor={setFontColor}
                        isResize={isResize}
                        setIsResize={setIsResize}
                        divRef={divRef}
                      />
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="w-full flex items-center justify-center">
                <div className="text-center p-8 max-w-md">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path>
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No document</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Get started by uploading a PDF document.
                  </p>
                  <div className="mt-6">
                    <div className="text-left mb-6 bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2 text-blue-800">Benefits of our Public Document Signing:</h4>
                      <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                        <li>No registration required</li>
                        <li>Completely free to use</li>
                        <li>Your documents stay private - all processing happens in your browser</li>
                        <li>Simple and intuitive interface</li>
                        <li>Compatible with all major PDF formats</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* SignPad Modal */}
          {isSignPad && (
            <SignPad
              signatureTypes={[
                { name: "draw", enabled: true },
                { name: "type", enabled: true },
                { name: "upload", enabled: true }
              ]}
              isSignPad={isSignPad}
              isStamp={isStamp}
              setIsImageSelect={setIsImageSelect}
              setIsSignPad={setIsSignPad}
              setImage={setImage}
              isImageSelect={isImageSelect}
              imageRef={imageRef}
              onImageChange={onImageChange}
              setSignature={setSignature}
              image={image}
              onSaveImage={saveImage}
              onSaveSign={saveSign}
              isInitial={isInitial}
              setIsInitial={setIsInitial}
              setIsStamp={setIsStamp}
              widgetType={widgetType}
            />
          )}
          
          {/* Alert Modal */}
          <ModalUi
            isOpen={isAlert.isShow}
            title={isAlert.isDownload ? "Success" : "Alert"}
            handleClose={() => setIsAlert({ isShow: false, alertMessage: "" })}
          >
            <div className="p-[20px] h-full">
              <p>{isAlert.alertMessage}</p>
              
              {isAlert.isDownload && (
                <div className="mt-4">
                  <button 
                    className="op-btn op-btn-primary"
                    onClick={handleDownload}
                  >
                    Download Document
                  </button>
                </div>
              )}
              
              <div className="h-[1px] w-full my-[15px] bg-[#9f9f9f]"></div>
              <button
                className="op-btn op-btn-ghost shadow-md"
                onClick={() => setIsAlert({ isShow: false, alertMessage: "" })}
              >
                Close
              </button>
            </div>
          </ModalUi>
        </div>
      </div>
    </DndProvider>
  );
}

export default PublicSign; 