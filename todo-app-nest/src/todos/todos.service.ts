import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from 'src/todos/schema/Todos.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class TodosService {
  constructor(@InjectModel('Todo') private readonly todoModel: Model<Todo>) { }

  async create(userId: string, createTodoDto: CreateTodoDto): Promise<Todo> {
    const anyTodo = createTodoDto as any;
    if (anyTodo._id) {
      delete anyTodo._id;
    }
    const newTodo = new this.todoModel({
      ...createTodoDto,
      userId,
    });
    return await newTodo.save();
  }

  async findAll(): Promise<Todo[]> {
    return await this.todoModel.find().exec();
  }

  async findOne(id: string): Promise<Todo> {
    const todo = await this.todoModel.findById(id).exec();
    if (!todo) {
      throw new Error('Todo not found');
    }
    return todo;
  }

  async update(id: string, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Invalid ID format');
    const updatedTodo = await this.todoModel
      .findByIdAndUpdate(id, updateTodoDto, { new: true })
      .exec();
    if (!updatedTodo) {
      throw new NotFoundException('Todo not found');
    }
    return updatedTodo;
  }

  async remove(id: string): Promise<Todo> {
    const deletedTodo = await this.todoModel.findByIdAndDelete(id).exec();
    if (!deletedTodo) {
      throw new NotFoundException('Todo not found');
    }
    return deletedTodo;
  }

  async findByUserId(userId: string, page: number, limit: number): Promise<{ data: Todo[]; total: number }> {
    if (!userId) {
      return { data: [], total: 0 };
    }
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

  async syncTodos(userId: string, localTodos: CreateTodoDto[]): Promise<Todo[]> {
    if (!userId) {
      throw new NotFoundException('Invalid User ID');
    }
    const result: Todo[] = [];

    for (const localTodo of localTodos) {
      const anyTodo = localTodo as any;
      if (anyTodo._id && !Types.ObjectId.isValid(anyTodo._id)) {
        delete anyTodo._id;
      }
      const newTodo = new this.todoModel({
        ...localTodo,
        userId: userId,
        completed: localTodo.completed ?? false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      await newTodo.save();
      result.push(newTodo);
    }
    return result;
  }

}