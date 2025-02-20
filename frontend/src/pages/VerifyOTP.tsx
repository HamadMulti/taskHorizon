import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { verifyOTP, sendOTP } from "../features/authSlice";
import { AppDispatch } from "../app/store";
import { useNavigate } from "react-router-dom";

const VerifyOTP = () => {
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const dispatch = useDispatch<AppDispatch>();
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
    dispatch(verifyOTP(otp))
      .unwrap()
      .then(() => {
        navigate("/dashboard/tasks");
      });
      // .catch((error) => alert("Error verifying OTP: " + error.message));
  };

  const handleResendOTP = () => {
    setIsTimerActive(true);
    setTimer(60);
    dispatch(sendOTP())
      .unwrap()
      .then(() => {
        alert("New OTP sent!");
      }).catch((error) => alert("Error sending OTP: " + error.message));
  };

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
          <button type="submit" className="text-gray-800 w-full p-2 rounded bg-yellow-400 hover:bg-yellow-500 focus:outline-none pl-2 pr-8 py-3 outline-none">
            Verify
          </button>
        </form>

        <div className="text-center mt-4">
          {isTimerActive ? (
            <p className="text-sm text-gray-600">Resend OTP in {timer} seconds</p>
          ) : (
            <p className="text-sm text-blue-500 cursor-pointer" onClick={handleResendOTP}>
              Resend OTP
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
