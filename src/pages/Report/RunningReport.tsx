import { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { FaChevronDown, FaRegTrashAlt } from "react-icons/fa";
import { LIST_FORM_SECTIONS_API, LIST_SECTION_PARAMS_API, LIST_CUSTOMER_API, SUBMIT_SECTION_API, ADD_OBSERVATIONS_API, GET_OBSERVATIONS_API, UPLOAD_IMAGE_API, DELETE_IMAGE_API, imgUrl } from "../../Api/api.tsx";
import { toast } from "react-toastify";

const RunningReport = () => {
  var utoken = localStorage.getItem('userToken');
  const navigate = useNavigate();
  const location = useLocation();
  var data = location.state;
  if (!data) {
    data = { reporttype: "IPQC", formId: 1, submissionID: 0, selectedSection: { section: 'Report Details', section_id: 1, section_type: 'inputField' } };
  }
  const [selectedSection, setSelectedSection] = useState<any>({ section: 'Report Details', section_id: 1, section_type: 'inputField' });
  const [customer, setCustomer] = useState([]);
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
    listSections();
    listCustomer();
  }, [data]);

  // Function to fetch sections
  const listSections = async () => {
    const params = new URLSearchParams({
      form_id: data.formId,
      format_id: "1"
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
      format_id: "1",
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
        setLoaded(false);
      }
    } catch (error) {
      console.error("Error fetching sections:", error);
      setLoaded(false);
    }
  };

  const listobservations = async (e: any) => {
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
          //console.log("observations", data.info);
          setObservations(data.info);
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

  const submitSection = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);

    console.log("selectedSection->>", selectedSection);
    console.log("sectionparams->>", sectionparams);

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
          jsonData: JSON.stringify(sectionparams)
        })
      });

      const datas = await response.json();

      if (datas.Status === 0) {
        setIsLoading(false);
      } else if (datas.Status === 1) {
        toast.success(datas.Message);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching sections:", error);
      setIsLoading(false);
    }
  }

  const addobservations = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(ADD_OBSERVATIONS_API, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${utoken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          form_id: 1,
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
    //console.log('newImages', newImages);
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

        // Show success message
        // toast.success(data.Message);
      } else {
        // Handle upload failure
        toast.error("Failed to upload images.");
      }
    } catch (error) {
      console.error("Error uploading images:", error);
      toast.error("An error occurred while uploading images.");
    } finally {
      setIsLoading(false);
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
    e: React.ChangeEvent<HTMLInputElement>,
    paramId: number,  // use paramId to identify the correct item
    round: string
  ) => {
    const { value } = e.target;

    // Update sectionparams based on paramId and round
    setSectionparams((prevParams: any) =>
      prevParams.map((param: any) =>
        param.param_id === paramId
          ? {
            ...param,
            value: {
              ...param.value,
              [round]: value,  // Update the specific round's value
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

  const updateDescription = (index: number, newDescription: string) => {
    setObservations((prevObservations: any) =>
      prevObservations.map((obs: any, i: any) =>
        i === index
          ? { ...obs, observations_text: newDescription } // Update the description for the matching index
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

  // Add a new observation
  const addObservation = () => {

    const addData = () => {
      const newObservation = {
        observations_id: 0,
        observations_text: "",
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
        setObservations((prevObservations: any) => {
          const updatedObservations = [...prevObservations];
          updatedObservations[obsIndex].images.splice(imgIndex, 1);
          return updatedObservations;
        });

      } else {
        toast.error("Failed to delete image.");
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("An error occurred while deleting the image.");
    }
  };


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
                <button className="add-btn mx-2" onClick={() => navigate('/reports/preview_report', {
                  state: {
                    formId: data.formId, reporttype: data.reporttype, submissionID: submissionID, selectedSection: selectedSection
                  }
                })}>
                  Preview
                </button>
                <button className="add-btn mx-2" onClick={submitSection}>
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
                </button>
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
                                      <FaRegTrashAlt
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
                                  <input
                                    type={item.inputType}
                                    placeholder={item.param_name}
                                    className="input-field"
                                    value={item.value ? item.value[round] : ""}
                                    onChange={(e) => handleNestedChange(e, item.param_id, round)}
                                  />
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
                <button className="add-btn mx-2" onClick={() => navigate('/reports/preview_report', {
                  state: {
                    pagetype: data.reportType, data: formData, observations: observations, otherobservations: {
                      filmCutting: otherdetails,
                      tabber: tabberotherdetails,
                      layup: layupotherdetails,
                      lamination: laminationotherdetails, framing: framingotherdetails,
                      flasher: flasherotherdetails,
                      randomsample: randomsampleotherdetails
                    }
                  }
                })}>
                  Preview
                </button>
                <button className="add-btn mx-2" onClick={() => { }}>
                  Save
                </button>
              </div>
            </div>
            {selectedSection.section === "Report Details" ?
              <form action="#">
                <div className="p-6.5">
                  <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                    <div className="w-full xl:w-1/2">
                      <label className="mb-2.5 block text-black dark:text-white">
                        OA NO
                      </label>
                      <input
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-1.5 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        style={{ margin: 0 }}
                        type="text"
                        placeholder="OA NO"
                        name="oaNo"
                        value={formData.oaNo}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="w-full xl:w-1/2">
                      <label className="mb-2.5 block text-black dark:text-white">
                        Manufacturer
                      </label>
                      <input
                        type="text"
                        name="manufacturer"
                        placeholder="Manufacturer"
                        value={formData.manufacturer}
                        onChange={handleChange}
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-1.5 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        style={{ margin: 0 }}
                      />
                    </div>
                  </div>

                  <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                    <div className="w-full xl:w-1/2">
                      <label className="mb-2.5 block text-black dark:text-white">
                        Date
                      </label>
                      <input
                        type="date"
                        name="date"
                        placeholder="Date"
                        value={formData.date}
                        onChange={handleChange}
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-1.5 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        style={{ margin: 0 }}
                      />
                    </div>

                    <div className="w-full xl:w-1/2">
                      <label className="mb-2.5 block text-black dark:text-white">
                        Report Created By
                      </label>
                      <input
                        type="text"
                        name="reportCreatedBy"
                        placeholder="Report Created By"
                        value={formData.reportCreatedBy}
                        onChange={handleChange}
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-1.5 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        style={{ margin: 0 }}
                      />
                    </div>
                  </div>

                  <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                    <div className="w-full xl:w-1/2">
                      <label className="mb-2.5 block text-black dark:text-white">
                        Place Of Inspection
                      </label>
                      <input
                        type="text"
                        name="placeOfInspection"
                        placeholder="Place Of Inspection"
                        value={formData.placeOfInspection}
                        onChange={handleChange}
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-1.5 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        style={{ margin: 0 }}
                      />
                    </div>

                    <div className="w-full xl:w-1/2">
                      <label className="mb-2.5 block text-black dark:text-white">
                        Customer Name
                      </label>
                      <div className="relative z-20 bg-transparent dark:bg-form-input">
                        <select
                          name="customerName"
                          value={formData.customerName}
                          onChange={handleChange}
                          className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-1.5 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        >
                          <option value="">Select customer</option>
                          <option value="GSE Renewables India Pvt ltd">GSE Renewables India Pvt ltd</option>
                        </select>
                        <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
                          <svg
                            className="fill-current"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g opacity="0.8">
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                                fill=""
                              ></path>
                            </g>
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                    <div className="w-full xl:w-1/2">
                      <label className="mb-2.5 block text-black dark:text-white">
                        Report No
                      </label>
                      <input
                        type="text"
                        name="reportNo"
                        placeholder="Report No"
                        value={formData.reportNo}
                        onChange={handleChange}
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-1.5 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        style={{ margin: 0 }}
                      />
                    </div>
                    <div className="w-full xl:w-1/2">
                      <label className="mb-2.5 block text-black dark:text-white">
                        Shift
                      </label>
                      <div className="relative z-20 bg-transparent dark:bg-form-input">
                        <select
                          name="shift"
                          value={formData.shift}
                          onChange={handleChange}
                          className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-1.5 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary">
                          <option value="">Select </option>
                          <option value="Day">Day</option>
                          <option value="Night">Night</option>
                        </select>
                        <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
                          <svg
                            className="fill-current"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g opacity="0.8">
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                                fill=""
                              ></path>
                            </g>
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
              : selectedSection.section === "Solar Cell" ?
                <div className="table-container">
                  <table className="production-table">
                    <thead>
                      <tr>
                        <th>Sr. No.</th>
                        <th>Component</th>
                        <th>Description Field</th>
                        <th>Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Solar Cell */}
                      <tr>
                        <td rowSpan="6">1</td>
                        <td rowSpan="6">Solar Cell</td>
                        <td>MBB Cells</td>
                        <td>
                          <input
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-1.5 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                            style={{ margin: 0 }}
                            type="text"
                            placeholder="10BB Cells"
                            value={formData.solar_cell.bb_cells}
                            onChange={(e) => handleNestedChange(e, "solar_cell", "bb_cells")}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Eff %</td>
                        <td>
                          <input
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-1.5 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                            style={{ margin: 0 }}
                            type="text"
                            placeholder="22.90%"
                            value={formData.solar_cell.efficiency}
                            onChange={(e) => handleNestedChange(e, "solar_cell", "efficiency")}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Size</td>
                        <td>
                          <input
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-1.5 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                            style={{ margin: 0 }}
                            type="text"
                            placeholder="182*182"
                            value={formData.solar_cell.size}
                            onChange={(e) => handleNestedChange(e, "solar_cell", "size")}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Product Name</td>
                        <td>
                          <input
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-1.5 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                            style={{ margin: 0 }}
                            type="text"
                            placeholder="M182ABPERCBP"
                            value={formData.solar_cell.product_name}
                            onChange={(e) =>
                              handleNestedChange(e, "solar_cell", "product_name")
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Batch of manufacturer</td>
                        <td>
                          <input
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-1.5 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                            style={{ margin: 0 }}
                            type="text"
                            placeholder="CM2407166529DAWD1924"
                            value={formData.solar_cell.batch}
                            onChange={(e) => handleNestedChange(e, "solar_cell", "batch")}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Company Make</td>
                        <td>
                          <input
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-1.5 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                            style={{ margin: 0 }}
                            type="text"
                            placeholder="Aidu Energy"
                            value={formData.solar_cell.company_make}
                            onChange={(e) =>
                              handleNestedChange(e, "solar_cell", "company_make")
                            }
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                : selectedSection.section === "Cell Connector" ?
                  <div className="table-container">
                    <table className="production-table">
                      <thead>
                        <tr>
                          <th>Sr. No.</th>
                          <th>Component</th>
                          <th>Description Field</th>
                          <th>Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* Cell Connector */}
                        <tr>
                          <td rowSpan="3">2</td>
                          <td rowSpan="3">Cell Connector (Ribbon)</td>
                          <td>Make</td>
                          <td>
                            <input
                              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-1.5 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                              style={{ margin: 0 }}
                              placeholder="Cell Connector (Ribbon)"
                              type="text"
                              value={formData.cell_connector.make}
                              onChange={(e) => handleNestedChange(e, "cell_connector", "make")}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>Diameter / Size</td>
                          <td>
                            <input
                              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-1.5 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                              style={{ margin: 0 }}
                              placeholder="Diameter"
                              type="text"
                              value={formData.cell_connector.diameter}
                              onChange={(e) =>
                                handleNestedChange(e, "cell_connector", "diameter")
                              }
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>Batch of Manufacturer</td>
                          <td>
                            <input
                              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-1.5 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                              style={{ margin: 0 }}
                              placeholder="Batch of Manufacturer"
                              type="text"
                              value={formData.cell_connector.batch}
                              onChange={(e) => handleNestedChange(e, "cell_connector", "batch")}
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  : selectedSection.section === "Soldering Flux" ?
                    <div className="table-container">
                      <table className="production-table">
                        <thead>
                          <tr>
                            <th>Sr. No.</th>
                            <th>Component</th>
                            <th>Description Field</th>
                            <th>Value</th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* Soldering Flux */}
                          <tr>
                            <td rowSpan="4">3</td>
                            <td rowSpan="4">Soldering Flux</td>
                            <td>Make</td>
                            <td>
                              <input
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-1.5 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                style={{ margin: 0 }}
                                type="text"
                                placeholder="Reality Chemicals"
                                value={formData.soldering_flux.make}
                                onChange={(e) => handleNestedChange(e, "soldering_flux", "make")}
                              />
                            </td>
                          </tr>
                          <tr>
                            <td>Model</td>
                            <td>
                              <input
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-1.5 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                style={{ margin: 0 }}
                                type="text"
                                placeholder="RC-PV"
                                value={formData.soldering_flux.model}
                                onChange={(e) => handleNestedChange(e, "soldering_flux", "model")}
                              />
                            </td>
                          </tr>
                          <tr>
                            <td>Batch of manufacturer</td>
                            <td>
                              <input
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-1.5 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                style={{ margin: 0 }}
                                type="text"
                                placeholder="RCPV 44M/23"
                                value={formData.soldering_flux.batch}
                                onChange={(e) => handleNestedChange(e, "soldering_flux", "batch")}
                              />
                            </td>
                          </tr>
                          <tr>
                            <td>Date of Manufacturing</td>
                            <td>
                              <input
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-1.5 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                style={{ margin: 0 }}
                                type="text"
                                placeholder="23-08-2024"
                                value={formData.soldering_flux.manufacturing_date}
                                onChange={(e) =>
                                  handleNestedChange(e, "soldering_flux", "manufacturing_date")
                                }
                              />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    : selectedSection.section === "Glass" ?
                      <div className="table-container">
                        <table className="production-table">
                          <thead>
                            <tr>
                              <th>Sr. No.</th>
                              <th>Component</th>
                              <th>Description Field</th>
                              <th>Value</th>
                            </tr>
                          </thead>
                          <tbody>
                            {/* Glass */}
                            <tr>
                              <td rowSpan="5">4</td>
                              <td rowSpan="5">Glass</td>
                              <td>Make</td>
                              <td>
                                <input
                                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-1.5 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                  style={{ margin: 0 }}
                                  type="text"
                                  placeholder="Gujarat Borosil LTD."
                                  value={formData.glass.make}
                                  onChange={(e) => handleNestedChange(e, "glass", "make")}
                                />
                              </td>
                            </tr>
                            <tr>
                              <td>Dimension</td>
                              <td>
                                <input
                                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-1.5 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                  style={{ margin: 0 }}
                                  type="text"
                                  placeholder="2272*1128*3.2"
                                  value={formData.glass.dimension}
                                  onChange={(e) => handleNestedChange(e, "glass", "dimension")}
                                />
                              </td>
                            </tr>
                            <tr>
                              <td>AR Coated Glass</td>
                              <td>
                                <input
                                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-1.5 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                  style={{ margin: 0 }}
                                  type="text"
                                  placeholder="Yes"
                                  value={formData.glass.ar_coated}
                                  onChange={(e) => handleNestedChange(e, "glass", "ar_coated")}
                                />
                              </td>
                            </tr>
                            <tr>
                              <td>Batch of Manufacturer</td>
                              <td>
                                <input
                                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-1.5 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                  style={{ margin: 0 }}
                                  type="text"
                                  placeholder="6XF02051X1"
                                  value={formData.glass.batch}
                                  onChange={(e) => handleNestedChange(e, "glass", "batch")}
                                />
                              </td>
                            </tr>
                            <tr>
                              <td>Manufacturing Date</td>
                              <td>
                                <input
                                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-1.5 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                  style={{ margin: 0 }}
                                  type="text"
                                  placeholder="Not Mentioned"
                                  value={formData.glass.manufacturing_date}
                                  onChange={(e) =>
                                    handleNestedChange(e, "glass", "manufacturing_date")
                                  }
                                />
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      : selectedSection.section === "EVA" ?
                        <div className="table-container">
                          <table className="production-table">
                            <thead>
                              <tr>
                                <th>Sr. No.</th>
                                <th>Component</th>
                                <th>Description Field</th>
                                <th>Value</th>
                              </tr>
                            </thead>
                            <tbody>
                              {/* EVA */}
                              <tr>
                                <td rowSpan="4">5</td>
                                <td rowSpan="4">EVA (Front or Back)</td>
                                <td>Make</td>
                                <td>
                                  <input
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-1.5 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                    style={{ margin: 0 }}
                                    placeholder="EVA (Front or Back)"
                                    type="text"
                                    value={formData.eva.make}
                                    onChange={(e) => handleNestedChange(e, "eva", "make")}
                                  />
                                </td>
                              </tr>
                              <tr>
                                <td>Model</td>
                                <td>
                                  <input
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-1.5 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                    style={{ margin: 0 }}
                                    placeholder="Model"
                                    type="text"
                                    value={formData.eva.model}
                                    onChange={(e) => handleNestedChange(e, "eva", "model")}
                                  />
                                </td>
                              </tr>
                              <tr>
                                <td>Batch of Manufacturer</td>
                                <td>
                                  <input
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-1.5 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                    style={{ margin: 0 }}
                                    placeholder="Batch of Manufacturer"
                                    type="text"
                                    value={formData.eva.batch}
                                    onChange={(e) => handleNestedChange(e, "eva", "batch")}
                                  />
                                </td>
                              </tr>
                              <tr>
                                <td>Manufacturing Date</td>
                                <td>
                                  <input
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-1.5 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                    style={{ margin: 0 }}
                                    placeholder="Manufacturing Date"
                                    type="text"
                                    value={formData.eva.manufacturing_date}
                                    onChange={(e) =>
                                      handleNestedChange(e, "eva", "manufacturing_date")
                                    }
                                  />
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        : selectedSection.section === "String Connector" ?
                          <div className="table-container">
                            <table className="production-table">
                              <thead>
                                <tr>
                                  <th>Sr. No.</th>
                                  <th>Component</th>
                                  <th>Description Field</th>
                                  <th>Value</th>
                                </tr>
                              </thead>
                              <tbody>
                                {/* String Connector */}
                                <tr>
                                  <td rowSpan="3">6</td>
                                  <td rowSpan="3">String Connector (Busbar)</td>
                                  <td>Make</td>
                                  <td>
                                    <input
                                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-1.5 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                      style={{ margin: 0 }}
                                      placeholder="Make"
                                      type="text"
                                      value={formData.string_connector.make}
                                      onChange={(e) =>
                                        handleNestedChange(e, "string_connector", "make")
                                      }
                                    />
                                  </td>
                                </tr>
                                <tr>
                                  <td>Dimension</td>
                                  <td>
                                    <input
                                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-1.5 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                      style={{ margin: 0 }}
                                      placeholder="Dimension"
                                      type="text"
                                      value={formData.string_connector.dimension}
                                      onChange={(e) =>
                                        handleNestedChange(e, "string_connector", "dimension")
                                      }
                                    />
                                  </td>
                                </tr>
                                <tr>
                                  <td>Batch of Manufacturer</td>
                                  <td>
                                    <input
                                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-1.5 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                      style={{ margin: 0 }}
                                      placeholder="Batch of Manufacturer"
                                      type="text"
                                      value={formData.string_connector.batch}
                                      onChange={(e) =>
                                        handleNestedChange(e, "string_connector", "batch")
                                      }
                                    />
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          : selectedSection.section === "Back Sheet" ?
                            <div className="table-container">
                              <table className="production-table">
                                <thead>
                                  <tr>
                                    <th>Sr. No.</th>
                                    <th>Component</th>
                                    <th>Description Field</th>
                                    <th>Value</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {/* Back Sheet */}
                                  <tr>
                                    <td rowSpan="4">7</td>
                                    <td rowSpan="4">Back Sheet</td>
                                    <td>Make</td>
                                    <td>
                                      <input
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-1.5 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                        style={{ margin: 0 }}
                                        placeholder="Make"
                                        type="text"
                                        value={formData.back_sheet.make}
                                        onChange={(e) => handleNestedChange(e, "back_sheet", "make")}
                                      />
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Model</td>
                                    <td>
                                      <input
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-1.5 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                        style={{ margin: 0 }}
                                        placeholder="Model"
                                        type="text"
                                        value={formData.back_sheet.model}
                                        onChange={(e) => handleNestedChange(e, "back_sheet", "model")}
                                      />
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Batch of Manufacturer</td>
                                    <td>
                                      <input
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-1.5 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                        style={{ margin: 0 }}
                                        placeholder="Batch of Manufacturer"
                                        type="text"
                                        value={formData.back_sheet.batch}
                                        onChange={(e) => handleNestedChange(e, "back_sheet", "batch")}
                                      />
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Manufacturing Date</td>
                                    <td>
                                      <input
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-1.5 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                        style={{ margin: 0 }}
                                        placeholder="Manufacturing Date"
                                        type="text"
                                        value={formData.back_sheet.manufacturing_date}
                                        onChange={(e) =>
                                          handleNestedChange(e, "back_sheet", "manufacturing_date")
                                        }
                                      />
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                            : selectedSection.section === "Frame" ?
                              <div className="table-container">
                                <table className="production-table">
                                  <thead>
                                    <tr>
                                      <th>Sr. No.</th>
                                      <th>Component</th>
                                      <th>Description Field</th>
                                      <th>Value</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {/* Frame */}
                                    <tr>
                                      <td rowSpan="6">8</td>
                                      <td rowSpan="6">Frame</td>
                                      <td>Make</td>
                                      <td>
                                        <input
                                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-1.5 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                          style={{ margin: 0 }}
                                          placeholder="Make"
                                          type="text"
                                          value={formData.frame.make}
                                          onChange={(e) => handleNestedChange(e, "frame", "make")}
                                        />
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>Dimension of Long Side</td>
                                      <td>
                                        <input
                                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-1.5 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                          style={{ margin: 0 }}
                                          placeholder="Dimension of Long Side"
                                          type="text"
                                          value={formData.frame.long_side_dimension}
                                          onChange={(e) =>
                                            handleNestedChange(e, "frame", "long_side_dimension")
                                          }
                                        />
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>Dimension of Short Side</td>
                                      <td>
                                        <input
                                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-1.5 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                          style={{ margin: 0 }}
                                          placeholder="Dimension of Short Side"
                                          type="text"
                                          value={formData.frame.short_side_dimension}
                                          onChange={(e) =>
                                            handleNestedChange(e, "frame", "short_side_dimension")
                                          }
                                        />
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>Punching Location</td>
                                      <td>
                                        <input
                                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-1.5 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                          style={{ margin: 0 }}
                                          placeholder="Punching Location"
                                          type="text"
                                          value={formData.frame.punching_location}
                                          onChange={(e) =>
                                            handleNestedChange(e, "frame", "punching_location")
                                          }
                                        />
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>Model</td>
                                      <td>
                                        <input
                                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-1.5 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                          style={{ margin: 0 }}
                                          placeholder="Model"
                                          type="text"
                                          value={formData.frame.model}
                                          onChange={(e) => handleNestedChange(e, "frame", "model")}
                                        />
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>Batch of Manufacturer</td>
                                      <td>
                                        <input
                                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-1.5 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                          style={{ margin: 0 }}
                                          placeholder="Batch of Manufacturer"
                                          type="text"
                                          value={formData.frame.batch}
                                          onChange={(e) => handleNestedChange(e, "frame", "batch")}
                                        />
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                              : selectedSection.section === "Junction Box" ?
                                <div className="table-container">
                                  <table className="production-table">
                                    <thead>
                                      <tr>
                                        <th>Sr. No.</th>
                                        <th>Component</th>
                                        <th>Description Field</th>
                                        <th>Value</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {/* Junction Box */}
                                      <tr>
                                        <td rowSpan="2">9</td>
                                        <td rowSpan="2">Junction Box</td>
                                        <td>Company Make</td>
                                        <td>
                                          <input
                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-1.5 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                            style={{ margin: 0 }}
                                            placeholder="Company Make"
                                            type="text"
                                            value={formData.junction_box.company_make}
                                            onChange={(e) =>
                                              handleNestedChange(e, "junction_box", "company_make")
                                            }
                                          />
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>Batch of Manufacturer</td>
                                        <td>
                                          <input
                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-1.5 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                            style={{ margin: 0 }}
                                            placeholder="Batch of Manufacturer"
                                            type="text"
                                            value={formData.junction_box.batch}
                                            onChange={(e) => handleNestedChange(e, "junction_box", "batch")}
                                          />
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                                : selectedSection.section === "Connector" ?
                                  <div className="table-container">
                                    <table className="production-table">
                                      <thead>
                                        <tr>
                                          <th>Sr. No.</th>
                                          <th>Component</th>
                                          <th>Description Field</th>
                                          <th>Value</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {/* Connector */}
                                        <tr>
                                          <td>10</td>
                                          <td>Connector</td>
                                          <td>Type</td>
                                          <td>
                                            <input
                                              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-1.5 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                              style={{ margin: 0 }}
                                              placeholder="Type"
                                              type="text"
                                              value={formData.connector.type}
                                              onChange={(e) => handleNestedChange(e, "connector", "type")}
                                            />
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                  : selectedSection.section === "Potting for JB" ?
                                    <div className="table-container">
                                      <table className="production-table">
                                        <thead>
                                          <tr>
                                            <th>Sr. No.</th>
                                            <th>Component</th>
                                            <th>Description Field</th>
                                            <th>Value</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {/* Potting for JB */}
                                          <tr>
                                            <td rowSpan="4">11</td>
                                            <td rowSpan="4">Potting for JB</td>
                                            <td>Make</td>
                                            <td>
                                              <input
                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-1.5 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                                style={{ margin: 0 }}
                                                placeholder="Make"
                                                type="text"
                                                value={formData.potting_for_jb.make}
                                                onChange={(e) =>
                                                  handleNestedChange(e, "potting_for_jb", "make")
                                                }
                                              />
                                            </td>
                                          </tr>
                                          <tr>
                                            <td>Model</td>
                                            <td>
                                              <input
                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-1.5 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                                style={{ margin: 0 }}
                                                placeholder="Model"
                                                type="text"
                                                value={formData.potting_for_jb.model}
                                                onChange={(e) =>
                                                  handleNestedChange(e, "potting_for_jb", "model")
                                                }
                                              />
                                            </td>
                                          </tr>
                                          <tr>
                                            <td>Batch of Manufacturer</td>
                                            <td>
                                              <input
                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-1.5 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                                style={{ margin: 0 }}
                                                placeholder="Batch of Manufacturer"
                                                type="text"
                                                value={formData.potting_for_jb.batch}
                                                onChange={(e) =>
                                                  handleNestedChange(e, "potting_for_jb", "batch")
                                                }
                                              />
                                            </td>
                                          </tr>
                                          <tr>
                                            <td>Manufacturing Date</td>
                                            <td>
                                              <input
                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-1.5 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                                style={{ margin: 0 }}
                                                placeholder="Manufacturing Date"
                                                type="text"
                                                value={formData.potting_for_jb.manufacturing_date}
                                                onChange={(e) =>
                                                  handleNestedChange(e, "potting_for_jb", "manufacturing_date")
                                                }
                                              />
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>
                                    : selectedSection.section === "Adhesive for Junction Box" ?
                                      <div className="table-container">
                                        <table className="production-table">
                                          <thead>
                                            <tr>
                                              <th>Sr. No.</th>
                                              <th>Component</th>
                                              <th>Description Field</th>
                                              <th>Value</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {/* Adhesive for Junction Box */}
                                            <tr>
                                              <td rowSpan="4">12</td>
                                              <td rowSpan="4">Adhesive for Junction Box</td>
                                              <td>Make</td>
                                              <td>
                                                <input
                                                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-1.5 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                                  style={{ margin: 0 }}
                                                  placeholder="Make"
                                                  type="text"
                                                  value={formData.adhesive_for_jb.make}
                                                  onChange={(e) =>
                                                    handleNestedChange(e, "adhesive_for_jb", "make")
                                                  }
                                                />
                                              </td>
                                            </tr>
                                            <tr>
                                              <td>Model</td>
                                              <td>
                                                <input
                                                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-1.5 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                                  style={{ margin: 0 }}
                                                  placeholder="Model"
                                                  type="text"
                                                  value={formData.adhesive_for_jb.model}
                                                  onChange={(e) =>
                                                    handleNestedChange(e, "adhesive_for_jb", "model")
                                                  }
                                                />
                                              </td>
                                            </tr>
                                            <tr>
                                              <td>Batch of Manufacturer</td>
                                              <td>
                                                <input
                                                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-1.5 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                                  style={{ margin: 0 }}
                                                  placeholder="Batch of Manufacturer"
                                                  type="text"
                                                  value={formData.adhesive_for_jb.batch}
                                                  onChange={(e) =>
                                                    handleNestedChange(e, "adhesive_for_jb", "batch")
                                                  }
                                                />
                                              </td>
                                            </tr>
                                            <tr>
                                              <td>Manufacturing Date</td>
                                              <td>
                                                <input
                                                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-1.5 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                                  style={{ margin: 0 }}
                                                  placeholder="Manufacturing Date"
                                                  type="text"
                                                  value={formData.adhesive_for_jb.manufacturing_date}
                                                  onChange={(e) =>
                                                    handleNestedChange(e, "adhesive_for_jb", "manufacturing_date")
                                                  }
                                                />
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </div>
                                      : selectedSection.section === "Insulation Layer Sealant" ?
                                        <div className="table-container">
                                          <table className="production-table">
                                            <thead>
                                              <tr>
                                                <th>Sr. No.</th>
                                                <th>Component</th>
                                                <th>Description Field</th>
                                                <th>Value</th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              {/* Insulation Layer Sealant */}
                                              <tr>
                                                <td rowSpan="2">13</td>
                                                <td rowSpan="2">Insulation Layer Sealant</td>
                                                <td>Make</td>
                                                <td>
                                                  <input
                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-1.5 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                                    style={{ margin: 0 }}
                                                    placeholder="Make"
                                                    type="text"
                                                    value={formData.insulation_layer_sealant.make}
                                                    onChange={(e) =>
                                                      handleNestedChange(e, "insulation_layer_sealant", "make")
                                                    }
                                                  />
                                                </td>
                                              </tr>
                                              <tr>
                                                <td>Model</td>
                                                <td>
                                                  <input
                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-1.5 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                                    style={{ margin: 0 }}
                                                    placeholder="Model"
                                                    type="text"
                                                    value={formData.insulation_layer_sealant.model}
                                                    onChange={(e) =>
                                                      handleNestedChange(e, "insulation_layer_sealant", "model")
                                                    }
                                                  />
                                                </td>
                                              </tr>
                                            </tbody>
                                          </table>
                                        </div>
                                        : selectedSection.section === "By Pass Diode" ?
                                          <div className="table-container">
                                            <table className="production-table">
                                              <thead>
                                                <tr>
                                                  <th>Sr. No.</th>
                                                  <th>Component</th>
                                                  <th>Description Field</th>
                                                  <th>Value</th>
                                                </tr>
                                              </thead>
                                              <tbody>
                                                {/* Bypass Diode */}
                                                <tr>
                                                  <td rowSpan="2">14</td>
                                                  <td rowSpan="2">Bypass Diode</td>
                                                  <td>Make</td>
                                                  <td>
                                                    <input
                                                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-1.5 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                                      style={{ margin: 0 }}
                                                      placeholder="Make"
                                                      type="text"
                                                      value={formData.bypass_diode.make}
                                                      onChange={(e) => handleNestedChange(e, "bypass_diode", "make")}
                                                    />
                                                  </td>
                                                </tr>
                                                <tr>
                                                  <td>Model</td>
                                                  <td>
                                                    <input
                                                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-1.5 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                                      style={{ margin: 0 }}
                                                      placeholder="Model"
                                                      type="text"
                                                      value={formData.bypass_diode.model}
                                                      onChange={(e) => handleNestedChange(e, "bypass_diode", "model")}
                                                    />
                                                  </td>
                                                </tr>
                                              </tbody>
                                            </table>
                                          </div>
                                          : selectedSection.section === "Fixing Tape" ?
                                            <div className="table-container">
                                              <table className="production-table">
                                                <thead>
                                                  <tr>
                                                    <th>Sr. No.</th>
                                                    <th>Component</th>
                                                    <th>Description Field</th>
                                                    <th>Value</th>
                                                  </tr>
                                                </thead>
                                                <tbody>
                                                  {/* Fixing Tape */}
                                                  <tr>
                                                    <td rowSpan="2">15</td>
                                                    <td rowSpan="2">Fixing Tape</td>
                                                    <td>Make</td>
                                                    <td>
                                                      <input
                                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-1.5 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                                        style={{ margin: 0 }}
                                                        placeholder="Make"
                                                        type="text"
                                                        value={formData.fixing_tape.make}
                                                        onChange={(e) => handleNestedChange(e, "fixing_tape", "make")}
                                                      />
                                                    </td>
                                                  </tr>
                                                  <tr>
                                                    <td>Model</td>
                                                    <td>
                                                      <input
                                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-1.5 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                                        style={{ margin: 0 }}
                                                        placeholder="Model"
                                                        type="text"
                                                        value={formData.fixing_tape.model}
                                                        onChange={(e) => handleNestedChange(e, "fixing_tape", "model")}
                                                      />
                                                    </td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                            </div>
                                            : selectedSection.section === "Cable" ?
                                              <div className="table-container">
                                                <table className="production-table">
                                                  <thead>
                                                    <tr>
                                                      <th>Sr. No.</th>
                                                      <th>Component</th>
                                                      <th>Description Field</th>
                                                      <th>Value</th>
                                                    </tr>
                                                  </thead>
                                                  <tbody>
                                                    {/* Cable */}
                                                    <tr>
                                                      <td>16</td>
                                                      <td>Cable</td>
                                                      <td>Make & Dimension</td>
                                                      <td>
                                                        <input
                                                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-1.5 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                                          style={{ margin: 0 }}
                                                          placeholder="Make & Dimension"
                                                          type="text"
                                                          value={formData.cable.make_dimension}
                                                          onChange={(e) => handleNestedChange(e, "cable", "make_dimension")}
                                                        />
                                                      </td>
                                                    </tr>
                                                  </tbody>
                                                </table>
                                              </div>
                                              : selectedSection.section === "RFID" ?
                                                <>
                                                  <div className="table-container">
                                                    <table className="production-table">
                                                      <thead>
                                                        <tr>
                                                          <th>Sr. No.</th>
                                                          <th>Component</th>
                                                          <th>Description Field</th>
                                                          <th>Value</th>
                                                        </tr>
                                                      </thead>
                                                      <tbody>
                                                        {/* RFID */}
                                                        <tr>
                                                          <td rowSpan="2">17</td>
                                                          <td rowSpan="2">RFID</td>
                                                          <td>Company Make</td>
                                                          <td>
                                                            <input
                                                              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-1.5 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                                              style={{ margin: 0 }}
                                                              placeholder="Company Make"
                                                              type="text"
                                                              value={formData.rfid.company_make}
                                                              onChange={(e) => handleNestedChange(e, "rfid", "company_make")}
                                                            />
                                                          </td>
                                                        </tr>
                                                        <tr>
                                                          <td>Model No</td>
                                                          <td>
                                                            <input
                                                              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-1.5 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                                              style={{ margin: 0 }}
                                                              placeholder="Model No"
                                                              type="text"
                                                              value={formData.rfid.model_no}
                                                              onChange={(e) => handleNestedChange(e, "rfid", "model_no")}
                                                            />
                                                          </td>
                                                        </tr>
                                                      </tbody>
                                                    </table>
                                                  </div>
                                                  <br />
                                                  <table className="production-table">
                                                    <thead>
                                                      <tr>
                                                        <th>Remarks</th>
                                                        <th>Verification done by</th>
                                                      </tr>
                                                    </thead>
                                                    <tbody>
                                                      <tr>
                                                        <td style={{ width: '50%' }}>
                                                          <input
                                                            type="text"
                                                            name="remarks"
                                                            placeholder="Remarks"
                                                            className="input-field"
                                                            value={formData.remarks}
                                                            onChange={handleChange}
                                                          />
                                                        </td>
                                                        <td>
                                                          <input
                                                            type="text"
                                                            name="verification_done_by"
                                                            placeholder="Verification Done By"
                                                            className="input-field"
                                                            value={formData.verification_done_by}
                                                            onChange={handleChange}
                                                          />
                                                        </td>
                                                      </tr>
                                                    </tbody>
                                                  </table>
                                                </>
                                                : <></>}
          </div>
          : (
            <p>Please select a section or subsection to view the form.</p>
          )}
      </div>

      {/* Right Container (20%) for Section List */}
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
    </div>
  );
};

export default RunningReport;