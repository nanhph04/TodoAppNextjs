import { IsEmail, IsNotEmpty } from "class-validator";

export class AuthDto {
    fullName: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    password: string;
}