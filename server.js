const express = require('express');
const app = express();
const { Pool } = require('pg');

// Настройки подключения к базе данных
const db = new Pool({
    user: 'your_user',
    host: 'localhost',
    database: 'pizza_db',
    password: 'your_password',
    port: 5432,
});
app.use(express.static('pages'))
app.use('/css', express.static('css'));

// Статичные файлы из папки js
app.use('/js', express.static('js'));

// Статичные файлы из папки images
app.use('/images', express.static('images'));

// Статичные файлы из папки pages
app.use('/pages', express.static('pages'));
app.use('/db', express.static('db'));

// Эндпоинт для получения данных о пицце
app.get('/api/pizzas/:id', async (req, res) => {
    const pizzaId = req.params.id;
    try {
        // Получение данных о пицце
        const pizzaQuery = `
            SELECT id, title, image, description, basePrice 
            FROM Pizzas 
            WHERE id = $1
        `;
        const pizza = await db.query(pizzaQuery, [pizzaId]);

        // Если пицца не найдена
        if (pizza.rows.length === 0) {
            return res.status(404).json({ error: 'Пицца не найдена' });
        }

        // Получение ингредиентов пиццы
        const ingredientsQuery = `
            SELECT i.id, i.name, i.price
            FROM Ingredients i
            JOIN PizzaIngredients pi ON pi.ingredient_id = i.id
            WHERE pi.pizza_id = $1
        `;
        const ingredients = await db.query(ingredientsQuery, [pizzaId]);

        // Возвращаем данные о пицце и ингредиентах
        res.json({
            pizza: pizza.rows[0],
            ingredients: ingredients.rows,
        });
    } catch (err) {
        console.error('Ошибка сервера:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Запуск сервера
const PORT_SERVER = 3000;
app.listen(PORT_SERVER, () => console.log(`Сервер запущен на http://localhost:${PORT_SERVER}`));
