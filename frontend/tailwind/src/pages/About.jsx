import React from 'react'
import about1 from '../assets/Images/aboutus1.webp'
import about2 from '../assets/Images/aboutus2.webp'
import about3 from '../assets/Images/aboutus3.webp'
import HighlightText from '../components/core/HomePage/HighlighText'
import Footer from '../components/universal/Footer'
import FoundingStory from '../assets/Images/FoundingStory.png'
import CTAButton from '../components/core/HomePage/Button';
import ContatctForm from '../components/core/HomePage/ContatctForm'
const About = () => {
    return (
        <div className='flex flex-col items-center justify-center w-full h-full bg-richblack-900'>
            {/* section-1 */}
            <div className="w-full bg-richblack-900 text-white py-20 h-[618px]">

                <div className="w-11/12 max-w-6xl mx-auto flex flex-col items-center text-center gap-6">

                    {/* Small Heading */}
                    <p className="text-yellow-400 text-lg font-semibold tracking-wider">
                        About Us
                    </p>

                    {/* Main Heading */}
                    <h1 className="text-3xl md:text-5xl font-bold leading-snug max-w-4xl">
                        Driving Innovation in Online Education<br /><HighlightText text="for a Brighter Future"></HighlightText>
                    </h1>

                    {/* Description */}
                    <p className="text-richblack-300 max-w-3xl text-sm md:text-base">
                        Studynotion is at the forefront of driving innovation in online education.
                        We're passionate about creating a brighter future by offering cutting-edge
                        courses, leveraging emerging technologies, and nurturing a vibrant
                        learning community.
                    </p>

                    {/* Images Row */}
                    <div className="flex flex-col md:flex-row gap-6 mt-16 h-[311px] z-10">
                        <img
                            src={about1}
                            alt="about1"
                            className="rounded-xl shadow-md w-full md:w-[350px] h-[250px] object-cover"
                        />
                        <img
                            src={about2}
                            alt="about2"
                            className="rounded-xl shadow-md w-full md:w-[350px] h-[250px] object-cover"
                        />
                        <img
                            src={about3}
                            alt="about3"
                            className="rounded-xl shadow-md w-full md:w-[350px] h-[250px] object-cover"
                        />
                    </div>

                </div>
            </div>

            {/* section-2 */}

            <div className="w-full bg-richblack-800 py-16 mt-5">
                <div className="w-11/12 max-w-6xl mx-auto flex justify-center">

                    <h1 className="text-2xl md:text-4xl font-semibold text-center text-richblack-5 leading-relaxed max-w-4xl">
                        We are passionate about revolutionizing the way we learn.
                        Our innovative platform{" "}
                        <HighlightText text="combines technology, expertise, and community" />{" "}
                        <span className='text-yellow-50'>to create an{" "}</span>
                        <span className="text-orange-500 font-bold text-brown-100">
                            educational experience.
                        </span>
                    </h1>

                </div>
            </div>

            {/* section-3 */}
            <div className="w-full py-16">
                <div className="w-11/12 max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10">

                    {/* left part */}
                    <div className="flex-1 space-y-6">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-400 text-4xl font-semibold tracking-wide">
                            Our Founding Story
                        </span>


                        <p className="text-richblack-5 leading-relaxed">
                            Our e-learning platform was born out of a shared vision and passion for transforming
                            education. It all began with a group of educators, technologists, and lifelong learners
                            who recognized the need for accessible, flexible, and high-quality learning opportunities
                            in a rapidly evolving digital world.
                        </p>

                        <p className="text-richblack-5 leading-relaxed">
                            As experienced educators ourselves, we witnessed firsthand the limitations and challenges
                            of traditional education systems. We believed that education should not be confined to the
                            walls of a classroom or restricted by geographical boundaries. We envisioned a platform
                            that could bridge these gaps and empower individuals from all walks of life to unlock their
                            full potential.
                        </p>
                    </div>

                    {/* right part */}
                    <div className="flex-1 flex justify-center">
                        <img
                            src={FoundingStory}
                            alt="Founding Story"
                            className="w-full max-w-md rounded-lg shadow-md"
                        />
                    </div>

                </div>
            </div>


            <div className="w-full py-16">
                {/* Left Side - Vision */}
                <div className='w-11/12 max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10'>
                    <div className="flex-1 flex flex-col justify-start items-start text-left md:text-left">
                        <span className="text-yellow-5 text-2xl font-semibold">Our Vision</span>
                        <p className="mt-4 text-richblack-5 leading-relaxed md:max-w-[500px]">
                            With this vision in mind, we set out on a journey to create an e-learning platform that would revolutionize the way people learn. Our team of dedicated experts worked tirelessly to develop a robust and intuitive platform that combines cutting-edge technology with engaging content, fostering a dynamic and interactive learning experience.
                        </p>
                    </div>

                    {/* Right Side - Mission */}
                    <div className="flex-1 flex flex-col justify-start items-start text-left md:text-left">
                        <span className="text-pink-200 text-2xl font-semibold">Our Mission</span>
                        <p className="mt-4 text-richblack-5 leading-relaxed md:max-w-[500px]">
                            Our mission goes beyond just delivering courses online. We wanted to create a vibrant community of learners, where individuals can connect, collaborate, and learn from one another. We believe that knowledge thrives in an environment of sharing and dialogue, and we foster this spirit of collaboration through forums, live sessions, and networking opportunities.
                        </p>
                    </div>
                </div>
            </div>



            {/* section-5 */}
            <div className="w-full bg-richblack-500 py-20 text-white">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-around items-center gap-12">
                    {/* Active Students */}
                    <div className="flex flex-col items-center">
                        <span className="text-4xl font-bold">5K</span>
                        <p className="mt-2 text-lg font-medium">Active Students</p>
                    </div>

                    {/* Mentors */}
                    <div className="flex flex-col items-center">
                        <span className="text-4xl font-bold">10+</span>
                        <p className="mt-2 text-lg font-medium">Mentors</p>
                    </div>

                    {/* Courses */}
                    <div className="flex flex-col items-center">
                        <span className="text-4xl font-bold">200+</span>
                        <p className="mt-2 text-lg font-medium">Courses</p>
                    </div>

                    {/* Awards */}
                    <div className="flex flex-col items-center">
                        <span className="text-4xl font-bold">50+</span>
                        <p className="mt-2 text-lg font-medium">Awards</p>
                    </div>
                </div>
            </div>

            {/* section-6 */}
            <div className="w-full max-w-[1440px] mx-auto flex flex-col gap-12 mt-16 px-4 md:px-10 items-center justify-center ">

                {/* LEFT SECTION */}
                <div className="flex flex-col md:flex-row gap-12">

                    {/* Heading + description + button */}
                    <div className="w-full md:w-[400px] flex flex-col items-start gap-6">
                        <h1 className="text-xl md:text-3xl font-bold leading-snug text-richblack-5">
                            World-Class Learning for <br />
                            <HighlightText text="Anyone, Anywhere" />
                        </h1>

                        <p className="text-richblack-200 text-sm leading-relaxed">
                            Studynotion partners with more than 275+ leading universities and companies
                            to bring flexible, affordable, job-relevant online learning to individuals and
                            organizations worldwide.
                        </p>

                        <CTAButton active={true} linkto="/signup">
                            <div>Learn More</div>
                        </CTAButton>
                    </div>

                    {/* First 2 cards */}
                    <div className="flex flex-row gap-6">
                        {/* Card 1 */}
                        <div className="card-box">
                            <h1 className="card-title">Curriculum Based on Industry Needs</h1>
                            <p className="card-text">
                                Save time and money! The Belajar curriculum is designed to be easy and aligned with industry standards.
                            </p>
                        </div>

                        {/* Card 2 */}
                        <div className="card-box">
                            <h1 className="card-title">Our Learning Methods</h1>
                            <p className="card-text">
                                Learn using a combination of online and offline methods.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Last 3 cards */}
                <div className="flex flex-row gap-6 flex-wrap md:flex-nowrap ml-[115px]">

                    {/* Card 3 */}
                    <div className="card-box">
                        <h1 className="card-title">Certification</h1>
                        <p className="card-text">
                            Get certificates that increase your chances while job hunting.
                        </p>
                    </div>

                    {/* Card 4 */}
                    <div className="card-box">
                        <h1 className="card-title">Rating "Auto-grading"</h1>
                        <p className="card-text">
                            Instant feedback during learning without waiting for mentor responses.
                        </p>
                    </div>

                    {/* Card 5 */}
                    <div className="card-box">
                        <h1 className="card-title">Ready to Work</h1>
                        <p className="card-text">
                            Connected with 150+ hiring partners to help you get a job after graduation.
                        </p>
                    </div>

                </div>
            </div>




            {/* section-7 */}
            <div className=" py-10">
                <div className="max-w-7xl mx-auto px-4">
                    <ContatctForm />
                </div>
            </div>

            {/* footer */}
            <Footer></Footer>
        </div>
    )
}

export default About
