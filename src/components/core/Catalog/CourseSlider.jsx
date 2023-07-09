import React from "react";

import { Pagination, Autoplay, FreeMode } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/pagination";

import CourseCard from "./CourseCard";

const CourseSlider = ({ Courses }) => {
    // you must include atleast twice the no of swipersliders to that of slidesPerView to make it work
    let test_arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 10];

    return (
        <>
            {/* for testing */}
            {/* <h2 className="text-white">Tersting Swiper </h2>
            <Swiper
                slidesPerView={5}
                // slidesPerView={3} // not working for 3 find out why
                spaceBetween={24}
                loop={true}
                autoplay={{
                    delay: 1000,
                    disableOnInteraction: false,
                }}
                modules={[FreeMode, Pagination, Autoplay]}
                className="max-h-[30rem] mb-4"
            >
                {test_arr?.map((ele, i) => (
                    <SwiperSlide key={i}>
                        <div className="bg-black grid place-items-center h-[250px] w-[250px] overflow-hidden text-white">
                            <p>testing {ele}</p>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper> */}




            {Courses?.length ? (
                <Swiper
                    slidesPerView={3}
                    // slidesPerView={3} // not working for 3 find out why
                    spaceBetween={24}
                    loop={true}
                    autoplay={{
                        delay: 1000,
                        disableOnInteraction: false,
                    }}
                    modules={[FreeMode, Pagination, Autoplay]}
                    className="max-h-[30rem]"
                >
                    {Courses?.map((course, i) => (
                        <SwiperSlide key={i}>
                            <CourseCard course={course} Height={"h-[250px]"} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            ) : (
                <p className="text-xl text-richblack-5">No Course Found</p>
            )}
        </>
    );
};

export default CourseSlider;
