const { instance } = require("../config/razorpay");
const Course = require("../model/Course");
const User = require("../model/User");
const mongoose = require("mongoose");
const crypto = require("crypto");
const mailSender = require("../utils/mailSender");
const courseEnrollTemplate = require("../mail/template/courseEntroll");
const paymentSuccessTemplate = require("../mail/template/paymentSuccessTemplate");

exports.capturePayment = async (req, res) => {
    try {
        const { courses } = req.body;
        const userId = req.user.id;

        if (!courses || courses.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please provide course IDs",
            });
        }

        let totalAmount = 0;

        for (const courseId of courses) {
            console.log("TYPE of course id", typeof (courseId));
            // console.log("printing", course.courseId);
            const course = await Course.findById(courseId);
            if (!course) {
                return res.status(404).json({
                    success: false,
                    message: "Course not found",
                });
            }

            const alreadyEnrolled = course.studentEnrolled.some(
                (id) => id.toString() === userId
            );

            if (alreadyEnrolled) {
                return res.status(400).json({
                    success: false,
                    message: "User already enrolled in course",
                });
            }

            totalAmount += course.price;
        }

        const options = {
            amount: totalAmount * 100, // paise
            currency: "INR",
            receipt: Date.now().toString(),
        };

        const order = await instance.orders.create(options);

        return res.status(200).json({
            success: true,
            order,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Payment order creation failed",
        });
    }
};


// verify payment

exports.verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            courses,
        } = req.body;

        const userId = req.user.id;

        if (
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature ||
            !courses ||
            !userId
        ) {
            return res.status(400).json({
                success: false,
                message: "Payment Failed",
            });
        }

        // Verify signature
        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: "Payment verification failed",
            });
        }

        // Get user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Enroll student & send mail
        for (const courseId of courses) {
            const course = await Course.findByIdAndUpdate(
                courseId,
                { $push: { studentEnrolled: userId } },
                { new: true }
            );

            await User.findByIdAndUpdate(
                userId,
                { $push: { courses: courseId } },
                { new: true }
            );

            // 📧 Send enrollment email
            await mailSender(
                user.email,
                "Successfully Enrolled in Course 🎉",
                courseEnrollTemplate(
                    user.firstName,
                    course.courseName,
                )
            );
            console.log("Email Sent Successfully.", mailSender.response);
        }

        return res.status(200).json({
            success: true,
            message: "Payment verified & enrolled successfully",
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Payment verification error",
        });
    }
};

// mail send
exports.sendPaymentSuccessEmail = async (req, res) => {
    try {
        const { orderId, paymentId, amount } = req.body;
        const userId = req.user.id;

        if (!orderId || !paymentId || !amount || !userId) {
            return res.status(400).json({
                success: false,
                message: "Please provide all fields",
            });
        }

        const enrolledStudent = await User.findById(userId);

        if (!enrolledStudent) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        await mailSender(
            enrolledStudent.email,
            "Payment Successful – Course Enrollment Confirmed 🎉",
            paymentSuccessTemplate({
                studentName: enrolledStudent.firstName,
                amount: amount,
                orderId: orderId,
                paymentId: paymentId,
            })
        );

        return res.status(200).json({
            success: true,
            message: "Payment success email sent",
        });

    } catch (error) {
        console.error("Error in sending mail:", error);
        return res.status(500).json({
            success: false,
            message: "Could not send mail",
        });
    }
};

// exports.capturePayment = async (req, res) => {
//     try {
//         console.log("🔥 capturePayment - req.body:", req.body);
//         console.log("🔥 userId:", req.user.id);

//         const { courses } = req.body; 
//         const userId = req.user.id;

//         // ✅ Validate input
//         if (!courses || !Array.isArray(courses) || courses.length === 0) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Please provide course IDs",
//             });
//         }

//         let totalAmount = 0;

//         // ✅ Loop through course IDs
//         for (const courseId of courses) {
//             // ✅ Validate ObjectId
//             if (!mongoose.Types.ObjectId.isValid(courseId)) {
//                 return res.status(400).json({
//                     success: false,
//                     message: `Invalid course ID: ${courseId}`,
//                 });
//             }

//             const course = await Course.findById(courseId);
//             if (!course) {
//                 return res.status(404).json({
//                     success: false,
//                     message: `Course not found: ${courseId}`,
//                 });
//             }

//             // ✅ Check already enrolled
//             const alreadyEnrolled = course.studentEnrolled.some(
//                 (id) => id.toString() === userId
//             );
//             if (alreadyEnrolled) {
//                 return res.status(400).json({
//                     success: false,
//                     message: `Already enrolled in ${course.title}`,
//                 });
//             }

