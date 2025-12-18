import { IsNotEmpty, IsString, IsArray, IsMongoId, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class CreateRoleDto {
    @IsNotEmpty()
    @IsString()
    name: string; // Vd: "Marketing Lead"

    @IsArray()
    @IsMongoId({ each: true }) // Mảng các Permission ID dạng ObjectId
    permissionIds: Types.ObjectId[];
}