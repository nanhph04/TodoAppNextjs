import { IsNotEmpty, IsString, IsArray, IsMongoId, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 'Marketing Lead' })
    name: string; // Vd: "Marketing Lead"

    @Transform(({ value, obj }) => {
        if (Array.isArray(value)) return value;
        return Array.isArray(obj?.permissions) ? obj.permissions : value;
    })
    @IsArray()
    @IsMongoId({ each: true })
    permissionIds: string[];
}