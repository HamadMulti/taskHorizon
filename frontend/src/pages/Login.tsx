import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const { handleLogin, loading } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };


const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  handleLogin(credentials)
    .then(() => navigate("/verify-otp"))
    .catch((e) => {
      const message = e.error || e.message || "Login failed";
      setError(message);
    });
};

useEffect(() => {
  if (error) {
    const timer = setTimeout(() => setError(""), 3000);
    return () => clearTimeout(timer);
  }
}, [error]);


  return (
    <div className="font-sans bg-white md:h-screen">
      <div className="grid md:grid-cols-2 items-center gap-8 h-full">
        <div className="max-md:order-1 flex items-center md:p-8 p-6 bg-[#0C172C] h-full lg:w-11/12 lg:ml-0">
          <form className="max-w-lg w-full mx-auto" onSubmit={handleSubmit}>
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-yellow-400">Sign in</h3>
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <div className="mt-8">
              <label className="text-white text-xs block mb-2">Email</label>
              <div className="relative flex items-center">
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full bg-transparent text-sm text-white border-b border-gray-300 focus:border-yellow-400 pl-2 pr-8 py-3 outline-none"
                  placeholder="Enter email"
                  value={credentials.email}
                  onChange={(e) =>
                    setCredentials({ ...credentials, email: e.target.value })
                  }
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#bbb"
                  stroke="#bbb"
                  className="w-[18px] h-[18px] absolute right-2"
                  viewBox="0 0 682.667 682.667"
                >
                  <defs>
                    <clipPath id="a" clipPathUnits="userSpaceOnUse">
                      <path d="M0 512h512V0H0Z" data-original="#000000"></path>
                    </clipPath>
                  </defs>
                  <g
                    clipPath="url(#a)"
                    transform="matrix(1.33 0 0 -1.33 0 682.667)"
                  >
                    <path
                      fill="none"
                      strokeMiterlimit="10"
                      strokeWidth="40"
                      d="M452 444H60c-22.091 0-40-17.909-40-40v-39.446l212.127-157.782c14.17-10.54 33.576-10.54 47.746 0L492 364.554V404c0 22.091-17.909 40-40 40Z"
                      data-original="#000000"
                    ></path>
                    <path
                      d="M472 274.9V107.999c0-11.027-8.972-20-20-20H60c-11.028 0-20 8.973-20 20V274.9L0 304.652V107.999c0-33.084 26.916-60 60-60h392c33.084 0 60 26.916 60 60v196.653Z"
                      data-original="#000000"
                    ></path>
                  </g>
                </svg>
              </div>
            </div>
            <div className="mt-8">
              <label className="text-white text-xs block mb-2">Password</label>
              <div className="relative flex items-center">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full bg-transparent text-sm text-white border-b border-gray-300 focus:border-yellow-400 pl-2 pr-8 py-3 outline-none"
                  placeholder="Enter password"
                  value={credentials.password}
                  onChange={(e) =>
                    setCredentials({ ...credentials, password: e.target.value })
                  }
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#bbb"
                  stroke="#bbb"
                  className="w-[18px] h-[18px] absolute right-2 cursor-pointer"
                  viewBox="0 0 128 128"
                  onClick={togglePasswordVisibility}
                >
                  <path
                    d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z"
                    data-original="#000000"
                  ></path>
                </svg>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 shrink-0 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-3 block text-sm text-white"
                >
                  Remember me
                </label>
              </div>
              <div>
                <Link
                  to="/forgot-password"
                  className="text-yellow-600 font-semibold text-sm hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            <div className="mt-8">
              <button
                type="submit"
                className="w-max shadow-xl py-3 px-6 text-sm text-gray-800 font-semibold rounded bg-yellow-400 hover:bg-yellow-500 focus:outline-none"
              >
                {loading ? (
                  <>
                    Loading
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18px"
                      fill="#fff"
                      className="ml-2 inline animate-spin"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 22c5.421 0 10-4.579 10-10h-2c0 4.337-3.663 8-8 8s-8-3.663-8-8c0-4.336 3.663-8 8-8V2C6.579 2 2 6.58 2 12c0 5.421 4.579 10 10 10z" />
                    </svg>
                  </>
                ) : (
                  "Login"
                )}
              </button>
              <p className="text-sm text-white mt-8">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-yellow-400 font-semibold hover:underline ml-1"
                >
                  Register here
                </Link>
              </p>
            </div>
          </form>
        </div>
        <div className="max-md:order-2 p-4">
          <img
            src="/auth/signin-image.webp"
            className="lg:max-w-[85%] w-full h-full aspect-square object-contain block mx-auto"
            alt="login image ..."
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
