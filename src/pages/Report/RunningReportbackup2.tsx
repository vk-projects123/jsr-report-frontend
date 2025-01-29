import { useState, useEffect } from "react";
import { LIST_FORM_SECTIONS_API, LIST_SECTION_PARAMS_API } from "../../Api/api.tsx";
import { useNavigate, useLocation } from 'react-router-dom';

const RunningReport = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state;
  const [selectedSection, setSelectedSection] = useState<any>({ section: 'Report Details', subsection: "" });
  const [expandedSection, setExpandedSection] = useState<any>(null);
  const [isLoaded, setLoaded] = useState(false);

  useEffect(() => {
    console.log("data", data);
    if (data.Datas) {
      try {
        setFormData(data.Datas);
        if (data.observations) {
          setObservations(data.observations);
        }
      } catch (e) {
        console.log('datas not get');
      }
    }
  }, [data]);

  const sections = data.reportType === "IPQC" ?
    [
      // {
      //   title: "Basic Details",
      //   icon: "🏠",
      //   subsections: ["Report Details", "Production Stage Wise"],
      // },
      {
        title: "Report Details",
        icon: "🏠",
        subsections: [],
      },
      {
        title: "Production Stage Wise",
        icon: "🏠",
        subsections: [],
      },
      {
        title: "Major Observations",
        icon: "🎓",
        subsections: [],
      },
      {
        title: "Film Cutting",
        icon: "🎓",
        subsections: [],
      },
      {
        title: "Tabber & Stringer",
        icon: "🎓",
        subsections: [],
      },
      {
        title: "Layup",
        icon: "🎓",
        subsections: [],
      },
      {
        title: "Lamination",
        icon: "🎓",
        subsections: [],
      },
      {
        title: "Framing",
        icon: "🎓",
        subsections: [],
      },
      {
        title: "Flasher Testing",
        icon: "🎓",
        subsections: [],
      },
      {
        title: "Random Sample Check",
        icon: "🎓",
        subsections: [],
      },
      // {
      //   title: "Attechments & others",
      //   icon: "🎓",
      //   subsections: [],
      // },
    ] :
    [
      {
        title: "Report Details",
        icon: "🏠",
        subsections: [],
      },
      // {
      //   title: "Material Details",
      //   icon: "🏠",
      //   subsections: [],
      // },
      {
        title: "Solar Cell",
        icon: "🏠",
        subsections: [],
      },
      {
        title: "Cell Connector",
        icon: "🏠",
        subsections: [],
      },
      {
        title: "Soldering Flux",
        icon: "🏠",
        subsections: [],
      },
      {
        title: "Glass",
        icon: "🏠",
        subsections: [],
      },
      {
        title: "EVA",
        icon: "🏠",
        subsections: [],
      },
      {
        title: "String Connector",
        icon: "🏠",
        subsections: [],
      },
      {
        title: "Back Sheet",
        icon: "🏠",
        subsections: [],
      },
      {
        title: "Frame",
        icon: "🏠",
        subsections: [],
      },
      {
        title: "Junction Box",
        icon: "🏠",
        subsections: [],
      },
      {
        title: "Connector",
        icon: "🏠",
        subsections: [],
      },
      {
        title: "Potting for JB",
        icon: "🏠",
        subsections: [],
      },
      {
        title: "Adhesive for Junction Box",
        icon: "🏠",
        subsections: [],
      },
      {
        title: "Insulation Layer Sealant",
        icon: "🏠",
        subsections: [],
      },
      {
        title: "By Pass Diode",
        icon: "🏠",
        subsections: [],
      },
      {
        title: "Fixing Tape",
        icon: "🏠",
        subsections: [],
      },
      {
        title: "Cable",
        icon: "🏠",
        subsections: [],
      },
      {
        title: "RFID",
        icon: "🏠",
        subsections: [],
      },
    ];

  const handleSectionClick = (section: any, subsection = null) => {
    setSelectedSection({ section, subsection });
    console.log("selected section ->>>", selectedSection, section, subsection);
  };

  const toggleSection = (title: any) => {
    setExpandedSection(expandedSection === title ? null : title);
  };

  const [formData, setFormData] = useState<any>({
    oaNo: '',
    manufacturer: '',
    date: '',
    reportCreatedBy: '',
    placeOfInspection: '',
    customerName: '',
    shift: '',
    reportNo:'',
    // date: null,
    enddate: null,
    wpInNos: null,
    totalProductionNos: null,
    totalProductionMw: null,
    tillDateWpInNos: null,
    tillDateTotalProductionNos: null,
    tillDateTotalProductionMw: null,
    product: null,
    total_layup: null,
    total_vqc_fail: null,
    total_fqc_fail: null,
    total_lamination_el_fail: null,
    total_low_wp: null,
    other_reject: null,
    eva_cutting_length: { round1: "", round2: "", round3: "", round4: "" },
    backsheet_cutting_length: { round1: "", round2: "", round3: "", round4: "" },
    epe_strip_cutting_size: { round1: "", round2: "", round3: "", round4: "" },
    busbar_cutting_size: { round1: "", round2: "", round3: "", round4: "" },
    raw_material_used_records: { round1: "", round2: "", round3: "", round4: "" },
    machine_no: { round1: "", round2: "", round3: "", round4: "" },
    soldering_temp_a: { round1: "", round2: "", round3: "", round4: "" },
    soldering_temp_b: { round1: "", round2: "", round3: "", round4: "" },
    peel_strength_front: { round1: "", round2: "", round3: "", round4: "" },
    peel_strength_back: { round1: "", round2: "", round3: "", round4: "" },
    all_machine_peel_strength: { round1: "", round2: "", round3: "", round4: "" },
    raw_material_track_records: { round1: "", round2: "", round3: "", round4: "" },
    tabber_observations: { round1: "", round2: "", round3: "", round4: "" },
    work_station_no: { round1: "", round2: "", round3: "", round4: "" },
    running_module_serial_no: { round1: "", round2: "", round3: "", round4: "" },
    soldering_station_temp: { round1: "", round2: "", round3: "", round4: "" },
    soldering_station_calibration: { round1: "", round2: "", round3: "", round4: "" },
    wip: { round1: "", round2: "", round3: "", round4: "" },
    layupobservations: { round1: "", round2: "", round3: "", round4: "" },
    lamination_work_station_no: { round1: "", round2: "", round3: "", round4: "" },
    stage1_cycle_time: { round1: "", round2: "", round3: "", round4: "" },
    stage2_cycle_time: { round1: "", round2: "", round3: "", round4: "" },
    temperature_stage1: { round1: "", round2: "", round3: "", round4: "" },
    temperature_stage2: { round1: "", round2: "", round3: "", round4: "" },
    pressure_stage1: { round1: "", round2: "", round3: "", round4: "" },
    pressure_stage2: { round1: "", round2: "", round3: "", round4: "" },
    last_gel_content_checked: { round1: "", round2: "", round3: "", round4: "" },
    gel_content: { round1: "", round2: "", round3: "", round4: "" },
    framing_work_station_no: { round1: "", round2: "", round3: "", round4: "" },
    module_width_after_framing: { round1: "", round2: "", round3: "", round4: "" },
    module_length_after_framing: { round1: "", round2: "", round3: "", round4: "" },
    frame_size_hs: { round1: "", round2: "", round3: "", round4: "" },
    x_pitch: { round1: "", round2: "", round3: "", round4: "" },
    y_pitch: { round1: "", round2: "", round3: "", round4: "" },
    rtv_consumption_long_side: { round1: "", round2: "", round3: "", round4: "" },
    rtv_consumption_short_side: { round1: "", round2: "", round3: "", round4: "" },
    rtv_back_filling: { round1: "", round2: "", round3: "", round4: "" },
    potting_material_mixing_ratio: { round1: "", round2: "", round3: "", round4: "" },
    jb_fixing_process: { round1: "", round2: "", round3: "", round4: "" },
    jb_terminal_connections: { round1: "", round2: "", round3: "", round4: "" },
    raw_material_consumption_records: { round1: "", round2: "", round3: "", round4: "" },
    calibration_time: { round1: "", round2: "", round3: "", round4: "" },
    calibration_by: { round1: "", round2: "", round3: "", round4: "" },
    reference_module_sr_no: { round1: "", round2: "", round3: "", round4: "" },
    difference_in_wp_measured: { round1: "", round2: "", round3: "", round4: "" },
    difference_in_isc_measured: { round1: "", round2: "", round3: "", round4: "" },
    difference_in_imp_measured: { round1: "", round2: "", round3: "", round4: "" },
    difference_in_vmp_measured: { round1: "", round2: "", round3: "", round4: "" },
    difference_in_voc_measured: { round1: "", round2: "", round3: "", round4: "" },
    flasher_records: { round1: "", round2: "", round3: "", round4: "" },
    flash_test: { round1: "", round2: "", round3: "", round4: "" },
    insulation_test: { round1: "", round2: "", round3: "", round4: "" },
    high_voltage_test: { round1: "", round2: "", round3: "", round4: "" },
    electroluminescence_test: { round1: "", round2: "", round3: "", round4: "" },
    soldering_peel_test: { round1: "", round2: "", round3: "", round4: "" },
    final_visual_inspection: { round1: "", round2: "", round3: "", round4: "" },
    laminate_visual_inspection: { round1: "", round2: "", round3: "", round4: "" },
    ground_continuity_test: { round1: "", round2: "", round3: "", round4: "" },
    test_results: [
      { sr_no: 1, test: "Flash test", module_sr_no: "", result: "" },
      { sr_no: 2, test: "Insulation Test", module_sr_no: "", result: "" },
      { sr_no: 3, test: "High Voltage Test", module_sr_no: "", result: "" },
      { sr_no: 4, test: "Electroluminescence Test", module_sr_no: "", result: "" },
      { sr_no: 5, test: "Soldering Peel Test", module_sr_no: "", result: "" },
      { sr_no: 6, test: "Final Visual Inspection", module_sr_no: "", result: "" },
      { sr_no: 7, test: "Laminate visual inspection", module_sr_no: "", result: "" },
      { sr_no: 8, test: "Ground continuity test", module_sr_no: "", result: "" },
    ],
    inpaction_done_by:"",
    checking_together:"",
    solar_cell: {
      bb_cells: "",
      efficiency: "",
      size: "",
      product_name: "",
      batch: "",
      company_make: "",
    },
    cell_connector: {
      make: "",
      diameter: "",
      batch: "",
    },
    soldering_flux: {
      make: "",
      model: "",
      batch: "",
      manufacturing_date: "",
    },
    glass: {
      make: "",
      dimension: "",
      ar_coated: "",
      batch: "",
      manufacturing_date: "",
    },
    eva: {
      make: "",
      model: "",
      batch: "",
      manufacturing_date: "",
    },
    string_connector: {
      make: "",
      dimension: "",
      batch: "",
    },
    back_sheet: {
      make: "",
      model: "",
      batch: "",
      manufacturing_date: "",
    },
    frame: {
      make: "",
      long_side_dimension: "",
      short_side_dimension: "",
      punching_location: "",
      model: "",
      batch: "",
    },
    junction_box: {
      company_make: "",
      batch: "",
    },
    connector: {
      type: "",
    },
    potting_for_jb: {
      make: "",
      model: "",
      batch: "",
      manufacturing_date: "",
    },
    adhesive_for_jb: {
      make: "",
      model: "",
      batch: "",
      manufacturing_date: "",
    },
    insulation_layer_sealant: {
      make: "",
      model: "",
    },
    bypass_diode: {
      make: "",
      model: "",
    },
    fixing_tape: {
      make: "",
      model: "",
    },
    cable: {
      make_dimension: "",
    },
    rfid: {
      company_make: "",
      model_no: "",
    },
    remarks:"",
    verification_done_by:""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData: any) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleNestedChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    paramName: string,
    round: string
  ) => {
    const { value } = e.target;
    setFormData((prevData: any) => ({
      ...prevData,
      [paramName]: {
        ...prevData[paramName],
        [round]: value, // Update the specific round's value
      },
    }));
  };

  const handleArrayChange = (e: any, key: any, index: any, field: any) => {
    const newValue = e.target.value;
    setFormData((prevFormData: any) => {
      const updatedArray = [...prevFormData[key]];
      updatedArray[index][field] = newValue;
      return { ...prevFormData, [key]: updatedArray };
    });
  };

  // observations section
  const [observations, setObservations] = useState<any>([]);

  const addObservation = () => {
    setObservations([
      ...observations,
      {
        id: observations.length + 1,
        description: "",
        images: [],
      },
    ]);
  };

  const updateDescription = (id: any, newDescription: any) => {
    setObservations((prevObservations: any) =>
      prevObservations.map((obs: any) =>
        obs.id === id ? { ...obs, description: newDescription } : obs
      )
    );
  };

  const addImages = (id: any, newImages: string[]) => {
    setObservations((prevObservations: any) =>
      prevObservations.map((obs: any) =>
        obs.id === id
          ? { ...obs, images: [...obs.images, ...newImages] } // Append all new images
          : obs
      )
    );
  };

  //other seaction
  const [otherdetails, setOtherdetails] = useState<any>([]);

  const addOtherdetails = () => {
    setOtherdetails([
      ...otherdetails,
      {
        id: otherdetails.length + 1,
        description: "",
        images: [],
      },
    ]);
  };

  const updateotherDescription = (id: any, newDescription: any) => {
    setOtherdetails((prevObservations: any) =>
      prevObservations.map((obs: any) =>
        obs.id === id ? { ...obs, description: newDescription } : obs
      )
    );
  };

  const addotherImages = (id: any, newImages: string[]) => {
    setOtherdetails((prevObservations: any) =>
      prevObservations.map((obs: any) =>
        obs.id === id
          ? { ...obs, images: [...obs.images, ...newImages] } // Append all new images
          : obs
      )
    );
  };

  //tabber section
  const [tabberotherdetails, setTabberOtherdetails] = useState<any>([]);

  const addtabberOtherdetails = () => {
    setTabberOtherdetails([
      ...tabberotherdetails,
      {
        id: tabberotherdetails.length + 1,
        description: "",
        images: [],
      },
    ]);
  };

  const updatetabberDescription = (id: any, newDescription: any) => {
    setTabberOtherdetails((prevObservations: any) =>
      prevObservations.map((obs: any) =>
        obs.id === id ? { ...obs, description: newDescription } : obs
      )
    );
  };

  const addtabberotherImages = (id: any, newImages: string[]) => {
    setTabberOtherdetails((prevObservations: any) =>
      prevObservations.map((obs: any) =>
        obs.id === id
          ? { ...obs, images: [...obs.images, ...newImages] } // Append all new images
          : obs
      )
    );
  };

  //layup section
  const [layupotherdetails, setLayupOtherdetails] = useState<any>([]);

  const addlayupOtherdetails = () => {
    setLayupOtherdetails([
      ...layupotherdetails,
      {
        id: layupotherdetails.length + 1,
        description: "",
        images: [],
      },
    ]);
  };

  const updatelayupDescription = (id: any, newDescription: any) => {
    setLayupOtherdetails((prevObservations: any) =>
      prevObservations.map((obs: any) =>
        obs.id === id ? { ...obs, description: newDescription } : obs
      )
    );
  };

  const addlayupotherImages = (id: any, newImages: string[]) => {
    setLayupOtherdetails((prevObservations: any) =>
      prevObservations.map((obs: any) =>
        obs.id === id
          ? { ...obs, images: [...obs.images, ...newImages] } // Append all new images
          : obs
      )
    );
  };

  //Lamination section
  const [laminationotherdetails, setLaminationOtherdetails] = useState<any>([]);

  const addlaminationOtherdetails = () => {
    setLaminationOtherdetails([
      ...laminationotherdetails,
      {
        id: laminationotherdetails.length + 1,
        description: "",
        images: [],
      },
    ]);
  };

  const updatelaminationDescription = (id: any, newDescription: any) => {
    setLaminationOtherdetails((prevObservations: any) =>
      prevObservations.map((obs: any) =>
        obs.id === id ? { ...obs, description: newDescription } : obs
      )
    );
  };

  const addlaminationotherImages = (id: any, newImages: string[]) => {
    setLaminationOtherdetails((prevObservations: any) =>
      prevObservations.map((obs: any) =>
        obs.id === id
          ? { ...obs, images: [...obs.images, ...newImages] } // Append all new images
          : obs
      )
    );
  };

  //Framing section
  const [framingotherdetails, setFramingOtherdetails] = useState<any>([]);

  const addframingOtherdetails = () => {
    setFramingOtherdetails([
      ...framingotherdetails,
      {
        id: framingotherdetails.length + 1,
        description: "",
        images: [],
      },
    ]);
  };

  const updateframingDescription = (id: any, newDescription: any) => {
    setFramingOtherdetails((prevObservations: any) =>
      prevObservations.map((obs: any) =>
        obs.id === id ? { ...obs, description: newDescription } : obs
      )
    );
  };

  const addframingotherImages = (id: any, newImages: string[]) => {
    setFramingOtherdetails((prevObservations: any) =>
      prevObservations.map((obs: any) =>
        obs.id === id
          ? { ...obs, images: [...obs.images, ...newImages] } // Append all new images
          : obs
      )
    );
  };

  //Flasher Testing section
  const [flasherotherdetails, setFlasherOtherdetails] = useState<any>([]);

  const addflasherOtherdetails = () => {
    setFlasherOtherdetails([
      ...flasherotherdetails,
      {
        id: flasherotherdetails.length + 1,
        description: "",
        images: [],
      },
    ]);
  };

  const updateflasherDescription = (id: any, newDescription: any) => {
    setFlasherOtherdetails((prevObservations: any) =>
      prevObservations.map((obs: any) =>
        obs.id === id ? { ...obs, description: newDescription } : obs
      )
    );
  };

  const addflasherotherImages = (id: any, newImages: string[]) => {
    setFlasherOtherdetails((prevObservations: any) =>
      prevObservations.map((obs: any) =>
        obs.id === id
          ? { ...obs, images: [...obs.images, ...newImages] } // Append all new images
          : obs
      )
    );
  };

  //Random Sample Check
  const [randomsampleotherdetails, setRandomsampleOtherdetails] = useState<any>([]);

  const addrandomsampleOtherdetails = () => {
    setRandomsampleOtherdetails([
      ...randomsampleotherdetails,
      {
        id: randomsampleotherdetails.length + 1,
        description: "",
        images: [],
      },
    ]);
  };

  const updaterandomsampleDescription = (id: any, newDescription: any) => {
    setRandomsampleOtherdetails((prevObservations: any) =>
      prevObservations.map((obs: any) =>
        obs.id === id ? { ...obs, description: newDescription } : obs
      )
    );
  };

  const addrandomsampleotherImages = (id: any, newImages: string[]) => {
    setRandomsampleOtherdetails((prevObservations: any) =>
      prevObservations.map((obs: any) =>
        obs.id === id
          ? { ...obs, images: [...obs.images, ...newImages] } // Append all new images
          : obs
      )
    );
  };

  return (
    <div className="container">
      {/* Left Container (80%) for Form */}
      <div className="left-container">
        {data.reportType === "IPQC" && selectedSection ? (
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
                    pagetype: data.reportType, data: formData, observations: observations,
                    otherobservations: {
                      filmCutting: otherdetails, tabber: tabberotherdetails,
                      layup: layupotherdetails, lamination: laminationotherdetails, framing: framingotherdetails,
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
                        type="text"
                        placeholder="OA NO"
                        name="oaNo"
                        value={formData.oaNo}
                        onChange={handleChange}
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-1.5 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        style={{ margin: 0 }}
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
                          <option value="">Select Shift</option>
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
              :
              // selectedSection.subsection === "Production Details" ?
              //   <div className="table-container">
              //     <table className="production-table">
              //       <tbody>
              //         <tr>
              //           <td>Last Working Day</td>
              //           <td>
              //             <input
              //               type="date"
              //               name="date"
              //               value={formData.date}
              //               onChange={handleChange}
              //               className="input-field"
              //             />
              //           </td>
              //         </tr>
              //         <tr>
              //           <td>380 Wp in Nos</td>
              //           <td>
              //             <input
              //               type="number"
              //               name="wpInNos"
              //               placeholder="380 Wp in Nos"
              //               value={formData.wpInNos}
              //               onChange={handleChange}
              //               className="input-field"
              //             />
              //           </td>
              //         </tr>
              //         <tr>
              //           <td>Total Production modules in Nos</td>
              //           <td>
              //             <input
              //               type="number"
              //               name="totalProductionNos"
              //               placeholder="Total Production modules in Nos"
              //               value={formData.totalProductionNos}
              //               onChange={handleChange}
              //               className="input-field"
              //             />
              //           </td>
              //         </tr>
              //         <tr>
              //           <td>Total Production in MW</td>
              //           <td>
              //             <input
              //               type="number"
              //               step="0.001"
              //               name="totalProductionMw"
              //               value={formData.totalProductionMw}
              //               placeholder="Total Production in MW"
              //               onChange={handleChange}
              //               className="input-field"
              //             />
              //           </td>
              //         </tr>
              //       </tbody>
              //     </table>
              //   </div>
              //   :
              selectedSection.section === "Production Stage Wise" ?
                <div className="table-container">
                  <table className="production-table">
                    <tbody>
                      <tr>
                        <td>Product</td>
                        <td>
                          <input
                            type="string"
                            name="product"
                            placeholder="Product"
                            value={formData.product}
                            onChange={handleChange}
                            className="input-field"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Total Layup</td>
                        <td>
                          <input
                            type="number"
                            name="total_layup"
                            value={formData.total_layup}
                            placeholder="Total Layup"
                            onChange={handleChange}
                            className="input-field"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Total VQC fail</td>
                        <td>
                          <input
                            type="number"
                            name="total_vqc_fail"
                            value={formData.total_vqc_fail}
                            placeholder="Total VQC fail"
                            onChange={handleChange}
                            className="input-field"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Total after lamination EL fail</td>
                        <td>
                          <input
                            type="number"
                            name="total_lamination_el_fail"
                            placeholder="Total after lamination EL fail"
                            value={formData.total_lamination_el_fail}
                            onChange={handleChange}
                            className="input-field"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Total FQC fail</td>
                        <td>
                          <input
                            type="number"
                            name="total_fqc_fail"
                            value={formData.total_fqc_fail}
                            placeholder="Total FQC fail"
                            onChange={handleChange}
                            className="input-field"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Total low Wp</td>
                        <td>
                          <input
                            type="number"
                            name="total_low_wp"
                            placeholder="Total low Wp"
                            value={formData.total_low_wp}
                            onChange={handleChange}
                            className="input-field"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Other reject/fail</td>
                        <td>
                          <input
                            type="number"
                            name="other_reject"
                            placeholder="Other reject/fail "
                            value={formData.other_reject}
                            onChange={handleChange}
                            className="input-field"
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                : selectedSection.section === "Major Observations" ?
                  <div className="observation-container">
                    <table className="observation-table">
                      <thead>
                        <tr>
                          <th>Sr No</th>
                          <th>Observations / Deficiency Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        {observations.map((observation: any, index: any) => (
                          <tr key={observation.id}>
                            <td>{index + 1}</td>
                            <td>
                              <div className="observation-detail">
                                {/* Editable Description */}
                                <textarea
                                  className="input-field"
                                  value={observation.description}
                                  onChange={(e) =>
                                    updateDescription(observation.id, e.target.value)
                                  }
                                  placeholder="Enter description"
                                />

                                {/* Display Images */}
                                <div className="image-row">
                                  {observation.images.map((image: any, idx: any) => (
                                    <img
                                      key={idx}
                                      src={image}
                                      alt={`Observation ${index + 1} - Image ${idx + 1}`}
                                    />
                                  ))}
                                </div>

                                <input
                                  type="file"
                                  accept="image/*"
                                  multiple
                                  onChange={(e: any) => {
                                    const files = e.target.files; // Get all selected files
                                    if (files.length > 0) {
                                      const imageUrls = Array.from(files).map((file: any) =>
                                        URL.createObjectURL(file)
                                      );
                                      addImages(observation.id, imageUrls); // Pass array of image URLs
                                    }
                                  }}
                                />
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  :
                  selectedSection.section === "Film Cutting" ?
                    <div className="table-container">
                      <table className="production-table">
                        <thead>
                          <tr>
                            <th>Parameters</th>
                            <th>Round 1</th>
                            <th>Round 2</th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* EVA Cutting Length */}
                          <tr>
                            <td>EVA Cutting Length (mm)</td>
                            {["round1", "round2"].map((round) => (
                              <td key={round}>
                                <input
                                  type="text"
                                  placeholder="EVA Length"
                                  className="input-field"
                                  value={formData.eva_cutting_length[round]}
                                  onChange={(e) => handleNestedChange(e, "eva_cutting_length", round)}
                                />
                              </td>
                            ))}
                          </tr>

                          {/* Backsheet Cutting Length */}
                          <tr>
                            <td>Backsheet Cutting length (mm)</td>
                            {["round1", "round2"].map((round) => (
                              <td key={round}>
                                <input
                                  type="text"
                                  placeholder="EVA thickness"
                                  className="input-field"
                                  value={formData.backsheet_cutting_length[round]}
                                  onChange={(e) =>
                                    handleNestedChange(e, "backsheet_cutting_length", round)
                                  }
                                />
                              </td>
                            ))}
                          </tr>

                          {/* Raw Material Used Records */}
                          <tr>
                            <td>Raw Material Used Records</td>
                            {["round1", "round2"].map((round) => (
                              <td key={round}>
                                <input
                                  type="text"
                                  placeholder="Raw Material"
                                  className="input-field"
                                  value={formData.raw_material_used_records[round]}
                                  onChange={(e) =>
                                    handleNestedChange(e, "raw_material_used_records", round)
                                  }
                                />
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                      <div className="observation-container" style={{ width: '100%' }}>
                        <button className="add-btn" onClick={addOtherdetails} style={{ justifyContent: 'end' }}>
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
                            {otherdetails.map((observation: any, index: any) => (
                              <tr key={observation.id}>
                                <td>{index + 1}</td>
                                <td>
                                  <div className="observation-detail">
                                    {/* Editable Description */}
                                    <textarea
                                      className="input-field"
                                      value={observation.description}
                                      onChange={(e) =>
                                        updateotherDescription(observation.id, e.target.value)
                                      }
                                      placeholder="Enter description"
                                    />

                                    {/* Display Images */}
                                    <div className="image-row">
                                      {observation.images.map((image: any, idx: any) => (
                                        <img
                                          key={idx}
                                          src={image}
                                          alt={`Observation ${index + 1} - Image ${idx + 1}`}
                                        />
                                      ))}
                                    </div>

                                    <input
                                      type="file"
                                      accept="image/*"
                                      multiple
                                      onChange={(e: any) => {
                                        const files = e.target.files;
                                        if (files.length > 0) {
                                          const imageUrls = Array.from(files).map((file: any) =>
                                            URL.createObjectURL(file)
                                          );
                                          addotherImages(observation.id, imageUrls);
                                        }
                                      }}
                                    />
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    : selectedSection.section === "Tabber & Stringer" ?
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
                            {/* Machine No */}
                            <tr>
                              <td>Machine No</td>
                              {["round1", "round2", "round3", "round4"].map((round) => (
                                <td key={round}>
                                  <input
                                    type="text"
                                    placeholder="Machine No"
                                    className="input-field"
                                    value={formData.machine_no[round]}
                                    onChange={(e) => handleNestedChange(e, "machine_no", round)}
                                  />
                                </td>
                              ))}
                            </tr>
                            {/* Soldering Temperature - A */}
                            <tr>
                              <td>Soldering Temperature - A (°C)</td>
                              {["round1", "round2", "round3", "round4"].map((round) => (
                                <td key={round}>
                                  <input
                                    type="text"
                                    placeholder="Temp A"
                                    className="input-field"
                                    value={formData.soldering_temp_a[round]}
                                    onChange={(e) => handleNestedChange(e, "soldering_temp_a", round)}
                                  />
                                </td>
                              ))}
                            </tr>

                            {/* Soldering Temperature - B */}
                            <tr>
                              <td>Soldering Temperature - B (°C)</td>
                              {["round1", "round2", "round3", "round4"].map((round) => (
                                <td key={round}>
                                  <input
                                    type="text"
                                    placeholder="Temp B"
                                    className="input-field"
                                    value={formData.soldering_temp_b[round]}
                                    onChange={(e) => handleNestedChange(e, "soldering_temp_b", round)}
                                  />
                                </td>
                              ))}
                            </tr>

                            {/* Peel Strength - Front */}
                            <tr>
                              <td>Peel Strength - Front (N)</td>
                              {["round1", "round2", "round3", "round4"].map((round) => (
                                <td key={round}>
                                  <input
                                    type="text"
                                    placeholder="Peel Front"
                                    className="input-field"
                                    value={formData.peel_strength_front[round]}
                                    onChange={(e) => handleNestedChange(e, "peel_strength_front", round)}
                                  />
                                </td>
                              ))}
                            </tr>

                            {/* Peel Strength - Back */}
                            <tr>
                              <td>Peel Strength - Back (N)</td>
                              {["round1", "round2", "round3", "round4"].map((round) => (
                                <td key={round}>
                                  <input
                                    type="text"
                                    placeholder="Peel Back"
                                    className="input-field"
                                    value={formData.peel_strength_back[round]}
                                    onChange={(e) => handleNestedChange(e, "peel_strength_back", round)}
                                  />
                                </td>
                              ))}
                            </tr>

                            {/* All Machine Peel Strength */}
                            <tr>
                              <td>All Machine Peel Strength</td>
                              {["round1", "round2", "round3", "round4"].map((round) => (
                                <td key={round}>
                                  <input
                                    type="text"
                                    placeholder="Peel Strength"
                                    className="input-field"
                                    value={formData.all_machine_peel_strength[round]}
                                    onChange={(e) => handleNestedChange(e, "all_machine_peel_strength", round)}
                                  />
                                </td>
                              ))}
                            </tr>

                            {/* Raw Material Track Records */}
                            <tr>
                              <td>Raw Material Track Records</td>
                              {["round1", "round2", "round3", "round4"].map((round) => (
                                <td key={round}>
                                  <input
                                    type="text"
                                    placeholder="Raw Material"
                                    className="input-field"
                                    value={formData.raw_material_track_records[round]}
                                    onChange={(e) => handleNestedChange(e, "raw_material_track_records", round)}
                                  />
                                </td>
                              ))}
                            </tr>
                          </tbody>
                        </table>
                        <div className="observation-container" style={{ width: '100%' }}>
                          <button className="add-btn" onClick={addtabberOtherdetails} style={{ justifyContent: 'end' }}>
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
                              {tabberotherdetails.map((observation: any, index: any) => (
                                <tr key={observation.id}>
                                  <td>{index + 1}</td>
                                  <td>
                                    <div className="observation-detail">
                                      {/* Editable Description */}
                                      <textarea
                                        className="input-field"
                                        value={observation.description}
                                        onChange={(e) =>
                                          updatetabberDescription(observation.id, e.target.value)
                                        }
                                        placeholder="Enter description"
                                      />

                                      {/* Display Images */}
                                      <div className="image-row">
                                        {observation.images.map((image: any, idx: any) => (
                                          <img
                                            key={idx}
                                            src={image}
                                            alt={`Observation ${index + 1} - Image ${idx + 1}`}
                                          />
                                        ))}
                                      </div>

                                      <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={(e: any) => {
                                          const files = e.target.files;
                                          if (files.length > 0) {
                                            const imageUrls = Array.from(files).map((file: any) =>
                                              URL.createObjectURL(file)
                                            );
                                            addtabberotherImages(observation.id, imageUrls);
                                          }
                                        }}
                                      />
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                      : selectedSection.section === "Layup" ?
                        <div className="table-container">
                          <table className="production-table">
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
                              {/* Work station no */}
                              <tr>
                                <td>Work station no</td>
                                {["round1", "round2", "round3", "round4"].map((round) => (
                                  <td key={round}>
                                    <input
                                      type="text"
                                      placeholder="Work Station"
                                      className="input-field"
                                      value={formData.work_station_no[round]}
                                      onChange={(e) => handleNestedChange(e, "work_station_no", round)}
                                    />
                                  </td>
                                ))}
                              </tr>

                              {/* Running module serial no */}
                              <tr>
                                <td>Running module serial no</td>
                                {["round1", "round2", "round3", "round4"].map((round) => (
                                  <td key={round}>
                                    <input
                                      type="text"
                                      placeholder="Serial No"
                                      className="input-field"
                                      value={formData.running_module_serial_no[round]}
                                      onChange={(e) => handleNestedChange(e, "running_module_serial_no", round)}
                                    />
                                  </td>
                                ))}
                              </tr>

                              {/* Soldering station temperature */}
                              <tr>
                                <td>Soldering station temperature (°C)</td>
                                {["round1", "round2", "round3", "round4"].map((round) => (
                                  <td key={round}>
                                    <input
                                      type="text"
                                      placeholder="Temp (°C)"
                                      className="input-field"
                                      value={formData.soldering_station_temp[round]}
                                      onChange={(e) => handleNestedChange(e, "soldering_station_temp", round)}
                                    />
                                  </td>
                                ))}
                              </tr>

                              {/* Soldering station calibration */}
                              <tr>
                                <td>Soldering station calibration</td>
                                {["round1", "round2", "round3", "round4"].map((round) => (
                                  <td key={round}>
                                    <input
                                      type="text"
                                      placeholder="Calibration"
                                      className="input-field"
                                      value={formData.soldering_station_calibration[round]}
                                      onChange={(e) => handleNestedChange(e, "soldering_station_calibration", round)}
                                    />
                                  </td>
                                ))}
                              </tr>

                              {/* WIP */}
                              <tr>
                                <td>WIP (including Pre-Lam EL fail & OK)</td>
                                {["round1", "round2", "round3", "round4"].map((round) => (
                                  <td key={round}>
                                    <input
                                      type="text"
                                      placeholder="WIP"
                                      className="input-field"
                                      value={formData.wip[round]}
                                      onChange={(e) => handleNestedChange(e, "wip", round)}
                                    />
                                  </td>
                                ))}
                              </tr>
                            </tbody>
                          </table>
                          <div className="observation-container" style={{ width: '100%' }}>
                            <button className="add-btn" onClick={addlayupOtherdetails} style={{ justifyContent: 'end' }}>
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
                                {layupotherdetails.map((observation: any, index: any) => (
                                  <tr key={observation.id}>
                                    <td>{index + 1}</td>
                                    <td>
                                      <div className="observation-detail">
                                        {/* Editable Description */}
                                        <textarea
                                          className="input-field"
                                          value={observation.description}
                                          onChange={(e) =>
                                            updatelayupDescription(observation.id, e.target.value)
                                          }
                                          placeholder="Enter description"
                                        />

                                        {/* Display Images */}
                                        <div className="image-row">
                                          {observation.images.map((image: any, idx: any) => (
                                            <img
                                              key={idx}
                                              src={image}
                                              alt={`Observation ${index + 1} - Image ${idx + 1}`}
                                            />
                                          ))}
                                        </div>

                                        <input
                                          type="file"
                                          accept="image/*"
                                          multiple
                                          onChange={(e: any) => {
                                            const files = e.target.files;
                                            if (files.length > 0) {
                                              const imageUrls = Array.from(files).map((file: any) =>
                                                URL.createObjectURL(file)
                                              );
                                              addlayupotherImages(observation.id, imageUrls);
                                            }
                                          }}
                                        />
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                        : selectedSection.section === "Lamination" ?
                          <div className="table-container">
                            <table className="production-table">
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
                                {/* Workstation No */}
                                <tr>
                                  <td>Workstation No</td>
                                  {["round1", "round2", "round3", "round4"].map((round) => (
                                    <td key={round}>
                                      <input
                                        type="text"
                                        placeholder="Work Station"
                                        className="input-field"
                                        value={formData.lamination_work_station_no[round]}
                                        onChange={(e) => handleNestedChange(e, "lamination_work_station_no", round)}
                                      />
                                    </td>
                                  ))}
                                </tr>

                                {/* Stage 1 Cycle Time */}
                                <tr>
                                  <td>Stage 1 cycle time (in Sec)</td>
                                  {["round1", "round2", "round3", "round4"].map((round) => (
                                    <td key={round}>
                                      <input
                                        type="text"
                                        placeholder="Cycle Time"
                                        className="input-field"
                                        value={formData.stage1_cycle_time[round]}
                                        onChange={(e) => handleNestedChange(e, "stage1_cycle_time", round)}
                                      />
                                    </td>
                                  ))}
                                </tr>

                                {/* Stage 2 Cycle Time */}
                                <tr>
                                  <td>Stage 2 cycle time (in Sec)</td>
                                  {["round1", "round2", "round3", "round4"].map((round) => (
                                    <td key={round}>
                                      <input
                                        type="text"
                                        placeholder="Cycle Time"
                                        className="input-field"
                                        value={formData.stage2_cycle_time[round]}
                                        onChange={(e) => handleNestedChange(e, "stage2_cycle_time", round)}
                                      />
                                    </td>
                                  ))}
                                </tr>

                                {/* Temperature Stage 1 */}
                                <tr>
                                  <td>Temperature stage 1 (°C)</td>
                                  {["round1", "round2", "round3", "round4"].map((round) => (
                                    <td key={round}>
                                      <input
                                        type="text"
                                        placeholder="Temperature"
                                        className="input-field"
                                        value={formData.temperature_stage1[round]}
                                        onChange={(e) => handleNestedChange(e, "temperature_stage1", round)}
                                      />
                                    </td>
                                  ))}
                                </tr>

                                {/* Temperature Stage 2 */}
                                <tr>
                                  <td>Temperature stage 2 (°C)</td>
                                  {["round1", "round2", "round3", "round4"].map((round) => (
                                    <td key={round}>
                                      <input
                                        type="text"
                                        placeholder="Temperature"
                                        className="input-field"
                                        value={formData.temperature_stage2[round]}
                                        onChange={(e) => handleNestedChange(e, "temperature_stage2", round)}
                                      />
                                    </td>
                                  ))}
                                </tr>

                                {/* Pressure Stage 1 */}
                                <tr>
                                  <td>Pressure stage 1</td>
                                  {["round1", "round2", "round3", "round4"].map((round) => (
                                    <td key={round}>
                                      <input
                                        type="text"
                                        placeholder="Pressure"
                                        className="input-field"
                                        value={formData.pressure_stage1[round]}
                                        onChange={(e) => handleNestedChange(e, "pressure_stage1", round)}
                                      />
                                    </td>
                                  ))}
                                </tr>

                                {/* Pressure Stage 2 */}
                                <tr>
                                  <td>Pressure stage 2</td>
                                  {["round1", "round2", "round3", "round4"].map((round) => (
                                    <td key={round}>
                                      <input
                                        type="text"
                                        placeholder="Pressure"
                                        className="input-field"
                                        value={formData.pressure_stage2[round]}
                                        onChange={(e) => handleNestedChange(e, "pressure_stage2", round)}
                                      />
                                    </td>
                                  ))}
                                </tr>

                                {/* Last gel content checked on same recipe */}
                                <tr>
                                  <td>Last gel content checked on same recipe</td>
                                  {["round1", "round2", "round3", "round4"].map((round) => (
                                    <td key={round}>
                                      <input
                                        type="text"
                                        placeholder="Last gel content checked"
                                        className="input-field"
                                        value={formData.last_gel_content_checked[round]}
                                        onChange={(e) => handleNestedChange(e, "last_gel_content_checked", round)}
                                      />
                                    </td>
                                  ))}
                                </tr>

                                {/* Gel Content */}
                                <tr>
                                  <td>Gel content %</td>
                                  {["round1", "round2", "round3", "round4"].map((round) => (
                                    <td key={round}>
                                      <input
                                        type="text"
                                        placeholder="Gel Content %"
                                        className="input-field"
                                        value={formData.gel_content[round]}
                                        onChange={(e) => handleNestedChange(e, "gel_content", round)}
                                      />
                                    </td>
                                  ))}
                                </tr>
                              </tbody>
                            </table>
                            <div className="observation-container" style={{ width: '100%' }}>
                              <button className="add-btn" onClick={addlaminationOtherdetails} style={{ justifyContent: 'end' }}>
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
                                  {laminationotherdetails.map((observation: any, index: any) => (
                                    <tr key={observation.id}>
                                      <td>{index + 1}</td>
                                      <td>
                                        <div className="observation-detail">
                                          {/* Editable Description */}
                                          <textarea
                                            className="input-field"
                                            value={observation.description}
                                            onChange={(e) =>
                                              updatelaminationDescription(observation.id, e.target.value)
                                            }
                                            placeholder="Enter description"
                                          />

                                          {/* Display Images */}
                                          <div className="image-row">
                                            {observation.images.map((image: any, idx: any) => (
                                              <img
                                                key={idx}
                                                src={image}
                                                alt={`Observation ${index + 1} - Image ${idx + 1}`}
                                              />
                                            ))}
                                          </div>

                                          <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={(e: any) => {
                                              const files = e.target.files;
                                              if (files.length > 0) {
                                                const imageUrls = Array.from(files).map((file: any) =>
                                                  URL.createObjectURL(file)
                                                );
                                                addlaminationotherImages(observation.id, imageUrls);
                                              }
                                            }}
                                          />
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                          : selectedSection.section === "Framing" ?
                            <div className="table-container">
                              <table className="production-table">
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
                                  {/* Framing Workstation No */}
                                  <tr>
                                    <td>Framing Workstation No</td>
                                    {["round1", "round2", "round3", "round4"].map((round) => (
                                      <td key={round}>
                                        <input
                                          type="text"
                                          placeholder="Workstation"
                                          className="input-field"
                                          value={formData.framing_work_station_no[round]}
                                          onChange={(e) => handleNestedChange(e, "framing_work_station_no", round)}
                                        />
                                      </td>
                                    ))}
                                  </tr>

                                  {/* Module Width After Framing */}
                                  <tr>
                                    <td>Module Width After Framing (in mm)</td>
                                    {["round1", "round2", "round3", "round4"].map((round) => (
                                      <td key={round}>
                                        <input
                                          type="text"
                                          placeholder="Width (mm)"
                                          className="input-field"
                                          value={formData.module_width_after_framing[round]}
                                          onChange={(e) => handleNestedChange(e, "module_width_after_framing", round)}
                                        />
                                      </td>
                                    ))}
                                  </tr>

                                  {/* Module Length After Framing */}
                                  <tr>
                                    <td>Module Length After Framing (in mm)</td>
                                    {["round1", "round2", "round3", "round4"].map((round) => (
                                      <td key={round}>
                                        <input
                                          type="text"
                                          placeholder="Length (mm)"
                                          className="input-field"
                                          value={formData.module_length_after_framing[round]}
                                          onChange={(e) => handleNestedChange(e, "module_length_after_framing", round)}
                                        />
                                      </td>
                                    ))}
                                  </tr>

                                  {/* Frame Size */}
                                  <tr>
                                    <td>Frame Size (HS in mm)</td>
                                    {["round1", "round2", "round3", "round4"].map((round) => (
                                      <td key={round}>
                                        <input
                                          type="text"
                                          placeholder="Frame Size (mm)"
                                          className="input-field"
                                          value={formData.frame_size_hs[round]}
                                          onChange={(e) => handleNestedChange(e, "frame_size_hs", round)}
                                        />
                                      </td>
                                    ))}
                                  </tr>

                                  {/* X Pitch */}
                                  <tr>
                                    <td>X Pitch (in mm)</td>
                                    {["round1", "round2", "round3", "round4"].map((round) => (
                                      <td key={round}>
                                        <input
                                          type="text"
                                          placeholder="X Pitch"
                                          className="input-field"
                                          value={formData.x_pitch[round]}
                                          onChange={(e) => handleNestedChange(e, "x_pitch", round)}
                                        />
                                      </td>
                                    ))}
                                  </tr>

                                  {/* Y Pitch */}
                                  <tr>
                                    <td>Y Pitch (in mm)</td>
                                    {["round1", "round2", "round3", "round4"].map((round) => (
                                      <td key={round}>
                                        <input
                                          type="text"
                                          placeholder="Y Pitch"
                                          className="input-field"
                                          value={formData.y_pitch[round]}
                                          onChange={(e) => handleNestedChange(e, "y_pitch", round)}
                                        />
                                      </td>
                                    ))}
                                  </tr>

                                  {/* RTV Consumption Long Side */}
                                  <tr>
                                    <td>RTV Consumption in Long Side Frame</td>
                                    {["round1", "round2", "round3", "round4"].map((round) => (
                                      <td key={round}>
                                        <input
                                          type="text"
                                          placeholder="RTV Long Side"
                                          className="input-field"
                                          value={formData.rtv_consumption_long_side[round]}
                                          onChange={(e) => handleNestedChange(e, "rtv_consumption_long_side", round)}
                                        />
                                      </td>
                                    ))}
                                  </tr>

                                  {/* RTV Consumption Short Side */}
                                  <tr>
                                    <td>RTV Consumption in Short Side Frame</td>
                                    {["round1", "round2", "round3", "round4"].map((round) => (
                                      <td key={round}>
                                        <input
                                          type="text"
                                          placeholder="RTV Short Side"
                                          className="input-field"
                                          value={formData.rtv_consumption_short_side[round]}
                                          onChange={(e) => handleNestedChange(e, "rtv_consumption_short_side", round)}
                                        />
                                      </td>
                                    ))}
                                  </tr>

                                  {/* RTV Back Filling */}
                                  <tr>
                                    <td>RTV Back Filling</td>
                                    {["round1", "round2", "round3", "round4"].map((round) => (
                                      <td key={round}>
                                        <input
                                          type="text"
                                          placeholder="RTV Back Filling"
                                          className="input-field"
                                          value={formData.rtv_back_filling[round]}
                                          onChange={(e) => handleNestedChange(e, "rtv_back_filling", round)}
                                        />
                                      </td>
                                    ))}
                                  </tr>

                                  {/* Potting Material Mixing Ratio */}
                                  <tr>
                                    <td>Potting Material Mixing Ratio</td>
                                    {["round1", "round2", "round3", "round4"].map((round) => (
                                      <td key={round}>
                                        <input
                                          type="text"
                                          placeholder="Mixing Ratio"
                                          className="input-field"
                                          value={formData.potting_material_mixing_ratio[round]}
                                          onChange={(e) => handleNestedChange(e, "potting_material_mixing_ratio", round)}
                                        />
                                      </td>
                                    ))}
                                  </tr>

                                  {/* JB Fixing Process */}
                                  <tr>
                                    <td>JB Fixing Process</td>
                                    {["round1", "round2", "round3", "round4"].map((round) => (
                                      <td key={round}>
                                        <input
                                          type="text"
                                          placeholder="Fixing Process"
                                          className="input-field"
                                          value={formData.jb_fixing_process[round]}
                                          onChange={(e) => handleNestedChange(e, "jb_fixing_process", round)}
                                        />
                                      </td>
                                    ))}
                                  </tr>

                                  {/* JB Terminal Connections */}
                                  <tr>
                                    <td>JB Terminal Connections</td>
                                    {["round1", "round2", "round3", "round4"].map((round) => (
                                      <td key={round}>
                                        <input
                                          type="text"
                                          placeholder="Terminal Connections"
                                          className="input-field"
                                          value={formData.jb_terminal_connections[round]}
                                          onChange={(e) => handleNestedChange(e, "jb_terminal_connections", round)}
                                        />
                                      </td>
                                    ))}
                                  </tr>

                                  {/* Raw Material Consumption Records */}
                                  <tr>
                                    <td>Raw Material Consumption Records</td>
                                    {["round1", "round2", "round3", "round4"].map((round) => (
                                      <td key={round}>
                                        <input
                                          type="text"
                                          placeholder="Consumption Records"
                                          className="input-field"
                                          value={formData.raw_material_consumption_records[round]}
                                          onChange={(e) => handleNestedChange(e, "raw_material_consumption_records", round)}
                                        />
                                      </td>
                                    ))}
                                  </tr>
                                </tbody>
                              </table>

                              <div className="observation-container" style={{ width: '100%' }}>
                                <button className="add-btn" onClick={addframingOtherdetails} style={{ justifyContent: 'end' }}>
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
                                    {framingotherdetails.map((observation: any, index: any) => (
                                      <tr key={observation.id}>
                                        <td>{index + 1}</td>
                                        <td>
                                          <div className="observation-detail">
                                            {/* Editable Description */}
                                            <textarea
                                              className="input-field"
                                              value={observation.description}
                                              onChange={(e) =>
                                                updateframingDescription(observation.id, e.target.value)
                                              }
                                              placeholder="Enter description"
                                            />

                                            {/* Display Images */}
                                            <div className="image-row">
                                              {observation.images.map((image: any, idx: any) => (
                                                <img
                                                  key={idx}
                                                  src={image}
                                                  alt={`Observation ${index + 1} - Image ${idx + 1}`}
                                                />
                                              ))}
                                            </div>

                                            <input
                                              type="file"
                                              accept="image/*"
                                              multiple
                                              onChange={(e: any) => {
                                                const files = e.target.files;
                                                if (files.length > 0) {
                                                  const imageUrls = Array.from(files).map((file: any) =>
                                                    URL.createObjectURL(file)
                                                  );
                                                  addframingotherImages(observation.id, imageUrls);
                                                }
                                              }}
                                            />
                                          </div>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                            : selectedSection.section === "Flasher Testing" ?
                              <div className="table-container">
                                <table className="production-table">
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
                                    {/* Calibration Time */}
                                    <tr>
                                      <td>Calibration Time</td>
                                      {["round1", "round2", "round3", "round4"].map((round) => (
                                        <td key={round}>
                                          <input
                                            type="text"
                                            placeholder="Calibration Time"
                                            className="input-field"
                                            value={formData.calibration_time[round]}
                                            onChange={(e) => handleNestedChange(e, "calibration_time", round)}
                                          />
                                        </td>
                                      ))}
                                    </tr>

                                    {/* Calibration By */}
                                    <tr>
                                      <td>Calibration By</td>
                                      {["round1", "round2", "round3", "round4"].map((round) => (
                                        <td key={round}>
                                          <input
                                            type="text"
                                            placeholder="Calibration By"
                                            className="input-field"
                                            value={formData.calibration_by[round]}
                                            onChange={(e) => handleNestedChange(e, "calibration_by", round)}
                                          />
                                        </td>
                                      ))}
                                    </tr>

                                    {/* Reference Module Serial Number */}
                                    <tr>
                                      <td>Reference Module Sr No</td>
                                      {["round1", "round2", "round3", "round4"].map((round) => (
                                        <td key={round}>
                                          <input
                                            type="text"
                                            placeholder="Reference Module Sr No"
                                            className="input-field"
                                            value={formData.reference_module_sr_no[round]}
                                            onChange={(e) => handleNestedChange(e, "reference_module_sr_no", round)}
                                          />
                                        </td>
                                      ))}
                                    </tr>

                                    {/* Difference in Wp Measured */}
                                    <tr>
                                      <td>Difference in Wp Measured</td>
                                      {["round1", "round2", "round3", "round4"].map((round) => (
                                        <td key={round}>
                                          <input
                                            type="text"
                                            placeholder="Difference in Wp"
                                            className="input-field"
                                            value={formData.difference_in_wp_measured[round]}
                                            onChange={(e) => handleNestedChange(e, "difference_in_wp_measured", round)}
                                          />
                                        </td>
                                      ))}
                                    </tr>

                                    {/* Difference in Isc Measured */}
                                    <tr>
                                      <td>Difference in Isc Measured</td>
                                      {["round1", "round2", "round3", "round4"].map((round) => (
                                        <td key={round}>
                                          <input
                                            type="text"
                                            placeholder="Difference in Isc"
                                            className="input-field"
                                            value={formData.difference_in_isc_measured[round]}
                                            onChange={(e) => handleNestedChange(e, "difference_in_isc_measured", round)}
                                          />
                                        </td>
                                      ))}
                                    </tr>

                                    {/* Difference in Imp Measured */}
                                    <tr>
                                      <td>Difference in Imp Measured</td>
                                      {["round1", "round2", "round3", "round4"].map((round) => (
                                        <td key={round}>
                                          <input
                                            type="text"
                                            placeholder="Difference in Imp"
                                            className="input-field"
                                            value={formData.difference_in_imp_measured[round]}
                                            onChange={(e) => handleNestedChange(e, "difference_in_imp_measured", round)}
                                          />
                                        </td>
                                      ))}
                                    </tr>

                                    {/* Difference in Vmp Measured */}
                                    <tr>
                                      <td>Difference in Vmp Measured</td>
                                      {["round1", "round2", "round3", "round4"].map((round) => (
                                        <td key={round}>
                                          <input
                                            type="text"
                                            placeholder="Difference in Vmp"
                                            className="input-field"
                                            value={formData.difference_in_vmp_measured[round]}
                                            onChange={(e) => handleNestedChange(e, "difference_in_vmp_measured", round)}
                                          />
                                        </td>
                                      ))}
                                    </tr>

                                    {/* Difference in Voc Measured */}
                                    <tr>
                                      <td>Difference in Voc Measured</td>
                                      {["round1", "round2", "round3", "round4"].map((round) => (
                                        <td key={round}>
                                          <input
                                            type="text"
                                            placeholder="Difference in Voc"
                                            className="input-field"
                                            value={formData.difference_in_voc_measured[round]}
                                            onChange={(e) => handleNestedChange(e, "difference_in_voc_measured", round)}
                                          />
                                        </td>
                                      ))}
                                    </tr>

                                    {/* Flasher Records */}
                                    <tr>
                                      <td>Flasher Records</td>
                                      {["round1", "round2", "round3", "round4"].map((round) => (
                                        <td key={round}>
                                          <input
                                            type="text"
                                            placeholder="Flasher Records"
                                            className="input-field"
                                            value={formData.flasher_records[round]}
                                            onChange={(e) => handleNestedChange(e, "flasher_records", round)}
                                          />
                                        </td>
                                      ))}
                                    </tr>
                                  </tbody>
                                </table>
                                <div className="observation-container" style={{ width: '100%' }}>
                                  <button className="add-btn" onClick={addflasherOtherdetails} style={{ justifyContent: 'end' }}>
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
                                      {flasherotherdetails.map((observation: any, index: any) => (
                                        <tr key={observation.id}>
                                          <td>{index + 1}</td>
                                          <td>
                                            <div className="observation-detail">
                                              {/* Editable Description */}
                                              <textarea
                                                className="input-field"
                                                value={observation.description}
                                                onChange={(e) =>
                                                  updateflasherDescription(observation.id, e.target.value)
                                                }
                                                placeholder="Enter description"
                                              />

                                              {/* Display Images */}
                                              <div className="image-row">
                                                {observation.images.map((image: any, idx: any) => (
                                                  <img
                                                    key={idx}
                                                    src={image}
                                                    alt={`Observation ${index + 1} - Image ${idx + 1}`}
                                                  />
                                                ))}
                                              </div>

                                              <input
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                onChange={(e: any) => {
                                                  const files = e.target.files;
                                                  if (files.length > 0) {
                                                    const imageUrls = Array.from(files).map((file: any) =>
                                                      URL.createObjectURL(file)
                                                    );
                                                    addflasherotherImages(observation.id, imageUrls);
                                                  }
                                                }}
                                              />
                                            </div>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                              : selectedSection.section === "Random Sample Check" ?
                                <div className="table-container">
                                  <table className="production-table">
                                    <thead>
                                      <tr>
                                        <th>Sr No</th>
                                        <th>Test</th>
                                        <th>Module Sr. No.</th>
                                        <th>Result</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {formData.test_results.map((test: any, index: any) => (
                                        <tr key={index}>
                                          <td>{test.sr_no}</td>
                                          <td>{test.test}</td>
                                          <td>
                                            <input
                                              type="text"
                                              placeholder="Module Sr. No."
                                              className="input-field"
                                              value={test.module_sr_no}
                                              onChange={(e) =>
                                                handleArrayChange(e, "test_results", index, "module_sr_no")
                                              }
                                            />
                                          </td>
                                          <td>
                                            <input
                                              type="text"
                                              placeholder="Result"
                                              className="input-field"
                                              value={test.result}
                                              onChange={(e) =>
                                                handleArrayChange(e, "test_results", index, "result")
                                              }
                                            />
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                  <br/>
                                  <table className="production-table">
                                    <thead>
                                      <tr>
                                        <th>Inspection done by</th>
                                        <th>Checking together with (Customer/Manufacturer representative)</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                          <td style={{width:'50%'}}>
                                            <input
                                              type="text"
                                              name="inpaction_done_by"
                                              placeholder="Inspection done by"
                                              className="input-field"
                                              value={formData.inpaction_done_by}
                                              onChange={handleChange}
                                            />
                                          </td>
                                          <td>
                                            <input
                                              type="text"
                                              name="checking_together"
                                              placeholder="Checking together with"
                                              className="input-field"
                                              value={formData.checking_together}
                                              onChange={handleChange}
                                            />
                                          </td>
                                        </tr>
                                    </tbody>
                                  </table>
                                  <div className="observation-container" style={{ width: '100%' }}>
                                    <button className="add-btn" onClick={addrandomsampleOtherdetails} style={{ justifyContent: 'end' }}>
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
                                        {randomsampleotherdetails.map((observation: any, index: any) => (
                                          <tr key={observation.id}>
                                            <td>{index + 1}</td>
                                            <td>
                                              <div className="observation-detail">
                                                {/* Editable Description */}
                                                <textarea
                                                  className="input-field"
                                                  value={observation.description}
                                                  onChange={(e) =>
                                                    updaterandomsampleDescription(observation.id, e.target.value)
                                                  }
                                                  placeholder="Enter description"
                                                />

                                                {/* Display Images */}
                                                <div className="image-row">
                                                  {observation.images.map((image: any, idx: any) => (
                                                    <img
                                                      key={idx}
                                                      src={image}
                                                      alt={`Observation ${index + 1} - Image ${idx + 1}`}
                                                    />
                                                  ))}
                                                </div>

                                                <input
                                                  type="file"
                                                  accept="image/*"
                                                  multiple
                                                  onChange={(e: any) => {
                                                    const files = e.target.files;
                                                    if (files.length > 0) {
                                                      const imageUrls = Array.from(files).map((file: any) =>
                                                        URL.createObjectURL(file)
                                                      );
                                                      addrandomsampleotherImages(observation.id, imageUrls);
                                                    }
                                                  }}
                                                />
                                              </div>
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                                :
                                ""
            }
          </div>
        ) : data.reportType === "BOM" && selectedSection ?
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
                                                <br/>
                                                <table className="production-table">
                                                  <thead>
                                                    <tr>
                                                      <th>Remarks</th>
                                                      <th>Verification done by</th>
                                                    </tr>
                                                  </thead>
                                                  <tbody>
                                                      <tr>
                                                        <td style={{width:'50%'}}>
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
        <div className="sections" style={{ height: '70vh' }}>
          {sections.map((section: any, index: any) => {
            const isActive = selectedSection?.section === section.title;
            return (
              <div key={index} className="section">
                <div
                  className={`section-header ${isActive ? 'active-section' : ''}`}
                  onClick={() => handleSectionClick(section.title)}
                >
                  <span className={`icon ${isActive ? 'active-section' : ''}`}>
                    {section.icon}
                  </span>
                  <span className={`title ${isActive ? 'active-section' : ''}`}>
                    {section.title}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RunningReport;