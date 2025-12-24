import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreatePermissionDto {
    @IsNotEmpty()
    @IsString()
    // Validate slug không dấu, ví dụ: user:create
    @Matches(/^[a-z0-9]+(:[a-z0-9]+)*$/, { message: 'Slug sai định dạng (vd: user:create)' })
    slug: string;

    @IsNotEmpty()
    @IsString()
    description: string;
}