import type { AuthRequest } from '../milddlewares/auth.middleware.js';
import { type Response } from 'express';



//--- GET USER INFO ---
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const user = req.user;
        const result = {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };
        console.log("GET /profile result:", result);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
}
