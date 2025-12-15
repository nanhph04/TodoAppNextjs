import { IsEmail, IsNotEmpty } from "class-validator";

export class RegisterDto {
    @IsNotEmpty()
    fullName: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    roles: string[]; // Nếu muốn cho phép truyền roles khi đăng ký, giữ lại. Nếu luôn mặc định thì có thể bỏ field này khỏi DTO.

}