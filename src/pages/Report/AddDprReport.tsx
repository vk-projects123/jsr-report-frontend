import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { LIST_CUSTOMER_API, ADD_DPR_REPORTS_API } from "../../Api/api.tsx";
import { toast } from "react-toastify";
import { FaChevronDown } from "react-icons/fa";

export default function AddDprReport() {
    var utoken = localStorage.getItem('userToken');
    const navigate = useNavigate();

    const [customer, setCustomer] = useState([]);
    const [isLoaded, setLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState<any>({
        reportNo: "",
        date: "",
        shift: "",
        oaNo: "",
        company: "",
        wpProduction: "",
        nosProduction: "",
        variant: "",
        nosRejection: ""
    });

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    useEffect(() => {
        setLoaded(true);
        listCustomer();
    }, []);

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

    const adddprreport = async (e: any) => {
        e.preventDefault();
        setIsLoading(true);
       console.log("formData ->>>",formData);
        try {
            const response = await fetch(ADD_DPR_REPORTS_API, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${utoken}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    oa_no: formData["OA No"],
                    company_name: formData.company,
                    report_no: formData.reportNo,
                    shift: formData.shift,
                    date: formData.date,
                    production_wp: formData["Production Watt Power"],
                    production_nos: formData.nosProduction,
                    variant: formData.Variant,
                    rejection_nos: formData.nosRejection
                })
            });

            const data = await response.json();

            if (data.Status === 0) {
                setIsLoading(false);
            } else if (data.Status === 1) {
                toast.success(data.Message);
                navigate("/reports/DPR");
                setIsLoading(false);
            }
        } catch (error) {
            console.error("Error fetching sections:", error);
            setIsLoading(false);
        }
    }

    return (
        <div className="container">
            <div className="left-container">
                <h1 style={{ fontWeight: 'bold', fontSize: 16, color: '#000' }}>Add DPR Report</h1>
                <div className="border border-stroke bg-white shadow-default p-6.5">
                    <form onSubmit={adddprreport}>
                        {[
                            ["reportNo", "date", "shift"],
                            ["OA No", "company"],
                            ["Production Watt Power", "nosProduction"],
                            ["Variant", "nosRejection"]
                        ].map((row, rowIndex) => (
                            <div key={rowIndex} className="mb-1 flex flex-col gap-6 xl:flex-row">
                                {row.map((field, colIndex) => (
                                    <div key={colIndex} className="w-full xl:w-1/2">
                                        <label className="mb-1 block text-black dark:text-white capitalize">
                                            {field == "OA No" ? "OA No" : field.replace(/([A-Z])/g, " $1").trim()}
                                        </label>
                                        {field === "shift" || field === "company" ? (
                                            <div className="relative z-20 bg-transparent dark:bg-form-input">
                                                <select
                                                    name={field}
                                                    value={formData[field]}
                                                    onChange={handleChange}
                                                    className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-1.5 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                                >
                                                    <option value="">Select Option</option>
                                                    {field === "shift"
                                                        ? ["Day", "Night"].map((option, idx) => (
                                                            <option key={idx} value={option}>{option}</option>
                                                        ))
                                                        : customer.map((custItem: any, idx: any) => (
                                                            <option key={idx} value={custItem.user_name}>
                                                                {custItem.user_name}
                                                            </option>
                                                        ))
                                                    }
                                                </select>
                                                <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
                                                    <FaChevronDown className="text-gray-500 dark:text-gray-400" />
                                                </span>
                                            </div>
                                        ) : (
                                            <input
                                                type={field === "date" ? "date" : (field === "reportNo" || field === "Variant") ? "text" : "number"}
                                                name={field}
                                                placeholder={field}
                                                value={formData[field]}
                                                onChange={handleChange}
                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-1.5 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        ))}
                        <div className="mt-6">
                            <button
                                type="submit"
                                className="w-full rounded bg-primary py-2.5 px-5 text-white hover:bg-primary-dark"
                                disabled={isLoading}
                            >
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
                    </form>
                </div>
            </div>
        </div>
    );
}
