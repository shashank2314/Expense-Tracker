const bcrypt = require("bcryptjs");
const jwt =require("jsonwebtoken")
const  RefreshToken  = require("../models/RefreshToken.js");
const otpGenerator = require("otp-generator")
const mailSender = require("../utils/mailSender")
const OTP = require("../models/OTP")
const User = require("../models/User");
require("dotenv").config();

exports.sendotp = async (req, res) => {
    try {
        const { email } = req.body
        if (
            !email 
        ) {
            return res.status(403).send({
                success: false,
                message: "All Fields are required",
            })
        }
        // Check if user is already present
        // Find user with provided email
        const checkUserPresent = await User.findOne({ email })
        // to be used in case of signup

        // If user found with provided email
        if (checkUserPresent) {
            // Return 401 Unauthorized status code with error message
            return res.status(401).json({
                success: false,
                message: `User is Already Registered`,
            })
        }

        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        })
        const result = await OTP.findOne({ otp: otp })
        // console.log("Result is Generate OTP Func")
        // console.log("OTP", otp)
        // console.log("Result", result)
        while (result) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
            })
        }
        const otpBody = await OTP.create({ email: email, otp })

        // console.log("OTP Body", otpBody)
        res.status(200).json({
            success: true,
            message: `OTP Sent Successfully`,
            otp,
        })
    } catch (error) {
        // console.log(error.message)
        return res.status(500).json({ success: false, error: error.message })
    }
}
exports.register = async (req, res) => {
    try {
        const { name, email, password, otp } = req.body;
        if (!name || !email || !password || !otp) {
            return res.status(401).json({
                message: "Something is missing, please check!",
                success: false,
            });
        }
        const user = await User.findOne({ email });
        if (user) {
            return res.status(401).json({
                message: "You have already account or Try different email",
                success: false,
            });
        };
        // Find the most recent OTP for the email
        const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1)
        // console.log(response)
        if (response.length === 0) {
            // OTP not found for the email
            return res.status(400).json({
                success: false,
                message: "The OTP is not valid",
            })
        } else if (otp !== response[0].otp) {
            // Invalid OTP
            return res.status(400).json({
                success: false,
                message: "The OTP is not valid",
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            name,
            email,
            password: hashedPassword
        });
        return res.status(201).json({
            message: "Account created successfully.",
            success: true,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error', success: false });
    }
}
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(401).json({
                message: "Something is missing, please check!",
                success: false,
            });
        }
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: "Incorrect email or you need to signup",
                success: false,
            });
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                message: "Incorrect email or password",
                success: false,
            });
        };

        const accessToken = await jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1d' });
        const refreshToken = await jwt.sign({ userId: user._id }, process.env.REFRESH_SECRET_KEY, { expiresIn: '10d' });

        const refreshTokenInstance = await RefreshToken.create({ refreshToken });
        console.log("refreshTokenInstance", refreshTokenInstance);
        user.refreshToken.push(refreshTokenInstance._id);

        await user.save();
        return res.cookie('accessToken', accessToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 1 * 24 * 60 * 60 * 1000 }).cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 10 * 24 * 60 * 60 * 1000 }).json({
            message: `Welcome back ${user.name}`,
            success: true,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
            },
            accessToken: accessToken
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error', success: false });
    }
};
exports.refreshAccessToken = async (req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
    
    if (!incomingRefreshToken) {
        return res.status(401).json({
            message: "Unauthorized request",
            success: false,
        });
    }

    try {
        // Verify incoming refresh token
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_SECRET_KEY
        );

        const user = await User.findById(decodedToken?.userId).populate('refreshToken');
        if (!user) {
            return res.status(401).json({
                message: "Invalid refresh token",
                success: false,
            });
        }

        // Remove the old refresh token
        user.refreshToken = user.refreshToken.filter(token => token.refreshToken !== incomingRefreshToken);
        await RefreshToken.deleteOne({ refreshToken: incomingRefreshToken });

        // Generate new tokens
        const accessToken = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1d' });
        const refreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_SECRET_KEY, { expiresIn: '10d' });

        // Save the new refresh token
        const refreshTokenInstance = await RefreshToken.create({ refreshToken });
        user.refreshToken.push(refreshTokenInstance._id);
        await user.save();

        return res
            .status(200)
            .cookie('accessToken', accessToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 1 * 24 * 60 * 60 * 1000 })
            .cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 10 * 24 * 60 * 60 * 1000 })
            .json({
                message: "Access token refreshed",
                success: true,
                accessToken: accessToken,
            });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error?.message,
        });
    }
};

exports.logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        const decodedToken = jwt.verify(
            refreshToken,
            process.env.REFRESH_SECRET_KEY
        )
        const user = await User.findById(decodedToken?.userId).populate('refreshToken')
        user.refreshToken = user.refreshToken.filter(token => token.refreshToken !== refreshToken);
        await user.save();
        await RefreshToken.deleteOne({ refreshToken });
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        return res.json({
            message: 'Logged out successfully.',
            success: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error', success: false });
    }
};