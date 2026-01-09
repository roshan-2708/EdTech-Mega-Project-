import { studentEndpoints } from "../apis";
import { apiConnector } from "../apiConnecter";
import { toast } from "react-hot-toast";
import { setPaymentLoading } from "../../slice/courseSlice";
import { resetCart } from "../../slice/cartSlice";

const {
    COURSE_PAYMENT_API,
    COURSE_VERIFY_API,
    SEND_PAYMENT_SUCCESS_EMAIL_API,
} = studentEndpoints;

function loadScript(src) {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
}

export async function buyCourse(token, courses, userDetails, navigate, dispatch) {
    const toastId = toast.loading("Loading...");
    try {
        const res = await loadScript(
            "https://checkout.razorpay.com/v1/checkout.js"
        );

        if (!res) {
            toast.error("Razorpay SDK failed to load");
            return;
        }

        const orderResponse = await apiConnector(
            "POST",
            COURSE_PAYMENT_API,
            { courses },
            { Authorization: `Bearer ${token}` }
        );

        if (!orderResponse.data.success) {
            throw new Error(orderResponse.data.message);
        }

        const order = orderResponse.data.order;

        const options = {
            key: process.env.REACT_APP_RAZORPAY_KEY_ID,
            currency: order.currency,
            amount: order.amount,
            order_id: order.id,
            name: "StudyNotion",
            description: "Thank you for purchasing the course",
            prefill: {
                name: userDetails.firstName,
                email: userDetails.email,
            },
            handler: function (response) {
                sendPaymentSuccessfulMail(
                    response,
                    order.amount / 100,
                    token
                );
                verifyPayment({ ...response, courses }, token, navigate, dispatch);
            },
        };

        // const paymentObject = new window.Razorpay(options);
        // paymentObject.open();
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
    } catch (error) {
        console.log("payment api error", error);
        toast.error("Could not make payment");
    }
    toast.dismiss(toastId);
}

async function sendPaymentSuccessfulMail(response, amount, token) {
    try {
        await apiConnector(
            "POST",
            SEND_PAYMENT_SUCCESS_EMAIL_API,
            {
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                amount,
            },
            { Authorization: `Bearer ${token}` }
        );
    } catch (error) {
        console.log("payment success email error...", error);
    }
}

async function verifyPayment(bodyData, token, navigate, dispatch) {
    const toastId = toast.loading("Verifying payment...");
    dispatch(setPaymentLoading(true));

    try {
        const response = await apiConnector(
            "POST",
            COURSE_VERIFY_API,
            bodyData,
            { Authorization: `Bearer ${token}` }
        );

        if (!response.data.success) {
            throw new Error(response.data.message);
        }

        toast.success("Payment successful");
        navigate("/dashboard/enrolled-courses");
        dispatch(resetCart());
    } catch (error) {
        console.log("payment verify error...", error);
        toast.error("Could not verify payment");
    }

    toast.dismiss(toastId);
    dispatch(setPaymentLoading(false));
}
