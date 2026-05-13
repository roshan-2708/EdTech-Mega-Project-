import React from 'react';
import { FaLongArrowAltRight } from "react-icons/fa";
import { Link } from 'react-router-dom';
import HighlighText from '../components/core/HomePage/HighlighText';
import ExploreMore from '../components/core/HomePage/ExploreMore';
import CTAButton from '../components/core/HomePage/Button';
import banner from '../assets/Images/banner.mp4'
import CodeBlocks from "../components/core/HomePage/Code";
import Footer from '../components/universal/Footer';
import TimeLineLogo from '../assets/Images/TimelineImage.png';
import Instructor from '../assets/Images/Instructor.png';
import Plan from '../assets/Images/Plan_your_lessons.png'
import Design from "../components/core/HomePage/Design";
import Know from '../assets/Images/Know_your_progress.svg'
import Compare from '../assets/Images/Compare_with_others.svg'
import { MdLeaderboard } from "react-icons/md";
import { FaGraduationCap } from "react-icons/fa";
import { FaGem } from "react-icons/fa";
import { FaCode } from "react-icons/fa";

const Home = () => {
    const token = localStorage.getItem('token');
    return (
        <div className='flex flex-col justify-center items-center'>

            {/* section-1 */}
            <div className="relative mx-auto flex flex-col w-11/12 items-center text-white justify-center ">

                <Link to={token !== null ? "/dashboard/my-profile" : "/login"}>
                    <div className="mt-16 p-1 mx-auto rounded-full bg-richblack-300 font-bold text-yellow-25
    w-fit cursor-pointer transition-all duration-300 
    shadow-md hover:shadow-xl hover:scale-95 group">
                        <div className="flex flex-row items-center gap-2 rounded-full px-10 py-[5px]
        transition-all duration-300 group-hover:bg-richblack-500">
                            <p>
                                {token !== null ? "Go to Dashboard" : "Become An Instructor"}
                            </p>
                            <FaLongArrowAltRight />
                        </div>
                    </div>
                </Link>

                <div className='text-center text-4xl font-semibold mt-8'>
                    Empower Your Future with <HighlighText text="Coding Skill" />
                </div>

                <div className='w-[50%] text-center text-sm font-bold text-richblack-100 mt-4'>
                    “Learn industry-ready skills from expert instructors. Build real-world projects, boost your career, and unlock new opportunities with flexible, high-quality courses designed to help you grow at your own pace.”
                </div>


                <div className='flex flex-row gap-7 mt-8'>
                    <CTAButton active={true} linkto={token !== null ? "/dashboard" : "/login"}>
                        Learn more
                    </CTAButton>
                    <CTAButton active={false} linkto={token !== null ? "/dashboard/my-profile" : "/login"}>
                        Book a demo
                    </CTAButton>
                </div>
                <div className="relative mx-auto my-12 w-fit shadow-[20px_20px_0px_0px_rgba(255,255,255,1)]">
                    <div className="group relative  transition-all duration-200 hover:scale-[1.02]">

                        {/* Main Video Wrapper */}
                        <div className="w-[850px] h-[450px] overflow-hidden">
                            <video
                                src={banner}
                                muted
                                loop
                                autoPlay
                                playsInline
                                className="w-full h-full object-cover"
                            ></video>
                        </div>

                    </div>
                </div>

                {/* code section-1 */}
                <CodeBlocks
                    position="lg:flex-row"
                    heading={
                        <div>
                            Unlock your coding potential <br /> <HighlighText text=" with our online courses." />
                        </div>
                    }
                    subheading="Our courses are designed and taught by industry experts who have years of experience."
                    ctabtn1={{
                        active: true,
                        linkto: token !== null ? '/dashboard/enrolled-courses' : '/login',
                        btnText: "Start Learning",
                    }}
                    ctabtn2={{
                        active: false,
                        linkto: token !== null ? '/dashboard/my-profile' : '/login',
                        btnText: "Learn more",
                    }}
                    // Yahan hum ensure kar rahe hain ki code block ek clean string ho
                    codeBlock={`function generateGreeting(name) {\n  const message = "Hello, " + name + "!";\n  for (let i = 0; i < 3; i++) {\n    console.log(message);\n  }\n  return message;\n}\ngenerateGreeting("Roshan");`}
                    backgroundGradient="bg-gradient-to-r from-yellow-400 to-blue-500"
                    codeColor="text-yellow-200"
                />

                {/* code section-2 */}
                <CodeBlocks
                    position="lg:flex-row-reverse"
                    heading={
                        <div>
                            Start <HighlighText text="coding in seconds" />
                        </div>
                    }
                    subheading="Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
                    ctabtn1={{
                        active: true,
                        linkto: token !== null ? "/dashboard/enrolled-courses" : "/login",
                        btnText: "Continue Lesson",
                    }}
                    ctabtn2={{
                        active: false,
                        linkto: token !== null ? "/dashboard/my-profile" : "/login",
                        btnText: "Learn more",
                    }}
                    codeBlock={`def binary_search(arr, target):\n    low, high = 0, len(arr) - 1\n    while low <= high:\n        mid = (low + high) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            low = mid + 1\n        else:\n            high = mid - 1\n    return -1`}
                    backgroundGradient="bg-gradient-to-r from-blue-400 to-yellow-500"
                    codeColor="text-blue-100"
                />


                <div className="w-full h-[800px] lg:h-[300px] mt-16 flex justify-center items-start md:items-center px-4">
                    <div className="w-full max-w-6xl">
                        <ExploreMore />
                    </div>
                </div>




            </div>

            {/* section-2 */}
            <div className="bg-pure-greys-5 text-richblack-700 w-full">

                <div className="homepage_bg h-[333px] w-full flex justify-center items-center">
                    <div className="flex flex-row gap-7 text-whit font-bold">
                        <CTAButton active={true} linkto={token !== null ? '/dashboard' : '/about'}>
                            <div>Explore Full Catalog</div>
                        </CTAButton>

                        <CTAButton active={false} linkto={token !== null ? '/dashboard' : '/'}>
                            <div>Learn More</div>
                        </CTAButton>
                    </div>
                </div>
            </div>

            {/* section-3 */}
            <div className="section2 w-full flex flex-col items-center justify-center bg-gray-50 py-16 px-4 md:px-20">
                <div className="flex flex-col md:flex-row md:gap-16 gap-12 items-center w-full max-w-6xl">

                    {/* Left Text */}
                    <div className="text-center md:text-left md:max-w-lg space-y-4 mb-8 md:mb-0">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                            Get the skills you need{' '}
                            <span className="bg-gradient-to-r from-blue-500 to-blue-800 bg-clip-text text-transparent">
                                for a job that is in demand.
                            </span>
                        </h2>

                    </div>

                    {/* Right Paragraph + Button */}
                    <div className="md:max-w-md text-center md:text-left space-y-6">
                        <p className="text-sm text-gray-700 font-semibold mb-10">
                            "The modern StudyNotion sets its own terms. Today, being a competitive specialist requires more than professional skills."
                        </p>
                        <div className='w-[150px] font-extrabold text-2xl'>
                            <CTAButton
                                active={true}
                                linkto="/signup"
                                className="bg-yellow-400 text-black hover:bg-yellow-500"
                            >
                                Learn More
                            </CTAButton>
                        </div>
                    </div>

                </div>


                <div className="flex flex-col md:flex-row mt-10 gap-10 w-11/12 mx-auto justify-center items-center">

                    {/* LEFT SIDE */}
                    <div className="flex flex-col gap-10 w-full md:w-auto">
                        <Design
                            icon={<MdLeaderboard />}
                            title="Leadership"
                            description="Fully committed to the success company"
                            bgColor="bg-blue-100 text-blue-600"
                        />

                        <Design
                            icon={<FaGraduationCap />}
                            title="Responsibility"
                            description="Students will always be our top priority"
                            bgColor="bg-pink-100 text-pink-600"
                        />

                        <Design
                            icon={<FaGem />}
                            title="Flexibility"
                            description="The ability to switch is an important skills"
                            bgColor="bg-yellow-100 text-sky-600"
                        />

                        <Design
                            icon={<FaCode />}
                            title="Solve the problem"
                            description="Code your way to a solution"
                            bgColor="bg-yellow-100 text-yellow-600"
                        />
                    </div>

                    {/* RIGHT SIDE IMAGE */}
                    <div className="relative w-full md:w-fit p-4 flex justify-center">
                        <img
                            src={TimeLineLogo}
                            alt=""
                            className=" w-full max-w-sm md:max-w-none drop-shadow-[0_10px_20px_rgba(0,128,255,0.7)]"
                        />

                        {/* green stats bar */}
                        <div
                            className="
                bg-green-800
                w-[90%] md:w-[500px]
                text-white
                flex flex-row justify-center items-center
                py-4 md:py-6
                absolute left-1/2 -translate-x-1/2
                -bottom-8 md:-bottom-10
                shadow-xl
                text-center
            "
                        >
                            {/* LEFT BLOCK */}
                            <div className="flex flex-row items-center px-5 md:px-10">
                                <h1 className="text-3xl md:text-4xl font-bold mr-3 md:mr-5">10</h1>
                                <span className="text-xs md:text-sm tracking-wide mt-1">
                                    YEARS <br /> EXPERIENCE
                                </span>
                            </div>

                            {/* LINE */}
                            <div className="w-[1px] h-10 md:h-16 bg-white opacity-60"></div>

                            {/* RIGHT BLOCK */}
                            <div className="flex flex-row items-center px-5 md:px-10">
                                <h1 className="text-3xl md:text-4xl font-bold mr-3 md:mr-5">250</h1>
                                <span className="text-xs md:text-sm tracking-wide mt-1">
                                    TYPES OF <br /> COURSES
                                </span>
                            </div>
                        </div>
                    </div>
                </div>



                <div className="mt-32 flex flex-col items-center w-full px-6">

                    <div className="max-w-3xl text-center flex flex-col gap-4">

                        <h1 className="text-4xl font-extrabold leading-tight text-richblack-900">
                            Your swiss knife <HighlighText text="for learning any language" />
                        </h1>

                        <p className="text-richblack-600 text-lg leading-relaxed">
                            Using Spin makes learning multiple languages effortless.
                            With 20+ languages, realistic voice-overs, progress tracking,
                            custom schedules, and more — everything you need is in one place.
                        </p>

                    </div>

                </div>

                <div className="w-full mt-16 flex flex-col items-center">

                    <div className="flex flex-col md:flex-row items-center justify-center">

                        <div className=" flex flex-col md:flex-row items-center p-0">

                            <div className="flex flex-col md:flex-row items-center justify-center mt-8 md:mt-0">
                                <img
                                    src={Know}
                                    alt="KnowYourProgress"
                                    className="object-contain md:-mr-32 hover:scale-105 transition-all duration-200"
                                />
                                <img
                                    src={Compare}
                                    alt="CompareWithOthers"
                                    className="object-contain hover:scale-105 transition-all duration-200 mt-[-50px] md:mt-0"
                                />
                                <img
                                    src={Plan}
                                    alt="PlanYourLesson"
                                    className="object-contain md:-ml-36 hover:scale-105 transition-all duration-200 mt-[-90px] md:mt-0"
                                />
                            </div>

                        </div>
                    </div>

                </div>

            </div>

            {/* section-4 */}
            <div className=' flex flex-col md:flex-row p-10 mt-10 justify-center items-center gap-16 w-full'>
                <div className='bg-white w-[616px] h-[545px] relative'>
                    <img
                        src={Instructor}
                        alt=""
                        className='absolute top-5 left-5'
                    />
                </div>

                {/* Right Content */}
                <div className="text-white flex flex-col max-w-[480px] space-y-6">

                    {/* Heading */}
                    <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                        Become an <HighlighText text="Instructor" />
                    </h1>

                    {/* Subtext */}
                    <p className="text-gray-300 text-lg leading-relaxed">
                        Instructors from around the world teach millions of students on StudyNotion.
                        We provide the tools and skills to help you teach what you love, effortlessly
                        and at scale.
                    </p>

                    {/* CTA */}
                    <div className="pt-2">
                        <CTAButton active={true} linkto={token !== null ? '/dashboard' : '/signup'}>
                            Start Teaching Today
                        </CTAButton>
                    </div>
                </div>
            </div>

            {/* section-5 */}
            {/*TODO: rating part will be added */}

            {/* footer */}
            <Footer></Footer>
        </div>
    );
};

export default Home;
