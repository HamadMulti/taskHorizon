import { useState } from "react";
import { useDispatch } from "react-redux";
import { forgotPassword } from "../features/authSlice";
import { AppDispatch } from "../app/store";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(forgotPassword(email));
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-xl font-bold mb-4">Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 mb-3 border rounded" />
          <button type="submit" className="bg-blue-500 text-white w-full p-2 rounded">Send Reset Link</button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
