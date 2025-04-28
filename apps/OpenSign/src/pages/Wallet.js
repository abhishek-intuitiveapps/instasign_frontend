import React, { useState, useEffect } from "react";
import Title from "../components/Title"; // Import the Title component
import axios from "axios";
import PaginationComponent from "./PaginationComponent"; // Adjust the import path as necessary
import AddCreditsModal from "./AddCreditsModal";
import { WalletCard } from "./WalletCard";
import Loader from "../primitives/Loader";
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for toasts


// Import necessary components and hooks
const Wallet = () => {
  // NewCard component definition

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amountValue, setAmountValue] = useState("100"); // Ensure it's a string
  const [creditValue, setCreditValue] = useState(100); // Ensure it's a string
  const [utrValue, setUtrValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [walletDetails, setWalletDetails] = useState(null); // State to store wallet details
  const [isLoading, setIsLoading] = useState(true); // New state for loading
  const [creditsData, setCreditsData] = useState([]); // Make creditsData a state variable
  const djangoUrl = process.env.REACT_APP_DJANGO_URL;

  const [rowsPerPage, setRowsPerPage] = useState(() => {
    const savedRowsPerPage = localStorage.getItem("rowsPerPage");
    return savedRowsPerPage ? parseInt(savedRowsPerPage, 10) : 25;
  });

  const djangoToken = localStorage.getItem('django');

  useEffect(() => {
    localStorage.setItem("rowsPerPage", rowsPerPage);
    const fetchData = async () => {
      setIsLoading(true); // Set loading to true before fetching
      // await fetchWalletDetails();
      fetchOfflineOrders();
      setIsLoading(false); // Set loading to false after fetching
    };
    fetchData();
  }, [rowsPerPage]);

  // const fetchWalletDetails = async () => {
  //   try {
  //     const response = await axios.get(`${djangoUrl}/base/api/v1/get/wallet/`, {
  //       headers: {
  //         Authorization: `Bearer ${djangoToken}`,
  //       },
  //     });
  //     if (response.data.status) {
  //       console.log("Wallet details fetched successfully:", response.data.data);
  //       setWalletDetails(response.data.data);
  //       toast.success("Wallet details fetched successfully!"); // Toast for success
  //     } else {
  //       console.error("Failed to fetch wallet details:", response.data.message);
  //       toast.error("Failed to fetch wallet details: " + response.data.message); // Toast for error
  //     }
  //   } catch (error) {
  //     console.error("Error fetching wallet details:", error);
  //     toast.error("Error fetching wallet details: " + error.message); // Toast for error
  //   }
  // };

  const fetchOfflineOrders = async () => {
    try {
      const response = await axios.get(`${djangoUrl}/base/api/v1/offline/order/`, {
        headers: {
          Authorization: `Bearer ${djangoToken}`,
        },
      });
      console.log(response.data);
      if (response.data) {
        console.log("Offline orders fetched successfully:", response.data.data);
        setCreditsData(response.data.data);
        // toast.success("Offline orders fetched successfully!"); // Toast for success
      } else {
        console.error("Failed to fetch offline orders:", response.data.message);
        toast.error("Failed to fetch offline orders: " + response.data.message); // Toast for error
      }
    } catch (error) {
      console.error("Error fetching offline orders:", error);
      toast.error("Error fetching offline orders: " + error.message); // Toast for error
    }
  };

  function generateUTR() {
    return "UTR" + Math.floor(10000 + Math.random() * 90000);
  }

  function generateWalletId() {
    return "WALLET" + Math.floor(100 + Math.random() * 900);
  }

  function generateStatus() {
    const statuses = ["APPROVED", "PENDING", "FAILED"];
    return statuses[Math.floor(Math.random() * statuses.length)];
  }

  function generateUserName() {
    const firstNames = ["John", "Jane", "Alice", "Bob", "Emily", "Michael", "Sarah", "David", "Laura", "Chris"];
    const lastNames = ["Doe", "Smith", "Brown", "Taylor", "Johnson", "Williams", "Jones", "Garcia", "Martinez", "Davis"];
    return firstNames[Math.floor(Math.random() * firstNames.length)] + " " + lastNames[Math.floor(Math.random() * lastNames.length)];
  }

  // const creditsData = [];

  // for (let i = 1; i <= 2; i++) {
  //   const amount = Math.floor(100 + Math.random() * 1000);
  //   const unitPrice = amount / 100;

  //   creditsData.push({
  //     id: i,
  //     date: `2025-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
  //     amount: amount,
  //     user: generateUserName(),
  //     unitPrice: unitPrice,
  //     utr: generateUTR(),
  //     walletId: generateWalletId(),
  //     status: generateStatus(),
  //   });
  // }

  const paginatedData = creditsData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  // const handleCheckout = async () => {
  //   if (!utrValue.trim()) {
  //     alert("Please enter a valid UTR number");
  //     return;
  //   }
  //   try {
  //     const response = await axios.post(
  //       "https://api.dev.instasign.ai/base/api/v1/create/offline/order/",
  //       {
  //         utr: utrValue,
  //         amount: amountValue,
  //         credits: creditValue,
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${djangoToken}`,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );
  //     alert("Payment successfully recorded");
  //     setIsModalOpen(false);
  //     setUtrValue("");
  //   } catch (error) {
  //     alert("Failed to record payment");
  //   }
  // };

  const downloadInvoice = async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Network response was not ok');
      
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'invoice.pdf'; // You can customize the filename here
      link.click();
      window.URL.revokeObjectURL(link.href); // Clean up the URL object
    } catch (error) {
      console.error('Error downloading the invoice:', error);
    }
  };

  // Call fetchWalletDetails when the component mounts or at a specific event

  return (
    <>
    
    {/* <div className="flex flex-col h-80vh bg-gray-100 p-5"> */}
    <div>
      <Title title="Wallet" drive={false} /> {/* Set the page title using Title component */}
      
      {/* New Card */}
      {/* {isLoading ? ( // Conditional rendering based on loading state
        <div className="flex justify-center items-center" style={{ height: '100%' }}>
          <Loader /> 
        </div>
      ) : (
        walletDetails && walletDetails.length > 0 && (
          <WalletCard 
            label="Company Credits" 
            value={walletDetails[0].available_allotment} // Use available_allotment from wallet details
            icon="fa-light fa-money-bill-wave" 
            loading={false} 
            id={walletDetails[0].wallet_id} // Use wallet_id from wallet details
            updatedOn={walletDetails[0].updated_at} // Use updated_at from wallet details
          />
        )
      )} */}
      
    </div>
      {/* <h2 className="text-2xl font-bold text-gray-800 mb-4">Billing - Credits</h2> */}
      <div className="bg-white px-3 pt-4 rounded-md shadow-md overflow-hidden" style={{ height: '90vh', maxWidth: '100%' }}>
        <div className="flex justify-between mb-2">
          <h2 className="text-2xl font-bold text-gray-800 ">Credits History</h2>
          <button 
            onClick={() => setShowModal(true)} 
            className="border border-gray-700 text-gray-700 px-4 py-2 rounded"
          >
            Add Credits
          </button>
        </div>
        <div className="table-container" style={{ height: 'calc(73vh - 80px)', overflowY: 'auto', overflowX: 'hidden' }}>
          <table 
            className="min-w-full border border-gray-300" 
            style={{
              borderCollapse: 'collapse', 
              height: isLoading || paginatedData.length === 0 ? '100%' : 'auto',
              width: '100%'
            }}
          >
            <thead className="bg-gray-200 sticky top-0">
              <tr className="text-gray-700">
                <th className="p-3 text-center border">S.No</th>
                <th className="p-3 text-center border">Invoice</th>
                <th className="p-3 text-center border">Date</th>
                <th className="p-3 text-center border">Amount</th>
                <th className="p-3 text-center border">User</th>
                <th className="p-3 text-center border">Unit Price</th>
                <th className="p-3 text-center border">UTR</th>
                <th className="p-3 text-center border">Wallet ID</th>
                <th className="p-3 text-center border">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? ( // Show loader while loading
                <tr>
                  <td colSpan="8" className="p-3 text-center" style={{ height: '400px' }}>
                    <div className="flex justify-center items-center" style={{ height: '100%' }}>
                      <Loader />
                    </div>
                  </td>
                </tr>
              ) : paginatedData.length > 0 ? (
                paginatedData.map((item, index) => (
                  <tr key={item.id} className="text-center border border-gray-300">
                    <td className="p-3 border">{(currentPage - 1) * rowsPerPage + index + 1}</td>
                    <td className="p-3 border">
                      {item.invoice ? (
                        <button 
                          className="p-2 rounded-md border border-gray-300 hover:bg-gray-100 transition-colors"
                          onClick={() => downloadInvoice(item.invoice)}
                        >
                          <i className="fa-light fa-file-pdf text-[#002864] text-xl"></i>
                        </button>
                      ) : (
                        <span>Not yet generated</span>
                      )}
                    </td>
                    <td className="p-3 text-center border">{item.created_at.split('T')[0]}</td>
                    <td className="p-3 border">{item.amount}</td>
                    <td className="p-3 border">{item.responsible_person}</td>
                    <td className="p-3 border">{item.unit_price}</td>
                    <td className="p-3 border">{item.utr}</td>
                    <td className="p-3 border">{item.order_wallet}</td>
                    <td className="p-3 border">
                      <span 
                        className={`text-xs font-semibold px-2.5 py-0.5 rounded text-center ${
                          item.status.toLowerCase() === "pending" ? "bg-blue-100 text-blue-800" : 
                          item.status.toLowerCase() === "failed" ? "bg-red-100 text-red-800" : 
                          item.status.toLowerCase() === "approved" ? "bg-green-100 text-green-800" : 
                          "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center p-3 border text-gray-500">No data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <PaginationComponent
          totalItems={creditsData.length}
          perPage={rowsPerPage}
          setPerPage={setRowsPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
      <AddCreditsModal show={showModal} handleClose={() => setShowModal(false)} />
    {/* </div> */}
    <ToastContainer 
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
};

export default Wallet;