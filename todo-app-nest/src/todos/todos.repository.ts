import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Todo, TodoDocument } from "./schema/Todos.schema";
import { TodoLean, PopulatedUser } from "./schema/todo-lean.interface";
import { Model, Types } from "mongoose";

@Injectable()
export class TodosRepository {
    constructor(
        @InjectModel(Todo.name) private todoModel: Model<TodoDocument>,
    ) { }

    // Cập nhật lại kiểu trả về (nếu cần thiết, hoặc để any/object tạm thời)
    // Tốt nhất bạn nên tạo một DTO (Data Transfer Object) cho response, nhưng ở đây mình để object cho nhanh.

    async findAll(page: number, limit: number): Promise<{ data: TodoLean[]; total: number }> {
        const [data, total] = await Promise.all([
            this.todoModel.find()
                .lean() // <--- QUAN TRỌNG: Chuyển đổi sang object thuần để nhẹ hơn và dễ sửa đổi
                .populate('assignee', 'fullName')
                .populate('createdBy', 'fullName')
                .skip((page - 1) * limit)
                .limit(limit)
                .exec(),
            this.todoModel.countDocuments()
        ]);

        // Xử lý làm phẳng dữ liệu (Flatten data)
        const formattedData: TodoLean[] = data.map(todo => ({
            _id: todo._id,
            title: todo.title,
            description: todo.description,
            status: todo.status,
            priority: todo.priority,
            assignee:
                typeof todo.assignee === 'object' && todo.assignee && 'fullName' in todo.assignee
                    ? todo.assignee as PopulatedUser
                    : undefined,
            createdBy:
                typeof todo.createdBy === 'object' && todo.createdBy && 'fullName' in todo.createdBy
                    ? todo.createdBy as PopulatedUser
                    : undefined,
        }));
        return { data: formattedData, total };
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

    async findByUserId(userId: string, page: number, limit: number): Promise<{ data: TodoLean[]; total: number }> {
        const userObjId = new Types.ObjectId(userId);
        const filter = { $or: [{ assignee: userObjId }, { createdBy: userObjId }] };
        const [data, total] = await Promise.all([
            this.todoModel.find(filter)
                .lean()
                .populate('assignee', 'fullName')
                .populate('createdBy', 'fullName')
                .skip((page - 1) * limit)
                .limit(limit)
                .exec(),
            this.todoModel.countDocuments(filter)
        ]);
        const formattedData: TodoLean[] = data.map(todo => ({
            _id: todo._id,
            title: todo.title,
            description: todo.description,
            status: todo.status,
            priority: todo.priority,
            assignee:
                typeof todo.assignee === 'object' && todo.assignee && 'fullName' in todo.assignee
                    ? todo.assignee as PopulatedUser
                    : undefined,
            createdBy:
                typeof todo.createdBy === 'object' && todo.createdBy && 'fullName' in todo.createdBy
                    ? todo.createdBy as PopulatedUser
                    : undefined,
        }));
        return { data: formattedData, total };
    }

    async countByFilter(filter: any): Promise<number> {
        return this.todoModel.countDocuments(filter);
    }


}