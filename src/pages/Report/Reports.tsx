import { useState } from "react";
import Breadcrumb from '../../components/Breadcrumb';
import { useParams, useNavigate } from 'react-router-dom';

const Forms = () => {
  const { reportType } = useParams();
  const navigate = useNavigate();

  var data = [
    {
      report_id: 1,
      oa_no: 1,
      date: "12 nov 2024",
      shift: "Day",
      client: "Tata Power",
      oem: "xy",
      oem_plant: "xy-1",
      inpection_eng_1: "Vikash",
      inpection_eng_2: "Vishal",
      connected_report: [{
        report_id: 2,
        report_name: "PDI Report"
      }],
      attechment: [{
        attechment_id: 1,
        attechment: "https://example.com/sample-1-320.jpg"
      }]
    },
    {
      report_id: 2,
      oa_no: 2,
      date: "13 nov 2024",
      shift: "Night",
      client: "Tata Power",
      oem: "xy",
      oem_plant: "xy-2",
      inpection_eng_1: "Amit",
      inpection_eng_2: "Ravi",
      connected_report: [{
        report_id: 3,
        report_name: "PDI Report"
      }],
      attechment: [{
        attechment_id: 2,
        attechment: "https://example.com/sample-2-320.jpg"
      }]
    },
    {
      report_id: 3,
      oa_no: 3,
      date: "14 nov 2024",
      shift: "Day",
      client: "Adani Power",
      oem: "yz",
      oem_plant: "yz-3",
      inpection_eng_1: "Sanjay",
      inpection_eng_2: "Manoj",
      connected_report: [{
        report_id: 4,
        report_name: "Inspection Report"
      }],
      attechment: [{
        attechment_id: 3,
        attechment: "https://example.com/sample-3-320.jpg"
      }]
    },
    {
      report_id: 4,
      oa_no: 4,
      date: "15 nov 2024",
      shift: "Night",
      client: "NTPC",
      oem: "yz",
      oem_plant: "yz-4",
      inpection_eng_1: "Deepak",
      inpection_eng_2: "Sumit",
      connected_report: [{
        report_id: 5,
        report_name: "PDI Report"
      }],
      attechment: [{
        attechment_id: 4,
        attechment: "https://example.com/sample-4-320.jpg"
      }]
    },
    {
      report_id: 5,
      oa_no: 5,
      date: "16 nov 2024",
      shift: "Day",
      client: "Reliance Power",
      oem: "xz",
      oem_plant: "xz-5",
      inpection_eng_1: "Rajesh",
      inpection_eng_2: "Prakash",
      connected_report: [{
        report_id: 6,
        report_name: "Maintenance Report"
      }],
      attechment: [{
        attechment_id: 5,
        attechment: "https://example.com/sample-5-320.jpg"
      }]
    },
    {
      report_id: 6,
      oa_no: 6,
      date: "17 nov 2024",
      shift: "Night",
      client: "Tata Power",
      oem: "xz",
      oem_plant: "xz-6",
      inpection_eng_1: "Anil",
      inpection_eng_2: "Suresh",
      connected_report: [{
        report_id: 7,
        report_name: "PDI Report"
      }],
      attechment: [{
        attechment_id: 6,
        attechment: "https://example.com/sample-6-320.jpg"
      }]
    },
    {
      report_id: 7,
      oa_no: 7,
      date: "18 nov 2024",
      shift: "Day",
      client: "Adani Power",
      oem: "yz",
      oem_plant: "yz-7",
      inpection_eng_1: "Rohit",
      inpection_eng_2: "Sunil",
      connected_report: [{
        report_id: 8,
        report_name: "Inspection Report"
      }],
      attechment: [{
        attechment_id: 7,
        attechment: "https://example.com/sample-7-320.jpg"
      }]
    },
    {
      report_id: 8,
      oa_no: 8,
      date: "19 nov 2024",
      shift: "Night",
      client: "NTPC",
      oem: "xy",
      oem_plant: "xy-8",
      inpection_eng_1: "Mahesh",
      inpection_eng_2: "Dinesh",
      connected_report: [{
        report_id: 9,
        report_name: "PDI Report"
      }],
      attechment: [{
        attechment_id: 8,
        attechment: "https://example.com/sample-8-320.jpg"
      }]
    },
    {
      report_id: 9,
      oa_no: 9,
      date: "20 nov 2024",
      shift: "Day",
      client: "Reliance Power",
      oem: "xz",
      oem_plant: "xz-9",
      inpection_eng_1: "Abhishek",
      inpection_eng_2: "Tarun",
      connected_report: [{
        report_id: 10,
        report_name: "Maintenance Report"
      }],
      attechment: [{
        attechment_id: 9,
        attechment: "https://example.com/sample-9-320.jpg"
      }]
    },
    {
      report_id: 10,
      oa_no: 10,
      date: "21 nov 2024",
      shift: "Night",
      client: "Tata Power",
      oem: "xy",
      oem_plant: "xy-10",
      inpection_eng_1: "Vikram",
      inpection_eng_2: "Yogesh",
      connected_report: [{
        report_id: 11,
        report_name: "PDI Report"
      }],
      attechment: [{
        attechment_id: 10,
        attechment: "https://example.com/sample-10-320.jpg"
      }]
    },
    {
      report_id: 11,
      oa_no: 11,
      date: "22 nov 2024",
      shift: "Day",
      client: "Adani Power",
      oem: "yz",
      oem_plant: "yz-11",
      inpection_eng_1: "Sameer",
      inpection_eng_2: "Rajeev",
      connected_report: [{
        report_id: 12,
        report_name: "Inspection Report"
      }],
      attechment: [{
        attechment_id: 11,
        attechment: "https://example.com/sample-11-320.jpg"
      }]
    },
    {
      report_id: 12,
      oa_no: 12,
      date: "23 nov 2024",
      shift: "Night",
      client: "NTPC",
      oem: "xz",
      oem_plant: "xz-12",
      inpection_eng_1: "Piyush",
      inpection_eng_2: "Vikas",
      connected_report: [{
        report_id: 13,
        report_name: "PDI Report"
      }],
      attechment: [{
        attechment_id: 12,
        attechment: "https://example.com/sample-12-320.jpg"
      }]
    },
    {
      report_id: 13,
      oa_no: 13,
      date: "24 nov 2024",
      shift: "Day",
      client: "Reliance Power",
      oem: "yz",
      oem_plant: "yz-13",
      inpection_eng_1: "Nikhil",
      inpection_eng_2: "Amit",
      connected_report: [{
        report_id: 14,
        report_name: "Maintenance Report"
      }],
      attechment: [{
        attechment_id: 13,
        attechment: "https://example.com/sample-13-320.jpg"
      }]
    },
    {
      report_id: 14,
      oa_no: 14,
      date: "25 nov 2024",
      shift: "Night",
      client: "Tata Power",
      oem: "xy",
      oem_plant: "xy-14",
      inpection_eng_1: "Lokesh",
      inpection_eng_2: "Arun",
      connected_report: [{
        report_id: 15,
        report_name: "PDI Report"
      }],
      attechment: [{
        attechment_id: 14,
        attechment: "https://example.com/sample-14-320.jpg"
      }]
    },
    {
      report_id: 15,
      oa_no: 15,
      date: "26 nov 2024",
      shift: "Day",
      client: "Adani Power",
      oem: "xz",
      oem_plant: "xz-15",
      inpection_eng_1: "Rakesh",
      inpection_eng_2: "Neeraj",
      connected_report: [{
        report_id: 16,
        report_name: "Inspection Report"
      }],
      attechment: [{
        attechment_id: 15,
        attechment: "https://example.com/sample-15-320.jpg"
      }]
    }
  ];

  const [reportData, setReportData] = useState(data);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });

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
            onClick={() => navigate('/reports/running_report/1')}
            className="inline-flex items-center justify-center rounded-md bg-primary py-2 mx-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
          >
            Running Report
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

        {/* Table */}
        <div className="rounded-sm border border-stroke bg-white pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-1.5">
          <div className="max-w-full overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                {/* , "Connected Reports", "Attechment" */}
                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                  {["Report id", "OA No", "Date", "Shift", "Client", "OEM", "OEM Plant", "Inpection Eng-1", "Inpection Eng-2", "Actions"].map(
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
                {currentItems.map((item, i) => (
                  <tr key={i}>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark text-center">
                      <p className="text-black dark:text-white">{item.report_id}</p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">{item.oa_no}</p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">{item.date}</p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">{item.shift}</p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">{item.client}</p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">{item.oem}</p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">{item.oem_plant}</p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">{item.inpection_eng_1}</p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">{item.inpection_eng_2}</p>
                    </td>
                    {/* <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark text-center">
                      <button className="hover:text-primary">
                        <svg
                          className="fill-current"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8.99981 14.8219C3.43106 14.8219 0.674805 9.50624 0.562305 9.28124C0.47793 9.11249 0.47793 8.88749 0.562305 8.71874C0.674805 8.49374 3.43106 3.20624 8.99981 3.20624C14.5686 3.20624 17.3248 8.49374 17.4373 8.71874C17.5217 8.88749 17.5217 9.11249 17.4373 9.28124C17.3248 9.50624 14.5686 14.8219 8.99981 14.8219ZM1.85605 8.99999C2.4748 10.0406 4.89356 13.5562 8.99981 13.5562C13.1061 13.5562 15.5248 10.0406 16.1436 8.99999C15.5248 7.95936 13.1061 4.44374 8.99981 4.44374C4.89356 4.44374 2.4748 7.95936 1.85605 8.99999Z"
                            fill=""
                          />
                          <path
                            d="M9 11.3906C7.67812 11.3906 6.60938 10.3219 6.60938 9C6.60938 7.67813 7.67812 6.60938 9 6.60938C10.3219 6.60938 11.3906 7.67813 11.3906 9C11.3906 10.3219 10.3219 11.3906 9 11.3906ZM9 7.875C8.38125 7.875 7.875 8.38125 7.875 9C7.875 9.61875 8.38125 10.125 9 10.125C9.61875 10.125 10.125 9.61875 10.125 9C10.125 8.38125 9.61875 7.875 9 7.875Z"
                            fill=""
                          />
                        </svg>
                      </button>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark text-center">
                      <button className="hover:text-primary">
                        <svg
                          className="fill-current"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8.99981 14.8219C3.43106 14.8219 0.674805 9.50624 0.562305 9.28124C0.47793 9.11249 0.47793 8.88749 0.562305 8.71874C0.674805 8.49374 3.43106 3.20624 8.99981 3.20624C14.5686 3.20624 17.3248 8.49374 17.4373 8.71874C17.5217 8.88749 17.5217 9.11249 17.4373 9.28124C17.3248 9.50624 14.5686 14.8219 8.99981 14.8219ZM1.85605 8.99999C2.4748 10.0406 4.89356 13.5562 8.99981 13.5562C13.1061 13.5562 15.5248 10.0406 16.1436 8.99999C15.5248 7.95936 13.1061 4.44374 8.99981 4.44374C4.89356 4.44374 2.4748 7.95936 1.85605 8.99999Z"
                            fill=""
                          />
                          <path
                            d="M9 11.3906C7.67812 11.3906 6.60938 10.3219 6.60938 9C6.60938 7.67813 7.67812 6.60938 9 6.60938C10.3219 6.60938 11.3906 7.67813 11.3906 9C11.3906 10.3219 10.3219 11.3906 9 11.3906ZM9 7.875C8.38125 7.875 7.875 8.38125 7.875 9C7.875 9.61875 8.38125 10.125 9 10.125C9.61875 10.125 10.125 9.61875 10.125 9C10.125 8.38125 9.61875 7.875 9 7.875Z"
                            fill=""
                          />
                        </svg>
                      </button>
                    </td> */}
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark text-center">
                      <button className="hover:text-primary" onClick={() => navigate('/reports/view_report/1')}>
                        <svg
                          className="fill-current"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8.99981 14.8219C3.43106 14.8219 0.674805 9.50624 0.562305 9.28124C0.47793 9.11249 0.47793 8.88749 0.562305 8.71874C0.674805 8.49374 3.43106 3.20624 8.99981 3.20624C14.5686 3.20624 17.3248 8.49374 17.4373 8.71874C17.5217 8.88749 17.5217 9.11249 17.4373 9.28124C17.3248 9.50624 14.5686 14.8219 8.99981 14.8219ZM1.85605 8.99999C2.4748 10.0406 4.89356 13.5562 8.99981 13.5562C13.1061 13.5562 15.5248 10.0406 16.1436 8.99999C15.5248 7.95936 13.1061 4.44374 8.99981 4.44374C4.89356 4.44374 2.4748 7.95936 1.85605 8.99999Z"
                            fill=""
                          />
                          <path
                            d="M9 11.3906C7.67812 11.3906 6.60938 10.3219 6.60938 9C6.60938 7.67813 7.67812 6.60938 9 6.60938C10.3219 6.60938 11.3906 7.67813 11.3906 9C11.3906 10.3219 10.3219 11.3906 9 11.3906ZM9 7.875C8.38125 7.875 7.875 8.38125 7.875 9C7.875 9.61875 8.38125 10.125 9 10.125C9.61875 10.125 10.125 9.61875 10.125 9C10.125 8.38125 9.61875 7.875 9 7.875Z"
                            fill=""
                          />
                        </svg>
                      </button>
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