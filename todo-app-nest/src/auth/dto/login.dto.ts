import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";
export class LoginDto {
    @IsEmail()
    @IsNotEmpty()
    
    email: string;
    @IsNotEmpty()
    password: string;
}