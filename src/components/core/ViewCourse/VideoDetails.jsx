import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { markLectureAsComplete } from "../../../services/operations/courseDetailsAPI";
import { updateCompletedLectures } from "../../../slices/viewCourseSlice";
import { Player } from "video-react";
import "video-react/dist/video-react.css";
import IconBtn from "../../common/IconBtn";
import { BigPlayButton } from "video-react";

const VideoDetails = () => {
    const { courseId, sectionId, subSectionId } = useParams();
    // console.log(courseId, sectionId, subSectionId);
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

                // console.log("Filtered data here new : ", filteredVideoData[0]);
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

        const currentSubSectionIndex = courseSectionData[
            currentSectionIndex
        ].subSections.findIndex((data) => data._id === subSectionId);

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
        console.log("I am inside handling function")
        const res = await markLectureAsComplete(
            { courseId: courseId, subSectionId: subSectionId },
            token
        )

        console.log("Result for mark as complete : ",res)
        if (res) {
            dispatch(updateCompletedLectures(subSectionId));
        }
        setLoading(false);
    };

    return (
        <div className="flex flex-col gap-5 text-white">
            {!videoData ? (
                <img
                    src={previewSource}
                    alt="Preview"
                    className="h-full w-full rounded-md object-cover"
                />
            ) : (
                <Player
                    ref={playerRef}
                    aspectRatio="16:9"
                    playsInline
                    onEnded={() => setVideoEnded(true)}
                    src={videoData?.videoUrl}
                >
                    <BigPlayButton position="center" />

                    {videoEnded && (
                        <div
                            style={{
                                backgroundImage:
                                    "linear-gradient(to top, rgb(0, 0, 0), rgba(0,0,0,0.7), rgba(0,0,0,0.5), rgba(0,0,0,0.1)",
                            }}
                            className="full absolute inset-0 z-[100] grid h-full place-content-center font-inter"
                        >
                            {!completedLectures.includes(subSectionId) && (
                                <IconBtn
                                    disabled={loading}
                                    onclick={() => handleLectureCompletion()}
                                    text={
                                        !loading
                                            ? "Mark as completed"
                                            : " Loading..."
                                    }
                                    customClasses="text-xl max-w-max px-4 mx-auto"
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
                                customClasses="text-xl max-w-max px-4 mx-auto mt-2"
                            />

                            {/* Previous and next button */}
                            <div className="mt-10 flex min-w-[250px] justify-center gap-x-4 text-xl">
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
            <h1 className="mt-4 text-3xl font-semibold text-center">{videoData?.title}</h1>
            <p className="pt-2 pb-6"> &nbsp; &nbsp;  &nbsp; &nbsp; {videoData?.description}</p>
        </div>
    );
};

export default VideoDetails;
