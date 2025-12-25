import { Controller, Get, Req, Post, Body, Param, Delete, Query, Put, UseGuards } from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { AuthGuard } from '@nestjs/passport';
import { PermissionsGuard } from 'src/auth/guard/permissions.guard';
import { Permissions } from 'src/auth/decorator/permissions.decorator';
import { requireUserId } from 'src/auth/context/request-context';

@Controller('todos')
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
export class TodosController {
  constructor(private readonly todosService: TodosService) { }

  @Post()
  @Permissions('task:create', '')
  create(@Body() createTodoDto: CreateTodoDto, @Req() req: any) {
    console.log('POST /todos req.user:', req.user);
    const { userId, permissions: userPermissions } = requireUserId(req);
    return this.todosService.create(createTodoDto, userId, userPermissions);
  }

 
  @Get()
  findAll(@Req() req: any, @Query('page') page = 1, @Query('limit') limit = 10) {
    // console.log('GET /todos req.user:', req.user);
    const { userId, permissions: userPermissions } = requireUserId(req);
    return this.todosService.findAllInternal(
      userId,
      userPermissions,
      Number(page),
      Number(limit)
    );
  }

  @Get('stats')
  // Không require 'task:read:any' cứng, vì Acc 1 cũng cần xem stats của chính họ
  async getStats(@Req() req: any) {
    console.log('GET /todos/stats req.user:', req.user);
    const { userId, permissions: userPermissions } = requireUserId(req);
    return this.todosService.countTodoStatus(userId, userPermissions);
  }

  @Get(':id')
  @Permissions('task:read:own', 'task:read:any')
  findOne(@Param('id') id: string, @Req() req: any) {
    console.log('GET /todos/:id req.user:', req.user);
    const { userId, permissions: userPermissions } = requireUserId(req);
    return this.todosService.findOne(id, userId, userPermissions);
  }

  @Put(':id')
  @Permissions('task:update:own', 'task:update:any')
  update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto, @Req() req: any) {
    console.log('PUT /todos/:id req.user:', req.user);
    const { userId, permissions: userPermissions } = requireUserId(req);
    return this.todosService.update(id, updateTodoDto, userId, userPermissions);
  }

  @Delete(':id')
  @Permissions('task:delete:own') // Hoặc task:delete:any
  remove(@Param('id') id: string, @Req() req: any) {
    console.log('DELETE /todos/:id req.user:', req.user);
    const { userId, permissions: userPermissions } = requireUserId(req);
    return this.todosService.remove(id, userId, userPermissions);
  }
}