import React, { useState,useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import PaginationComponent from "./PaginationComponent"; // Adjust the import path as necessary
import AddCreditsModal from "./AddCreditsModal";
import Loader from "../primitives/Loader";
import Title from "../components/Title";
import env_data from "../env_data.json";
const MonthlyBills = () => {
  const [activeTable, setActiveTable] = useState("transactions");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amountValue, setAmountValue] = useState("100"); // Ensure it's a string
  const [creditValue, setCreditValue] = useState(0); // Remove creditValue state
  const [utrValue, setUtrValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [billsData, setBillsData] = useState([]); // Add state for transactions data
  const [isLoading, setIsLoading] = useState(false); // Add isLoading state
  const djangoToken = localStorage.getItem('django'); // Commenting out the token retrieval
  const paymentMode = useSelector((state) => state.payment.mode);
  const djangoUrl = env_data.django_url;
   // Retrieve rowsPerPage from localStorage or default to 25
  const [rowsPerPage, setRowsPerPage] = useState(() => {
    const savedRowsPerPage = localStorage.getItem("rowsPerPage");
    return savedRowsPerPage ? parseInt(savedRowsPerPage, 10) : 25;
  });
  console.log("payment mode ==>",paymentMode);
  // Update localStorage whenever rowsPerPage changes
  useEffect(() => {
    localStorage.setItem("rowsPerPage", rowsPerPage);
    fetchTransactionsData();
  }, [rowsPerPage]);

  // Function to fetch transactions data
  const fetchTransactionsData = async () => {
    setIsLoading(true); // Set loading to true before fetching
    try {
      const response = await axios.get(`${djangoUrl}/base/api/v1/postpaid/billing/`, {
        headers: {
          Authorization: `Bearer ${djangoToken}`,
        },
      });
      console.log("Transactions data is fetched:", response.data);
      setBillsData(response.data.data); // Store the fetched data in state
    } catch (error) {
      console.error("Error fetching transactions data:", error);
    } finally {
      setIsLoading(false); // Set loading to false after fetching
    }
  };

  // const billsData = [
  //   {
  //     "id": 1,
  //     "pdf_attachment_url": "https://example.com/invoices/invoice1.pdf",
  //     "month": "January",
  //     "amount": 1000,
  //     "raised_on": "2025-01-01T10:00:00",
  //     "status": "Success"
  //   },
  //   {
  //     "id": 2,
  //     "pdf_attachment_url": "https://example.com/invoices/invoice2.pdf",
  //     "month": "January",
  //     "amount": 1200,
  //     "raised_on": "2025-01-05T12:30:00",
  //     "status": "Pending"
  //   },
  //   {
  //     "id": 3,
  //     "pdf_attachment_url": "https://example.com/invoices/invoice3.pdf",
  //     "month": "January",
  //     "amount": 1500,
  //     "raised_on": "2025-01-10T09:15:00",
  //     "status": "Failed"
  //   },
  //   {
  //     "id": 4,
  //     "pdf_attachment_url": "https://example.com/invoices/invoice4.pdf",
  //     "month": "February",
  //     "amount": 1100,
  //     "raised_on": "2025-02-02T14:45:00",
  //     "status": "Success"
  //   },
  //   {
  //     "id": 5,
  //     "pdf_attachment_url": "https://example.com/invoices/invoice5.pdf",
  //     "month": "February",
  //     "amount": 1300,
  //     "raised_on": "2025-02-08T11:20:00",
  //     "status": "Failed"
  //   },
  //   {
  //     "id": 6,
  //     "pdf_attachment_url": "https://example.com/invoices/invoice6.pdf",
  //     "month": "February",
  //     "amount": 1700,
  //     "raised_on": "2025-02-15T16:10:00",
  //     "status": "Pending"
  //   },
  //   {
  //     "id": 7,
  //     "pdf_attachment_url": "https://example.com/invoices/invoice7.pdf",
  //     "month": "March",
  //     "amount": 2000,
  //     "raised_on": "2025-03-03T08:25:00",
  //     "status": "Success"
  //   },
  //   {
  //     "id": 8,
  //     "pdf_attachment_url": "https://example.com/invoices/invoice8.pdf",
  //     "month": "March",
  //     "amount": 1400,
  //     "raised_on": "2025-03-07T13:50:00",
  //     "status": "Pending"
  //   },
  //   {
  //     "id": 9,
  //     "pdf_attachment_url": "https://example.com/invoices/invoice9.pdf",
  //     "month": "March",
  //     "amount": 1800,
  //     "raised_on": "2025-03-12T10:40:00",
  //     "status": "Failed"
  //   },
  //   {
  //     "id": 10,
  //     "pdf_attachment_url": "https://example.com/invoices/invoice10.pdf",
  //     "month": "April",
  //     "amount": 1600,
  //     "raised_on": "2025-04-04T12:00:00",
  //     "status": "Success"
  //   },
  //   {
  //     "id": 11,
  //     "pdf_attachment_url": "https://example.com/invoices/invoice11.pdf",
  //     "month": "April",
  //     "amount": 1900,
  //     "raised_on": "2025-04-10T14:30:00",
  //     "status": "Pending"
  //   },
  //   {
  //     "id": 12,
  //     "pdf_attachment_url": "https://example.com/invoices/invoice12.pdf",
  //     "month": "April",
  //     "amount": 1750,
  //     "raised_on": "2025-04-18T17:15:00",
  //     "status": "Failed"
  //   },
  //   {
  //     "id": 13,
  //     "pdf_attachment_url": "https://example.com/invoices/invoice13.pdf",
  //     "month": "May",
  //     "amount": 1500,
  //     "raised_on": "2025-05-02T09:45:00",
  //     "status": "Success"
  //   },
  //   {
  //     "id": 14,
  //     "pdf_attachment_url": "https://example.com/invoices/invoice14.pdf",
  //     "month": "May",
  //     "amount": 1350,
  //     "raised_on": "2025-05-06T11:30:00",
  //     "status": "Pending"
  //   },
  //   {
  //     "id": 15,
  //     "pdf_attachment_url": "https://example.com/invoices/invoice15.pdf",
  //     "month": "May",
  //     "amount": 2000,
  //     "raised_on": "2025-05-12T14:00:00",
  //     "status": "Failed"
  //   },
  //   {
  //     "id": 16,
  //     "pdf_attachment_url": "https://example.com/invoices/invoice16.pdf",
  //     "month": "June",
  //     "amount": 1750,
  //     "raised_on": "2025-06-03T12:20:00",
  //     "status": "Success"
  //   },
  //   {
  //     "id": 17,
  //     "pdf_attachment_url": "https://example.com/invoices/invoice17.pdf",
  //     "month": "June",
  //     "amount": 2200,
  //     "raised_on": "2025-06-09T15:40:00",
  //     "status": "Pending"
  //   },
  //   {
  //     "id": 18,
  //     "pdf_attachment_url": "https://example.com/invoices/invoice18.pdf",
  //     "month": "June",
  //     "amount": 1450,
  //     "raised_on": "2025-06-14T10:10:00",
  //     "status": "Failed"
  //   },
  //   {
  //     "id": 19,
  //     "pdf_attachment_url": "https://example.com/invoices/invoice19.pdf",
  //     "month": "July",
  //     "amount": 1300,
  //     "raised_on": "2025-07-05T11:50:00",
  //     "status": "Success"
  //   },
  //   {
  //     "id": 20,
  //     "pdf_attachment_url": "https://example.com/invoices/invoice20.pdf",
  //     "month": "July",
  //     "amount": 1800,
  //     "raised_on": "2025-07-11T13:20:00",
  //     "status": "Failed"
  //   },
  //   {
  //     "id": 21,
  //     "pdf_attachment_url": "https://example.com/invoices/invoice1.pdf",
  //     "month": "January",
  //     "amount": 1000,
  //     "raised_on": "2025-01-01T10:00:00",
  //     "status": "Success"
  //   },
  //   {
  //     "id": 22,
  //     "pdf_attachment_url": "https://example.com/invoices/invoice2.pdf",
  //     "month": "January",
  //     "amount": 1200,
  //     "raised_on": "2025-01-05T12:30:00",
  //     "status": "Pending"
  //   },
  //   {
  //     "id": 23,
  //     "pdf_attachment_url": "https://example.com/invoices/invoice3.pdf",
  //     "month": "January",
  //     "amount": 1500,
  //     "raised_on": "2025-01-10T09:15:00",
  //     "status": "Failed"
  //   },
  //   {
  //     "id": 24,
  //     "pdf_attachment_url": "https://example.com/invoices/invoice4.pdf",
  //     "month": "February",
  //     "amount": 1100,
  //     "raised_on": "2025-02-02T14:45:00",
  //     "status": "Success"
  //   },
  //   {
  //     "id": 25,
  //     "pdf_attachment_url": "https://example.com/invoices/invoice5.pdf",
  //     "month": "February",
  //     "amount": 1300,
  //     "raised_on": "2025-02-08T11:20:00",
  //     "status": "Failed"
  //   },
  //   {
  //     "id": 26,
  //     "pdf_attachment_url": "https://example.com/invoices/invoice6.pdf",
  //     "month": "February",
  //     "amount": 1700,
  //     "raised_on": "2025-02-15T16:10:00",
  //     "status": "Pending"
  //   },
  //   {
  //     "id": 27,
  //     "pdf_attachment_url": "https://example.com/invoices/invoice7.pdf",
  //     "month": "March",
  //     "amount": 2000,
  //     "raised_on": "2025-03-03T08:25:00",
  //     "status": "Success"
  //   },
  //   {
  //     "id": 28,
  //     "pdf_attachment_url": "https://example.com/invoices/invoice8.pdf",
  //     "month": "March",
  //     "amount": 1400,
  //     "raised_on": "2025-03-07T13:50:00",
  //     "status": "Pending"
  //   },
  //   {
  //     "id": 29,
  //     "pdf_attachment_url": "https://example.com/invoices/invoice9.pdf",
  //     "month": "March",
  //     "amount": 1800,
  //     "raised_on": "2025-03-12T10:40:00",
  //     "status": "Failed"
  //   },
  //   {
  //     "id": 30,
  //     "pdf_attachment_url": "https://example.com/invoices/invoice10.pdf",
  //     "month": "April",
  //     "amount": 1600,
  //     "raised_on": "2025-04-04T12:00:00",
  //     "status": "Success"
  //   },
  //   {
  //     "id": 31,
  //     "pdf_attachment_url": "https://example.com/invoices/invoice11.pdf",
  //     "month": "April",
  //     "amount": 1900,
  //     "raised_on": "2025-04-10T14:30:00",
  //     "status": "Pending"
  //   },
  //   {
  //     "id": 32,
  //     "pdf_attachment_url": "https://example.com/invoices/invoice12.pdf",
  //     "month": "April",
  //     "amount": 1750,
  //     "raised_on": "2025-04-18T17:15:00",
  //     "status": "Failed"
  //   },
  //   {
  //     "id": 33,
  //     "pdf_attachment_url": "https://example.com/invoices/invoice13.pdf",
  //     "month": "May",
  //     "amount": 1500,
  //     "raised_on": "2025-05-02T09:45:00",
  //     "status": "Success"
  //   },
  //   {
  //     "id": 34,
  //     "pdf_attachment_url": "https://example.com/invoices/invoice14.pdf",
  //     "month": "May",
  //     "amount": 1350,
  //     "raised_on": "2025-05-06T11:30:00",
  //     "status": "Pending"
  //   },
  //   {
  //     "id": 35,
  //     "pdf_attachment_url": "https://example.com/invoices/invoice15.pdf",
  //     "month": "May",
  //     "amount": 2000,
  //     "raised_on": "2025-05-12T14:00:00",
  //     "status": "Failed"
  //   },
  //   {
  //     "id": 36,
  //     "pdf_attachment_url": "https://example.com/invoices/invoice16.pdf",
  //     "month": "June",
  //     "amount": 1750,
  //     "raised_on": "2025-06-03T12:20:00",
  //     "status": "Success"
  //   },
  //   {
  //     "id": 37,
  //     "pdf_attachment_url": "https://example.com/invoices/invoice17.pdf",
  //     "month": "June",
  //     "amount": 2200,
  //     "raised_on": "2025-06-09T15:40:00",
  //     "status": "Pending"
  //   },
  //   {
  //     "id": 38,
  //     "pdf_attachment_url": "https://example.com/invoices/invoice18.pdf",
  //     "month": "June",
  //     "amount": 1450,
  //     "raised_on": "2025-06-14T10:10:00",
  //     "status": "Failed"
  //   },
  //   {
  //     "id": 39,
  //     "pdf_attachment_url": "https://example.com/invoices/invoice19.pdf",
  //     "month": "July",
  //     "amount": 1300,
  //     "raised_on": "2025-07-05T11:50:00",
  //     "status": "Success"
  //   },
  //   {
  //     "id": 40,
  //     "pdf_attachment_url": "https://example.com/invoices/invoice20.pdf",
  //     "month": "July",
  //     "amount": 1800,
  //     "raised_on": "2025-07-11T13:20:00",
  //     "status": "Failed"
  //   }
  // ]
  
  

  const data = billsData; // Only use transactions data

  // Pagination Logic
  const paginatedData = data.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  return (
    // <div className="flex flex-col h-50vh bg-gray-100 p-5">
    <>
      <Title title="Monthly Bills" drive={false} />
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
      <div className="bg-white p-5 rounded-md shadow-md overflow-hidden" style={{ height: '80vh' }}>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Billing History</h2>
        <div className="table-container" style={{ height: 'calc(65vh - 80px)', overflowY: 'auto' }}>
        <table 
            className="min-w-full border border-gray-300" 
            style={{
              borderCollapse: 'collapse', 
              height: isLoading || data.length === 0 ? '100%' : 'auto'
            }}
          >
            <thead className="bg-gray-200 sticky top-0 z-10">
              <tr className="text-gray-700">
                <th className="p-3 text-center border">S.No</th>
                <th className="p-3 text-center border">Attachment</th>
                <th className="p-3 text-center border">Month</th>
                <th className="p-3 text-center border">Total Documents</th>
                <th className="p-3 text-center border">Subtotal Amount</th>
                <th className="p-3 text-center border">Billing Amount</th>
                {/* <th className="p-3 text-center border">Status</th> */}
              </tr>
            </thead>
            <tbody>
              {
              isLoading ? ( // Show loader while loading
                <tr>
                  <td colSpan="6" className="p-3 text-center" style={{ height: '400px' }}>
                    <div className="flex justify-center items-center" style={{ height: '100%' }}>
                      <Loader />
                    </div>
                  </td>
                </tr>
              ) : paginatedData.length > 0 ? (
                paginatedData.map((item, index) => (
                  <tr key={item.id} className="text-center border border-gray-300">
                    <td className="p-3 border">{(currentPage - 1) * rowsPerPage + index + 1}</td>
                    <td className="p-2 border">
                      <a href={item.pdf_attachment_url} target="_blank" rel="noopener noreferrer">
                        <button className="p-2 rounded-md border border-gray-300 hover:bg-gray-100 transition-colors">
                          <i className="fa-light fa-file-pdf text-[#002864] text-xl"></i>
                        </button>
                      </a>
                    </td>
                    <td className="p-3 border">{item.month}</td>
                    <td className="p-3 border">{item.total_documents}</td>
                    <td className="p-3 border">{item.subtotal_amount}</td>
                    <td className="p-3 border">{item.billing_amount}</td>
                    {/* <td className="p-3 border">
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
                    </td> */}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-3 text-center border">No data available</td>
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

export default MonthlyBills;