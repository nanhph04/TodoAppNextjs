import swaggerJSDoc from "swagger-jsdoc";

const options: swaggerJSDoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API Documentation",
            version: "1.0.0",
            description: "API documentation for the Todo application",
        },
        components: {
            schemas: {
                Todo: {
                    type: "object",
                    properties: {
                        _id: { type: "string", example: "656a1b2c3d4e5f6a7b8c9d0e" },
                        title: { type: "string", example: "Viết tài liệu Swagger" },
                        description: { type: "string", example: "Thêm mô tả cho API" },
                        priority: { type: "string", enum: ["low", "medium", "high"], example: "medium" },
                        completed: { type: "boolean", example: false },
                        createdAt: { type: "string", format: "date-time", example: "2025-11-26T10:00:00.000Z" },
                        updatedAt: { type: "string", format: "date-time", example: "2025-11-26T10:05:00.000Z" },
                    },
                },
            },
        },
        servers: [
            {
                url: "http://localhost:5001",
                description: "Local server",
            },
        ],
    },
    apis: ["./src/routes/*.ts", "./src/models/*.ts"],
};

export const swaggerSpec = swaggerJSDoc(options);