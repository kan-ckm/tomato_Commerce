import React, { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import SummaryApi from '../common';
import loginicon from '../assest/profile.gif';
import moment from 'moment';
const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [tokenFromServer, setTokenFromServer] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [expiresAt, setExpiresAt] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);

  const navigate = useNavigate();

  const handleSendEmail = async (e) => {
    e.preventDefault();
    const response = await fetch(SummaryApi.userForgotPassword.url, {
      method: SummaryApi.userForgotPassword.method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await response.json();
      console.log('Response data:', data);
    if (data.success) {
      toast.success(data.message);
      setExpiresAt(data.expiresAt);
       console.log('expiresAt from server:', data.expiresAt);
      setStep(2);
    } else {
      toast.error(data.message);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    const response = await fetch(SummaryApi.checkCode.url, {
      method: SummaryApi.checkCode.method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code })
    });
    const data = await response.json();
    if (data.success) {
      toast.success("Verification successful!");
      setTokenFromServer(data.token);
      setExpiresAt(data.expiresAt);
      setStep(3);
    } else {
      toast.error(data.message || "Incorrect verification code.");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    const response = await fetch(SummaryApi.userResetPassword.url, {
      method: SummaryApi.userResetPassword.method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: tokenFromServer,
        newPassword
      })
    });
    const data = await response.json();
    if (data.success) {
      toast.success("Password has been successfully updated!");
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } else {
      toast.error(data.message || "Something went wrong.");
    }
  };

useEffect(() => {
  if (!expiresAt) return;

  const expireDate = new Date(expiresAt);
  const interval = setInterval(() => {
    const now = new Date();
    const secondsLeft = Math.max(0, Math.floor((expireDate - now) / 1000));
    setTimeLeft(secondsLeft);

    if (secondsLeft <= 0) {
      clearInterval(interval);
      toast.error("The verification code has expired. Please resend the email.");
    }
  }, 1000);

  const initialSecondsLeft = Math.max(0, Math.floor((expireDate - new Date()) / 1000));
  setTimeLeft(initialSecondsLeft);

  return () => clearInterval(interval);
}, [expiresAt]);

const formattedTimeLeft = moment.utc(timeLeft * 1000).format('mm:ss');
  return (
    <section id="forgot-password">
      <div className="mx-auto container p-4">
        <div className="bg-white p-5 w-full max-w-sm mx-auto rounded-lg shadow-md">
          <div className="w-20 h-20 mx-auto relative overflow-hidden rounded-full">
            <img src={loginicon} alt="icon" />
          </div>

          {step === 1 && (
            <form className="pt-6 flex flex-col gap-3" onSubmit={handleSendEmail}>
              <div className="grid">
                <label className="ml-2">Email:</label>
                <div className="bg-slate-100 p-2 rounded-full">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-transparent outline-none"
                  />
                </div>
              </div>
              <button className="bg-gray-800 hover:bg-yellow-400 hover:text-black text-white px-6 py-2 rounded-full transition mx-auto mt-4">
                Send code
              </button>
            </form>
          )}

          {step === 2 && (
            <form className="pt-6 flex flex-col gap-3" onSubmit={handleVerifyCode}>
              <div className="grid">
                <label className="ml-2">Verification code:</label>
                <div className="bg-slate-100 p-2 rounded-full">
                  <input
                    type="text"
                    placeholder="Enter the verification code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                    className="w-full bg-transparent outline-none"
                  />
                </div>
              </div>
              <button className="bg-gray-800 hover:bg-yellow-400 hover:text-black text-white px-6 py-2 rounded-full transition mx-auto mt-4">
                Verify
              </button>
              {timeLeft > 0 ? (
                <p className="text-center text-sm text-gray-500">
                  Code expires in: <span className="font-semibold">{formattedTimeLeft}s</span>
                </p>
              ) : (
                <p className="text-center font-medium text-sm text-red-500">
                  Code expired. Please go back and resend.
                </p>
              )}
              {timeLeft <= 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setCode('');
                    setTimeLeft(0);
                  }}
                  className="text-sm hover:no-underline font-semibold hover:text-yellow-400 mt-2"
                >
                  Resend code
                </button>
              )}
            </form>
          )}

          {step === 3 && (
            <form className="pt-6 flex flex-col gap-3" onSubmit={handleResetPassword}>
              <div className="grid">
                <label className="ml-2">New password:</label>
                <div className="bg-slate-100 p-2 rounded-full flex items-center justify-between">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="w-full bg-transparent outline-none"
                  />
                  <div
                    className="cursor-pointer text-lg ml-2"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                  >
                    {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                  </div>
                </div>
              </div>

              <div className="grid">
                <label className="ml-2">Confirm password:</label>
                <div className="bg-slate-100 p-2 rounded-full flex items-center justify-between">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full bg-transparent outline-none"
                  />
                  <div
                    className="cursor-pointer text-lg ml-2"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </div>
                </div>
              </div>

              <button className="bg-gray-800 hover:bg-yellow-400 hover:text-black text-white px-6 py-2 rounded-full transition mx-auto mt-4">
                Reset password
              </button>
            </form>
          )}

          <p className="my-4">
            Remembered your password?{" "}
            <Link to="/login" className="hover:no-underline hover:text-yellow-400">
              Login
            </Link>
          </p>
        </div>
      </div>
      <ToastContainer />
    </section>
  );
};

export default ForgotPassword;
