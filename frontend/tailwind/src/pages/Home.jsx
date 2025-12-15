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
    return (
        <div className='flex flex-col justify-center items-center'>

            {/* section-1 */}
            <div className="relative mx-auto flex flex-col w-11/12 items-center text-white justify-center ">
                <Link to="/signup">
                    <div className="mt-16 p-1 mx-auto rounded-full bg-richblack-300 font-bold text-yellow-25
                    w-fit cursor-pointer transition-all duration-300 
                    shadow-md hover:shadow-xl hover:scale-95 group">
                        <div className="flex flex-row items-center gap-2 rounded-full px-10 py-[5px]
                        transition-all duration-300 group-hover:bg-richblack-500">
                            <p>Become An Instructor</p>
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
                    <CTAButton active={true} linkto={"/signup"}>
                        Learn more
                    </CTAButton>
                    <CTAButton active={false} linkto={"/login"}>
                        Book a demo
                    </CTAButton>
                </div>
                <div className="relative rounded-xl overflow-hidden shadow-xl shadow-blue-300 group mt-10 ">
                    <div className="w-[850px] h-[450px] rounded-xl overflow-hidden">
                        <video
                            src={banner}
                            muted
                            loop
                            autoPlay
                            playsInline
                            className="w-full h-full object-cover"
                        ></video>
                    </div>


                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 
                    transition-all duration-300"></div>
                </div>

                {/* code section-1 */}
                <CodeBlocks
                    position="lg:flex-row"
                    heading={
                        <div>
                            Unlock your coding potential <br /> <HighlighText text=" with our online courses." />
                        </div>
                    }
                    subheading="Our courses are designed and taught by industry experts who have years of experience "
                    ctabtn1={{
                        active: true,
                        linkto: "/signup",
                        btnText: "Start Learning",
                    }}
                    ctabtn2={{
                        active: false,
                        linkto: "/courses",
                        btnText: "Learn more",
                    }}
                    codeBlock={`function generateGreeting(name) {
  const message = "Hello, " + name + "!";
  for (let i = 0; i < 3; i++) {
    console.log(message);
  }
  return message;
}
generateGreeting("Roshan");`}

                    backgroundGradient="bg-gradient-to-r from-yellow-400 to-blue-500"
                    codeColor="text-yellow-200"
                />

                {/* code section-2 */}
                <CodeBlocks
                    position="lg:flex-row-reverse"
                    heading={
                        <div>
                            Start <HighlighText text="coding in second" />
                        </div>
                    }
                    subheading="Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
                    ctabtn1={{
                        active: true,
                        linkto: "/signup",
                        btnText: "Continue Lesson",
                    }}
                    ctabtn2={{
                        active: false,
                        linkto: "/courses",
                        btnText: "Learn more",
                    }}
                    codeBlock={`def binary_search(arr, target):
low, high = 0, len(arr) - 1
    while low <= high:
    mid = (low + high) // 2
    if arr[mid] == target:
        return mid
    elif arr[mid] < target:
        low = mid + 1
    else:
        high = mid - 1
    return -1
`}
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
                        <CTAButton active={true} linkto={"/signup"}>
                            <div>Explore Full Catalog</div>
                        </CTAButton>

                        <CTAButton active={false} linkto={"/signup"}>
                            <div>Learn More</div>
                        </CTAButton>
                    </div>
                </div>
            </div>

            <div className="section2 w-full flex flex-col items-center justify-center bg-gray-50 py-16 px-4 md:px-20">
                <div className="flex flex-col md:flex-row md:gap-16 gap-12 items-center w-full max-w-6xl">

                    {/* Left Text */}
                    <div className="text-center md:text-left md:max-w-lg space-y-4 mb-8 md:mb-0">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                            Get the skills you need{' '}
                            <span className="bg-gradient-to-r from-blue-50 to-blue-25 bg-clip-text text-transparent">
                                for a job that is in demand.
                            </span>
                        </h2>

                    </div>

                    {/* Right Paragraph + Button */}
                    <div className="md:max-w-md text-center md:text-left space-y-6">
                        <p className="text-sm text-gray-700 mb-10">
                            The modern StudyNotion sets its own terms. Today, being a competitive specialist requires more than professional skills.
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
                            className="rounded-xl w-full max-w-sm md:max-w-none drop-shadow-[0_10px_20px_rgba(0,128,255,0.7)]"
                        />

                        {/* green stats bar */}
                        <div
                            className="
                bg-caribbeangreen-500
                w-[90%] md:w-[500px]
                text-white
                flex flex-row justify-center items-center
                py-4 md:py-6 rounded-lg
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

                        <div className="bg-white flex flex-col md:flex-row items-center p-0">

                            {/* IMAGE 1 */}
                            <img
                                src={Know}
                                alt="Know"
                                className="
                    object-contain 
                    w-48 md:w-auto 
                    -mb-10 md:mb-0 
                    md:-mr-32 
                    z-30
                "
                            />

                            {/* IMAGE 2 */}
                            <img
                                src={Compare}
                                alt="Compare"
                                className="
                    object-contain 
                    w-48 md:w-auto
                    -mb-10 md:mb-0
                    md:-mr-32 
                    z-20
                "
                            />

                            {/* IMAGE 3 */}
                            <img
                                src={Plan}
                                alt="Plan"
                                className="
                    object-contain 
                    w-48 md:w-auto 
                    z-10
                "
                            />

                        </div>
                    </div>

                </div>


                <div className='mt-6 font-bold'>
                    <CTAButton active={true} linkto={'/signup'}>Learn More</CTAButton>
                </div>

            </div>
            {/* section-3 */}

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
                        <CTAButton active={true} linkto={'/signup'}>
                            Start Teaching Today
                        </CTAButton>
                    </div>
                </div>
            </div>


            {/* section-4 */}


            {/* footer */}
            <Footer></Footer>
        </div>
    );
};

export default Home;
