import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const VerifyOTP = () => {
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const { handleSendOTP, handleVerifyOTP, handleLogout, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isTimerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsTimerActive(false);
    }

    return () => clearInterval(interval);
  }, [isTimerActive, timer]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleVerifyOTP(otp)
      .then(() => {
        navigate("/dashboard/projects");
      })
      .catch((error) => {
        alert("Error verifying OTP: " + error.error);
        navigate(0);
      });
  };

  const handleResendOTP = () => {
    setIsTimerActive(true);
    setTimer(60);
    handleSendOTP()
      .then(() => {
        alert("New OTP sent!");
      })
      .catch((error) => {
        alert("Error sending OTP: " + error.error);
        navigate(0);
      });
  };

  const logout = () => {
    handleLogout();
    navigate("/login")
    navigate(0);
  }

  return (
    <div className="flex justify-center items-center h-screen bg-[#0C172C]">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-xl font-bold mb-4">Verify OTP</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full p-2 mb-3 rounded border border-gray-300 focus:border-yellow-400"
          />
          <div className="min-w-full flex justify-between items-center gap-4 py-2">
            <button
              type="button"
              onClick={logout}
              className="text-gray-800 w-full p-2 rounded bg-red-500 hover:bg-red-700 focus:outline-none pl-2 pr-8 py-3 outline-none"
            >
              Logout
            </button>
            <button
              type="submit"
              className="text-gray-800 w-full p-2 rounded bg-yellow-400 hover:bg-yellow-500 focus:outline-none pl-2 pr-8 py-3 outline-none"
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
                "Verify"
              )}
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          {isTimerActive ? (
            <p className="text-sm text-gray-600">
              Resend OTP in {timer} seconds
            </p>
          ) : (
            <button
              className="text-sm text-gray-500 hover:text-gray-800 cursor-pointer border-none"
              onClick={handleResendOTP}
              disabled={loading || isTimerActive}
            >
              Resend OTP
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
