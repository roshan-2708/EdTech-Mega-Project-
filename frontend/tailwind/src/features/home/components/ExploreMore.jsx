import React, { useState } from 'react';
import { HomePageExplore } from '../../../data/homepage-explore';
import HighlighText from './HighlightText';
import CourseCard from './CourseCards';

const tabsName = [
    'Free',
    'New to coding',
    'Most popular',
    'Skill paths',
    'Career paths',
];

const ExploreMore = () => {
    const [currentTab, setCurrentTab] = useState(tabsName[0]);
    const [courses, setCourses] = useState(HomePageExplore[0]?.courses || []);
    const [currentCard, setCurrentCard] = useState(
        HomePageExplore[0]?.courses?.[0]?.heading || ''
    );

    const setMyCard = (value) => {
        setCurrentTab(value);
        const result = HomePageExplore.find((course) => course.tag === value);

        if (result && result.courses?.length > 0) {
            setCourses(result.courses);
            setCurrentCard(result.courses[0].heading);
        }
    };

    return (
        <section className="relative w-full px-4 pt-14 pb-20 md:px-8">
            {/* Background Subtle Radial Glow */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-blue-500/10 blur-[130px] rounded-sm"
            />

            {/* Heading Section */}
            <div className="relative z-10 text-center max-w-2xl mx-auto space-y-3">
                <h2 className="font-bold text-3xl sm:text-4xl lg:text-5xl text-richblack-5 tracking-tight">
                    Unlock the <HighlighText text="Power of Code" />
                </h2>
                <p className="text-richblack-300 text-sm sm:text-base font-normal">
                    Learn to Build Anything You Can Imagine
                </p>
            </div>

            {/* Modern Floating Pill Tabs */}
            <div className="relative z-10 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 bg-richblack-800/80 backdrop-blur-md border border-richblack-700 p-1.5 rounded-sm w-fit mx-auto mt-8 mb-12 shadow-inner">
                {tabsName.map((tab) => {
                    const isActive = currentTab === tab;
                    return (
                        <button
                            key={tab}
                            type="button"
                            onClick={() => setMyCard(tab)}
                            className={`px-4 sm:px-5 py-2 rounded-sm text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${isActive
                                    ? 'bg-richblack-900 text-richblack-5 shadow-lg border border-richblack-700 font-semibold'
                                    : 'text-richblack-300 hover:text-richblack-50 hover:bg-richblack-700/50'
                                }`}
                        >
                            {tab}
                        </button>
                    );
                })}
            </div>

            {/* Course Cards Grid */}
            <div className="relative z-10 w-full max-w-6xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 justify-items-center">
                    {courses.map((course, idx) => (
                        <CourseCard
                            key={`${course.heading}-${idx}`}
                            cardData={course}
                            currentCard={currentCard}
                            setCurrentCard={setCurrentCard}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ExploreMore;