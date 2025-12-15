import { IsBoolean, IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TodoStatus } from '../schema/Todos.schema';

export class CreateTodoDto {
    @IsNotEmpty({ message: 'Tiêu đề không được để trống' })
    title: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsEnum(TodoStatus)
    status?: TodoStatus;

    // Acc 1 không gửi field này (Backend tự gán).
    // Acc 3 (Admin) có thể gửi field này để giao việc cho người khác.
    @IsOptional()
    assignee?: string;

    @IsOptional()
    @IsEnum(['low', 'medium', 'high'], { message: 'Priority phải là low, medium hoặc high' })
    priority?: 'low' | 'medium' | 'high';
}
