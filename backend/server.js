const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");

// Database connections pehle initialize karein
const { connectDB } = require("./config/database");
const { cloudinaryConnect } = require("./config/cloudinary");

connectDB();
cloudinaryConnect();

// --- PASSPORT FIXED LOGIC ---
// 1. Official npm package load karo jisme .initialize() function hota hai
const passport = require("passport"); 
// 2. Apni custom config/strategies wali file ko execute karo
require("./config/passport"); 

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

const PORT = process.env.PORT || 5000;

const corsOptions = {
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());

// Passport Middleware (Ab ye perfect chalega)
app.use(passport.initialize());

// API Routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/section", sectionRoutes);
app.use("/api/v1/subsection", subSectionRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/rating", ratingAndReviewRoutes);
app.use("/api/v1/progress", courseProgressRoute);

// Health check endpoints
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "🚀 Server is up and running!",
        timestamp: new Date().toISOString(),
    });
});

app.get('/health', (req, res) => {
    res.status(200).send('Server is active');
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});