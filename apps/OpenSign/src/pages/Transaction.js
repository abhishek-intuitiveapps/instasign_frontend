import React, { useState,useEffect } from "react";
import axios from "axios";
import PaginationComponent from "./PaginationComponent"; // Adjust the import path as necessary
import AddCreditsModal from "./AddCreditsModal";
import Loader from "../primitives/Loader";
import Title from "../components/Title";



const BillingPage = () => {
  const [activeTable, setActiveTable] = useState("transactions");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amountValue, setAmountValue] = useState("100"); // Ensure it's a string
  const [creditValue, setCreditValue] = useState(0); // Remove creditValue state
  const [utrValue, setUtrValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [transactionsData, setTransactionsData] = useState([]); // Add state for transactions data
  const [isLoading, setIsLoading] = useState(true); // Add isLoading state
  const djangoToken = localStorage.getItem('django'); // Commenting out the token retrieval
  const djangoUrl = process.env.REACT_APP_DJANGO_URL;
  
   // Retrieve rowsPerPage from localStorage or default to 25
  const [rowsPerPage, setRowsPerPage] = useState(() => {
    const savedRowsPerPage = localStorage.getItem("rowsPerPage");
    return savedRowsPerPage ? parseInt(savedRowsPerPage, 10) : 25;
  });

  // Update localStorage whenever rowsPerPage changes
  useEffect(() => {
    localStorage.setItem("rowsPerPage", rowsPerPage);
    fetchTransactionsData();
  }, [rowsPerPage]);

  // Function to fetch transactions data
  const fetchTransactionsData = async () => {
    setIsLoading(true); // Set loading to true before fetching
    try {
      const response = await axios.get(`${djangoUrl}/base/api/v1/get/transactions/`, {
        headers: {
          Authorization: `Bearer ${djangoToken}`,
        },
      });
      console.log("Transactions data is fetched:", response.data);
      setTransactionsData(response.data.data); // Store the fetched data in state
    } catch (error) {
      console.error("Error fetching transactions data:", error);
    } finally {
      setIsLoading(false); // Set loading to false after fetching
    }
  };

  // Dummy transaction data
  // const dummyTransactionsData = [
  //   { id: 1, date: "2025-01-01", amount: 100, transactionId: "TXN001", status: "approved" },
  //   { id: 2, date: "2025-01-02", amount: 200, transactionId: "TXN002", status: "pending" },
  //   { id: 3, date: "2025-01-03", amount: 150, transactionId: "TXN003", status: "failed" },
  //   { id: 4, date: "2025-01-04", amount: 300, transactionId: "TXN004", status: "approved" },
  //   { id: 5, date: "2025-01-05", amount: 250, transactionId: "TXN005", status: "approved" },
  //   { id: 1, date: "2025-01-01", amount: 100, transactionId: "TXN001", status: "approved" },
  //   { id: 2, date: "2025-01-02", amount: 200, transactionId: "TXN002", status: "pending" },
  //   { id: 3, date: "2025-01-03", amount: 150, transactionId: "TXN003", status: "failed" },
  //   { id: 4, date: "2025-01-04", amount: 300, transactionId: "TXN004", status: "approved" },
  //   { id: 5, date: "2025-01-05", amount: 250, transactionId: "TXN005", status: "approved" },
  //   { id: 1, date: "2025-01-01", amount: 100, transactionId: "TXN001", status: "approved" },
  //   { id: 2, date: "2025-01-02", amount: 200, transactionId: "TXN002", status: "pending" },
  //   { id: 3, date: "2025-01-03", amount: 150, transactionId: "TXN003", status: "failed" },
  //   { id: 4, date: "2025-01-04", amount: 300, transactionId: "TXN004", status: "approved" },
  //   { id: 5, date: "2025-01-05", amount: 250, transactionId: "TXN005", status: "approved" },
  //   { id: 1, date: "2025-01-01", amount: 100, transactionId: "TXN001", status: "approved" },
  //   { id: 2, date: "2025-01-02", amount: 200, transactionId: "TXN002", status: "pending" },
  //   { id: 3, date: "2025-01-03", amount: 150, transactionId: "TXN003", status: "failed" },
  //   { id: 4, date: "2025-01-04", amount: 300, transactionId: "TXN004", status: "approved" },
  //   { id: 5, date: "2025-01-05", amount: 250, transactionId: "TXN005", status: "approved" },
  //   { id: 1, date: "2025-01-01", amount: 100, transactionId: "TXN001", status: "approved" },
  //   { id: 2, date: "2025-01-02", amount: 200, transactionId: "TXN002", status: "pending" },
  //   { id: 3, date: "2025-01-03", amount: 150, transactionId: "TXN003", status: "failed" },
  //   { id: 4, date: "2025-01-04", amount: 300, transactionId: "TXN004", status: "approved" },
  //   { id: 5, date: "2025-01-05", amount: 250, transactionId: "TXN005", status: "approved" },
  //   { id: 1, date: "2025-01-01", amount: 100, transactionId: "TXN001", status: "approved" },
  //   { id: 2, date: "2025-01-02", amount: 200, transactionId: "TXN002", status: "pending" },
  //   { id: 3, date: "2025-01-03", amount: 150, transactionId: "TXN003", status: "failed" },
  //   { id: 4, date: "2025-01-04", amount: 300, transactionId: "TXN004", status: "approved" },
  //   { id: 5, date: "2025-01-05", amount: 250, transactionId: "TXN005", status: "approved" },
  //   { id: 1, date: "2025-01-01", amount: 100, transactionId: "TXN001", status: "approved" },
  //   { id: 2, date: "2025-01-02", amount: 200, transactionId: "TXN002", status: "pending" },
  //   { id: 3, date: "2025-01-03", amount: 150, transactionId: "TXN003", status: "failed" },
  //   { id: 4, date: "2025-01-04", amount: 300, transactionId: "TXN004", status: "approved" },
  //   { id: 5, date: "2025-01-05", amount: 250, transactionId: "TXN005", status: "approved" },
  //   { id: 1, date: "2025-01-01", amount: 100, transactionId: "TXN001", status: "approved" },
  //   { id: 2, date: "2025-01-02", amount: 200, transactionId: "TXN002", status: "pending" },
  //   { id: 3, date: "2025-01-03", amount: 150, transactionId: "TXN003", status: "failed" },
  //   { id: 4, date: "2025-01-04", amount: 300, transactionId: "TXN004", status: "approved" },
  //   { id: 5, date: "2025-01-05", amount: 250, transactionId: "TXN005", status: "approved" },
  //   { id: 1, date: "2025-01-01", amount: 100, transactionId: "TXN001", status: "approved" },
  //   { id: 2, date: "2025-01-02", amount: 200, transactionId: "TXN002", status: "pending" },
  //   { id: 3, date: "2025-01-03", amount: 150, transactionId: "TXN003", status: "failed" },
  //   { id: 4, date: "2025-01-04", amount: 300, transactionId: "TXN004", status: "approved" },
  //   { id: 5, date: "2025-01-05", amount: 250, transactionId: "TXN005", status: "approved" },
  //   { id: 1, date: "2025-01-01", amount: 100, transactionId: "TXN001", status: "approved" },
  //   { id: 2, date: "2025-01-02", amount: 200, transactionId: "TXN002", status: "pending" },
  //   { id: 3, date: "2025-01-03", amount: 150, transactionId: "TXN003", status: "failed" },
  //   { id: 4, date: "2025-01-04", amount: 300, transactionId: "TXN004", status: "approved" },
  //   { id: 5, date: "2025-01-05", amount: 250, transactionId: "TXN005", status: "approved" },
  // ];

  // Set dummy data to transactionsData
  // useEffect(() => {
  //   setTransactionsData(dummyTransactionsData);
  //   setIsLoading(false);
  // }, []);

  const data = transactionsData; // Only use transactions data

  // Pagination Logic
  const paginatedData = data.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  return (
    // <div className="flex flex-col h-50vh bg-gray-100 p-5">
    <>
      <Title title="Transactions" drive={false} />
      {/* Toggle Buttons */}
      {/* <div className="flex items-center mb-4">
        <button
          className={`px-4 py-2 rounded-r ${activeTable === "transactions" ? "bg-gray-700 text-white" : "bg-gray-300 text-gray-700"}`}
          onClick={() => { setActiveTable("transactions"); setCurrentPage(1); }}
        >
          Transactions
        </button>
      </div> */}

      {/* Table Section */}
      <div className="bg-white px-3 pt-4 rounded-md shadow-md overflow-hidden" style={{ height: '90vh' }}>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Transactions History</h2>
        <div className="table-container" style={{ height: 'calc(73vh - 80px)', overflowY: 'auto' }}>
          <table 
            className="min-w-full border border-gray-300" 
            style={{
              borderCollapse: 'collapse', 
              height: isLoading || data.length === 0 ? '100%' : 'auto'
            }}
          >
            <thead className="bg-gray-200 sticky top-0">
              <tr className="text-gray-700">
                <th className="p-3 text-center border">S.No</th>
                <th className="p-3 text-center border">Date</th>
                <th className="p-3 text-center border">Amount</th>
                <th className="p-3 text-center border">Transaction ID</th>
                <th className="p-3 text-center border">Status</th>
              </tr>
            </thead>
            <tbody>
              {
              isLoading ? ( // Show loader while loading
                <tr>
                  <td colSpan="5" className="p-3 text-center" style={{ height: '400px' }}>
                    <div className="flex justify-center items-center" style={{ height: '100%' }}>
                      <Loader />
                    </div>
                  </td>
                </tr>
              ) : paginatedData.length > 0 ? (
                paginatedData.map((item, index) => (
                  <tr key={item.id} className="text-center border border-gray-300">
                    <td className="p-3 border">{(currentPage - 1) * rowsPerPage + index + 1}</td>
                    <td className="p-3 border">{item.transaction_date}</td>
                    <td className="p-3 border">{item.amount}</td>
                    <td className="p-3 border">{item.transaction_id}</td>
                    <td className="p-3 border">
                      <span 
                        className={`text-xs font-semibold px-2.5 py-0.5 rounded text-center ${
                          item.status.toLowerCase() === "pending" ? "bg-blue-100 text-blue-800" : 
                          item.status.toLowerCase() === "failed" ? "bg-red-100 text-red-800" : 
                          item.status.toLowerCase() === "success" ? "bg-green-100 text-green-800" : 
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
                  <td colSpan="5" className="p-3 text-center border">No data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination Controls */}
        <PaginationComponent
          totalItems={data.length}
          perPage={rowsPerPage}
          setPerPage={setRowsPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    {/* </div> */}
    </>
  );
};

export default BillingPage;
