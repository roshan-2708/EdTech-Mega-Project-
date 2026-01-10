import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { Navigation, Pagination } from "swiper/modules";
import Course_Card from "../components/catalog/Course_Card";

const CourseSlider = ({ Courses }) => {
    if (!Courses || Courses.length === 0) {
        return <p className="text-richblack-300">No Course Found</p>;
    }

    return (
        <div className="relative">
            <Swiper
                modules={[Navigation, Pagination]}
                navigation
                pagination={{ clickable: true }}
                slidesPerView="auto"   // 🔥 KEY FIX
                spaceBetween={24}
                className="pb-10"
            >
                {Courses.map((course) => (
                    <SwiperSlide
                        key={course._id}
                        className="!w-auto flex justify-center"
                    >
                        <Course_Card course={course} Height="h-[150px]" />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default CourseSlider;
