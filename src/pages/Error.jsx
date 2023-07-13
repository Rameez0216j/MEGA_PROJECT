import React from "react";
import error from "../assets/Images/page-not-found.svg"

const Error = () => {
    return (
        <div className="flex justify-center items-center text-richblack-5 min-h-[80vh]">
            <div className="flex-col justify-center items-center">
                <div className="">
                    <img
                        src={error}
                        alt="Something went wrong"
                        className="h-[400px]"
                    />
                </div>
                <div className="flex flex-col items-center">
                    <h1 className="text-2xl font-semibold">404 Page Not Found</h1>
                    <a className="px-10 text-xl hover:scale-95 transition-all duration-200 py-2 rounded-md font-semibold my-6 text-richblack-300 border border-richblack-400 hover:bg-yellow-50 hover:text-richblack-900" href="/">
                        Back to home
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Error;
