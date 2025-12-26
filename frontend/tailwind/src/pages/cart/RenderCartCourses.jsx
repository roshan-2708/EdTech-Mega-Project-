import React from "react";
import { useDispatch, useSelector } from "react-redux";
import StarRatings from "react-star-ratings";
import { FaStar, FaStarHalf } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { removeFromCart } from "../../slice/cartSlice";

const RenderCartCourses = () => {

    const { cart } = useSelector((state) => state.cart);
    const dispatch = useDispatch();

    return (
        <div>
            {cart.map((course, index) => (
                <div key={course._id || index}>
                    <div>
                        <img src={course?.thumbnail} alt="course" />
                        <div>
                            <p>{course?.courseName}</p>
                            <p>{course?.courseCategory}</p>

                            <div>
                                <span>4.0</span>
                                <StarRatings
                                    count={5}
                                    size={20}
                                    edit={false}
                                    activeColor="#ffd700"
                                    emptyIcon={<FaStarHalf />}
                                    fullIcon={<FaStar />}
                                />
                                <span>
                                    {course?.ratingAndReview?.length || 0} Ratings
                                </span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <button
                            onClick={() => dispatch(removeFromCart(course._id))}
                        >
                            <MdDelete /> <span>Remove</span>
                        </button>

                        <p>Rs {course?.price}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default RenderCartCourses;
