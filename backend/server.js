const express = require("express");
const app = express();

const path = require("path");
const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const paymentRoutes = require("./routes/Payment");
const courseRoutes = require("./routes/Course");
const categoryRoutes = require("./routes/createCategory");
const sectionRoutes = require("./routes/sectionRoutes");
const subSectionRoutes = require("./routes/subsectionRoutes")
const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { cloudinaryConnect } = require("./config/cloudinary");
const dotenv = require("dotenv");

// ✅ ADD fileupload middleware
const fileUpload = require('express-fileupload');

dotenv.config();
const PORT = process.env.PORT || 4000;

// Database
database.connect();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
    createParentPath: true,
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB
}));

app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);

cloudinaryConnect();

// Routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/section", sectionRoutes);
app.use("/api/v1/subsection", subSectionRoutes);
// Test
app.get("/", (req, res) => {
    res.json({ success: true, message: "Server running" });
});

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});
