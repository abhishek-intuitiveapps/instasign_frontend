import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import axios from 'axios';
import Loader from '../primitives/Loader';
import env_data from "../env_data.json";


const AddCreditsModal = ({ show, handleClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [showUPI, setShowUPI] = useState(false);
  const [utrNumber, setUtrNumber] = useState("");
  const [pricePerItem, setPricePerItem] = useState(10.0); // Default value
  const [gstRate, setGstRate] = useState(0.18); // Default value
  const djangoToken = localStorage.getItem('django')
  const [loadingQRCode, setLoadingQRCode] = useState(true);
  const djangoUrl = env_data.django_url;


  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get(
          `${djangoUrl}/base/api/v1/get/default/settings/`,
          {
            headers: {
              Authorization: `Bearer ${djangoToken}`,
            },
          }
        );

        const data = response.data;
        console.log(data);
        if (data.status && data.data) {
          setPricePerItem(typeof data.data.unit_price === 'number' ? data.data.unit_price : 10.0); // Ensure it's a number
          setGstRate(typeof data.data.tax_percentage === 'number' ? data.data.tax_percentage / 100 : 0.18); // Ensure it's a number
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      }
    };

    fetchSettings();
  }, []);

  const subtotal = quantity * pricePerItem;
  const gstAmount = subtotal * gstRate;
  const totalAmount = subtotal + gstAmount;

  const upiLink = `upi://pay?pa=im.259811010221@indus&am=${totalAmount.toFixed(2)}&cu=INR`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(upiLink)}`;

  const handleUPICheckout = () => {
    setShowUPI(true);
  };

  const handleBack = () => {
    setShowUPI(false);
  };

  const handleCheckout = async () => {
    if (!utrNumber.trim()) {
      alert("Please enter a valid UTR number");
      return;
    }
    try {
      const token = localStorage.getItem('django'); // Replace with your actual Bearer token
      const response = await axios.post(
          `${djangoUrl}/base/api/v1/offline/order/`,
        {
          utr: utrNumber, // Ensuring it's a string
          amount: totalAmount.toFixed(2), // Ensuring it's a string
          credits: quantity, // Keeping creditValue constant as quantity
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("API Response:", response.data);
      // alert("Payment Submitted – Awaiting Verification");
      alert(response.data.message);
      handleClose();
      setUtrNumber("");
    } catch (error) {
      console.error("Error calling API:", error);
      alert("Failed to record payment");
    }
  };

  const handleSubmit = () => {
    handleCheckout();
  };

  const handleQRCodeLoad = () => {
    setLoadingQRCode(false);
  };

  return (
    <Modal show={show} onHide={handleClose} centered className="custom-modal">
    <Modal.Header className="border-b border-gray-200 relative">
      <Modal.Title className="text-xl font-semibold text-center w-full">Add Credits</Modal.Title>
      <Button
        variant="link"
        onClick={handleClose}
        className="absolute top-0 right-0 p-2 text-gray-600 hover:text-gray-900"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </Button>
    </Modal.Header>
      <Modal.Body className="p-4">
        {!showUPI ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 border border-gray-200">Item</th>
                    <th className="p-2 border border-gray-200">Quantity</th>
                    <th className="p-2 border border-gray-200">Price</th>
                    <th className="p-2 border border-gray-200">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 border border-gray-200">E-Sign Allotments</td>
                    <td className="p-2 border border-gray-200">
                      <div className="flex items-center justify-center">
                        <Button
                          variant="outline-secondary"
                          className="px-3 py-1 border border-gray-300 rounded-l"
                          onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                        >
                          −
                        </Button>
                        <input
                          type="number"
                          value={quantity}
                          onChange={(e) => {
                            const value = Math.max(1, Math.min(9999, Number(e.target.value))); // Limit to 1-1000
                            setQuantity(value);
                          }}
                          className="w-16 text-center border-t border-b border-gray-300"
                          min="1"
                          max="1000" // Optional: Add max attribute for HTML validation
                        />
                        <Button
                          variant="outline-secondary"
                          className="px-3 py-1 border border-gray-300 rounded-r"
                          onClick={() => setQuantity((prev) => Math.min(9999, prev + 1))} // Ensure it doesn't exceed 1000
                        >
                          +
                        </Button>
                      </div>
                    </td>
                    <td className="border border-gray-200 text-right">₹{pricePerItem.toFixed(2)}</td>
                    <td className="border border-gray-200 text-right">₹{subtotal.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
          </>
        ) : (
          <div className="text-center">
            {loadingQRCode && <Loader />}
            <img 
              src={qrCodeUrl} 
              alt="UPI QR Code" 
              className="mx-auto mb-2"
              onLoad={handleQRCodeLoad}
              style={{ display: loadingQRCode ? 'none' : 'block' }}
            />
            <div className="mb-2">
              <span className="text-lg font-semibold mr-2">Scan and Pay via</span>
              <img 
                src={require('../assets/images/UPI-Color.svg').default} 
                alt="UPI Image" 
                className="mx-auto"
                style={{ width: '80px', height: 'auto' }}
              />
            </div>
            <p className="text-lg font-semibold mb-2">Total Amount: ₹{totalAmount.toFixed(2)}</p>
            <input
              type="text"
              placeholder="Enter UTR Number"
              value={utrNumber}
              onChange={(e) => {
                const value = e.target.value.slice(0, 22); // Limit input to 22 characters
                setUtrNumber(value);
              }}
              className="w-60 p-2 border border-gray-300 rounded mb-2"
              maxLength={22} // Prevent entering more than 22 characters
            />
            { (utrNumber.length < 15 || utrNumber.length > 22) && (
              <p className="text-red-500 mb-2">
                UTR number must be between 15 and 22 characters long.
              </p>
            )}
            <div className="flex justify-center space-x-2">
              <Button variant="secondary" onClick={handleBack} className="bg-gray-500 text-white px-4 py-2 rounded">
                Back
              </Button>
              <Button 
                variant="primary" 
                onClick={handleSubmit} 
                className="bg-blue-500 text-white px-4 py-2 rounded" 
                disabled={utrNumber.length < 15 || utrNumber.length > 22}
              >
                Submit
              </Button>
            </div>
          </div>
        )}
      </Modal.Body>
      {!showUPI && (<>
        <div className="text-right mt-4 p-4">
              <p className="text-gray-700">
                Sub Total: <strong className="font-semibold ml-2">₹{subtotal.toFixed(2)}</strong>
              </p>
              <p className="text-gray-700">
                GST ({(gstRate * 100).toFixed(0)}%): <strong className="font-semibold ml-2">₹{gstAmount.toFixed(2)}</strong>
              </p>
              <p className="text-gray-700">
                Total Amount: <strong className="font-semibold ml-2">₹{totalAmount.toFixed(2)}</strong>
              </p>
            </div>
        <Modal.Footer className="border-t border-gray-200 p-4">
          {totalAmount > 100000 && (
            <p className="text-red-500 mr-4">
              Note: UPI transactions are restricted to a maximum amount of INR 1 lakh.
            </p>
          )}
          <Button 
            variant="success" 
            onClick={handleUPICheckout} 
            className="bg-green-500 text-white px-4 py-2 rounded" 
            disabled={totalAmount > 100000}
          >
            Checkout via UPI
          </Button>
        </Modal.Footer></>
        
      )}
    </Modal>
  );
};

export default AddCreditsModal;