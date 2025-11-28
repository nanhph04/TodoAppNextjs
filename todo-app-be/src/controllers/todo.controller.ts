import { type Request, type Response } from "express";
import Todo, { type ITodo } from "../models/todo.model.js";

export const getTodos = async (req: Request, res: Response): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        if (req.query.page || req.query.limit) {
            const [todos, total] = await Promise.all([
                Todo.find().skip(skip).limit(limit),
                Todo.countDocuments(),
            ]);
            res.status(200).json({
                todos,
                total,
                page,
                totalPages: Math.ceil(total / limit),
            });
        } else {
            const todos: ITodo[] = await Todo.find();
            res.status(200).json({ todos, total: todos.length });
        }
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch todos", error });
    }
}

export const createTodo = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, description, priority } = req.body;
        const newTodo: ITodo = new Todo({
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
        const updatedTodo: ITodo | null = await Todo.findByIdAndUpdate(
            id,
            { title, description, priority, completed },
            { new: true }
        );
        if (updatedTodo) {
            res.status(200).json(updatedTodo);
        } else {
            res.status(404).json({ message: "Todo not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Failed to update todo", error });
    }
}

export const deleteTodo = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const deletedTodo: ITodo | null = await Todo.findByIdAndDelete(id);
        if (deletedTodo) {
            res.status(200).json({ message: "Todo deleted successfully" });
        } else {
            res.status(404).json({ message: "Todo not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Failed to delete todo", error });
    }
}
