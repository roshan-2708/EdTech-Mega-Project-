const express = require("express");
const app = express();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const courseRoutes = require("./routes/Course");
const categoryRoutes = require("./routes/createCategory");
const sectionRoutes = require("./routes/sectionRoutes");
const subSectionRoutes = require("./routes/subsectionRoutes");
const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { cloudinaryConnect } = require("./config/cloudinary");
const dotenv = require("dotenv");
const paymentRoutes = require("./routes/payments")
dotenv.config();
const PORT = process.env.PORT || 5000;

// Database
database.connect();

// ================= MIDDLEWARE =================
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));

app.use(express.json({ limit: "50mb" })); // ✅ ONLY JSON
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

// ================= TEST =================
app.get("/", (req, res) => {
    res.json({ success: true, message: "🚀 Server Perfect!" });
});

app.listen(PORT, () => {
    console.log(`🚀 Server: http://localhost:${PORT}`);
});
