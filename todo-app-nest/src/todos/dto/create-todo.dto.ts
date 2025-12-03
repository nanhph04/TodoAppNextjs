import { IsBoolean, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTodoDto {
    @IsOptional()
    @IsMongoId()
    userId?: string;

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsOptional()
    @IsBoolean()
    completed?: boolean = false;

    @IsOptional()
    @IsString()
    priority?: 'low' | 'medium' | 'high';
}
