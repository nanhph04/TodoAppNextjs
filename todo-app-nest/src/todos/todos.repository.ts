

import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Todo, TodoDocument } from "./schema/Todos.schema";
import { Model } from "mongoose";

@Injectable()
export class TodosRepository {
    constructor(
        @InjectModel(Todo.name) private todoModel: Model<TodoDocument>,
    ) { }

    async findAll(page: number, limit: number): Promise<{ data: TodoDocument[]; total: number }> {
        const [data, total] = await Promise.all([
            this.todoModel.find()
                .skip((page - 1) * limit)
                .limit(limit)
                .exec(),
            this.todoModel.countDocuments()
        ]);
        return { data, total };
    }

    async findById(id: string): Promise<TodoDocument | null> {
        return this.todoModel.findById(id).exec();
    }

    async create(todoData: Partial<TodoDocument>): Promise<TodoDocument> {
        const newTodo = new this.todoModel(todoData);
        return newTodo.save();
    }

    async update(id: string, updateData: Partial<TodoDocument>): Promise<TodoDocument | null> {
        return this.todoModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    }

    async delete(id: string): Promise<TodoDocument | null> {
        return this.todoModel.findByIdAndDelete(id).exec();
    }

    async findByUserId(userId: string, page: number, limit: number): Promise<{ data: TodoDocument[]; total: number }> {
        const filter = { userId: userId };
        const [data, total] = await Promise.all([
            this.todoModel.find(filter)
                .skip((page - 1) * limit)
                .limit(limit)
                .exec(),
            this.todoModel.countDocuments(filter)
        ]);
        return { data, total };
    }

    async countByFilter(filter: any): Promise<number> {
        return this.todoModel.countDocuments(filter);
    }


}