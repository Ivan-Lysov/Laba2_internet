const express = require('express');
const fs = require('fs').promises;
const app = express();
const path = require('path');

app.use(express.json());
app.use(express.static('pages'));
app.use('/css', express.static('css'));
app.use('/js', express.static('js'));
app.use('/images', express.static('images'));
app.use('/pages', express.static('pages'));
app.use('/db', express.static('db'));

const readJSONFile = async (filePath) => {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
};

const writeJSONFile = async (filePath, data) => {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
};

app.get('/api/pizzas/:id', async (req, res) => {
    const pizzaId = req.params.id;
    const pizzas = await readJSONFile(path.join(__dirname, 'db', 'pizzas.json'));
    const pizza = pizzas.find(p => p.id === pizzaId);

    if (!pizza) {
        return res.status(404).json({ error: 'Пицца не найдена' });
    }

    res.json(pizza);
});

app.post('/api/order', async (req, res) => {
    const orderData = req.body;
    const ordersFilePath = path.join(__dirname, 'db', 'orders.json');
    const orders = await readJSONFile(ordersFilePath);
    orders.push(orderData);
    await writeJSONFile(ordersFilePath, orders);
    res.status(201).json({ message: 'Заказ успешно оформлен!' });
});

app.post('/api/feedback', async (req, res) => {
    const feedbackData = req.body;
    const feedbackFilePath = path.join(__dirname, 'db', 'feedback.json');
    const feedback = await readJSONFile(feedbackFilePath);
    feedback.push({ rating: feedbackData.rating, comments: feedbackData.comments });
    await writeJSONFile(feedbackFilePath, feedback);
    res.status(201).json({ message: 'Отзыв успешно отправлен!' });
});

const PORT_SERVER = 3000;
app.listen(PORT_SERVER, () => console.log(`Сервер запущен на http://localhost:${PORT_SERVER}`));