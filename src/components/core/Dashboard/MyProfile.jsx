import React from "react";
import { RiEditBoxLine } from "react-icons/ri";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { formattedDate } from "../../../utils/dateFormatter";
import IconBtn from "../../common/IconBtn";

const MyProfile = () => {
    const { user } = useSelector((state) => state.profile);
    const navigate = useNavigate();
    return (
        <div className="text-richblack-5">
            <h1 className="mb-10 text-3xl text-center font-medium text-richblack-5">
                My profile
            </h1>
            <div className="flex items-center justify-between border-richblack-700 bg-richblack-800 rounded-md p-8 border-[1px]">
                <div className="flex items-center gap-x-4">
                    <img
                        className="aspect-square w-[78px] rounded-full object-cover"
                        src={user?.image}
                        alt={`profile-${user?.firstName}`}
                    />
                    <div className="space-y-2">
                        <p className="text-lg font-semibold">
                            {user?.firstName + " " + user.lastName}
                        </p>
                        <p className="text-sm text-richblack-300">
                            {user?.email}
                        </p>
                    </div>
                </div>
                <IconBtn
                    text="Edit"
                    onclick={() => navigate("/dashboard/settings")}
                >
                    <RiEditBoxLine />
                </IconBtn>
            </div>

            {/* section 2 */}
            <div className="my-10 bg-richblack-800 p-8 border-[1px] border-richblack-700 rounded-md">
                <div className="flex w-full justify-between items-center">
                    <p className="text-lg font-semibold">About</p>
                    <IconBtn
                        text="Edit"
                        onclick={() => navigate("/dashboard/settings")}
                    >
                        <RiEditBoxLine />
                    </IconBtn>
                </div>
                <p
                    className={`${
                        user?.additionalDetails?.about
                            ? "text-richblack-5"
                            : "text-richblack-400"
                    } text-sm font-medium`}
                >
                    {user?.additionalDetails?.about
                        ? user?.additionalDetails?.about
                        : "Write something about yourself"}
                </p>
            </div>

            {/* Section 3 */}
            <div className="my-10 flex flex-col gap-y-10 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8">
                <div className="flex w-full items-center justify-between ">
                    <p className="text-lg font-semibold text-richblack-5">Personal Details</p>
                    <IconBtn
                        text="Edit"
                        onclick={() => navigate("/dashboard/settings")}
                    >
                        <RiEditBoxLine />
                    </IconBtn>
                </div>
                <div className="flex max-w-[500px] justify-between">
                    <div className="flex flex-col gap-y-5">
                        <div>
                            <p className="mb-1 text-sm text-richblack-600">
                                First Name
                            </p>
                            <p className="text-sm font-medium text-richblack-5">
                                {user?.firstName}
                            </p>
                        </div>
                        <div>
                            <p className="mb-1 text-sm text-richblack-600">
                                Email
                            </p>
                            <p className="text-sm font-medium text-richblack-5">
                                {user?.email}
                            </p>
                        </div>
                        <div>
                            <p className="mb-1 text-sm text-richblack-600">
                                Gender
                            </p>
                            <p className="text-sm font-medium text-richblack-5">
                                {user?.additionalDetails?.gender ??
                                    "Add Gender"}
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-y-5">
                        <div>
                            <p className="mb-1 text-sm text-richblack-600">
                                Last Name
                            </p>
                            <p className="text-sm font-medium text-richblack-5">
                                {user?.lastName}
                            </p>
                        </div>
                        <div>
                            <p className="mb-1 text-sm text-richblack-600">
                                Phone Number
                            </p>
                            <p className="text-sm font-medium text-richblack-5">
                                {user?.additionalDetails?.contactNumber ??
                                    "Add Contact Number"}
                            </p>
                        </div>
                        <div>
                            <p className="mb-1 text-sm text-richblack-600">
                                Date Of Birth
                            </p>
                            <p className="text-sm font-medium text-richblack-5">
                                {formattedDate(
                                    user?.additionalDetails?.dateOfBirth
                                ) ?? "Add Date Of Birth"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyProfile;
