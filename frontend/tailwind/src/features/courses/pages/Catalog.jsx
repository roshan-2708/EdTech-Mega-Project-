import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Footer from "../../../components/layout/Footer";
import { apiConnector } from "../../../services/apiConnecter";
import { categoryEndpoints } from "../../../services/apis";
import { getCatalogPageData } from "../../../services/operations/pageAndComponentData";
import CourseSlider from "../components/CourseSlider";
import Course_Card from "../components/CourseCard";

const Catalog = () => {
    const { name } = useParams();
    const [catalogPageData, setCatalogPageData] = useState(null);
    const [categoryId, setCategoryId] = useState(null);
    const [activeTab, setActiveTab] = useState("popular"); // popular | new | highest

    // Fetch categories
    useEffect(() => {
        const getCategoryDetails = async () => {
            const res = await apiConnector(
                "GET",
                categoryEndpoints.GET_ALL_CATEGORIES
            );

            const category = res?.data?.data?.find(
                (ct) => ct.name.toLowerCase() === name.toLowerCase()
            );

            if (category?._id) {
                setCategoryId(category._id);
            }
        };

        if (name) getCategoryDetails();
    }, [name]);

    // Fetch catalog data
    useEffect(() => {
        if (!categoryId) return;

        const getCategory = async () => {
            const res = await getCatalogPageData(categoryId);
            setCatalogPageData(res?.data);
        };

        getCategory();
    }, [categoryId]);

    // 🔥 Course filtering & sorting logic
    const courses = catalogPageData?.selectedCategory?.courses || [];

    const popularCourses = [...courses].sort(
        (a, b) =>
            (b.ratingAndReview?.length || 0) -
            (a.ratingAndReview?.length || 0)
    );

    const newCourses = [...courses].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    const highestRatedCourses = [...courses].sort((a, b) => {
        const getAvg = (arr) => {
            if (!arr || arr.length === 0) return 0;
            const total = arr.reduce((acc, curr) => acc + (curr.rating || 0), 0);
            return total / arr.length;
        };
        return getAvg(b.ratingAndReview) - getAvg(a.ratingAndReview);
    });

    const displayCourses =
        activeTab === "popular"
            ? popularCourses
            : activeTab === "new"
            ? newCourses
            : highestRatedCourses;

    // Subcategories / Tags mock (apne data ke hisaab se map kar sakte ho)
    const subLinks = ["MERN", "Next.js 14", "Java Spring Boot", "Cloud & DevOps"];

    if (!name) return <div className="text-white p-6">Category not found</div>;

    return (
        <div className="min-h-screen bg-richblack-900 text-white font-inter">
            {/* =================== HERO SECTION =================== */}
            <div className="bg-richblack-800 border-b border-richblack-700">
                <div className="mx-auto max-w-maxContentTab px-4 py-8 lg:max-w-maxContent lg:px-8">
                    <p className="text-xs text-richblack-300">
                        Home / Catalog / <span className="text-yellow-50">{name}</span>
                    </p>

                    <h1 className="mt-2 text-3xl font-bold text-richblack-5">
                        {name}
                    </h1>

                    <p className="mt-2 max-w-3xl text-sm text-richblack-200">
                        {catalogPageData?.selectedCategory?.description ||
                            "Learn end-to-end web & backend engineering. Master modern frameworks, scalable database architectures, microservices, and cloud deployments."}
                    </p>

                    {/* Sub-category Filter Pills */}
                    <div className="mt-6 flex flex-wrap gap-3">
                        {subLinks.map((tag, index) => (
                            <span
                                key={index}
                                className="cursor-pointer rounded-full bg-richblack-700 px-4 py-1.5 text-xs font-medium text-richblack-200 transition-all hover:bg-richblack-600 hover:text-richblack-5 border border-richblack-600"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* =================== MAIN CONTENT CONTAINER =================== */}
            <div className="mx-auto max-w-maxContentTab px-4 py-8 lg:max-w-maxContent lg:px-8 flex flex-col gap-12">
                
                {/* ---------- SECTION 1: Courses to get you started ---------- */}
                <div>
                    <div className="flex flex-col gap-4 border-b border-richblack-700 pb-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-richblack-5">
                                Courses to get you started
                            </h2>
                            <p className="text-xs text-richblack-300 mt-0.5">Hand-picked industry standard curriculum</p>
                        </div>

                        <div className="flex gap-6 text-sm font-medium">
                            <button
                                onClick={() => setActiveTab("popular")}
                                className={`pb-2 transition-all ${
                                    activeTab === "popular"
                                        ? "border-b-2 border-yellow-50 text-yellow-50"
                                        : "text-richblack-300 hover:text-richblack-5"
                                }`}
                            >
                                Most Popular
                            </button>

                            <button
                                onClick={() => setActiveTab("new")}
                                className={`pb-2 transition-all ${
                                    activeTab === "new"
                                        ? "border-b-2 border-yellow-50 text-yellow-50"
                                        : "text-richblack-300 hover:text-richblack-5"
                                }`}
                            >
                                New & Trending
                            </button>

                            <button
                                onClick={() => setActiveTab("highest")}
                                className={`pb-2 transition-all ${
                                    activeTab === "highest"
                                        ? "border-b-2 border-yellow-50 text-yellow-50"
                                        : "text-richblack-300 hover:text-richblack-5"
                                }`}
                            >
                                Highest Rated
                            </button>
                        </div>
                    </div>

                    <div className="py-6">
                        <CourseSlider Courses={displayCourses} />
                    </div>
                </div>

                {/* =================== SECTION 2: Top Courses =================== */}
                <div>
                    <h2 className="mb-1 text-xl font-bold text-richblack-5">
                        Top Courses in {name}
                    </h2>
                    <p className="text-xs text-richblack-300 mb-6">Highest enrolled programs this semester</p>

                    <CourseSlider Courses={popularCourses} />
                </div>

                {/* =================== SECTION 3: Frequently Bought Together (Bundle Style) =================== */}
                <div className="rounded-sm bg-richblack-800 border border-richblack-700 p-6 shadow-lg">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold bg-yellow-50 text-richblack-900 px-2 py-0.5 rounded uppercase">Power Pack</span>
                    </div>
                    <h2 className="text-xl font-bold text-richblack-5 mb-4">
                        Frequently Bought Together
                    </h2>

                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        {/* Bundle Items List */}
                        <div className="flex flex-col gap-3 flex-1">
                            {courses.slice(0, 3).map((course, i) => (
                                <div key={course._id || i} className="flex items-center justify-between bg-richblack-900/60 p-3 rounded-sm border border-richblack-700">
                                    <div className="flex items-center gap-3">
                                        <div className="w-5 h-5 rounded-full bg-caribbeangreen-200/20 text-caribbeangreen-300 flex items-center justify-center text-xs font-bold">✓</div>
                                        <p className="text-sm font-medium text-richblack-5 line-clamp-1">{course?.courseName || course?.title}</p>
                                    </div>
                                    <span className="text-xs font-bold text-richblack-5 ml-4">₹{course?.price || "499"}</span>
                                </div>
                            ))}
                            {courses.length === 0 && (
                                <p className="text-sm text-richblack-300">No bundle packages found</p>
                            )}
                        </div>

                        {/* Bundle Pricing & Action */}
                        <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between lg:justify-center gap-4 bg-richblack-900 p-4 rounded-sm border border-richblack-700 min-w-[220px]">
                            <div>
                                <p className="text-[10px] text-richblack-400 uppercase tracking-wider">Bundle Total Price</p>
                                <div className="flex items-baseline gap-2 mt-0.5">
                                    <span className="text-xl font-bold text-yellow-50">₹1,399</span>
                                    <span className="text-xs text-richblack-400 line-through">₹2,027</span>
                                    <span className="text-[10px] bg-caribbeangreen-200/20 text-caribbeangreen-300 px-1.5 py-0.5 rounded font-semibold">Save 30%</span>
                                </div>
                            </div>
                            <button className="w-full sm:w-auto rounded-sm bg-yellow-50 px-5 py-2 text-xs font-bold text-richblack-900 transition-all hover:scale-95 shadow">
                                Add Bundle
                            </button>
                        </div>
                    </div>
                </div>

            </div>

            <Footer />
        </div>
    );
};

export default Catalog;