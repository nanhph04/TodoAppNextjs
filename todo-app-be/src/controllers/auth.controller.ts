import { type Request, type Response } from 'express';
import User from '../models/user.model.js';
import RefreshToken from '../models/refreshToken.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { AuthRequest } from '../milddlewares/auth.middleware.js';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_should_change';
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET || 'default_refresh_secret';

const generateAccessToken = (userId: string) => {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '15m' });
};

const generateRefreshToken = (userId: string) => {
    return jwt.sign({ userId }, REFRESH_SECRET, { expiresIn: '7d' });
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

        const accessToken = generateAccessToken(newUser._id.toString());
        const refreshToken = generateRefreshToken(newUser._id.toString());

        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 ngày
        await RefreshToken.create({
            userId: newUser._id,
            token: refreshToken,
            expiresAt,
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 ngày
        });
        res.status(201).json({
            accessToken,
            user: {
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email
            }
        });
    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ message: "Registration failed" });
    }
}

// --- LOGIN ---
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            res.status(401).json({ message: "Invalid email or password" });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ message: "Invalid email or password" });
            return;
        }

        const accessToken = generateAccessToken(user._id.toString());
        const refreshToken = generateRefreshToken(user._id.toString());

        // Lưu refresh token vào collection RefreshToken
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 ngày
        await RefreshToken.create({
            userId: user._id,
            token: refreshToken,
            expiresAt,
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 ngày
        });
        res.status(200).json({
            accessToken,
            user: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Login failed" });
    }
}

//--- GET USER INFO ---
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        // Vì middleware 'protect' đã chạy trước, nên req.user đã có dữ liệu
        const user = req.user;

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            // Thêm các trường khác nếu muốn (avatar, role...)
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
}

//--- REFRESH TOKEN ---
export const refreshToken = async (req: Request, res: Response): Promise<void> => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            res.status(400).json({ message: "Refresh token is required" });
            return;
        }

        try {
            // Tìm refresh token trong DB
            const storedToken = await RefreshToken.findOne({ token: refreshToken });
            if (!storedToken) {
                res.status(403).json({ message: "Refresh token not found!" });
                return;
            }
            // Kiểm tra hạn sử dụng
            if (storedToken.expiresAt < new Date()) {
                res.status(403).json({ message: "Refresh token expired!" });
                return;
            }
            // Xác thực token
            const decoded = jwt.verify(refreshToken, REFRESH_SECRET as string) as { userId: string };
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