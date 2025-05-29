import { useState, useEffect } from "react";
import Breadcrumb from '../../components/Breadcrumb';
import { useParams, useNavigate } from 'react-router-dom';
import { LIST_REPORTS_API, RESUME_REPORT_API, GET_REPORT_HISTORY_API } from '../../Api/api';
import moment from "moment";
import { FaEye } from "react-icons/fa";
import { toast } from "react-toastify";

const Forms = () => {
  const { reportType } = useParams();
  const navigate = useNavigate();
  const [reportData, setReportData] = useState([]);
  const [reporthistoryData, setReportHistoryData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [isLoaded, setLoaded] = useState(false);
  const [historymodal, setHistorymodal] = useState(false);
  const [reportStatus, setReportstatus] = useState('Running');
  const [submissionId, setSubmissionid] = useState(0);
  var utoken = localStorage.getItem('userToken');

  const tableHeaders = [
    { label: "Report ID", key: "report_no" },
    { label: "Client", key: "customer_name" },
    { label: "Status", key: "submission_status" },
    { label: "BOM", key: "attech_report_id" },
    { label: "Inspection Eng-1", key: "employee_name" },
    // { label: "Inspection Eng-2", key: "" }, 
    { label: "Date", key: "created_at" },
    { label: "Actions", key: "" }, // No sorting for actions
  ];

  const tableHeadersbom = [
    { label: "Report ID", key: "report_no" },
    { label: "Client", key: "customer_name" },
    { label: "Status", key: "submission_status" },
    { label: "Inspection Eng-1", key: "employee_name" },
    // { label: "Inspection Eng-2", key: "" }, 
    { label: "Date", key: "created_at" },
    { label: "Images", key: "" },
    { label: "Actions", key: "" }, // No sorting for actions
  ];

  const tableHeadersdpr = [
    { label: "Report ID", key: "report_no" },
    { label: "Client", key: "customer_name" },
    { label: "Inspection Eng", key: "employee_name" },
    { label: "WP Production ", key: "production_wp" },
    { label: "NOS Production", key: "production_nos" },
    { label: "WP Rejection ", key: "rejection_wp" },
    { label: "NOS Rejection", key: "rejection_nos" },
    { label: "Date", key: "created_at" },
    { label: "Actions", key: "" },
  ];

  const tableHeaderspdi = [
    { label: "Report ID", key: "report_no" },
    { label: "Client", key: "customer_name" },
    { label: "Status", key: "submission_status" },
    { label: "Inspection Eng", key: "employee_name" },
    { label: "Date", key: "created_at" },
    { label: "Last Action At", key: "last_updated_at" },
    { label: "Reupdate", key: "" },
    { label: "Actions", key: "" },
  ];

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      listReports((currentPage + 1).toString());
      setCurrentPage(currentPage + 1)
    };
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      listReports((currentPage - 1).toString());
      setCurrentPage(currentPage - 1)
    };
  };

  // Sorting function
  const handleSort = (key: any) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    const sortedData = [...reportData].sort((a: any, b: any) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setReportData(sortedData);
    setSortConfig({ key, direction });
  };

  // Search function
  const handleSearch = (e: any) => {
    setSearchQuery(e.target.value);
    const filteredData = data.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
    setReportData(filteredData);
    setCurrentPage(1); // Reset to the first page after search
  };


  useEffect(() => {
    setLoaded(true);
    listReports(currentPage.toString());
  }, [reportType]);

  // Function to fetch sections-
  const listReports = async (page_no: string) => {
    const params = new URLSearchParams({
      pageNo: page_no,
      report_type: reportType || "IPQC"
    });

    try {
      const response = await fetch(`${LIST_REPORTS_API}?${params.toString()}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${utoken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      const data = await response.json();

      if (data.Status === 0) {
        setLoaded(false);
      } else if (data.Status === 1) {
        setReportData(data.info.data);
        setReportstatus(data.info.reportStatus);
        setSubmissionid(data.info.submission_id);
        setTotalPages(data.info.pagination.totalPages || 0);
        setLoaded(false);
      }
    } catch (error) {
      console.error("Error fetching sections:", error);
      setLoaded(false);
    }
  };

  const listReportsHistory = async (submission_id: string) => {
    const params = new URLSearchParams({
      submission_id: submission_id
    });

    try {
      const response = await fetch(`${GET_REPORT_HISTORY_API}?${params.toString()}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${utoken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      const data = await response.json();

      if (data.Status === 0) {
        setLoaded(false);
      } else if (data.Status === 1) {
        setReportHistoryData(data.info);
      }
    } catch (error) {
      console.error("Error fetching sections:", error);
      setLoaded(false);
    }
  };

  const resumeReport = async (e: any, formId: any, submissionID: any) => {
    e.preventDefault();
    try {
      const response = await fetch(RESUME_REPORT_API, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${utoken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          submission_id: submissionID,
          form_id: formId
        })
      });

      const data = await response.json();

      if (data.Status === 0) {
        setLoaded(false);
        toast.error(data.Message);
      } else if (data.Status === 1) {
        toast.success(data.Message);
        listReports(currentPage);
        setLoaded(false);
      }
    } catch (error) {
      console.error("Error fetching sections:", error);
      setLoaded(false);
    }
  };

  const openhistorymodal = (submission_id: any) => {
    listReportsHistory(submission_id);
    setHistorymodal(true);
  }

  return (
    <>
      <Breadcrumb pageName={reportType + " Report"} />

      <div className="flex flex-col" id="report">
        {/* Search bar and Add button */}
        <div className="flex justify-end items-center mb-4">
          {/* <button
            onClick={() => { }}
            className="inline-flex items-center justify-center rounded-md bg-primary py-2 px-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
          >
            New Report
          </button> */}
          <button
            onClick={() => navigate('/reports/running_report/1', { state: { reporttype: reportType, formId: reportType == "IPQC" ? 1 : reportType == "BOM" ? 3 : reportType == "PDI" ? 4 : 0, submissionID: submissionId } })}
            className="inline-flex items-center justify-center rounded-md bg-primary py-2 mx-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
          >
            {reportStatus} Report
          </button>
          <div className="relative mx-2">
            <button className="absolute top-1/2 left-0 -translate-y-1/2">
              <svg
                className="fill-body hover:fill-primary dark:fill-bodydark dark:hover:fill-primary"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M9.16666 3.33332C5.945 3.33332 3.33332 5.945 3.33332 9.16666C3.33332 12.3883 5.945 15 9.16666 15C12.3883 15 15 12.3883 15 9.16666C15 5.945 12.3883 3.33332 9.16666 3.33332ZM1.66666 9.16666C1.66666 5.02452 5.02452 1.66666 9.16666 1.66666C13.3088 1.66666 16.6667 5.02452 16.6667 9.16666C16.6667 13.3088 13.3088 16.6667 9.16666 16.6667C5.02452 16.6667 1.66666 13.3088 1.66666 9.16666Z"
                  fill=""
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M13.2857 13.2857C13.6112 12.9603 14.1388 12.9603 14.4642 13.2857L18.0892 16.9107C18.4147 17.2362 18.4147 17.7638 18.0892 18.0892C17.7638 18.4147 17.2362 18.4147 16.9107 18.0892L13.2857 14.4642C12.9603 14.1388 12.9603 13.6112 13.2857 13.2857Z"
                  fill=""
                />
              </svg>
            </button>

            <input
              type="text"
              placeholder="Type to search..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full bg-transparent pr-4 pl-9 focus:outline-none"
            />
          </div>
        </div>

        {historymodal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Data Table</h2>
                <button
                  onClick={() => setHistorymodal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <table className="w-full text-left border border-gray-200">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 border-b">Sr No</th>
                    <th className="p-2 border-b">History Type</th>
                    <th className="p-2 border-b">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {reporthistoryData.map((row: any, key: any) => (
                    <tr key={key} className="hover:bg-gray-50">
                      <td className="p-2 border-b">{key+1}</td>
                      <td className="p-2 border-b">{row.submission_type}</td>
                      <td className="p-2 border-b">{moment.utc(row.created_at).local().format("lll")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-4 text-right">
                <button
                  onClick={() => setHistorymodal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="max-w-full overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                  {(reportType == "BOM" ? tableHeadersbom : reportType == "DPR" ? tableHeadersdpr : reportType == "PDI" ? tableHeaderspdi : tableHeaders).map(({ label, key }) => (
                    <th
                      key={label}
                      className="min-w-[100px] py-3 px-4 font-medium text-sm text-black dark:text-white cursor-pointer"
                      onClick={key ? () => handleSort(key) : undefined} // Only sort if key exists
                    >
                      <b>{label}</b>{" "}
                      {sortConfig.key === key && key && (
                        <span>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reportData.map((item: any, i: any) => (
                  <tr key={i}>
                    <td className="border-b border-[#eee] py-1 px-4 dark:border-strokedark text-center" style={{ width: 20 }}>
                      <p className="text-sm text-black dark:text-white">{item.report_no}</p>
                    </td>
                    <td className="border-b border-[#eee] py-1 px-4 dark:border-strokedark">
                      <p className="text-sm text-black dark:text-white">{item.customer_name}</p>
                    </td>
                    <td className="border-b border-[#eee] py-1 px-4 dark:border-strokedark">
                      <p className="inline-flex bg-opacity-10 text-sm text-success">
                        {item.submission_status}</p>
                    </td>
                    {item.form_id == 1 ? <td className="border-b border-[#eee] py-1 px-4 dark:border-strokedark">
                      {item.attech_report_id ? <p onClick={() => navigate("/reports/view_report/1", { state: { submissionID: item.attech_submission_id, reporttype: 'BOM', formId: 3 } })} className="inline-flex bg-opacity-10 text-sm text-primary">{item.attech_report_id}</p> : <p className="inline-flex bg-opacity-10 text-sm text-danger">not attached</p>}
                    </td> : ""}
                    <td className="border-b border-[#eee] py-1 px-4 dark:border-strokedark">
                      <p className="text-sm text-black dark:text-white">{item.employee_name}</p>
                    </td>
                    <td className="border-b border-[#eee] py-1 px-4 dark:border-strokedark">
                      <p className="text-sm text-black dark:text-white">{moment(reportType == "BOM" ? item.bom_date : reportType == "PDI" ? item.created_at : item.ipqc_date).format("DD-MM-YYYY")}</p>
                    </td>
                    {reportType == "BOM" ? <td className="border-b border-[#eee] py-1 px-4 dark:border-strokedark">
                      <div onClick={() => navigate("/reports/view_images", { state: { submissionID: item.submission_id, reporttype: item.form_name, formId: item.form_id } })}><FaEye className="w-5 h-5" /></div>
                    </td> : ""}
                    {reportType == "PDI" ? <td className="border-b border-[#eee] py-1 px-4 dark:border-strokedark">
                      <div onClick={() => openhistorymodal(item.submission_id)}>{moment.utc(item.last_updated_at).local().format("lll")}</div>
                    </td> : ""}
                    {reportType == "PDI" ? <td className="border-b border-[#eee] py-1 px-4 dark:border-strokedark">
                      <button style={{ backgroundColor: '#1C2434', color: 'white', borderRadius: 20, padding: 8 }} onClick={(e) => resumeReport(e, item.form_id, item.submission_id)}>Resume</button>
                    </td> : ""}
                    <td className="border-b border-[#eee] py-1 px-4 dark:border-strokedark">
                      <div onClick={() => navigate("/reports/view_report/1", { state: { submissionID: item.submission_id, reporttype: item.form_name, formId: item.form_id } })}><FaEye className="w-5 h-5" /></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination controls */}
          <div className="flex justify-between mt-4">
            <button
              className={`px-4 py-2 ${currentPage === 1 ? "opacity-50" : ""}`}
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <p>
              Page {currentPage} of {totalPages}
            </p>
            <button
              className={`px-4 py-2 ${currentPage === totalPages ? "opacity-50" : ""}`}
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Forms;