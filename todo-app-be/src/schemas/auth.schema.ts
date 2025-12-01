import { z } from 'zod';

export const registerSchema = z.object({
    body: z.object({
        fullName: z
            .string()
            .min(2, { message: "Họ tên phải có ít nhất 2 ký tự" }),
        email: z
            .string()
            .email({ message: "Địa chỉ email không hợp lệ" }),
        password: z
            .string()
            .min(8, { message: "Mật khẩu phải có ít nhất 8 ký tự" })
            .regex(/[A-Z]/, { message: "Mật khẩu phải có ít nhất 1 chữ hoa" })
            .regex(/[^A-Za-z0-9]/, { message: "Mật khẩu phải có ít nhất 1 ký tự đặc biệt" }),
    })
});



export const loginSchema = z.object({
    body: z.object({
        email: z
            .string()
            .email({ message: "Invalid email address" }),
        password: z
            .string()
            .min(8, { message: "Mật khẩu phải có ít nhất 8 ký tự" })
            .regex(/[A-Z]/, { message: "Mật khẩu phải có ít nhất 1 chữ hoa" })
            .regex(/[^A-Za-z0-9]/, { message: "Mật khẩu phải có ít nhất 1 ký tự đặc biệt" }),
    })
});