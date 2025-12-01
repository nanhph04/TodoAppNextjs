import { type Request, type Response } from 'express';
import User from '../models/user.model.js';
import RefreshToken from '../models/refreshToken.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import '../configs/env.js';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

const generateAccessToken = (userId: string) => {
    return jwt.sign({ userId }, ACCESS_TOKEN_SECRET!, { expiresIn: '15m' });
};

const generateRefreshToken = (userId: string) => {
    return jwt.sign({ userId }, REFRESH_TOKEN_SECRET!, { expiresIn: '7d' });
};

// --- REGISTER ---
export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { fullName, email, password } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(400).json({ message: "User already exists" });
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ fullName, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({
            message: "User registered successfully",
            user: {
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email
            }
        });
    } catch (error: any) {
        if (error.code === 11000 && error.keyPattern?.email) {
            res.status(400).json({ message: "Email đã tồn tại" });
        } else if (error.name === "ValidationError") {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Đăng ký thất bại" });
        }
    }
}

// --- LOGIN ---
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            res.status(404).json({ message: "Email hoặc mật khẩu không đúng" });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ message: "Email hoặc mật khẩu không đúng" });
            return;
        }

        const accessToken = generateAccessToken(user._id.toString());
        const refreshToken = generateRefreshToken(user._id.toString());

        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 ngày

        await RefreshToken.deleteMany({ userId: user._id });
        await RefreshToken.create({
            userId: user._id,
            token: refreshToken,
            expiresAt,
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            accessToken
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Login failed" });
    }
}


//--- REFRESH TOKEN ---
export const refreshToken = async (req: Request, res: Response): Promise<void> => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            res.status(401).json({ message: "Bạn chưa đăng nhập" });
            return;
        }

        try {
            const storedToken = await RefreshToken.findOne({ token: refreshToken });
            if (!storedToken) {
                res.status(403).json({ message: "Refresh token not found!" });
                return;
            }
            if (storedToken.expiresAt < new Date()) {
                res.status(403).json({ message: "Refresh token expired!" });
                return;
            }
            const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET as string) as { userId: string };
            const user = await User.findById(decoded.userId);
            if (!user) {
                res.status(403).json({ message: "User not found!" });
                return;
            }
            const newAccessToken = generateAccessToken(user._id.toString());
            res.status(200).json({ accessToken: newAccessToken });
        } catch (err) {
            console.error("Refresh Token Error:", err);
            res.status(403).json({ message: "Invalid refresh token" });
        }
    }
    catch (error) {
        console.error("Refresh Token Error:", error);
        res.status(500).json({ message: "Refresh token failed" });
    }
}

//--- LOGOUT ---
export const logout = async (req: Request, res: Response): Promise<void> => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (refreshToken) {
            await RefreshToken.deleteOne({ token: refreshToken });
            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: false,
                sameSite: 'strict',
            });
        }
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Logout Error:", error);
        res.status(500).json({ message: "Logout failed" });
    }
}