import { type Request, type Response } from "express";
import type { AuthRequest } from "../milddlewares/auth.middleware.js";

import {
    getTodosService,
    createTodoService,
    updateTodoService,
    deleteTodoService,
    syncTodosService
} from "../services/todo.service.js";

export const getTodos = async (req: Request, res: Response): Promise<void> => {
    try {
        const page = req.query.page ? parseInt(req.query.page as string) : undefined;
        const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
        const userId = (req as AuthRequest).user?._id;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized: Missing userId" });
            return;
        }
        const result = await getTodosService(userId, page, limit);
        res.status(200).json(result);
    } catch (error) {
        console.error("getTodos error:", error);
        res.status(500).json({ message: "Lỗi lấy dữ liệu", error: error instanceof Error ? error.message : error });
    }
}

export const createTodo = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as AuthRequest).user._id;
        const savedTodo = await createTodoService(userId, req.body);
        res.status(201).json(savedTodo);
    } catch (error) {
        res.status(500).json({ message: "Lỗi tạo todo", error });
    }
}

export const updateTodo = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = (req as AuthRequest).user._id;
        const updatedTodo = await updateTodoService(userId, id, req.body);
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
        const userId = (req as AuthRequest).user._id;
        const deletedTodo = await deleteTodoService(userId, id);
        if (deletedTodo) {
            res.status(200).json({ message: "Todo deleted successfully" });
        } else {
            res.status(404).json({ message: "Todo not found or not authorized" });
        }
    } catch (error) {
        res.status(500).json({ message: "Failed to delete todo", error });
    }
}

export const syncTodos = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as AuthRequest).user._id;
        const { localTodos } = req.body;
        const todos = await syncTodosService(userId, localTodos);
        res.status(200).json({ todos });
    } catch (error) {
        res.status(500).json({ message: "Lỗi đồng bộ", error });
    }
}
