const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// Routes
const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const courseRoutes = require("./routes/Course");
const categoryRoutes = require("./routes/createCategory");
const sectionRoutes = require("./routes/sectionRoutes");
const subSectionRoutes = require("./routes/subsectionRoutes");
const courseProgressRoute = require("./routes/courseProgressRoutes");
const ratingAndReviewRoutes = require("./routes/ratingAndReviewRoutes");
const paymentRoutes = require("./routes/payments");

// Configs
const database = require("./config/database");
const { cloudinaryConnect } = require("./config/cloudinary");

dotenv.config();
const PORT = process.env.PORT || 5000;

// ================= DATABASE =================
database.connect();

// ================= CORS =================
const allowedOrigins = [
    "http://localhost:3000",
    "https://ed-tech-mega-project.vercel.app",
    "https://ed-tech-mega-project-2k0771xkv.vercel.app"
];

const corsOptions = {
    origin: function (origin, callback) {
        // Check if origin is in allowedOrigins or ends with .vercel.app
        if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
            callback(null, true);
        } else {
            console.log("Blocked by CORS:", origin); // Log blocked origins for debugging
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"]
};

// 1. Add this line explicitly for preflight requests
app.options("*", cors(corsOptions));

// 2. Then use the middleware globally
app.use(cors(corsOptions));


// ================= MIDDLEWARE =================
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());

// ================= CLOUDINARY =================
cloudinaryConnect();

// ================= ROUTES =================
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/section", sectionRoutes);
app.use("/api/v1/subsection", subSectionRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/rating", ratingAndReviewRoutes);
app.use("/api/v1/progress", courseProgressRoute);

// ================= TEST =================
app.get("/", (req, res) => {
    res.json({ success: true, message: "🚀 Server Perfect!" });
});

// ================= START SERVER =================
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
