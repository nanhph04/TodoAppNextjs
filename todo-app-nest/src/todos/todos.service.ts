import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './schema/Todos.schema'; // Đảm bảo đường dẫn đúng
import { TodosRepository } from './todos.repository';
import { Types } from 'mongoose';

@Injectable()
export class TodosService {
  constructor(private readonly todosRepository: TodosRepository) { }

  // --- HELPER: Check quyền sở hữu ---
  // Nếu user có quyền 'bất tử' (*:*) hoặc quyền 'any' -> Bỏ qua check
  // Nếu chỉ có quyền 'own' -> Bắt buộc assignee phải là userId
  private checkOwnership(task: Todo, userId: string, userPermissions: string[], action: 'read' | 'update' | 'delete') {
    const hasAnyPerm = userPermissions.includes('*:*') || userPermissions.includes(`task:${action}:any`);
    const hasOwnPerm = userPermissions.includes(`task:${action}:own`);

    if (hasAnyPerm) return; // SuperAdmin hoặc Auditor -> OK

    if (hasOwnPerm) {
      // Logic: Chỉ được thao tác nếu mình là assignee hoặc createdBy
      if (task.assignee.toString() !== userId && task.createdBy.toString() !== userId) {
        throw new ForbiddenException('Bạn không có quyền thao tác trên task của người khác');
      }
      return;
    }

    throw new ForbiddenException('Bạn không có quyền thực hiện hành động này');
  }

  async create(createTodoDto: CreateTodoDto, userId: string, userPermissions: string[]): Promise<Todo> {

    let assignee = createTodoDto.assignee;
    // Nếu KHÔNG có quyền tạo cho người khác, ép assignee là chính mình
    const canCreateAny = userPermissions.includes('*:*') || userPermissions.includes('task:create:any');
    if (!canCreateAny) {
      assignee = userId;
    }

    // Convert assignee và createdBy sang ObjectId
    const assigneeObjId = assignee ? new Types.ObjectId(assignee) : new Types.ObjectId(userId);
    const createdByObjId = new Types.ObjectId(userId);

    const todoData: any = {
      ...createTodoDto,
      assignee: assigneeObjId,
      createdBy: createdByObjId,
      status: createTodoDto['status'] || 'TODO',
      priority: createTodoDto['priority'] || 'medium',
    };
    return this.todosRepository.create(todoData);
  }

  async findAllInternal(userId: string, userPermissions: string[], page: number, limit: number) {
    // console.log('[TodosService][findAllInternal] userId:', userId);
    // console.log('[TodosService][findAllInternal] userPermissions:', userPermissions);
    // Nếu có quyền xem tất cả
    if (userPermissions.includes('*:*') || userPermissions.includes('task:read:any')) {
      return this.todosRepository.findAll(page, limit);
    }

    if (userPermissions.includes('task:read:own')) {
      return this.todosRepository.findByUserId(userId, page, limit);
    }

    return { data: [], total: 0 };
  }

  async findOne(id: string, userId: string, userPermissions: string[]): Promise<Todo> {
    const todo = await this.todosRepository.findById(id);
    if (!todo) throw new NotFoundException('Todo not found');

    // CHECK BẢO MẬT: Xem user có được phép xem task này không
    this.checkOwnership(todo, userId, userPermissions, 'read');

    return todo;
  }

  async update(id: string, updateTodoDto: UpdateTodoDto, userId: string, userPermissions: string[]): Promise<Todo> {
    // 1. Phải tìm task trước để biết chủ nhân là ai
    const todo = await this.todosRepository.findById(id);
    if (!todo) throw new NotFoundException('Todo not found');

    // 2. CHECK BẢO MẬT: Có phải task của mình không?
    this.checkOwnership(todo, userId, userPermissions, 'update');

    // 3. Nếu qua được bước trên mới cho update
    const updateData: any = { ...updateTodoDto };
    delete updateData['userId']; // Prevent hack
    delete updateData['_id'];

    // Nếu có assignee là string thì convert sang ObjectId
    if (updateData.assignee && typeof updateData.assignee === 'string') {
      try {
        const { Types } = await import('mongoose');
        updateData.assignee = new Types.ObjectId(updateData.assignee);
      } catch (e) {
        // Nếu lỗi import hoặc convert thì bỏ qua, để mongoose tự xử lý lỗi
      }
    }

    const updatedTodo = await this.todosRepository.update(id, updateData);
    if (!updatedTodo) throw new NotFoundException('Todo not found');
    return updatedTodo;
  }

  async remove(id: string, userId: string, userPermissions: string[]): Promise<Todo> {
    const todo = await this.todosRepository.findById(id);
    if (!todo) throw new NotFoundException('Todo not found');

    // CHECK BẢO MẬT
    this.checkOwnership(todo, userId, userPermissions, 'delete');

    const deletedTodo = await this.todosRepository.delete(id);
    if (!deletedTodo) throw new NotFoundException('Todo not found');
    return deletedTodo;
  }

  async countTodoStatus(userId: string, userPermissions: string[]) {
    const filter: any = {};

    const canReadAll = userPermissions.includes('*:*') || userPermissions.includes('task:read:any');
    if (!canReadAll) {
      filter.$or = [
        { assignee: userId },
        { createdBy: userId }
      ];
    }

    const [todo, inProgress, done, total] = await Promise.all([
      this.todosRepository.countByFilter({ ...filter, status: 'TODO' }),
      this.todosRepository.countByFilter({ ...filter, status: 'IN_PROGRESS' }),
      this.todosRepository.countByFilter({ ...filter, status: 'DONE' }),
      this.todosRepository.countByFilter(filter)
    ]);
    console.log('[TodosService][countTodoStatus] todo:', todo, inProgress, done, total);

    return { todo, inProgress, done, total };
  }
}