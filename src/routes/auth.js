import { celebrate } from 'celebrate';
import { Router } from 'express';
import {
  loginUserSchema,
  registerUserSchema,
} from '../validations/authValidation.js';
import {
  loginUser,
  logoutUser,
  refreshUserSession,
  registerUser,
} from '../controllers/authController.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Аутентификация и управление сессиями пользователей
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Регистрация нового пользователя
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 32
 *                 example: "artem123"
 *               email:
 *                 type: string
 *                 format: email
 *                 maxLength: 64
 *                 example: "artem@example.com"
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 maxLength: 64
 *                 format: password
 *                 example: "StrongPass123"
 *     responses:
 *       201:
 *         description: Пользователь успешно зарегистрирован
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Пользователь создан"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *       400:
 *         description: Ошибка валидации данных
 *       409:
 *         description: Пользователь с таким email уже существует
 *       500:
 *         description: Ошибка сервера
 */
router.post('/register', celebrate(registerUserSchema), registerUser);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Вход пользователя
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "artem@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "StrongPass123"
 *     responses:
 *       200:
 *         description: Успешный вход
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *       401:
 *         description: Неверные учетные данные
 *       400:
 *         description: Ошибка валидации
 *       500:
 *         description: Ошибка сервера
 */
router.post('/login', celebrate(loginUserSchema), loginUser);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Обновление access-токена с помощью refresh-токена
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Токены успешно обновлены
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       401:
 *         description: Недействительный или просроченный refresh-токен
 *       500:
 *         description: Ошибка сервера
 */
router.post('/refresh', refreshUserSession);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Выход пользователя (инвалидация сессии)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Успешный выход
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Выход выполнен"
 *       401:
 *         description: Не авторизован / недействительный токен
 *       500:
 *         description: Ошибка сервера
 */
router.post('/logout', logoutUser);

export default router;
