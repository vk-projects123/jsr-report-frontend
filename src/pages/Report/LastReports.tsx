import { useState,useEffect } from "react";
import Breadcrumb from '../../components/Breadcrumb';
import { LIST_REPORTS_API } from '../../Api/api';
import moment from "moment";
import { useNavigate } from 'react-router-dom';
import { FaEye } from "react-icons/fa";     

const LastForms = () => {
  const navigate = useNavigate();
  var utoken = localStorage.getItem('userToken');
  const [reportData, setReportData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [isLoaded, setLoaded] = useState(false);

  // Pagination logic
  const lastItemIndex = currentPage * itemsPerPage;
  const firstItemIndex = lastItemIndex - itemsPerPage;
  const currentItems = reportData.slice(firstItemIndex, lastItemIndex);

  const totalPages = Math.ceil(reportData.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
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
      listReports();
    }, []);
  
    // Function to fetch sections
    const listReports = async () => {
      const params = new URLSearchParams({
        pageNo: '1',
        report_type: 'All'
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
          console.log("data ->>>",data.info.data);
          setReportData(data.info.data);
          setLoaded(false);
        }
      } catch (error) {
        console.error("Error fetching sections:", error);
        setLoaded(false);
      }
    };

  return (
    <>
      <Breadcrumb pageName={localStorage.getItem('user_role') === 'admin' ? "Reports" : localStorage.getItem('user_role') === 'subadmin' ? "Last Reports" : "My Reports"} />

      <div className="flex flex-col">
        {/* Search bar and Add button */}
        <div className="flex justify-end items-center mb-4">
          {/* <button
            onClick={() => { }}
            className="inline-flex items-center justify-center rounded-md bg-primary py-2 px-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
          >
            New Report
          </button>
          <button
            onClick={() => { }}
            className="inline-flex items-center justify-center rounded-md bg-primary py-2 mx-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
          >
            Running Report
          </button> */}
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

        {/* Table */}
        <div className="rounded-sm border border-stroke bg-white pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-1.5">
          <div className="max-w-full overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                  {["Report id", "Client", "Report Type", "Status", "Inpection Eng-1", "Inpection Eng-2","Date", "Actions"].map(
                    (col) => (
                      <th
                        key={col}
                        className="min-w-[100px] py-4 px-4 font-medium text-black dark:text-white cursor-pointer"
                        onClick={() => handleSort(col.replace(" ", "_").toLowerCase())}
                      >
                        {col}{" "}
                        {sortConfig.key === col.replace(" ", "_").toLowerCase() && (
                          <span>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                        )}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
               {reportData.map((item:any, i:any) => (
                                 <tr key={i}>
                                   <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark text-center">
                                     <p className="text-black dark:text-white">{item.submission_id}</p>
                                   </td>
                                   <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                     <p className="text-black dark:text-white">{item.customer_name}</p>
                                   </td>
                                   <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                     <p className="text-black dark:text-white">{item.form_name}</p>
                                   </td>
                                   <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                   <p className="inline-flex rounded-full bg-success bg-opacity-10 py-1 px-3 text-sm font-medium text-success">
                                     {item.submission_status}</p>
                                   </td>
                                   <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                     <p className="text-black dark:text-white">{item.employee_name}</p>
                                   </td>
                                   <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                     <p className="text-black dark:text-white">{'-'}</p>
                                   </td>
                                   <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                     <p className="text-black dark:text-white">{moment(item.created_at).format("YYYY-MM-DD")}</p>
                                   </td>
                                   <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                         <div onClick={()=>navigate("/reports/view_report/1")}><FaEye className="w-5 h-5" /></div>
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

export default LastForms;