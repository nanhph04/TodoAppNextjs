import { IsArray, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export class UpdateRoleDto {
    // Chỉ cập nhật permissions, tên role thường ít sửa (hoặc optional)
    @IsArray()
    @IsMongoId({ each: true })
    permissionIds: Types.ObjectId[];
}