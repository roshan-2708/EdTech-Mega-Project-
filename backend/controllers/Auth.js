const User = require("../model/User");
const Otp = require("../model/Otp");
const Profile = require("../model/Profile");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailSender = require("../utils/mailSender");
require("dotenv").config();


// ---------------- SEND OTP ------------------

exports.sendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

        let otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });

        // Ensure unique OTP
        let exists = await Otp.findOne({ otp });
        while (exists) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            });
            exists = await Otp.findOne({ otp });
        }

        // Save OTP with 5 min expiry
        await Otp.create({
            email,
            otp,
            createdAt: Date.now(),
        });

        // SEND EMAIL
        await mailSender(
            email,
            "Your OTP Code",
            `<h3>Your OTP is: <b>${otp}</b></h3>
            <p>OTP valid for 5 minutes.</p>`
        );

        return res.status(200).json({
            success: true,
            message: "OTP sent successfully",
        });

    } catch (error) {
        console.error("SEND OTP ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to send OTP",
        });
    }
};


// ---------------- SIGN UP ------------------

exports.signUp = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
        } = req.body;


        // Basic validation
        if (!firstName || !lastName || !email || !password || !confirmPassword || !contactNumber) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }
        // Validate accountType
        const validAccountTypes = ["Student", "Instructor"];

        if (!accountType || !validAccountTypes.includes(accountType)) {
            return res.status(400).json({
                success: false,
                message: "Invalid account type",
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match."
            });
        }

        // Check existing user
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists."
            });
        }

        // Check email verification
        const verifiedEmail = await Otp.findOne({
            email,
            isVerified: true,
        });

        if (!verifiedEmail) {
            return res.status(400).json({
                success: false,
                message: "Email not verified. Please verify OTP first.",
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create profile
        const profile = await Profile.create({
            contactNumber,
        });

        // Create user
        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            accountType,
            additionalDetail: profile._id,
            image: `https://api.dicebear.com/7.x/initials/svg?seed=${firstName} ${lastName}`,
        });

        // Cleanup OTP
        await Otp.deleteMany({ email });

        return res.status(201).json({
            success: true,
            message: "User registered successfully.",
            user: newUser,
        });

    } catch (error) {
        console.error("SIGNUP ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Signup failed.",
        });
    }
};



// ---------------- LOGIN ------------------

exports.login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({
                success: false,
                message: "Email, password and role are required."
            });
        }

        const user = await User.findOne({ email }).populate("additionalDetail");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Incorrect password."
            });
        }
        if (user.accountType !== role) {
            return res.status(403).json({
                success: false,
                message: `You are registered as ${user.accountType}, not ${role}`,
            });
        }

        const payload = {
            id: user._id,
            email: user.email,
            role: user.accountType,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "2h",
        });

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        };

        user.password = undefined;

        return res
            .cookie("token", token, cookieOptions)
            .status(200)
            .json({
                success: true,
                message: "Login successful",
                token,
                user,
            });

    } catch (error) {
        console.error("LOGIN ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Login failed",
        });
    }
};

// ---------------- LOGOUT ------------------

exports.logout = async (req, res) => {
    try {
        // Clear cookie
        res.clearCookie("token", {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
        });

        return res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    } catch (error) {
        console.error("Logout error:", error);
        return res.status(500).json({
            success: false,
            message: "Logout failed",
        });
    }
};


// ---------------- CHANGE PASSWORD ------------------

exports.changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Both old and new password required."
            });
        }

        const user = await User.findById(req.user._id).select("+password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Old password incorrect."
            });
        }

        if (await bcrypt.compare(newPassword, user.password)) {
            return res.status(400).json({
                success: false,
                message: "New password cannot be same as old."
            });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        await mailSender(
            user.email,
            "Password Changed Successfully",
            `<p>Your password has been updated.</p>`
        );

        return res.status(200).json({
            success: true,
            message: "Password updated successfully."
        });

    } catch (error) {
        console.error("CHANGE PASSWORD ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update password.",
        });
    }
};

// verify otp
exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const otpRecord = await Otp.findOne({ email, otp });

        if (!otpRecord) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP",
            });
        }

        otpRecord.isVerified = true;
        await otpRecord.save();

        return res.status(200).json({
            success: true,
            message: "Email verified successfully",
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "OTP verification failed",
        });
    }
};
