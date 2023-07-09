import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import IconBtn from "../../common/IconBtn";
import { RiArrowDownSFill } from "react-icons/ri";

const VideoDetailsSidebar = ({ setReviewModal }) => {
    //for current section
    const [activeStatus, setActiveStatus] = useState("");
    //for current sub-section
    const [videoBarActive, setVideoBarActive] = useState("");

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    const { sectionId, subSectionId } = useParams();
    const {
        courseSectionData,
        courseEntireData,
        totalNoOfLectures,
        completedLectures,
    } = useSelector((state) => state.viewCourse);

    useEffect(() => {
        const setActiveFlags = () => {
            if (!courseSectionData.length) return;
            const currentSectionIndex = courseSectionData.findIndex(
                (data) => data._id === sectionId
            );
            const currentSubSectionIndex = courseSectionData[
                currentSectionIndex
            ]?.subSections.findIndex((data) => data._id === subSectionId);

            const activeSubSectionId =
                courseSectionData[currentSectionIndex]?.subSections?.[
                    currentSubSectionIndex
                ]?._id;

            //set current section here
            setActiveStatus(courseSectionData?.[currentSectionIndex]?._id);
            //set current sub-section here
            setVideoBarActive(activeSubSectionId);
        };
        setActiveFlags();
    }, [courseSectionData, courseEntireData, location.pathname]);

    const handleAddReview = () => {
        setReviewModal(true);
    };

    return (
        <>
            <div className="flex h-[calc(100vh-3.5rem)] w-[320px] max-w-[350px] flex-col border-r-[1px] border-r-richblack-700 bg-richblack-800">
                {/* for back and review buttons */}
                <div className="mx-5 flex flex-col items-start justify-between gap-2 gap-y-4 border-b border-richblack-600 py-5 text-lg font-bold text-richblack-25">
                    <div className="flex w-full items-center justify-between ">
                        <div
                            onClick={() => {
                                navigate("/dashboard/enrolled-courses");
                            }}
                            className="flex h-[35px] w-[35px] items-center justify-center rounded-full bg-richblack-100 p-1 text-richblack-700 hover:scale-90"
                            title="back"
                        >
                            <IoIosArrowBack size={30} />
                        </div>

                        <IconBtn
                            text="Add Review"
                            onclick={() => handleAddReview()}
                        />
                    </div>

                    {/* for courseName and completed videos track */}
                    <div className="flex flex-col">
                        <p>{courseEntireData?.courseName}</p>
                        <p className="text-sm font-semibold text-richblack-500 mt-2">
                            {completedLectures?.length} / {totalNoOfLectures}
                        </p>
                    </div>
                </div>

                {/* for sections and subsections */}
                <div className="h-[calc(100vh - 5rem)] overflow-y-auto">
                    {courseSectionData.map((section, index) => (
                        // section
                        <div
                            className="mt-2 cursor-pointer text-sm text-richblack-5"
                            onClick={() => setActiveStatus(section?._id)}
                            key={index}
                        >
                            <div className="flex flex-row justify-between bg-richblack-600 px-5 py-4">
                                <div className="w-[70%] font-semibold">
                                    {section?.sectionName}
                                </div>
                                <RiArrowDownSFill
                                    className={`${
                                        activeStatus === section?._id
                                            ? "rotate-0"
                                            : "-rotate-90"
                                    } trasnsition-all duration-100`}
                                />
                            </div>

                            {/* subSections */}
                            {activeStatus === section?._id && (
                                <div className="transition-[height] duration-500 ease-in-out">
                                    {section.subSections.map((topic, index) => (
                                        <div
                                            className={`flex gap-3  px-5 py-2 ${
                                                videoBarActive === topic._id
                                                    ? "bg-yellow-200 font-semibold text-richblack-800"
                                                    : "hover:bg-richblack-900"
                                            } `}
                                            onClick={() => {
                                                navigate(
                                                    `/view-course/${courseEntireData?._id}/section/${section?._id}/sub-section/${topic?._id}`
                                                );
                                                setVideoBarActive(topic?._id);
                                            }}
                                            key={index}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={completedLectures.includes(
                                                    topic?._id
                                                )}
                                                onChange={() => {}}
                                            />
                                            <span>{topic.title}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default VideoDetailsSidebar;
