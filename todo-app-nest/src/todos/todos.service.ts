import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from 'src/todos/schema/Todos.schema';
import { Types } from 'mongoose';
import { TodosRepository } from './todos.repository';

@Injectable()
export class TodosService {
  constructor(
    private readonly todosRepository: TodosRepository
  ) { }

  async create(userId: string, createTodoDto: CreateTodoDto): Promise<Todo> {
    const { _id, ...rest } = createTodoDto as any;
    const newTodo = await this.todosRepository.create({
      ...rest,
      userId,
    });
    return newTodo;
  }

  async findOne(id: string): Promise<Todo> {
    const todo = await this.todosRepository.findById(id);
    if (!todo) {
      throw new Error('Todo not found');
    }
    return todo;
  }

  async update(id: string, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Invalid ID format');
    let updateData: any = { ...updateTodoDto };
    delete updateData.userId;
    delete updateData._id;
    const updatedTodo = await this.todosRepository.update(id, updateData);
    if (!updatedTodo) {
      throw new NotFoundException('Todo not found');
    }
    return updatedTodo;
  }

  async remove(id: string): Promise<Todo> {
    const deletedTodo = await this.todosRepository.delete(id);
    if (!deletedTodo) {
      throw new NotFoundException('Todo not found');
    }
    return deletedTodo;
  }

  async findByUserId(userId: string, page: number, limit: number): Promise<{ data: Todo[]; total: number }> {
    if (!userId) {
      return { data: [], total: 0 };
    }
    const [data, total] = await Promise.all([
      this.todosRepository.findByUserId(userId, page, limit).then(res => res.data),
      this.todosRepository.findByUserId(userId, page, limit).then(res => res.total)
    ]);
    return { data, total };
  }

  async findAll(page: number, limit: number): Promise<{ data: Todo[]; total: number }> {
    return this.todosRepository.findAll(page, limit);
  }

  async countCompletedTodos(userId: string, isAdmin: boolean): Promise<{ completed: number; notCompleted: number; total: number }> {
    const filter: any = {};
    if (!isAdmin) {
      filter.userId = userId;
    }
    const [completed, notCompleted, total] = await Promise.all([
      this.todosRepository.countByFilter({ ...filter, completed: true }),
      this.todosRepository.countByFilter({ ...filter, completed: false }),
      this.todosRepository.countByFilter(filter)
    ]);
    return { completed, notCompleted, total };
  }

}