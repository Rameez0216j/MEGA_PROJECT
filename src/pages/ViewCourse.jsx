import React from "react";
import VideoDetailsSidebar from "../components/core/ViewCourse/VideoDetailsSidebar";
import { Outlet } from "react-router-dom";
import CourseReviewModal from "../components/core/ViewCourse/CourseReviewModal";
import { useState } from "react";
import { getFullDetailsOfCourse } from "../services/operations/courseDetailsAPI";
import {
    setCompletedLectures,
    setCourseSectionData,
    setEntireCourseData,
    setTotalNoOfLectures,
} from "../slices/viewCourseSlice";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const ViewCourse = () => {
    const [reviewModal, setReviewModal] = useState(false);
    const { courseId } = useParams();
    const { token } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    useEffect(() => {
        const setCourseSpecificDetails = async () => {
            const courseData = await getFullDetailsOfCourse(courseId, token);
            dispatch(
                setCourseSectionData(courseData.courseDetails.courseContent)
            );
            dispatch(setEntireCourseData(courseData.courseDetails));
            dispatch(setCompletedLectures(courseData.completedVideos));
            let lectures = 0;
            courseData?.courseDetails?.courseContent?.forEach((sec) => {
                lectures += sec.subSections.length;
            });
            dispatch(setTotalNoOfLectures(lectures));


            console.log("courseData : ",courseData)


        };
        setCourseSpecificDetails();
    }, []);

    return (
        <>
            <div className="relative flex min-h-[calc(100vh-3.5rem)]">
                <VideoDetailsSidebar setReviewModal={setReviewModal} />
                <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto">
                    <Outlet />
                </div>
                {reviewModal && (
                    <CourseReviewModal setReviewModal={setReviewModal} />
                )}
            </div>
        </>
    );
};

export default ViewCourse;
