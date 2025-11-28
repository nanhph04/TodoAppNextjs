import mongoose, { Schema, Document, model } from 'mongoose';
export interface IUser extends Document {
    fullName: string;
    email: string;
    password: string;
    refreshToken?: string;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema({
    fullName: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    refreshToken: { type: String },
}, { timestamps: true, });

export default mongoose.model<IUser>('User', UserSchema);

