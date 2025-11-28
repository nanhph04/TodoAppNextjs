import mongoose, { Schema, Document } from "mongoose";

export interface IRefreshToken extends Document {
    userId: mongoose.Types.ObjectId;
    token: string;
    createdAt: Date;
    expiresAt: Date;
}

const RefreshTokenSchema: Schema = new Schema({
    userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    token: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true },
});

RefreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model<IRefreshToken>("RefreshToken", RefreshTokenSchema);