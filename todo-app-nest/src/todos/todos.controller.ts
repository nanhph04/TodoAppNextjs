
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
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
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto) {
    return this.todosService.update(id, updateTodoDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.todosService.remove(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('user/:userId')
  findByUserId(@Param('userId') userId: string) {
    return this.todosService.findByUserId(userId, 1, 10);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('user/:userId/page/:page/limit/:limit')
  findByUserIdPaginated(
    @Param('userId') userId: string,
    @Param('page') page: number,
    @Param('limit') limit: number,
  ) {
    return this.todosService.findByUserId(userId, page, limit);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('sync/:userId')
  syncTodos(
    @Param('userId') userId: string,
    @Body() localTodos: CreateTodoDto[],
  ) {
    return this.todosService.syncTodos(userId, localTodos);
  }

}
