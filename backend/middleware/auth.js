const jwt = require("jsonwebtoken");
require("dotenv").config();

// AUTH
exports.auth = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization?.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        } else if (req.cookies?.token) {
            token = req.cookies.token;
        } else if (req.body?.token) {
            token = req.body.token;
        }

        console.log("TOKEN RECEIVED:", token); // 🔍 DEBUG

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token missing",
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log("DECODED USER:", decoded); // 🔍 DEBUG

        req.user = decoded;
        next();
    } catch (error) {
        console.error("AUTH ERROR:", error.message);

        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
};


// ROLE: STUDENT
exports.isStudent = (req, res, next) => {
    try {
        if (req.user.role !== "Student") {
            return res.status(401).json({
                success: false,
                message: "Protected route for Students only",
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Role verification failed",
        });
    }
};

// ROLE: INSTRUCTOR
exports.isInstructor = (req, res, next) => {
    try {
        if (req.user.role !== "Instructor") {
            return res.status(401).json({
                success: false,
                message: "Protected route for Instructors only",
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Role verification failed",
        });
    }
};

// ROLE: ADMIN
exports.isAdmin = (req, res, next) => {
    try {
        if (req.user.role !== "Admin") {
            return res.status(401).json({
                success: false,
                message: "Protected route for Admins only",
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Role verification failed",
        });
    }
};
