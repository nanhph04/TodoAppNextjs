import mongoose, { Schema, Document } from 'mongoose';

export interface ITodo extends Document {
    title: string;
    description?: string;
    priority?: 'low' | 'medium' | 'high';
    userId: string;
    completed: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const TodoSchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: false },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    completed: { type: Boolean, default: false },
}, { timestamps: true, });

export default mongoose.model<ITodo>('Todo', TodoSchema);