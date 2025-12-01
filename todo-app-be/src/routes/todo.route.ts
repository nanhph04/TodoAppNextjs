
import { Router } from "express";
import { getTodos, createTodo, updateTodo, deleteTodo, syncTodos } from "../controllers/todo.controller.js";

/**
 * @swagger
 * tags:
 *   name: Todos
 *   description: API quản lý công việc (Todo)
 */

const router: Router = Router();


/**
 * @swagger
 * /api/todos:
 *   get:
 *     summary: Lấy danh sách tất cả công việc
 *     tags: [Todos]
 *     responses:
 *       200:
 *         description: Danh sách công việc
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Todo'
 */
router.get('/', getTodos);

/**
 * @swagger
 * /api/todos:
 *   post:
 *     summary: Tạo mới một công việc
 *     tags: [Todos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Todo'
 *     responses:
 *       201:
 *         description: Tạo thành công
 */
router.post('/', createTodo);

/**
 * @swagger
 * /api/todos/{id}:
 *   put:
 *     summary: Cập nhật một công việc
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của công việc
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Todo'
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.put('/:id', updateTodo);

/**
 * @swagger
 * /api/todos/{id}:
 *   delete:
 *     summary: Xóa một công việc
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của công việc
 *     responses:
 *       200:
 *         description: Xóa thành công
 */
router.delete('/:id', deleteTodo);

router.post('/sync', syncTodos);

export default router;