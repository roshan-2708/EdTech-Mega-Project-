import React from 'react'
import { Swiper, SwiperSlide } from "swiper/react";
import { useRef } from 'react';
import "swiper/css";
import "swiper/css/free-mode"
import "swiper/css/pagination";
import { FreeMode } from 'swiper'
import Course_Card from '../components/catalog/Course_Card';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
const CourseSlider = ({ Courses }) => {
    const progressCircle = useRef(null);
    const progressContent = useRef(null);
    const onAutoplayTimeLeft = (s, time, progress) => {
        progressCircle.current.style.setProperty('--progress', 1 - progress);
        progressContent.current.textContent = `${Math.ceil(time / 1000)}s`;
    };
    return (
        <div>
            {Courses?.length > 0 ? (
                <Swiper
                    spaceBetween={30}
                    centeredSlides={true}
                    autoplay={{
                        delay: 2500,
                        disableOnInteraction: false,
                    }}
                    pagination={{ clickable: true }}
                    navigation={true}
                    modules={[Autoplay, Pagination, Navigation]}
                    className="mySwiper"
                >
                    {Courses.map((course) => (
                        <SwiperSlide key={course._id}>
                            <Course_Card
                                course={course}
                                Height="h-[250px]"
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            ) : (
                <p>No Course Found</p>
            )}
        </div>
    )
}

export default CourseSlider
