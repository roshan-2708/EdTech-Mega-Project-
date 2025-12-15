import React, { useState } from 'react'
import { HomePageExplore } from '../../../data/homepage-explore'
import HighlighText from './HighlighText';
import CourseCard from './CourseCards';

const tabsName = [
    'Free',
    "New to coding",
    "Most popular",
    "Skill paths",
    "Career paths"
]

const ExploreMore = () => {

    const [currentTab, setCurrentTab] = useState(tabsName[0]);

    // IMPORTANT: Make sure to load an ARRAY
    const [Course, setCourses] = useState(HomePageExplore[0].courses);

    const [currentCard, setCurrentCard] = useState(
        HomePageExplore[0].courses[0].heading
    );

    const setMyCard = (value) => {
        setCurrentTab(value);

        const result = HomePageExplore.filter((course) => course.tag === value);

        setCourses(result[0].courses);
        setCurrentCard(result[0].courses[0].heading);
    };

    return (
        <div className="w-full px-4 mt-10 md:px-8 lg:px-0">
            {/* Heading */}
            <div className="text-center w-full">
                <h1 className="font-semibold text-3xl md:text-4xl leading-snug">
                    Unlock the <HighlighText text="Power of Code" />
                </h1>

                <p className="text-richblack-300 text-sm md:text-base font-medium mt-3">
                    Learn to Build Anything You Can Imagine
                </p>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-3 bg-richblack-700 p-2 rounded-xl w-fit mx-auto my-8">
                {tabsName.map((ele, idx) => (
                    <button
                        key={idx}
                        onClick={() => setMyCard(ele)}
                        className={`px-4 py-2 rounded-3xl text-sm transition-all duration-200
                    ${currentTab === ele
                                ? "bg-richblack-900 text-white shadow-md"
                                : "bg-richblack-600 text-richblack-200 hover:bg-richblack-500"
                            }`}
                    >
                        {ele}
                    </button>
                ))}
            </div>

            {/* COURSE CARDS */}
            <div className="w-full mt-12 flex justify-center">
                <div
                    className="
            w-full max-w-6xl
            grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
            gap-6 md:gap-8
            place-items-center
        "
                >
                    {Course.map((ele, idx) => (
                        <CourseCard
                            key={idx}
                            cardData={ele}
                            currentCard={currentCard}
                            setCurrentCard={setCurrentCard}
                        />
                    ))}
                </div>
            </div>
        </div>

    )
}

export default ExploreMore
