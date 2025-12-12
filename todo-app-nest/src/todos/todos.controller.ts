
import { Controller, Get, Req, Post, Body, Patch, Param, Delete, Query, Put } from '@nestjs/common';
import type { Request } from 'express';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/role/roles.decorator';
import { Role } from 'src/role/role.enum';
import { RolesGuard } from 'src/role/roles.guard';

@Controller('api/todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) { }


  @UseGuards(AuthGuard('jwt'))
  @Roles(Role.USER)
  @Post()
  create(@Body() createTodoDto: CreateTodoDto, @Req() req: Request) {
    const userId = (req.user as any)?.sub;
    return this.todosService.create(userId, createTodoDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  findMyTodos(
    @Req() req: Request,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    const userId = (req.user as any)?.sub;
    return this.todosService.findByUserId(userId, Number(page), Number(limit));
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('count-status')
  async countStatus(@Req() req: Request) {
    const userId = (req.user as any)?.sub;
    const role = (req.user as any)?.role;
    const isAdmin = role === 'admin';
    return this.todosService.countCompletedTodos(userId, isAdmin);
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

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.todosService.findAll(Number(page), Number(limit));
  }


}
