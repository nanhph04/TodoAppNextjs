import { Controller, Get, Req, Post, Body, Patch, Param, Delete, Query, Put } from '@nestjs/common';
import type { Request } from 'express';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) { }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createTodoDto: CreateTodoDto) {
    return this.todosService.create(createTodoDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll() {
    return this.todosService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.todosService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto) {
    return this.todosService.update(id, updateTodoDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.todosService.remove(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  findMyTodos(@Req() req: Request) {
    const userId = (req.user as any)?.sub;
    return this.todosService.findByUserId(userId, 1, 10);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('user')
  findByUserIdPaginated(
    @Param('userId') userId: string,
    @Query('page') page: number,
    @Param('limit') limit: number,
  ) {
    console.log(userId, page, limit);
    return this.todosService.findByUserId(userId, page, limit);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('user/:userId')
  findByUserId(
    @Param('userId') userId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.todosService.findByUserId(userId, Number(page), Number(limit));
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('sync')
  syncTodos(
    @Req() req: Request,
    @Body() body: { localTodos: CreateTodoDto[] },
  ) {
    const userId = (req.user as any)?.sub;
    const localTodos = body.localTodos;
    return this.todosService.syncTodos(userId, localTodos);
  }

}
