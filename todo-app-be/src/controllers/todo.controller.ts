import { type Request, type Response } from "express";
import { Types } from "mongoose";
import type { AuthRequest } from "../milddlewares/auth.middleware.js";
import Todo, { type ITodo } from "../models/todo.model.js";

export const getTodos = async (req: Request, res: Response): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const userId = (req as AuthRequest).user?._id;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized: Missing userId" });
            return;
        }

        if (req.query.page || req.query.limit) {
            const [todos, total] = await Promise.all([
                Todo.find({ userId }).skip(skip).limit(limit),
                Todo.countDocuments({ userId }),
            ]);
            res.status(200).json({
                todos,
                total,
                page,
                totalPages: Math.ceil(total / limit),
            });
        } else {
            const todos: ITodo[] = await Todo.find({ userId });
            res.status(200).json({ todos, total: todos.length });
        }
    } catch (error) {
        console.error("getTodos error:", error);
        res.status(500).json({ message: "Failed to fetch todos", error: error instanceof Error ? error.message : error });
    }
}

export const createTodo = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, description, priority } = req.body;
        const newTodo: ITodo = new Todo({
            userId: (req as AuthRequest).user._id,
            title,
            description,
            priority,
            completed: false,
        });
        const savedTodo: ITodo = await newTodo.save();
        res.status(201).json(savedTodo);
    } catch (error) {
        res.status(500).json({ message: "Failed to create todo", error });
    }
}

export const updateTodo = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { title, description, priority, completed } = req.body;
        const userId = (req as AuthRequest).user._id;
        if (!id || !Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: "Invalid todo id" });
            return;
        }
        const updatedTodo: ITodo | null = await Todo.findOneAndUpdate(
            { _id: new Types.ObjectId(id), userId },
            { title, description, priority, completed },
            { new: true }
        );
        if (updatedTodo) {
            res.status(200).json(updatedTodo);
        } else {
            res.status(404).json({ message: "Todo not found or not authorized" });
        }
    } catch (error) {
        res.status(500).json({ message: "Failed to update todo", error });
    }
}

export const deleteTodo = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        // Chỉ cho phép xóa todo của user hiện tại
        const userId = (req as AuthRequest).user._id;
        if (!id || !Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: "Invalid todo id" });
            return;
        }
        const deletedTodo: ITodo | null = await Todo.findOneAndDelete({ _id: new Types.ObjectId(id), userId });
        if (deletedTodo) {
            res.status(200).json({ message: "Todo deleted successfully" });
        } else {
            res.status(404).json({ message: "Todo not found or not authorized" });
        }
    } catch (error) {
        res.status(500).json({ message: "Failed to delete todo", error });
    }
}
