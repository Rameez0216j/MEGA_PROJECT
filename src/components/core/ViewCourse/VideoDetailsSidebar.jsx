import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
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
                courseSectionData[currentSectionIndex]?.subSection?.[
                    currentSubSectionIndex
                ]?._id;

            //set current section here
            setActiveStatus(courseSectionData?.[currentSectionIndex]?._id);
            //set current sub-section here
            setVideoBarActive(activeSubSectionId);
        };
    }, [courseSectionData, courseEntireData, location.pathname]);

    const handleAddReview = () => {
        setReviewModal(true);
    };

    return (
        <>
            <div className="text-richblack-5">
                {/* for back and review buttons */}
                <div>
                    <div>
                        <div>
                            <div
                                onClick={() => {
                                    navigate("/dashboard/enrolled-courses");
                                }}
                            >
                                Back
                            </div>

                            <div>
                                <IconBtn
                                    text="Add Review"
                                    onclick={() => handleAddReview()}
                                />
                            </div>
                        </div>
                    </div>

                    {/* for courseName and completed videos track */}
                    <div>
                        <p>{courseEntireData?.courseName}</p>
                        <p>
                            {completedLectures?.length} / {totalNoOfLectures}
                        </p>
                    </div>
                </div>

                {/* for sections and subsections */}
                <div>
                    {courseSectionData.map((section, index) => (
                        // section
                        <div
                            onClick={() => setActiveStatus(section?._id)}
                            key={index}
                        >
                            <div>
                                <div>{section?.sectionName}</div>
                                <RiArrowDownSFill className={`${ activeStatus === section?._id ? "rotate-0" : "-rotate-90"} trasnsition-all duration-100`}/>
                            </div>

                            {/* subSections */}
                            <div>
                                {activeStatus === section?._id && (
                                    <div>
                                        {section.subSections.map(
                                            (topic, index) => (
                                                <div
                                                    onClick={() => {
                                                        navigate(
                                                            `/view-course/${courseEntireData?._id}/section/${section?._id}/sub-section/${topic?._id}`
                                                        );
                                                        setVideoBarActive(
                                                            topic?._id
                                                        );
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
                                            )
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default VideoDetailsSidebar;