//             totalAmount += course.price;
//             console.log(`✅ Course ${course.title}: ₹${course.price}`);
//         }

//         console.log("✅ Total amount:", totalAmount);

//         if (totalAmount === 0) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Total amount is zero",
//             });
//         }

//         // ✅ Create Razorpay order
//         const options = {
//             amount: totalAmount * 100, // paise
//             currency: "INR",
//             receipt: `receipt_${userId}_${Date.now()}`,
//         };

//         console.log("🔄 Creating Razorpay order...");
//         const order = await instance.orders.create(options);

//         console.log("✅ Razorpay order created:", order.id);

//         return res.status(200).json({
//             success: true,
//             order,
//             // For frontend verification
//             key_id: process.env.RAZORPAY_KEY_ID,
//         });

//     } catch (error) {
//         console.error("💥 capturePayment ERROR:", error);

//         // ✅ Better error messages
//         if (error.name === "CastError") {
//             return res.status(400).json({
//                 success: false,
//                 message: "Invalid course ID format",
//             });
//         }

//         if (error.statusCode === 400) {
//             return res.status(400).json({
//                 success: false,
//                 message: error.description || "Payment gateway error",
//             });
//         }

//         return res.status(500).json({
//             success: false,
//             message: "Internal server error",
//         });
//     }
// };


// CAPTURE PAYMENT for single
// exports.capturePayment = async (req, res) => {
//     try {
//         const { course_id } = req.body;
//         const userId = req.user.id;

//         if (!course_id) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Course ID is required",
//             });
//         }

//         const course = await Course.findById(course_id);
//         if (!course) {
//             return res.status(404).json({ success: false, message: "Course not found" });
//         }

//         // Avoid double purchase
//         const uid = new mongoose.Types.ObjectId(userId);
//         if (course.studentEnrolled.includes(uid)) {
//             return res.status(400).json({
//                 success: false,
//                 message: "User already purchased this course",
//             });
//         }

//         // Create Razorpay order
//         const optionObject = {
//             amount: course.price * 100,
//             currency: "INR",
//             receipt: `receipt_${Date.now()}`,
//             notes: {
//                 course_id: course_id,
//                 userId: userId,
//             },
//         };

//         const paymentResponse = await instance.orders.create(optionObject);

//         return res.status(200).json({
//             success: true,
//             message: "Order created successfully",
//             orderId: paymentResponse.id,
//             amount: paymentResponse.amount,
//             currency: paymentResponse.currency,
//             courseName: course.courseName,
//             thumbnail: course.thumbnail,
//         });

//     } catch (error) {
//         console.error("Payment Error:", error);
//         return res.status(500).json({ success: false, message: error.message });
//     }
// };
// WEBHOOK
// exports.paymentWebhook = async (req, res) => {
//     try {
//         const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

//         const shasum = crypto.createHmac("sha256", secret);
//         shasum.update(JSON.stringify(req.body));
//         const digest = shasum.digest("hex");

//         if (digest !== req.headers["x-razorpay-signature"]) {
//             return res.status(400).json({ success: false, message: "Invalid signature" });
//         }

//         const event = req.body.event;

//         if (event === "payment.captured") {
//             const payment = req.body.payload.payment.entity;

//             const userId = payment.notes.userId;
//             const courseId = payment.notes.course_id;

//             // ENROLL USER
//             const user = await User.findByIdAndUpdate(
//                 userId,
//                 { $addToSet: { purchasedCourses: courseId } },
//                 { new: true }
//             );

//             const course = await Course.findByIdAndUpdate(
//                 courseId,
//                 { $addToSet: { studentEnrolled: userId } },
//                 { new: true }
//             );

//             // SEND EMAIL
//             await mailSender(
//                 user.email,
//                 "Course Enrolled Successfully!",
//                 courseEnrollTemplate(user.firstName, course.courseName)
//             );

//             console.log("✔ User enrolled + email sent");
//         }

//         return res.status(200).json({ success: true });

//     } catch (error) {
//         console.error("Webhook Error:", error);
//         return res.status(500).json({ success: false });
//     }
// };
// VERIFY SIGNATURE
// exports.verifySignature = async (req, res) => {
//     try {
//         const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

//         if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Missing fields"
//             });
//         }

//         const sign = razorpay_order_id + "|" + razorpay_payment_id;
//         const expectedSignature = crypto
//             .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//             .update(sign)
//             .digest("hex");

//         if (expectedSignature !== razorpay_signature) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Invalid payment signature"
//             });
//         }

//         return res.status(200).json({
//             success: true,
//             message: "Payment verified successfully"
//         });

//     } catch (error) {
//         console.error("Verify Signature Error:", error);
//         return res.status(500).json({
//             success: false,
//             message: "Internal Server Error"
//         });
//     }
// };
