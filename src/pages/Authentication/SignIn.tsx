import { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../images/logo.jpg';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { LOGIN_API } from "../../Api/api.tsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignIn = () => {
  const navigate = useNavigate();

useEffect(() => {
  if (utoken) {
    navigate("/");
  }
  }, []);


  var utoken = localStorage.getItem('workspaceuserToken');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errortext, setErrortext] = useState('');

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const [formData, setFormData] = useState<any>({
    device_type: 'Web',
    device_id: 123,
    device_token: 'abc'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData: any) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const login = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    setErrortext(''); // Clear previous errors
    try {
      const response = await fetch(LOGIN_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.Status === 0) {
        setErrortext(data.Message);
        setIsLoading(false);
      } else if (data.Status === 1) {
        //console.log(data.info);
        localStorage.setItem('workspaceuserToken', data.UserToken);
        localStorage.setItem('workspaceuser_role', data.info.user_role);
        localStorage.setItem('workspacesub_role', data.info.sub_role);
        localStorage.setItem('workspaceuser_name', data.info.user_name);
        toast.success(data.Message);
        navigate('/');
      }
    } catch (error) {
      console.error("Error login API:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white p-8 shadow-xl dark:bg-gray-800">
        <div className="text-center">
          <img
            src={Logo}
            alt="Logo"
            className="mx-auto w-60 mb-4"
          />
        </div>

        <form onSubmit={login} className="mt-8">
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              name='email_id'
              onChange={handleChange}
              placeholder="Enter your email"
              className="input-field"
              required
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Password
            </label>
            <div className="relative flex items-center mt-1">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name='password'
                onChange={handleChange}
                placeholder="Enter your password"
                className="input-field w-full pr-10 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                required
              />
              <div
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-3 flex items-center justify-center text-gray-500 cursor-pointer"
              >
                {showPassword ? (
                  <FaEyeSlash className="w-5 h-5" />
                ) : (
                  <FaEye className="w-5 h-5" />
                )}
              </div>
            </div>
            {errortext && (
              <p style={{ color: 'red' }} className="mt-2 text-sm text-red-600">{errortext}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center rounded-lg bg-primary p-3 text-sm font-medium text-white transition hover:bg-primary/90 focus:outline-none focus:ring focus:ring-primary/40"
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
              'Sign In'
            )}
          </button>
        </form>
        {/* <ToastContainer /> */}
      </div>
    </div>
  );
};

export default SignIn;
