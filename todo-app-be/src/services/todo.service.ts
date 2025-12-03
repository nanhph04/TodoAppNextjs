import { Types } from "mongoose";
import Todo, { type ITodo } from "../models/todo.model.js";


export const getTodosService = async (userId: string, page?: number, limit?: number) => {
    if (!userId) throw new Error("Missing userId");
    if (page || limit) {
        const _page = page || 1;
        const _limit = limit || 10;
        const skip = (_page - 1) * _limit;
        const [todos, total] = await Promise.all([
            Todo.find({ userId }).skip(skip).limit(_limit),
            Todo.countDocuments({ userId }),
        ]);
        return {
            todos,
            total,
            page: _page,
            totalPages: Math.ceil(total / _limit),
        };
    } else {
        const todos: ITodo[] = await Todo.find({ userId });
        return { todos, total: todos.length };
    }
};

export const createTodoService = async (userId: string, data: any) => {
    const newTodo: ITodo = new Todo({
        userId,
        title: data.title,
        description: data.description,
        priority: data.priority,
        completed: false,
    });
    return await newTodo.save();
};

export const updateTodoService = async (userId: string, id: string, data: any) => {
    if (!id || !Types.ObjectId.isValid(id)) throw new Error("Invalid todo id");
    return await Todo.findOneAndUpdate(
        { _id: new Types.ObjectId(id), userId },
        { title: data.title, description: data.description, priority: data.priority, completed: data.completed },
        { new: true }
    );
};

export const deleteTodoService = async (userId: string, id: string) => {
    if (!id || !Types.ObjectId.isValid(id)) throw new Error("Invalid todo id");
    return await Todo.findOneAndDelete({ _id: new Types.ObjectId(id), userId });
};

export const syncTodosService = async (userId: string, localTodos: any[]) => {
    if (localTodos && localTodos.length > 0) {
        const todosToInsert = localTodos.map((todo: any) => ({
            userId: userId,
            title: todo.title,
            description: todo.description,
            priority: todo.priority,
            completed: todo.completed
        }));
        await Todo.insertMany(todosToInsert);
    }
    return await Todo.find({ userId });
};
