import { Module } from '@nestjs/common';
import { TodosService } from './todos.service';
import { TodosController } from './todos.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TodoSchema } from 'src/todos/schema/Todos.schema';
import { TodosRepository } from './todos.repository';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Todo', schema: TodoSchema }]),
    UserModule,
  ],
  controllers: [TodosController],
  providers: [TodosService, TodosRepository],
  exports: [TodosService, TodosRepository],
})
export class TodosModule { }
