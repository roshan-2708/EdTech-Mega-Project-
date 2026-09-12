import React from 'react';
import about1 from '../assets/images/about/aboutus1.webp';
import about2 from '../assets/images/about/aboutus2.webp';
import about3 from '../assets/images/about/aboutus3.webp';
import HighlightText from '../features/home/components/HighlightText';
import Footer from '../components/layout/Footer';
import FoundingStory from '../assets/images/about/FoundingStory.png';
import CTAButton from '../components/common/Button';
// import HighlightText from '../features/home/components/HighlightText';
import { SparklesIcon } from '@heroicons/react/24/outline';

const statsData = [
    { count: "5K", label: "Active Students" },
    { count: "10+", label: "Mentors" },
    { count: "200+", label: "Courses" },
    { count: "50+", label: "Awards" },
];

const learningGridData = [
    {
        order: 1,
        heading: "Curriculum Based on Industry Needs",
        description: "Save time and money! The curriculum is designed to be straightforward and aligned with real modern industry standards.",
    },
    {
        order: 2,
        heading: "Our Learning Methods",
        description: "Learn flexibly using hands-on code challenges, interactive reviews, and structured project milestones.",
    },
    {
        order: 3,
        heading: "Certification",
        description: "Get verified course certificates that tangibly stand out to tech recruiters during job hunting.",
    },
    {
        order: 4,
        heading: "Auto-grading & Reviews",
        description: "Get instant automated feedback and linting on your code exercises without waiting for mentor queues.",
    },
    {
        order: 5,
        heading: "Ready to Work",
        description: "Connected with 150+ hiring partners to fast-track your profile into developer roles post-completion.",
    },
];

