import { useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import React from "react";

import { getPasswordResetToken } from "../services/operations/authAPI";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const handleOnSubmit = (event) => {
    event.preventDefault();
    dispatch(getPasswordResetToken(email, setEmailSent));
  };
  return (
    <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
      {loading ? (
        <div className="spinner"></div>
      ) : (
        <div className="max-w-[500px] p-4 lg:p-8">
          <h1 className="text-[1.875rem] font-semibold text-richblack-5">
            {!emailSent ? "Reset Your Password" : "Check your Email"}
          </h1>
          <p className="my-4 text-[1.125rem] leading-[1.625] text-richblack-100">
            {!emailSent
              ? "Have no fear. We'll email you instructions to reset your password. If you dont have access to your email we can try account recovery"
              : `We have sent the reset email to ${email}`}
          </p>
          <form onSubmit={handleOnSubmit}>
            {!emailSent && (
              <label className="w-full">
                <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                  Email Address
                  <sup className="text-pink-200">*</sup>
                </p>
                <input
                  type="email"
                  placeholder="Enter email address"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  className="bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[12px]"
                />
              </label>
            )}
            <button
            type="submit"
            className="mt-3 w-full rounded-[8px] bg-yellow-50 py-[12px] px-[12px] font-semibold text-richblack-900"
            >{!emailSent ? "Submit" : "Resend Mail"}</button>
          </form>
          <div className="mt-6 flex items-center justify-between">
            <Link to="/login">
              <p className="flex items-center gap-x-2 text-richblack-5">
                <BiArrowBack />
                Back To Login
              </p>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
