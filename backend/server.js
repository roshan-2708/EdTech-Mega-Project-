const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");

// ================= ROUTES =================
const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const courseRoutes = require("./routes/Course");
const categoryRoutes = require("./routes/createCategory");
const sectionRoutes = require("./routes/sectionRoutes");
const subSectionRoutes = require("./routes/subsectionRoutes");
const courseProgressRoute = require("./routes/courseProgressRoutes");
const ratingAndReviewRoutes = require("./routes/ratingAndReviewRoutes");
const paymentRoutes = require("./routes/payments");

// ================= CONFIG =================
// 1. Yahan destructuring sahi hai
const { connectDB } = require("./config/database");
const { cloudinaryConnect } = require("./config/cloudinary");

const PORT = process.env.PORT || 5000;

// ================= DATABASE & CLOUDINARY =================
// 2. YAHAN GALTI THI — Isse aise likho:
connectDB();          // ✅ Ab ye sahi function call karega
cloudinaryConnect();   // ✅ Ye bhi sahi hai

// ================= CORS (NODE 22 SAFE) =================
const corsOptions = {
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// ================= MIDDLEWARE =================
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());

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

// ================= HEALTH CHECK =================
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "🚀 Server is up and running!",
        timestamp: new Date().toISOString(),
    });
});

// ================= START SERVER =================
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});