import { isEmail, IsEmail } from "class-validator";

export class CreateUserDto {

    fullName: string;

    @IsEmail()
    email: string;

    password: string;
}