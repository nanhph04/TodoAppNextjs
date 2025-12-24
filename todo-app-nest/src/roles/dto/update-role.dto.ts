import { IsArray, IsMongoId } from 'class-validator';

export class UpdateRoleDto {
    // Chỉ nhận mảng string ObjectId
    @IsArray()
    @IsMongoId({ each: true })
    permissionIds: string[];
}