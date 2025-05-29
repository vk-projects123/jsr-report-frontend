import { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { FaChevronDown, FaTimes } from "react-icons/fa";
import { LIST_FORM_SECTIONS_API, UPLOAD_ATTECHMENT_API, LIST_INSPECTION_OBSERVATIONS_API, LIST_SECTION_PARAMS_API, LIST_CUSTOMER_API, SUBMIT_SECTION_API, ADD_OBSERVATIONS_API, GET_OBSERVATIONS_API, UPLOAD_IMAGE_API, DELETE_IMAGE_API, LIST_BOM_REPORTS_API, imgUrl } from "../../Api/api.tsx";
import { toast } from "react-toastify";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const RunningReport = () => {
  var utoken = localStorage.getItem('userToken');
  const navigate = useNavigate();
  const location = useLocation();
  var data = location.state;
  if (!data) {
    data = { reporttype: "IPQC", formId: 1, submissionID: 0, selectedSection: { section: 'Report Details', section_id: 1, section_type: 'inputField' } };
  }
  const [selectedSection, setSelectedSection] = useState<any>({ section: 'Report Details', section_id: data.reporttype === "IPQC" ? 1 : data.reporttype === "BOM" ? 22 : 51, section_type: 'inputField' });
  const [customer, setCustomer] = useState([]);
  const [InspectionObservations, setInspectionObservations] = useState([]);
  const [isLoaded, setLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log("data", data);
    if (data.Datas) {
      try {
        setFormData(data.Datas);
        if (data.observations) {
          setObservations(data.observations);
        }
      } catch (e) {
        //console.log('datas not get');
      }
    }
  }, [data]);

  const [sectionparams, setSectionparams] = useState<any>([]);
  const [submitsectionby, setSubmitsectionby] = useState<any>("");
  const [checkingtogether, setCheckingtogether] = useState<any>("");
  const [sections, setSections] = useState<any>([]);
  const [observations, setObservations] = useState<any>([]);
  const [submissionID, setsubmissionID] = useState<any>(0);
  const [imageuploading, setimageuploading] = useState<any>(false);
  const [bomreports, setBomreports] = useState<any>([]);
  const [attech_submission_id, setAttech_submission_id] = useState<any>(0);

  useEffect(() => {
    setLoaded(true);
    if (data.selectedSection) {
      setSelectedSection(data.selectedSection);
      listobservations(data.selectedSection.section_id);
      listSectionParams(data.selectedSection.section_id);
    } else {
      listSectionParams(selectedSection.section_id);
      listobservations(selectedSection.section_id);
    }
    listbomreports();
    listSections();
    listCustomer();
    list_Inspection_Observations();
  }, [data]);

  // Function to fetch sections
  const listSections = async () => {
    console.log(" data.formId", data.formId);
    const params = new URLSearchParams({
      form_id: data.formId,
      format_id: data.reporttype == "IPQC" ? "1" : data.reporttype == "BOM" ? "2" : "3"
    });

    try {
      const response = await fetch(`${LIST_FORM_SECTIONS_API}?${params.toString()}`, {
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
        //console.log(data.info);
        setSections(data.info || []);
        setLoaded(false);
      }
    } catch (error) {
      console.error("Error fetching sections:", error);
      setLoaded(false);
    }
  };

  const listSectionParams = async (e: any) => {
    const params = new URLSearchParams({
      form_id: data.formId,
      format_id: data.reporttype == "IPQC" ? "1" : data.reporttype == "BOM" ? "2" : "3",
      section_id: e
    });

    //console.log("listSectionParams", params);

    try {
      const response = await fetch(`${LIST_SECTION_PARAMS_API}?${params.toString()}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${utoken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      const data = await response.json();
      //console.log("data", data);
      if (data.Status === 0) {
        setLoaded(false);
      } else if (data.Status === 1) {
        setSectionparams(data.info);
        setsubmissionID(data.submission_id);
        setSubmitsectionby(data.Datas.inspection_done_by);
        setCheckingtogether(data.Datas.checking_together);
        setAttech_submission_id(data.Datas.attech_submission_id);
        setLoaded(false);
      }
    } catch (error) {
      console.error("Error fetching sections:", error);
      setLoaded(false);
    }
  };

  const listobservations = async (e: any) => {
    var FORMID = data.formId;
    console.log("list observation called", {
      form_id: data.formId,
      section_id: e
    });

    if (data.submissionID === 0 || !data.submissionID) {
      console.log("no observation found");
    } else {
      const params = new URLSearchParams({
        form_id: data.formId,
        section_id: e
      });

      //console.log("listSectionParams", params);

      try {
        const response = await fetch(`${GET_OBSERVATIONS_API}?${params.toString()}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${utoken}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        const data = await response.json();
        //console.log("data", data);
        if (data.Status === 0) {
          setLoaded(false);
        } else if (data.Status === 1) {
          console.log("observations", data.info);
          // if (FORMID == 3 && data.info.length != 0) {
          //   console.log("get data.info.length",data.info.length);
          //   setObservations([]);
          // }
          console.log("add extra obj", data.info.length);
          if (FORMID == 3 && data.info.length == 0) {
            console.log("add extra obj");
            var extraObj = {
              "observations_id": 0,
              "observations_text": "-",
              "is_major": "No",
              "images": []
            };
            setObservations([extraObj]);
          } else {
            setObservations(data.info);
          }

          setsubmissionID(data.submission_id);
          setLoaded(false);
        }
      } catch (error) {
        console.error("Error fetching sections:", error);
        setLoaded(false);
      }
    }
  };

  const listCustomer = async () => {
    try {
      const response = await fetch(LIST_CUSTOMER_API, {
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
        //console.log("customer", data.info);
        setCustomer(data.info);
        setLoaded(false);
      }
    } catch (error) {
      console.error("Error fetching sections:", error);
      setLoaded(false);
    }
  };

  const list_Inspection_Observations = async () => {
    try {
      const response = await fetch(LIST_INSPECTION_OBSERVATIONS_API, {
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
        //console.log("customer", data.info);
        setInspectionObservations(data.info);
        setLoaded(false);
      }
    } catch (error) {
      console.error("Error fetching sections:", error);
      setLoaded(false);
    }
  };

  const listbomreports = async () => {
    var FORMID = data.formId;
    try {
      const params = new URLSearchParams({
        form_id: FORMID
      });
      const response = await fetch(`${LIST_BOM_REPORTS_API}?${params.toString()}`, {
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
        console.log("bom report", data.info);
        setBomreports(data.info);
        setLoaded(false);
      }
    } catch (error) {
      console.error("Error fetching sections:", error);
      setLoaded(false);
    }
  };

  const submitSection = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);

    console.log("selectedSection->>", selectedSection);
    console.log("sectionparams->>", sectionparams);
    console.log("attech_submission_id ->>", attech_submission_id);

    if (selectedSection.section_id === 4) {
      setSectionparams([]);
    }
    addobservations(e);
    try {
      const response = await fetch(SUBMIT_SECTION_API, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${utoken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          form_id: data.formId,
          section_id: selectedSection.section_id,
          inspection_done_by: submitsectionby,
          checking_together: checkingtogether,
          jsonData: JSON.stringify(sectionparams),
          attech_submission_id: attech_submission_id
        })
      });

      const datas = await response.json();

      if (datas.Status === 0) {
        setIsLoading(false);
      } else if (datas.Status === 1) {
        toast.success(datas.Message);
        listSectionParams(selectedSection.section_id);
        listobservations(selectedSection.section_id);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching sections:", error);
      setIsLoading(false);
    }
  }

  const addobservations = async (e: any) => {
    e.preventDefault();
    var FORMID = data.formId;
    setIsLoading(true);

    console.log("observations ->>", observations);


    try {
      const response = await fetch(ADD_OBSERVATIONS_API, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${utoken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          form_id: FORMID,
          section_id: selectedSection.section_id,
          jsonData: JSON.stringify(observations)
        })
      });

      const data = await response.json();

      if (data.Status === 0) {
        setIsLoading(false);
      } else if (data.Status === 1) {
        // toast.success(data.Message);
        listobservations(selectedSection.section_id);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching sections:", error);
      setIsLoading(false);
    }
  }

  const addAndUploadImages = async (index: number, newImages: File[]) => {
    const formData = new FormData();
    console.log('newImages', newImages);
    // Append each file to the same parameter
    for (const file of newImages) {
      formData.append('observations', file);
    }

    try {
      // Upload images to the server
      const response = await fetch(UPLOAD_IMAGE_API, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${utoken}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (data.Status === 1) {
        //console.log("images ->> data.info", data.info);
        // If upload is successful, update the local state with the new image URLs
        setObservations((prevObservations: any) =>
          prevObservations.map((obs: any, idx: any) =>
            idx === index
              ? {
                ...obs,
                images: [
                  ...obs.images,
                  ...data.info.map((url: string) => ({ image_id: 0, image: url })),
                ],
              }
              : obs
          )
        );
        setimageuploading(false);
        // Show success message
        // toast.success(data.Message);
      } else {
        // Handle upload failure
        toast.error("Failed to upload images.");
        setimageuploading(false);
      }
    } catch (error) {
      console.error("Error uploading images:", error);
      toast.error("An error occurred while uploading images.");
      setimageuploading(false);
    } finally {
      setIsLoading(false);
      setimageuploading(false);
    }
  };

  const UploadAttechmentFile = async (newImages: File[]) => {
    const formData = new FormData();

    // Append each file to the same parameter
    for (const file of newImages) {
      formData.append('attechment', file);
    }

    try {
      // Upload images to the server
      const response = await fetch(UPLOAD_ATTECHMENT_API, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${utoken}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (data.Status === 1) {
        //console.log("images ->> data.info", data.info);
        // If upload is successful, update the local state with the new image URLs
        const name = "Attachments if any";
        const value = data.info;

        console.log("images", data.info);
        setSectionparams((prevParams: any) =>
          prevParams.map((param: any) =>
            param.param_name === name ? { ...param, value } : param
          )
        );
        setimageuploading(false);
        // Show success message
        // toast.success(data.Message);
      } else {
        // Handle upload failure
        toast.error("Failed to upload images.");
        setimageuploading(false);
      }
    } catch (error) {
      console.error("Error uploading images:", error);
      toast.error("An error occurred while uploading images.");
      setimageuploading(false);
    } finally {
      setIsLoading(false);
      setimageuploading(false);
    }
  };

  // Map sections into viewable data
  const viewSections = sections.map((item: any) => ({
    section_id: item.section_id,
    title: item.section_name,
    section_type: item.section_type,
    icon: "🏠",
  }));

  const handleSectionClick = (section: any, section_id = null, section_type: any) => {
    //console.log(section_id);
    setSelectedSection({ section, section_id, section_type });
    section_id === 4 ? "" : listSectionParams(section_id);
    listobservations(section_id);
    // //console.log("selected section ->>>", selectedSection, section, section_id,section_type);
  };

  const [formData, setFormData] = useState<any>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSectionparams((prevParams: any) =>
      prevParams.map((param: any) =>
        param.param_name === name ? { ...param, value } : param
      )
    );
  };

  const handleNestedChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    paramId: number,
    round: string
  ) => {
    const { value } = e.target;

    setSectionparams((prevParams: any) =>
      prevParams.map((param: any) =>
        param.param_id === paramId
          ? {
            ...param,
            value: {
              ...param.value,
              [round]: value, // Update the correct round's value
            },
          }
          : param
      )
    );
  };

  const handleArrayChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    field: "module_sr_no" | "result"
  ) => {
    //console.log("data ->>", e, index, field);
    const newValue = e.target.value;
    //console.log("value ->>", newValue);
    var sparams = [...sectionparams];
    sparams[index] = { ...sparams[index], [field]: newValue };
    setSectionparams(sparams);
  };

  const updateDescription = (index: number, newDescription: string, extradetails: any) => {
    setObservations((prevObservations: any) =>
      prevObservations.map((obs: any, i: any) =>
        i === index
          ? { ...obs, Inspection: extradetails, observations_text: newDescription } // Update the description for the matching index
          : obs // Leave other observations unchanged
      )
    );
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, index: any, imageLength: any) => {
    const files = event.target.files;
    if (imageLength >= 2) {
      alert(`You can upload a maximum of two images.`);
      event.target.value = "";
      return;
    } else if ((parseInt(imageLength) + parseInt(files.length)) > 2) {
      alert(`You can upload a maximum of two images.`);
      event.target.value = "";
      return;
    } else if (files.length > 2) {
      alert(`You can upload a maximum of two images.`);
      event.target.value = "";
      return;
    }

    if (files && files.length > 0) {
      const newImages = Array.from(files);
      addAndUploadImages(index, newImages);
    }
  };

  const handleattechmentFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files && files.length > 0) {
      const newImages = Array.from(files);
      UploadAttechmentFile(newImages);
    }
  };

  const handleFileUpload1 = (event: React.ChangeEvent<HTMLInputElement>, index: any) => {
    setimageuploading(true);
    const files = event.target.files;
    if (files && files.length > 0) {
      const newImages = Array.from(files);
      addAndUploadImages(index, newImages);
    } else {
      setimageuploading(false);
    }
  };

  // Add a new observation
  const addObservation = () => {

    const addData = () => {
      const newObservation = {
        observations_id: 0,
        observations_text: "",
        Inspection: "",
        is_major: selectedSection.section_id === 4 ? "Yes" : "No", // Set is_major based on section_id
        images: [],
      };

      setObservations([...observations, newObservation]);
    }

    if (observations.length >= 1) {
      var lastobservation = observations.length - 1;
      if (observations[lastobservation]["observations_text"] == "") {
        alert("please enter last observations");
      } else {
        addData();
      }
    } else {
      addData();
    }

  };

  const handleDeleteImage = async (obsIndex: number, imgIndex: number, image_id: number, image: string) => {
    const params = new URLSearchParams({
      image_id: image_id.toString(),
      image: image
    });
    try {

      const response = await fetch(`${DELETE_IMAGE_API}?${params.toString()}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${utoken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        }
      });

      const data = await response.json();

      if (data.Status === 1) {
        toast.success(data.Message);

        // Update local state without calling API again
        // setObservations((prevObservations: any) => {
        //   const updatedObservations = [...prevObservations];
        //   updatedObservations[obsIndex].images.splice(imgIndex, 1);
        //   return updatedObservations;
        // });

        listobservations(selectedSection.section_id);

      } else {
        toast.error("Failed to delete image.");
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("An error occurred while deleting the image.");
    }
  };

  const ChartData = [
    { date: "12/25/2024", dayProduction: 120, nightProduction: 222, totalRejection: 50 },
    { date: "12/26/2024", dayProduction: 350, nightProduction: 334, totalRejection: 70 },
    { date: "12/27/2024", dayProduction: 300, nightProduction: 335, totalRejection: 50 },
    { date: "12/28/2024", dayProduction: 133, nightProduction: 145, totalRejection: 51 },
  ];

  return (
    <div className="container">
      {/* Left Container (80%) for Form */}
      <div className="left-container">
        {data.reporttype === "IPQC" && selectedSection ? (
          <div className="border border-stroke bg-white shadow-default">
            <div className="flex justify-between items-center border-b border-stroke mt-5 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                {selectedSection.section}
                {selectedSection.subsection && ` - ${selectedSection.subsection}`}
              </h3>
              <div>
                {selectedSection.section === "Major Observations" && (
                  <button className="add-btn" onClick={addObservation}>
                    + Add Observation
                  </button>
                )}
                {submissionID == 0 ? "" : <button className="add-btn mx-2" onClick={() => navigate('/reports/preview_report', {
                  state: {
                    formId: data.formId, reporttype: data.reporttype, submissionID: submissionID, selectedSection: selectedSection
                  }
                })}>
                  Preview
                </button>}
                {((submissionID == 0 && selectedSection.section_id == 1) || submissionID != 0) ?
                  <button className="add-btn mx-2" disabled={isLoading} onClick={submitSection}>
                    {isLoading ? (
                      <svg
                        className="w-5 h-5 animate-spin text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        ></path>
                      </svg>
                    ) : (
                      'Save'
                    )}
                  </button> : ""}
              </div>
            </div>

            {selectedSection.section_type === "inputField" ?
              <form action="#">
                <div className="p-6.5">
                  {sectionparams
                    .reduce((rows: any, item: any, index: any) => {
                      if (index % 2 === 0) {
                        rows.push([item]);
                      } else {
                        rows[rows.length - 1].push(item);
                      }
                      return rows;
                    }, [])
                    .map((row: any, rowIndex: any) => (
                      <div key={rowIndex} className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                        {row.map((item: any, colIndex: any) => (
                          <div key={colIndex} className="w-full xl:w-1/2">
                            <label className="mb-2.5 block text-black dark:text-white">
                              {item.param_name}
                            </label>
                            {item.inputType === "selection" ? (
                              <div className="relative z-20 bg-transparent dark:bg-form-input">
                                <select
                                  name={item.param_name}
                                  value={item.value}
                                  onChange={handleChange}
                                  className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-1.5 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                >
                                  <option value="">Select Option</option>
                                  {item.param_name === "Customer Name"
                                    ? customer.map((custItem: any, idx: any) => (
                                      <option key={idx} value={custItem.user_name}>
                                        {custItem.user_name}
                                      </option>
                                    ))
                                    :
                                    [
                                      <option key="day" value="Day">
                                        Day
                                      </option>,
                                      <option key="night" value="Night">
                                        Night
                                      </option>,
                                    ]
                                  }
                                </select>
                                <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
                                  <FaChevronDown className="text-gray-500 dark:text-gray-400" />
                                </span>
                              </div>
                            ) : (
                              <input
                                type={item.inputType}
                                placeholder={item.param_name}
                                value={item.value}
                                name={item.param_name}
                                onChange={handleChange}
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-1.5 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                style={{ margin: 0 }}
                              />
                            )}
                          </div>
                        ))}
                        {/* Ensure each row has exactly two columns */}
                        {row.length === 1 && <div className="w-full xl:w-1/2"></div>}
                      </div>
                    ))}
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Bom Report Attechment
                    </label>
                    <div className="relative z-20 bg-transparent dark:bg-form-input">
                      <select
                        value={attech_submission_id}
                        onChange={(e) => setAttech_submission_id(e.target.value)}
                        className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-1.5 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      >
                        <option value="">Select Option</option>
                        {bomreports.map((bomItem: any, idx: any) => (
                          <option key={idx} value={bomItem.submission_id}>
                            {bomItem.report_no}
                          </option>
                        ))}
                      </select>
                      <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
                        <FaChevronDown className="text-gray-500 dark:text-gray-400" />
                      </span>
                    </div>
                  </div>
                </div>
              </form>
              : selectedSection.section_type === "table" ?
                <div className="table-container">
                  <table className="production-table">
                    <tbody>
                      {sectionparams.map((item: any, index: any) =>
                        <tr key={index}>
                          <td>{item.param_name}</td>
                          <td>
                            <input
                              type={item.inputType}
                              name={item.param_name}
                              placeholder={item.param_name}
                              value={item.value}
                              onChange={handleChange}
                              className="input-field"
                            />
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                : selectedSection.section_type === "imageDescription" ?
                  <div className="observation-container">
                    <table className="observation-table">
                      <thead>
                        <tr>
                          <th>Sr No</th>
                          <th>Observations / Deficiency Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        {observations.map((observation: any, index: number) => (
                          <tr key={observation.observations_id}>
                            <td>{index + 1}</td>
                            <td>
                              <div className="observation-detail">
                                {/* Editable Description */}
                                <textarea
                                  className="input-field"
                                  value={observation.observations_text}
                                  onChange={(e) => updateDescription(index, e.target.value)}
                                  placeholder="Enter description"
                                />

                                {/* Display Images with Delete Icon */}
                                <div className="image-row">
                                  {observation.images.map((image: any, imgIdx: number) => (
                                    <div key={imgIdx} className="image-container">
                                      {/* Observation Image */}
                                      <img
                                        className="observation-close-image"
                                        src={imgUrl + image.image}
                                        alt={`Observation ${index + 1} - Image ${imgIdx + 1}`}
                                      />

                                      {/* Delete Icon in Top-Right Corner */}
                                      <FaTimes
                                        className="delete-icon"
                                        onClick={() => handleDeleteImage(index, imgIdx, image.image_id, image.image)}
                                      />
                                    </div>
                                  ))}
                                </div>

                                {/* File Upload */}
                                <input
                                  type="file"
                                  accept="image/*"
                                  multiple
                                  onChange={(e: any) => handleFileUpload(e, index, observation.images.length)}
                                />
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  : selectedSection.section_type === "roundsTable" ?
                    <div className="table-container">
                      <table className="production-table" style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #ddd" }}>
                        <thead>
                          <tr>
                            <th>Parameters</th>
                            <th>Round 1</th>
                            <th>Round 2</th>
                            <th>Round 3</th>
                            <th>Round 4</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sectionparams.map((item: any, index: number) => (
                            <tr key={index}>
                              <td>{item.param_name}</td>
                              {["round1", "round2", "round3", "round4"].map((round) => (
                                <td key={round}>
                                  {item.inputType === "selection" ? (
                                    <div className="relative z-20 bg-transparent dark:bg-form-input">
                                      <select
                                        name={item.param_name}
                                        value={item.value ? item.value[round] : ""}
                                        onChange={(e) => handleNestedChange(e, item.param_id, round)}
                                        className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-1.5 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                      >
                                        <option value="">-Select-</option>
                                        {
                                          [
                                            <option key="Spring fit" value="Spring fit">
                                              Spring fit
                                            </option>,
                                            <option key="Soldering" value="Soldering">
                                              Soldering
                                            </option>,
                                          ]
                                        }
                                      </select>
                                      <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
                                        <FaChevronDown className="text-gray-500 dark:text-gray-400" />
                                      </span>
                                    </div>
                                  ) : (
                                    <input
                                      type={item.inputType}
                                      placeholder={item.param_name}
                                      className="input-field"
                                      value={item.value ? item.value[round] : ""}
                                      onChange={(e) => handleNestedChange(e, item.param_id, round)}
                                    />
                                  )}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div className="observation-container" style={{ width: '100%' }}>
                        <button className="add-btn" onClick={addObservation} style={{ justifyContent: 'end' }}>
                          + Add Extra Details
                        </button>
                        <table className="observation-table">
                          <thead>
                            <tr>
                              <th style={{ width: "100px" }}>Sr No</th>
                              <th>Other Details</th>
                            </tr>
                          </thead>
                          <tbody>
                            {observations.map((observation: any, index: any) => (
                              <tr key={observation.observations_id}>
                                <td>{index + 1}</td>
                                <td>
                                  <div className="observation-detail">
                                    {/* Editable Description */}
                                    <textarea
                                      className="input-field"
                                      value={observation.observations_text}
                                      onChange={(e) =>
                                        updateDescription(index, e.target.value)
                                      }
                                      placeholder="Enter description"
                                    />

                                    {/* Display Images with Delete Icon */}
                                    <div className="image-row">
                                      {observation.images.map((image: any, imgIdx: number) => (
                                        <div key={imgIdx} className="image-container">
                                          {/* Observation Image */}
                                          <img
                                            className="observation-close-image"
                                            src={imgUrl + image.image}
                                            alt={`Observation ${index + 1} - Image ${imgIdx + 1}`}
                                          />

                                          {/* Delete Icon in Top-Right Corner */}
                                          <FaTimes
                                            className="delete-icon"
                                            onClick={() => handleDeleteImage(index, imgIdx, image.image_id, image.image)}
                                          />
                                        </div>
                                      ))}
                                    </div>

                                    {/* File Upload */}
                                    <input
                                      type="file"
                                      accept="image/*"
                                      multiple
                                      onChange={(e: any) => handleFileUpload(e, index, observation.images.length)}
                                    />
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    : selectedSection.section_type === "tableInputs" ?
                      <div className="table-container">
                        <table className="production-table">
                          <thead>
                            <tr>
                              <th>Test</th>
                              <th>Module Sr. No.</th>
                              <th>Result</th>
                            </tr>
                          </thead>
                          <tbody>
                            {sectionparams.map((test: any, index: any) => (
                              <tr key={index}>
                                <td>{test.test}</td>
                                <td>
                                  <input
                                    type={test.inputType}
                                    placeholder="Module Sr. No."
                                    className="input-field"
                                    value={test.module_sr_no}
                                    onChange={(e) => handleArrayChange(e, index, "module_sr_no")}
                                  />
                                </td>
                                <td>
                                  <input
                                    type={test.inputType}
                                    placeholder="Result"
                                    className="input-field"
                                    value={test.result}
                                    onChange={(e) => handleArrayChange(e, index, "result")}
                                  />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <br />
                        <div className="observation-container" style={{ width: '100%' }}>
                          <button className="add-btn" onClick={addObservation} style={{ justifyContent: 'end' }}>
                            + Add Extra Details
                          </button>
                          <table className="observation-table">
                            <thead>
                              <tr>
                                <th style={{ width: "100px" }}>Sr No</th>
                                <th>Other Details</th>
                              </tr>
                            </thead>
                            <tbody>
                              {observations.map((observation: any, index: any) => (
                                <tr key={observation.observations_id}>
                                  <td>{index + 1}</td>
                                  <td>
                                    <div className="observation-detail">
                                      {/* Editable Description */}
                                      <textarea
                                        className="input-field"
                                        value={observation.observations_text}
                                        onChange={(e) =>
                                          updateDescription(index, e.target.value)
                                        }
                                        placeholder="Enter description"
                                      />

                                      {/* Display Images */}
                                      <div className="image-row">
                                        {observation.images.map((image: any, idx: any) => (
                                          <img
                                            key={idx}
                                            src={imgUrl + image.image}
                                            alt={`Observation ${index + 1} - Image ${idx + 1}`}
                                          />
                                        ))}
                                      </div>

                                      {/* File Upload */}
                                      <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={(e: any) => handleFileUpload(e, index, observation.images.length)}
                                      />
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <table className="production-table">
                          <thead>
                            <tr>
                              <th>Inspection done by</th>
                              <th>Checking together with (Customer/Manufacturer representative)</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td style={{ width: '50%' }}>
                                <input
                                  type="text"
                                  name="inspection_done_by"
                                  placeholder="Inspection done by"
                                  className="input-field"
                                  value={submitsectionby}
                                  onChange={(e) => setSubmitsectionby(e.target.value)}
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  name="checking_together"
                                  placeholder="Checking together with"
                                  className="input-field"
                                  value={checkingtogether}
                                  onChange={(e) => setCheckingtogether(e.target.value)}
                                />
                              </td>
                            </tr>
                          </tbody>
                        </table>

                      </div>
                      : ""
            }
          </div>
        ) : data.reporttype === "BOM" && selectedSection ?
          <div className="border border-stroke bg-white shadow-default">
            <div className="flex justify-between items-center border-b border-stroke mt-5 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                {selectedSection.section}
                {selectedSection.subsection && ` - ${selectedSection.subsection}`}
              </h3>
              <div>
                {selectedSection.section === "Major Observations" && (
                  <button className="add-btn" onClick={addObservation}>
                    + Add Observation
                  </button>
                )}
                {submissionID == 0 ? "" : <button className="add-btn mx-2" onClick={() => navigate('/reports/preview_report', {
                  state: {
                    formId: data.formId, reporttype: data.reporttype, submissionID: submissionID, selectedSection: selectedSection
                  }
                })}>
                  Preview
                </button>}
                {((submissionID == 0 && selectedSection.section_id == 22) || submissionID != 0) ?
                  <button className="add-btn mx-2" disabled={isLoading} onClick={submitSection}>
                    {isLoading ? (
                      <svg
                        className="w-5 h-5 animate-spin text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        ></path>
                      </svg>
                    ) : (
                      'Save'
                    )}
                  </button> : ""}
              </div>
            </div>

            {selectedSection.section_type === "inputField" ?
              <form action="#">
                <div className="p-6.5">
                  {sectionparams
                    .reduce((rows: any, item: any, index: any) => {
                      if (index % 2 === 0) {
                        rows.push([item]);
                      } else {
                        rows[rows.length - 1].push(item);
                      }
                      return rows;
                    }, [])
                    .map((row: any, rowIndex: any) => (
                      <div key={rowIndex} className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                        {row.map((item: any, colIndex: any) => (
                          <div key={colIndex} className="w-full xl:w-1/2">
                            <label className="mb-2.5 block text-black dark:text-white">
                              {item.param_name}
                            </label>
                            {item.inputType === "selection" ? (
                              <div className="relative z-20 bg-transparent dark:bg-form-input">
                                <select
                                  name={item.param_name}
                                  value={item.value}
                                  onChange={handleChange}
                                  className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-1.5 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                >
                                  <option value="">Select Option</option>
                                  {item.param_name === "Customer Name"
                                    ? customer.map((custItem: any, idx: any) => (
                                      <option key={idx} value={custItem.user_name}>
                                        {custItem.user_name}
                                      </option>
                                    ))
                                    :
                                    [
                                      <option key="day" value="Day">
                                        Day
                                      </option>,
                                      <option key="night" value="Night">
                                        Night
                                      </option>,
                                    ]
                                  }
                                </select>
                                <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
                                  <FaChevronDown className="text-gray-500 dark:text-gray-400" />
                                </span>
                              </div>
                            ) : (
                              <input
                                type={item.inputType}
                                placeholder={item.param_name}
                                value={item.value}
                                name={item.param_name}
                                onChange={handleChange}
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-1.5 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                style={{ margin: 0 }}
                              />
                            )}
                          </div>
                        ))}
                        {/* Ensure each row has exactly two columns */}
                        {row.length === 1 && <div className="w-full xl:w-1/2"></div>}
                      </div>
                    ))}
                </div>
              </form>
              : selectedSection.section_type === "table" ?
                <div className="table-container">
                  <table className="production-table">
                    <tbody>
                      {sectionparams.map((item: any, index: any) =>
                        <tr key={index}>
                          <td>{item.param_name}</td>
                          <td>
                            <input
                              type={item.inputType}
                              name={item.param_name}
                              placeholder={item.param_name}
                              value={item.value}
                              onChange={handleChange}
                              className="input-field"
                            />
                          </td>
                        </tr>
                      )}
                      {sectionparams.length >= 1 ?
                        sectionparams[0]["param_name"] == "Remarks" ?
                          <tr>
                            <td>Verification done by</td>
                            <td>
                              <input
                                type="text"
                                name="inspection_done_by"
                                placeholder="Verification done by"
                                className="input-field"
                                value={submitsectionby}
                                onChange={(e) => setSubmitsectionby(e.target.value)}
                              />
                            </td>
                          </tr> : ""
                        : ""}
                    </tbody>
                  </table>
                </div>
                : selectedSection.section_type === "imageDescription" ?
                  <div className="observation-container">
                    <table className="observation-table">
                      <tbody>
                        {observations.map((observation: any, index: any) => (
                          <tr key={observation.observations_id}>
                            <td>
                              <div className="observation-detail">
                                {/* Image Grid */}
                                <div
                                  style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(5, 1fr)",
                                    gap: "10px",
                                    padding: "10px",
                                  }}
                                >
                                  {imageuploading ? "Wait Image is Uploading..." : observation.images.map((image: any, imgIdx: any) => (
                                    <div
                                      key={imgIdx}
                                      style={{ position: "relative", width: "120px", height: "120px" }}
                                    >
                                      <img
                                        style={{
                                          width: "100%",
                                          height: "100%",
                                          objectFit: "cover",
                                          borderRadius: "5px",
                                        }}
                                        src={imgUrl + image.image}
                                        alt={`Observation ${index + 1} - Image ${imgIdx + 1}`}
                                      />
                                      <FaTimes
                                        className="delete-icon"
                                        onClick={() => handleDeleteImage(index, imgIdx, image.image_id, image.image)}
                                      />
                                    </div>
                                  ))}
                                </div>

                                {/* File Upload */}
                                <input
                                  type="file"
                                  accept="image/*"
                                  multiple
                                  onChange={(e) => handleFileUpload1(e, index)}
                                />
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  : ""}
          </div>
          :
          data.reporttype === "PDI" && selectedSection ? (
            <div className="border border-stroke bg-white shadow-default">
              <div className="flex justify-between items-center border-b border-stroke mt-5 px-6.5 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  {selectedSection.section}
                  {selectedSection.subsection && ` - ${selectedSection.subsection}`}
                </h3>
                <div>
                  {(selectedSection.section === "Major Observations" || selectedSection.section === "Observations") && (
                    <button className="add-btn" onClick={addObservation}>
                      + Add Observation
                    </button>
                  )}
                  {submissionID == 0 ? "" : <button className="add-btn mx-2" onClick={() => navigate('/reports/preview_report', {
                    state: {
                      formId: data.formId, reporttype: data.reporttype, submissionID: submissionID, selectedSection: selectedSection
                    }
                  })}>
                    Preview
                  </button>}
                  {((submissionID == 0 && selectedSection.section_id == 1) || submissionID != 0 || (submissionID == 0 && selectedSection.section_id == 51)) ?
                    <button className="add-btn mx-2" disabled={isLoading} onClick={submitSection}>
                      {isLoading ? (
                        <svg
                          className="w-5 h-5 animate-spin text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8H4z"
                          ></path>
                        </svg>
                      ) : (
                        'Save'
                      )}
                    </button> : ""}
                </div>
              </div>

              {selectedSection.section_type === "inputField" ?
                <form action="#">
                  <div className="p-6.5">
                    {sectionparams
                      .reduce((rows: any, item: any, index: any) => {
                        if (index % 2 === 0) {
                          rows.push([item]);
                        } else {
                          rows[rows.length - 1].push(item);
                        }
                        return rows;
                      }, [])
                      .map((row: any, rowIndex: any) => (
                        <div key={rowIndex} className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                          {row.map((item: any, colIndex: any) => (
                            // item.param_name == "OA No" ? "" :
                            <div key={colIndex} className="w-full xl:w-1/2">
                              <label className="mb-2.5 block text-black dark:text-white">
                                {item.param_name}
                              </label>
                              {item.inputType === "selection" ? (
                                <div className="relative z-20 bg-transparent dark:bg-form-input">
                                  <select
                                    name={item.param_name}
                                    value={item.value}
                                    onChange={handleChange}
                                    className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-1.5 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                  >
                                    <option value="">Select Option</option>
                                    {item.param_name === "Customer Name"
                                      ? customer.map((custItem: any, idx: any) => (
                                        <option key={idx} value={custItem.user_name}>
                                          {custItem.user_name}
                                        </option>
                                      ))
                                      :
                                      [
                                        <option key="day" value="Day">
                                          Day
                                        </option>,
                                        <option key="night" value="Night">
                                          Night
                                        </option>,
                                      ]
                                    }
                                  </select>
                                  <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
                                    <FaChevronDown className="text-gray-500 dark:text-gray-400" />
                                  </span>
                                </div>
                              ) : (
                                <input
                                  type={item.inputType}
                                  placeholder={item.param_name}
                                  value={item.value}
                                  name={item.param_name}
                                  onChange={handleChange}
                                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-1.5 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                  style={{ margin: 0 }}
                                />
                              )}
                            </div>
                          ))}
                          {/* Ensure each row has exactly two columns */}
                          {row.length === 1 && <div className="w-full xl:w-1/2"></div>}
                        </div>
                      ))}
                  </div>
                </form>
                : selectedSection.section_type === "table" ?
                  <div className="table-container">
                    <table className="production-table">
                      <tbody>
                        {sectionparams.map((item: any, index: any) =>
                          <tr key={index}>
                            <td style={{ width: '50%' }}>{item.param_name}</td>
                            <td>
                              {item.param_name == "Attachments if any" ?
                                <>
                                  <input
                                    type="file"
                                    name={item.param_name}
                                    onChange={(e: any) => handleattechmentFileUpload(e)}
                                  />
                                  {item.value && (
                                    <div style={{ marginTop: '10px' }}>
                                      <a style={{color:'blue'}} href={imgUrl + item.value} target="_blank" rel="noopener noreferrer">
                                        View PDF
                                      </a>
                                    </div>
                                  )}
                                </>
                                :
                                <input
                                  type={item.inputType}
                                  name={item.param_name}
                                  placeholder={item.param_name}
                                  value={item.value}
                                  onChange={handleChange}
                                  className="input-field"
                                />
                              }
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                    {selectedSection.section == "Inspection Results" ? <table className="mt-10 production-table">
                      <thead>
                        <tr>
                          <th>Inspection done by</th>
                          <th>Checking together with (Customer/Manufacturer representative)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td style={{ width: '50%' }}>
                            <input
                              type="text"
                              name="inspection_done_by"
                              placeholder="Inspection done by"
                              className="input-field"
                              value={submitsectionby}
                              onChange={(e) => setSubmitsectionby(e.target.value)}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              name="checking_together"
                              placeholder="Checking together with"
                              className="input-field"
                              value={checkingtogether}
                              onChange={(e) => setCheckingtogether(e.target.value)}
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table> : ""}
                  </div>
                  : selectedSection.section_type === "imageDescription" ?
                    <div className="observation-container">
                      <table className="observation-table">
                        <thead>
                          <tr>
                            <th>Sr No</th>
                            <th>Inspection</th>
                            <th>Observations / Deficiency Details</th>
                          </tr>
                        </thead>
                        <tbody>
                          {observations.map((observation: any, index: number) => (
                            <tr key={observation.observations_id}>
                              <td>{index + 1}</td>
                              <td>
                                <div className="relative z-20 bg-transparent dark:bg-form-input">
                                  <select
                                    name={"Inspection"}
                                    value={observation.Inspection}
                                    onChange={(e) => updateDescription(index, observation.observations_text, e.target.value)}
                                    className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-1.5 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                  >
                                    <option value="">Select Option</option>
                                    {InspectionObservations.map((custItem: any, idx: any) => (
                                      <option key={idx} value={custItem.inspection}>
                                        {custItem.inspection}
                                      </option>
                                    ))
                                    }
                                  </select>
                                  <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
                                    <FaChevronDown className="text-gray-500 dark:text-gray-400" />
                                  </span>
                                </div>
                              </td>
                              <td>
                                <div className="observation-detail">
                                  {/* Editable Description */}
                                  <textarea
                                    className="input-field"
                                    value={observation.observations_text}
                                    onChange={(e) => updateDescription(index, e.target.value, observation.Inspection)}
                                    placeholder="Enter description"
                                  />

                                  {/* Display Images with Delete Icon */}
                                  <div className="image-row">
                                    {observation.images.map((image: any, imgIdx: number) => (
                                      <div key={imgIdx} className="image-container">
                                        {/* Observation Image */}
                                        <img
                                          className="observation-close-image"
                                          src={imgUrl + image.image}
                                          alt={`Observation ${index + 1} - Image ${imgIdx + 1}`}
                                        />

                                        {/* Delete Icon in Top-Right Corner */}
                                        <FaTimes
                                          className="delete-icon"
                                          onClick={() => handleDeleteImage(index, imgIdx, image.image_id, image.image)}
                                        />
                                      </div>
                                    ))}
                                  </div>

                                  {/* File Upload */}
                                  <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={(e: any) => handleFileUpload(e, index, observation.images.length)}
                                  />
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    : selectedSection.section_type === "roundsTable" ?
                      <div className="table-container">
                        <table className="production-table" style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #ddd" }}>
                          <thead>
                            <tr>
                              <th>Parameters</th>
                              <th>Round 1</th>
                              <th>Round 2</th>
                              <th>Round 3</th>
                              <th>Round 4</th>
                            </tr>
                          </thead>
                          <tbody>
                            {sectionparams.map((item: any, index: number) => (
                              <tr key={index}>
                                <td>{item.param_name}</td>
                                {["round1", "round2", "round3", "round4"].map((round) => (
                                  <td key={round}>
                                    {item.inputType === "selection" ? (
                                      <div className="relative z-20 bg-transparent dark:bg-form-input">
                                        <select
                                          name={item.param_name}
                                          value={item.value ? item.value[round] : ""}
                                          onChange={(e) => handleNestedChange(e, item.param_id, round)}
                                          className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-1.5 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                        >
                                          <option value="">-Select-</option>
                                          {
                                            [
                                              <option key="Spring fit" value="Spring fit">
                                                Spring fit
                                              </option>,
                                              <option key="Soldering" value="Soldering">
                                                Soldering
                                              </option>,
                                            ]
                                          }
                                        </select>
                                        <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
                                          <FaChevronDown className="text-gray-500 dark:text-gray-400" />
                                        </span>
                                      </div>
                                    ) : (
                                      <input
                                        type={item.inputType}
                                        placeholder={item.param_name}
                                        className="input-field"
                                        value={item.value ? item.value[round] : ""}
                                        onChange={(e) => handleNestedChange(e, item.param_id, round)}
                                      />
                                    )}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <div className="observation-container" style={{ width: '100%' }}>
                          <button className="add-btn" onClick={addObservation} style={{ justifyContent: 'end' }}>
                            + Add Extra Details
                          </button>
                          <table className="observation-table">
                            <thead>
                              <tr>
                                <th style={{ width: "100px" }}>Sr No</th>
                                <th>Other Details</th>
                              </tr>
                            </thead>
                            <tbody>
                              {observations.map((observation: any, index: any) => (
                                <tr key={observation.observations_id}>
                                  <td>{index + 1}</td>
                                  <td>
                                    <div className="observation-detail">
                                      {/* Editable Description */}
                                      <textarea
                                        className="input-field"
                                        value={observation.observations_text}
                                        onChange={(e) =>
                                          updateDescription(index, e.target.value)
                                        }
                                        placeholder="Enter description"
                                      />

                                      {/* Display Images with Delete Icon */}
                                      <div className="image-row">
                                        {observation.images.map((image: any, imgIdx: number) => (
                                          <div key={imgIdx} className="image-container">
                                            {/* Observation Image */}
                                            <img
                                              className="observation-close-image"
                                              src={imgUrl + image.image}
                                              alt={`Observation ${index + 1} - Image ${imgIdx + 1}`}
                                            />

                                            {/* Delete Icon in Top-Right Corner */}
                                            <FaTimes
                                              className="delete-icon"
                                              onClick={() => handleDeleteImage(index, imgIdx, image.image_id, image.image)}
                                            />
                                          </div>
                                        ))}
                                      </div>

                                      {/* File Upload */}
                                      <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={(e: any) => handleFileUpload(e, index, observation.images.length)}
                                      />
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                      : selectedSection.section_type === "tableInputs" ?
                        <div className="table-container">
                          <table className="production-table">
                            <thead>
                              <tr>
                                <th>Test</th>
                                <th>Module Sr. No.</th>
                                <th>Result</th>
                              </tr>
                            </thead>
                            <tbody>
                              {sectionparams.map((test: any, index: any) => (
                                <tr key={index}>
                                  <td>{test.test}</td>
                                  <td>
                                    <input
                                      type={test.inputType}
                                      placeholder="Module Sr. No."
                                      className="input-field"
                                      value={test.module_sr_no}
                                      onChange={(e) => handleArrayChange(e, index, "module_sr_no")}
                                    />
                                  </td>
                                  <td>
                                    <input
                                      type={test.inputType}
                                      placeholder="Result"
                                      className="input-field"
                                      value={test.result}
                                      onChange={(e) => handleArrayChange(e, index, "result")}
                                    />
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          <br />
                          <div className="observation-container" style={{ width: '100%' }}>
                            <button className="add-btn" onClick={addObservation} style={{ justifyContent: 'end' }}>
                              + Add Extra Details
                            </button>
                            <table className="observation-table">
                              <thead>
                                <tr>
                                  <th style={{ width: "100px" }}>Sr No</th>
                                  <th>Other Details</th>
                                </tr>
                              </thead>
                              <tbody>
                                {observations.map((observation: any, index: any) => (
                                  <tr key={observation.observations_id}>
                                    <td>{index + 1}</td>
                                    <td>
                                      <div className="observation-detail">
                                        {/* Editable Description */}
                                        <textarea
                                          className="input-field"
                                          value={observation.observations_text}
                                          onChange={(e) =>
                                            updateDescription(index, e.target.value)
                                          }
                                          placeholder="Enter description"
                                        />

                                        {/* Display Images */}
                                        <div className="image-row">
                                          {observation.images.map((image: any, idx: any) => (
                                            <img
                                              key={idx}
                                              src={imgUrl + image.image}
                                              alt={`Observation ${index + 1} - Image ${idx + 1}`}
                                            />
                                          ))}
                                        </div>

                                        {/* File Upload */}
                                        <input
                                          type="file"
                                          accept="image/*"
                                          multiple
                                          onChange={(e: any) => handleFileUpload(e, index, observation.images.length)}
                                        />
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          <table className="production-table">
                            <thead>
                              <tr>
                                <th>Inspection done by</th>
                                <th>Checking together with (Customer/Manufacturer representative)</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td style={{ width: '50%' }}>
                                  <input
                                    type="text"
                                    name="inspection_done_by"
                                    placeholder="Inspection done by"
                                    className="input-field"
                                    value={submitsectionby}
                                    onChange={(e) => setSubmitsectionby(e.target.value)}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    name="checking_together"
                                    placeholder="Checking together with"
                                    className="input-field"
                                    value={checkingtogether}
                                    onChange={(e) => setCheckingtogether(e.target.value)}
                                  />
                                </td>
                              </tr>
                            </tbody>
                          </table>

                        </div>
                        : ""
              }
            </div>
          ) :
            (
              <ResponsiveContainer width="100%" height={400} style={{ marginTop: 30 }}>
                <ComposedChart data={ChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  {/* Grid */}
                  <CartesianGrid strokeDasharray="3 3" />

                  {/* X-Axis */}
                  <XAxis dataKey="date" />

                  {/* Left Y-Axis for Production */}
                  <YAxis yAxisId="left" label={{ value: "Daily Production", angle: -90, position: "insideLeft" }} />

                  {/* Right Y-Axis for Rejection */}
                  <YAxis yAxisId="right" orientation="right" label={{ value: "Total Rejection", angle: -90, position: "insideRight" }} />

                  <Tooltip />
                  <Legend />

                  {/* Stacked Bar Chart */}
                  <Bar yAxisId="left" dataKey="dayProduction" stackId="a" fill="#28a745" name="Day Production" />
                  <Bar yAxisId="left" dataKey="nightProduction" stackId="a" fill="#f4c542" name="Night Production" />

                  {/* Line Chart for Total Rejection */}
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="totalRejection"
                    stroke="red"
                    strokeWidth={3}
                    dot={{ fill: "red", r: 5 }}
                    name="Total Rejection"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            )}
      </div>

      {/* Right Container (20%) for Section List */}
      {data.reporttype === "DPR" ? "" :
        <div className="right-container">
          <h2>Sections</h2>
          <div className="sections">
            {viewSections.map((section: any, index: any) => {
              const isActive = selectedSection?.section === section.title;
              return (
                <div key={index} className="section">
                  <div
                    className={`section-header ${isActive ? 'active-section' : ''}`}
                    onClick={() =>
                      // section.subsections.length
                      //   ? toggleSection(section.title)
                      //   : 
                      handleSectionClick(section.title, section.section_id, section.section_type)
                    }
                  >
                    <span className={`icon ${isActive ? 'active-section' : ''}`}>
                      {section.icon}
                    </span>
                    <span className={`title ${isActive ? 'active-section' : ''}`}>
                      {section.title}
                    </span>
                    {/* {section.subsections.length > 0 && (
                    <span className="toggle">
                      {expandedSection === section.title ? "-" : "+"}
                    </span>
                  )} */}
                  </div>
                  {/* Subsections */}
                  {/* {section.subsections.length > 0 &&
                  expandedSection === section.title && (
                    <div className="subsections">
                      {section.subsections.map((sub: any, idx) => (
                        <div
                          key={idx}
                          className="subsection"
                          onClick={() => handleSectionClick(section.title, sub,section.section_type)}
                        >
                          {sub}
                        </div>
                      ))}
                    </div>
                  )} */}
                </div>
              );
            })}
          </div>
        </div>
      }
    </div>
  );
};

export default RunningReport;