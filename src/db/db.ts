import * as SQLite from 'expo-sqlite';
import CryptoJS from 'crypto-js';

// Відкриття бази даних
export const openDatabase = async () => {
    return await SQLite.openDatabaseAsync('calendar.db');
};

// Створення таблиць
export const createTable = async () => {
    const db = await openDatabase();
    try {
        await db.execAsync(`
            PRAGMA journal_mode = WAL;
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS tasks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                content TEXT NOT NULL,
                date TEXT NOT NULL,
                user_id INTEGER NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users(id)
            );
        `);
        console.log('Tables created');
    } catch (e) {
        console.error('Error creating tables:', e);
    }
};

// Хешування пароля
const hashPassword = (password: string) => {
    return CryptoJS.SHA256(password).toString();
};

// Реєстрація користувача
export const registerUser = async (name: string, password: string) => {
    const db = await openDatabase();
    const hashedPassword = hashPassword(password);

    try {
        const result = await db.runAsync(
            `INSERT INTO users (name, password) VALUES (?, ?)`,
            [name, hashedPassword]
        );
        console.log("User registered:", result);
        return result.lastInsertRowId;
    } catch (e) {
        console.error("Error registering user:", e);
        return null;
    }
};

// Логін користувача
export const loginUser = async (name: string, password: string) => {
    const db = await openDatabase();
    const hashedPassword = hashPassword(password);

    try {
        const user = await db.getFirstAsync(
            `SELECT * FROM users WHERE name = ? AND password = ?`,
            [name, hashedPassword]
        );
        return user || null;
    } catch (e) {
        console.error("Login error:", e);
        return null;
    }
};

// Додавання завдання
export const insertEvent = async (content: string, date: string, userId: number) => {
    const db = await openDatabase();
    if (!content || !date || !userId) return;

    try {
        const result = await db.runAsync(
            `INSERT INTO tasks (content, date, user_id) VALUES (?, ?, ?)`,
            [content, date, userId]
        );
        return result.lastInsertRowId;
    } catch (e) {
        console.error('Error inserting event:', e);
        return null;
    }
};

// Отримання всіх завдань
export const fetchTasks = async () => {
    const db = await openDatabase();
    try {
        const allTasks = await db.getAllAsync(`SELECT * FROM tasks`);
        return allTasks;
    } catch (e) {
        console.error('Error fetching tasks:', e);
        return [];
    }
};

// Отримання завдань для конкретного користувача
export const fetchTasksByUser = async (userId: number) => {
    const db = await openDatabase();
    try {
        const userTasks = await db.getAllAsync(`SELECT * FROM tasks WHERE user_id = ?`, [userId]);
        return userTasks;
    } catch (e) {
        console.error('Error fetching user tasks:', e);
        return [];
    }
};

// Оновлення завдання
export const updateTask = async (id: number, content: string, date: string) => {
    const db = await openDatabase();
    try {
        const result = await db.runAsync(
            `UPDATE tasks SET content = ?, date = ? WHERE id = ?`,
            [content, date, id]
        );
        return result.changes > 0;
    } catch (e) {
        console.error('Error updating task:', e);
        return false;
    }
};

// Видалення завдання
export const deleteTask = async (id: number) => {
    const db = await openDatabase();
    try {
        const result = await db.runAsync(
            `DELETE FROM tasks WHERE id = ?`,
            [id]
        );
        return result.changes > 0;
    } catch (e) {
        console.error('Error deleting task:', e);
        return false;
    }
};
