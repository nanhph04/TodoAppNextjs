import mongoose, { Schema, Document } from 'mongoose';

export interface ITodo extends Document {
    title: string;
    description?: string;
    priority?: 'low' | 'medium' | 'high';
    userId: mongoose.Types.ObjectId;
    completed: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const TodoSchema: Schema = new Schema({
    userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: false },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    completed: { type: Boolean, default: false },
}, { timestamps: true, });

export default mongoose.model<ITodo>('Todo', TodoSchema);