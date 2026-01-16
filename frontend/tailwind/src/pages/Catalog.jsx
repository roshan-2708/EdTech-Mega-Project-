import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Footer from "../components/universal/Footer";
import { apiConnector } from "../services/apiConnecter";
import { categoryEndpoints } from "../services/apis";
import { getCatalogPageData } from "../services/operations/pageAndComponentData";
import CourseSlider from "./CourseSlider";
import Course_Card from "../components/catalog/Course_Card";

const Catalog = () => {
    const { name } = useParams();
    const [catalogPageData, setCatalogPageData] = useState(null);
    const [categoryId, setCategoryId] = useState(null);
    const [activeTab, setActiveTab] = useState("popular"); // popular | new

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
            setCatalogPageData(res.data);
        };

        getCategory();
    }, [categoryId]);

    // 🔥 Course filtering logic
    const courses = catalogPageData?.selectedCategory?.courses || [];

    const popularCourses = [...courses].sort(
        (a, b) =>
            (b.ratingAndReview?.length || 0) -
            (a.ratingAndReview?.length || 0)
    );

    const newCourses = [...courses].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    const displayCourses =
        activeTab === "popular" ? popularCourses : newCourses;

    if (!name) return <div className="text-white">Category not found</div>;

    return (
        <div className="min-h-screen bg-richblack-900 text-white">
            {/* =================== HERO SECTION =================== */}
            <div className="mx-auto max-w-7xl px-4 py-10">
                <p className="text-sm text-richblack-300">
                    Home / Catalog / <span className="text-yellow-50">{name}</span>
                </p>

                <h1 className="mt-3 text-3xl font-bold text-richblack-5">
                    {name}
                </h1>

                <p className="mt-2 max-w-3xl text-richblack-200">
                    {catalogPageData?.selectedCategory?.description ||
                        "No description available"}
                </p>

            </div>

            {/* =================== SECTION 2 =================== */}
            <div className="mx-auto max-w-7xl px-4">
                {/* ---------- Toggle Header ---------- */}
                <div className="flex flex-col gap-4 border-b border-richblack-700 pb-4 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="text-xl font-semibold">
                        Courses to get you started
                    </h2>

                    <div className="flex gap-6 text-sm font-medium">
                        <button
                            onClick={() => setActiveTab("popular")}
                            className={`pb-2 transition-all ${activeTab === "popular"
                                ? "border-b-2 border-yellow-50 text-yellow-50"
                                : "text-richblack-300 hover:text-richblack-5"
                                }`}
                        >
                            Most Popular
                        </button>

                        <button
                            onClick={() => setActiveTab("new")}
                            className={`pb-2 transition-all ${activeTab === "new"
                                ? "border-b-2 border-yellow-50 text-yellow-50"
                                : "text-richblack-300 hover:text-richblack-5"
                                }`}
                        >
                            New
                        </button>
                    </div>
                </div>

                {/* ---------- Slider ---------- */}
                <div className="py-6">
                    <CourseSlider Courses={displayCourses} />
                </div>

                {/* =================== TOP COURSES =================== */}
                <div className="py-10">
                    <h2 className="mb-6 text-xl font-semibold">
                        Top Courses in {name}
                    </h2>

                    <CourseSlider Courses={popularCourses} />
                </div>

                {/* =================== FREQUENTLY BOUGHT =================== */}
                <div className="py-10">
                    <h2 className="mb-6 text-xl font-semibold">
                        Frequently Bought
                    </h2>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        {courses.length > 0 ? (
                            courses.map((course) => (
                                <Course_Card
                                    key={course._id}
                                    course={course}
                                    Height="h-[100px]"
                                />
                            ))
                        ) : (
                            <p className="text-richblack-300">No courses found</p>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Catalog;
