const jwt = require("jsonwebtoken");
require("dotenv").config();

// AUTH
exports.auth = async (req, res, next) => {
    try {
        const token =
            req.headers.authorization?.replace("Bearer ", "") ||
            req.body.token ||
            req.cookies.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No token provided",
            });
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decode;

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Invalid token",
            });
        }

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized",
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
