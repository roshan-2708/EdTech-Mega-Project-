const express = require("express");
const app = express();

const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const courseRoutes = require("./routes/Course");
const categoryRoutes = require("./routes/createCategory");
const sectionRoutes = require("./routes/sectionRoutes");
const subSectionRoutes = require("./routes/subsectionRoutes");
const courseProgressRoute = require("./routes/courseProgressRoutes");
const ratingAndReviewRoutes = require("./routes/ratingAndReviewRoutes");
const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { cloudinaryConnect } = require("./config/cloudinary");
const dotenv = require("dotenv");
const paymentRoutes = require("./routes/payments");

dotenv.config();
const PORT = process.env.PORT || 5000;

// Database
database.connect();

// ================= MIDDLEWARE =================
const allowedOrigins = [
    "http://localhost:3000",
    "https://ed-tech-mega-project.vercel.app",
];

// CORS middleware
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (
        allowedOrigins.includes(origin) ||
        (origin && origin.endsWith(".vercel.app"))
    ) {
        res.setHeader("Access-Control-Allow-Origin", origin);
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept, Authorization"
        );
        res.setHeader(
            "Access-Control-Allow-Methods",
            "GET, POST, PUT, PATCH, DELETE, OPTIONS"
        );
    }
    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }
    next();
});



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

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
