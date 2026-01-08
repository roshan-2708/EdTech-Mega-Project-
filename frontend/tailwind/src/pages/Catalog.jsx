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
    const [active, setActive] = useState(false);
    
    // Fetch categories
    useEffect(() => {
        const getCategotyDetails = async () => {
            const res = await apiConnector("GET", categoryEndpoints.GET_ALL_CATEGORIES);

            console.log("URL param name:", name);
            console.log("All categories:", res?.data?.data);

            const category = res?.data?.data?.find(
                (ct) => ct.name.toLowerCase() === name.toLowerCase()
            );

            console.log("Matched category:", category);

            if (category?._id) {
                setCategoryId(category._id);
            }
        };

        if (name) getCategotyDetails();
    }, [name]);

    useEffect(() => {
        if (!categoryId) return;

        const getCategory = async () => {
            const res = await getCatalogPageData(categoryId);
            setCatalogPageData(res.data);
        };

        getCategory();
    }, [categoryId]);


    if (!name) {
        return <div>Category not found</div>;
    }

    return (
        <div className="text-white">
            {/* section-1 */}
            <div>
                <p>{`Home/Catalog/${name}`}</p>
                <h1 className="text-2xl font-bold">
                    Category: {name}
                </h1>
                <p>
                    {catalogPageData?.data?.selectedCategory?.description || "No description available"}
                </p>

            </div>
            {/* section-2 */}
            <div>
                {/* subsection-1 */}
                <div>
                    <div>
                        Courses to get you started
                    </div>
                    <div className="flex gap-x-3">
                        <p>Most Popular</p>
                        <p>New</p>
                    </div>
                    <div>
                        <CourseSlider
                            Course={catalogPageData?.selectedCategory?.courses}
                        />

                    </div>
                </div>
                {/* subsection-2 */}
                <div>
                    <p>Top Courses in {name}</p>
                    <div>
                        <CourseSlider
                            Course={catalogPageData?.otherCategories?.flatMap(cat => cat.courses)}
                        />

                    </div>
                </div>
                {/* section-3 */}
                <div>
                    <p>Frequently Bought</p>
                    <div className="py-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2">
                            {catalogPageData?.selectedCategory?.courses?.length > 0 ? (
                                catalogPageData.selectedCategory.courses.map((course) => (
                                    <Course_Card
                                        key={course._id}
                                        course={course}
                                        Height="h-[200px]"
                                    />
                                ))
                            ) : (
                                <p className="text-white">No courses found</p>
                            )}

                        </div>

                    </div>
                </div>
            </div>
            <Footer></Footer>
        </div>
    );
};

export default Catalog;
