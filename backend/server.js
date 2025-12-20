const express = require("express");
const app = express();

const path = require("path");   // ✅ MUST ADD THIS

const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const paymentRoutes = require("./routes/Payment");
const courseRoutes = require("./routes/Course");
const categoryRoutes = require("./routes/createCategory");
const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { cloudinaryConnect } = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");
const sectionRoutes = require("./routes/sectionRoutes");
const SubSection = require("./routes/subsectionRoutes");
const contactRoutes = require("./routes/contactRoutes");
dotenv.config();
const PORT = process.env.PORT || 4000;

// Database connect
database.connect();

app.use(express.json());
app.use(cookieParser());

app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);

// ✅ FIXED TEMP FOLDER
app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: path.join(__dirname, "tmp"), // ✔ works now
    })
);

// Cloudinary connection
cloudinaryConnect();

// Routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/section", sectionRoutes);
app.use("/api/v1/subsection", SubSection);
app.use("/api/v1/", contactRoutes);
// Default route
app.get("/", (req, res) => {
    return res.json({
        success: true,
        message: "Your server is running.",
    });
});

app.listen(PORT, () => {
    console.log(`App is running at ${PORT}`);
});
