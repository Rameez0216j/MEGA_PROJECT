import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { login } from "../../../services/operations/authAPI"

const LoginForm = ({ setIsLoggedIn }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const { email, password } = formData;
    const [showPassword, setShowPassword] = useState(false);

    function changeHandler(event) {
        setFormData((prev) => ({
            ...prev,
            [event.target.name]: event.target.value,
        }));
    }

    function submitHandler(event) {
        event.preventDefault();
        dispatch(login(email,password,navigate));
    }

    return (
        <form onSubmit={submitHandler}
        className="flex flex-col w-full gap-y-4 mt-6">
            <label className='w-full'>
                <p className='text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]'>Email Address <span className='text-pink-200'>*</span></p>
                <input
                    required
                    type="email"
                    name="email"
                    value={formData.email}
                    placeholder="Enter your email id"
                    onChange={changeHandler}
                    className='bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[12px]'
                />
            </label>


            <label className='w-full relative'>
            <p className='text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]'>Password <span className='text-pink-200'>*</span></p>
                <input
                    required
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    placeholder="Enter your password"
                    onChange={changeHandler}
                    className='bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[12px]'
                />

				{/* () => setShowPassword((prev) => !prev)   This caused error last time as setShowPassword((prev) => !prev) */}
                <span 
                className='absolute right-3 top-[38px] cursor-pointer'
                onClick={() => setShowPassword((prev) => !prev)}>
                    {showPassword ? (
                        <AiOutlineEyeInvisible fontSize={24} fill='#AFB2BF'/>
                    ) : (
                        <AiOutlineEye fontSize={24} fill='#AFB2BF'/>
                    )}
                </span>

                <Link to="/forgot-password">
                    {/* ml-auto sets all the content to right */}
                <p className='text-xs mt-3 text-blue-100 max-w-max ml-auto'>
                    Forgot Password
                </p>
                </Link>
            </label>
			<button
            className='bg-yellow-50 rounded-[8px] font-medium text-richblack-900 px-[12px] py-[8px] mt-6'>Sign In</button>
        </form>
    );
};

export default LoginForm;