const About = () => {
    return (
        <div className="flex flex-col items-center w-full min-h-screen bg-richblack-900 text-richblack-100 overflow-x-hidden">

            {/* Section 1: Hero Banner & Images */}
            <section className="relative w-full bg-richblack-900 pt-16 md:pt-20 pb-16">
                <div className="w-11/12 max-w-6xl mx-auto flex flex-col items-center text-center">

                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-50 text-xs font-semibold uppercase tracking-wider">
                        <SparklesIcon className="h-4 w-4" />
                        <span>About Us</span>
                    </div>

                    {/* Title */}
                    <h1 className="mt-6 text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl">
                        Driving Innovation in Online Education <br />
                        <HighlightText text="for a Brighter Future" />
                    </h1>

                    {/* Subtitle */}
                    <p className="mt-4 text-richblack-300 text-sm sm:text-base max-w-3xl leading-relaxed">
                        StudyNotion is at the forefront of driving practical transformation in tech education. We provide production-tested engineering roadmaps, collaborative sandboxes, and a thriving developer ecosystem.
                    </p>

                    {/* Triple Responsive Image Showcase */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6 mt-12 w-full max-w-5xl px-4">
                        {[about1, about2, about3].map((imgSrc, idx) => (
                            <div key={idx} className="relative w-full aspect-[4/3] sm:h-[260px]">

                                {/* Background White Accent Card */}
                                <div
                                    aria-hidden="true"
                                    className="absolute inset-0 bg-white rounded-sm shadow-lg -z-0"
                                />

                                {/* Foreground Image shifted Slightly Top & Left */}
                                <div className="relative w-full h-full -top-3 -left-3 rounded-sm overflow-hidden shadow-2xl border border-richblack-700/60 transition-transform duration-300 hover:-translate-x-1 hover:-translate-y-1 z-10">
                                    <img
                                        src={imgSrc}
                                        alt={`about-${idx + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-richblack-900/10 hover:bg-transparent transition-colors" />
                                </div>

                            </div>
                        ))}
                    </div>

                </div>
            </section>

            {/* Section 2: Quote Strip */}
            <section className="w-full border-y border-richblack-700/60 bg-richblack-800/50 py-16 px-4">
                <div className="max-w-5xl mx-auto text-center">
                    <blockquote className="text-xl sm:text-3xl font-semibold text-richblack-100 leading-snug tracking-tight">
                        "We are passionate about revolutionizing the way developers learn. Our platform{" "}
                        <HighlightText text="combines interactive tooling, rigorous mentorship," />{" "}
                        and an active peer community to build an empowering, job-ready journey."
                    </blockquote>
                </div>
            </section>

            {/* Section 3: Founding Story */}
            <section className="w-full py-20 px-4">
                <div className="w-11/12 max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">

                    <div className="w-full lg:w-1/2 space-y-5 text-left">
                        <h2 className="text-3xl sm:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-pink-400 to-caribbean-200">
                            Our Founding Story
                        </h2>
                        <p className="text-richblack-300 text-sm sm:text-base leading-relaxed">
                            Our journey started out of a shared frustration with fragmented tutorials and static video libraries. We realized that learning to build software requires immediate experimentation, context-rich debugging, and practical problem-solving.
                        </p>
                        <p className="text-richblack-300 text-sm sm:text-base leading-relaxed">
                            We set out to bridge the gap between academic theory and actual tech employment standards, building a platform where learners tackle real engineering workflows from day one.
                        </p>
                    </div>

                    <div className="w-full lg:w-5/12 flex justify-center p-4">
                        <div className="relative w-full max-w-[460px] aspect-[4/3]">

                            {/* Background White Accent Card */}
                            <div
                                aria-hidden="true"
                                className="absolute inset-0 bg-white rounded-sm shadow-lg -z-0"
                            />

                            {/* Foreground Image shifted Slightly Top & Left */}
                            <div className="relative w-full h-full -top-3 -left-3 rounded-sm overflow-hidden shadow-2xl border border-richblack-700/60 transition-transform duration-300 hover:-translate-x-1 hover:-translate-y-1 z-10 bg-richblack-800">
                                <img
                                    src={FoundingStory}
                                    alt="Founding Story"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-richblack-900/10 hover:bg-transparent transition-colors" />
                            </div>

                        </div>
                    </div>

                </div>
            </section>

            {/* Section 4: Vision & Mission */}
            <section className="w-full pb-20 px-4">
                <div className="w-11/12 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">

                    <div className="p-8 rounded-sm bg-richblack-800/60 border border-richblack-700/60 flex flex-col gap-4 text-left">
                        <h3 className="text-xl sm:text-2xl font-bold text-yellow-50">
                            Our Vision
                        </h3>
                        <p className="text-richblack-300 text-sm sm:text-base leading-relaxed">
                            To construct a frictionless global campus where anyone with an internet connection can acquire world-class computational skills and lead impactful technical careers.
                        </p>
                    </div>

                    <div className="p-8 rounded-sm bg-richblack-800/60 border border-richblack-700/60 flex flex-col gap-4 text-left">
                        <h3 className="text-xl sm:text-2xl font-bold text-caribbean-200">
                            Our Mission
                        </h3>
                        <p className="text-richblack-300 text-sm sm:text-base leading-relaxed">
                            Equip students with production-grade instincts through active coding environments, direct mentorship channels, and collaborative open-source team builds.
                        </p>
                    </div>

                </div>
            </section>

            {/* Section 5: Key Metrics */}
            <section className="w-full bg-richblack-800 border-y border-richblack-700/60 py-14 px-4">
                <div className="w-11/12 max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {statsData.map((item, index) => (
                        <div key={index} className="flex flex-col items-center">
                            <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                                {item.count}
                            </span>
                            <span className="mt-1 text-xs sm:text-sm font-medium text-richblack-400">
                                {item.label}
                            </span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Section 6: Grid Features Showcase */}
            <section className="w-full py-20 px-4">
                <div className="w-11/12 max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                        {/* Main CTA Block (Spans 2 columns on desktop) */}
                        <div className="lg:col-span-2 p-8 rounded-sm bg-transparent flex flex-col justify-between items-start gap-6">
                            <div className="space-y-4">
                                <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                                    World-Class Learning for <br />
                                    <HighlightText text="Anyone, Anywhere" />
                                </h2>
                                <p className="text-richblack-300 text-sm sm:text-base leading-relaxed">
                                    StudyNotion pairs direct curriculum design with industry leaders to make high-value software education accessible to every aspiring builder.
                                </p>
                            </div>

                            <div className="w-fit">
                                <CTAButton active={true} linkto="/signup">
                                    Explore Catalog
                                </CTAButton>
                            </div>
                        </div>

                        {/* Feature Cards */}
                        {learningGridData.map((card, idx) => (
                            <div
                                key={idx}
                                className="p-6 rounded-sm bg-richblack-800/70 border border-richblack-700/60 flex flex-col justify-between transition-all duration-200 hover:border-richblack-600 hover:-translate-y-1"
                            >
                                <div>
                                    <h4 className="text-lg font-bold text-white mb-3">
                                        {card.heading}
                                    </h4>
                                    <p className="text-xs sm:text-sm text-richblack-300 leading-relaxed">
                                        {card.description}
                                    </p>
                                </div>
                            </div>
                        ))}

                    </div>
                </div>
            </section>

            {/* Global Footer */}
            <Footer />
        </div>
    );
};

export default About;