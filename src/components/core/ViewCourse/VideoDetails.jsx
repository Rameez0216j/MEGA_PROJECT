import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { markLectureAsComplete } from "../../../services/operations/courseDetailsAPI";
import { updateCompletedLectures } from "../../../slices/viewCourseSlice";
import { Player } from "video-react";
import "video-react/dist/video-react.css";
import { AiFillPlayCircle } from "react-icons/ai";
import IconBtn from "../../common/IconBtn";

const VideoDetails = () => {
    const { courseId, sectionId, subSectionId } = useParams();
    console.log(courseId, sectionId, subSectionId);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const playerRef = useRef();
    const { token } = useSelector((state) => state.auth);
    const { courseSectionData, courseEntireData, completedLectures } =
        useSelector((state) => state.viewCourse);

    const [videoData, setVideoData] = useState([]);
    const [previewSource, setPreviewSource] = useState("");
    const [videoEnded, setVideoEnded] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const setVideoSpecificDetails = async () => {
            if (!courseSectionData.length) return;
            if (!courseId && !sectionId && !subSectionId) {
                navigate("/dashboard/enrolled-courses");
            } else {
                //let's assume that all 3 fields are present
                // console.log("Filtered data here : ",courseSectionData)
                const filteredData = courseSectionData.filter(
                    (section) => section._id === sectionId
                );
                // console.log("Filtered data here up : ",filteredData)
                const filteredVideoData = filteredData[0]?.subSections.filter(
                    (data) => data._id === subSectionId
                );

                console.log("Filtered data here : ", filteredVideoData);
                setVideoData(filteredVideoData[0]);
                setPreviewSource(courseEntireData.thumbnail);
                setVideoEnded(false);
            }
        };
        setVideoSpecificDetails();
    }, [courseSectionData, courseEntireData, location.pathname]);

    const isFirstVideo = () => {
        const currentSectionIndex = courseSectionData.findIndex(
            (data) => data._id === sectionId
        );

        const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSections.findIndex((data) => data._id === subSectionId);

        if (currentSectionIndex === 0 && currentSubSectionIndex === 0) {
            return true;
        } else {
            return false;
        }
    };

    // go to the next video
    const goToNextVideo = () => {
        const currentSectionIndex = courseSectionData.findIndex(
            (data) => data._id === sectionId
        );

        const noOfSubsections =
            courseSectionData[currentSectionIndex].subSections.length;

        const currentSubSectionIndex = courseSectionData[
            currentSectionIndex
        ].subSections.findIndex((data) => data._id === subSectionId);

        // console.log("no of subsections", noOfSubsections)

        if (currentSubSectionIndex !== noOfSubsections - 1) {
            const nextSubSectionId =
                courseSectionData[currentSectionIndex].subSections[
                    currentSubSectionIndex + 1
                ]._id;
            navigate(
                `/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`
            );
        } else {
            // for last video there is no next button visible
            const nextSectionId =
                courseSectionData[currentSectionIndex + 1]._id;
            const nextSubSectionId =
                courseSectionData[currentSectionIndex + 1].subSections[0]._id;
            navigate(
                `/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubSectionId}`
            );
        }
    };

    // check if the lecture is the last video of the course
    const isLastVideo = () => {
        const currentSectionIndex = courseSectionData.findIndex(
            (data) => data._id === sectionId
        );

        const noOfSubsections =
            courseSectionData[currentSectionIndex].subSections.length;

        const currentSubSectionIndex = courseSectionData[
            currentSectionIndex
        ].subSections.findIndex((data) => data._id === subSectionId);

        if (
            currentSectionIndex === courseSectionData.length - 1 &&
            currentSubSectionIndex === noOfSubsections - 1
        ) {
            return true;
        } else {
            return false;
        }
    };

    // go to the previous video
    const goToPrevVideo = () => {
        const currentSectionIndex = courseSectionData.findIndex(
            (data) => data._id === sectionId
        );

        const currentSubSectionIndex = courseSectionData[
            currentSectionIndex
        ].subSections.findIndex((data) => data._id === subSectionId);

        if (currentSubSectionIndex !== 0) {
            const prevSubSectionId =
                courseSectionData[currentSectionIndex].subSections[
                    currentSubSectionIndex - 1
                ]._id;
            navigate(
                `/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubSectionId}`
            );
        } else {
            const prevSectionId =
                courseSectionData[currentSectionIndex - 1]._id;
            const prevSubSectionLength =
                courseSectionData[currentSectionIndex - 1].subSections.length;
            const prevSubSectionId =
                courseSectionData[currentSectionIndex - 1].subSections[
                    prevSubSectionLength - 1
                ]._id;
            navigate(
                `/view-course/${courseId}/section/${prevSectionId}/sub-section/${prevSubSectionId}`
            );
        }
    };

    const handleLectureCompletion = async () => {
        setLoading(true);
        const res = await markLectureAsComplete(
            { courseId: courseId, subSectionId: subSectionId },
            token
        );
        if (res) {
            dispatch(updateCompletedLectures(subSectionId));
        }
        setLoading(false);
    };

    return (
        <div>
            {!videoData ? (
                <div>No Video Available</div>
            ) : (
                <Player
                    ref={playerRef}
                    aspectRatio="16:9"
                    playsInline
                    onEnded={() => setVideoEnded(true)}
                    src={videoData?.videoUrl}
                >
                    <AiFillPlayCircle />

                    {videoEnded && (
                        <div>
                            {!completedLectures.includes(subSectionId) && (
                                <IconBtn
                                    disabled={loading}
                                    onclick={() => handleLectureCompletion()}
                                    text={
                                        !loading
                                            ? "Mark as completed"
                                            : " Loading..."
                                    }
                                />
                            )}

                            <IconBtn
                                disabled={loading}
                                onclick={() => {
                                    if (playerRef?.current) {
                                        playerRef.current?.seek(0);
                                        setVideoEnded(false);
                                    }
                                }}
                                text="Rewatch"
                                customClasses="text-xl"
                            />


                            {/* Previous and next button */}
                            <div>
                                {!isFirstVideo() && (
                                    <button
                                        disabled={loading}
                                        onClick={goToPrevVideo}
                                        className="blackButton"
                                    >
                                        Prev
                                    </button>
                                )}
                                {!isLastVideo() && (
                                    <button
                                        disabled={loading}
                                        onClick={goToNextVideo}
                                        className="blackButton"
                                    >
                                        Next
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </Player>
            )}
            <h1>
                {videoData?.title}
            </h1>
            <p>
                {videoData?.description}
            </p>
        </div>
    );
};

export default VideoDetails;
