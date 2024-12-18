async function loadJSON(url) {
    const response = await fetch(url);
    return response.json();
}

async function loadPizzaMenu() {
    const pizzas = await loadJSON('../db/pizzas.json');
    const pizzaContainer = document.getElementById('pizza-container');

    pizzas.forEach(pizza => {
        const pizzaElement = document.createElement('div');
        pizzaElement.classList.add('pizza-item');
        pizzaElement.innerHTML = `
            <a href="pages/${pizza.id}.html?id=${pizza.id}">
                <img src="${pizza.image}" alt="${pizza.title}" class="pizza-image">
                <h3>${pizza.title}</h3>
                <p>${pizza.description}</p>
                <p>Цена: ${pizza.basePrice} ₽</p>
            </a>
        `;
        pizzaContainer.appendChild(pizzaElement);
    });
}

async function loadPizzaDetails() {
    const [pizzas, ingredientPrices] = await Promise.all([
        loadJSON('../db/pizzas.json'),
        loadJSON('../db/ingredients.json')
    ]);

    const pizzaId = new URLSearchParams(window.location.search).get('id');
    if (!pizzaId) return;

    const pizza = pizzas.find(p => p.id === pizzaId);
    if (!pizza) {
        alert("Пицца не найдена!");
        return;
    }

    displayPizzaDetails(pizza);
    setupIngredientOptions(pizza, ingredientPrices);
    setupOrderForm(pizza);
}

function displayPizzaDetails(pizza) {
    document.getElementById('pizza-title').innerText = pizza.title;
    document.getElementById('pizza-description').innerText = pizza.description;
    document.getElementById('pizza-image').src = pizza.image;
    document.getElementById('total-price').innerText = pizza.basePrice;
}

function setupIngredientOptions(pizza, ingredientPrices) {
    const ingredientsContainer = document.querySelector('.ingredients');
    let totalPrice = pizza.basePrice;

    pizza.ingredients.forEach(ingredientId => {
        const ingredientPrice = ingredientPrices[ingredientId] || 0;
        const ingredientOption = document.createElement('div');
        ingredientOption.classList.add('ingredient-option');
        ingredientOption.innerHTML = `
            <input type="checkbox" id="${ingredientId}" class="ingredient-checkbox"> 
            ${ingredientId.charAt(0).toUpperCase() + ingredientId.slice(1)} 
            (${ingredientPrice} ₽)
        `;
        ingredientsContainer.appendChild(ingredientOption);

        document.getElementById(ingredientId).addEventListener('change', function () {
            totalPrice += this.checked ? ingredientPrice : -ingredientPrice;
            document.getElementById('total-price').innerText = totalPrice;
        });
    });
}

function setupOrderForm(pizza) {
    const orderForm = document.getElementById("order-form");
    orderForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const address = document.getElementById('address').value;

        if (!name || !phone || !address) {
            alert("Пожалуйста, заполните все поля формы.");
            return;
        }

        const orderData = {
            pizzaId: pizza.id,
            totalPrice: parseFloat(document.getElementById('total-price').innerText),
            ingredients: pizza.ingredients.filter(id => document.getElementById(id).checked),
            customer: { name, phone, address }
        };

        await submitOrder(orderData);
    });
}


async function submitOrder(orderData) {
    try {
        const response = await fetch('/api/order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });

        if (response.ok) {
            alert('Ваш заказ успешно оформлен!');
            window.location.href = "feedback.html";
        } else {
            const errorData = await response.json();
            alert(`Ошибка: ${errorData.error}`);
        }
    } catch (error) {
        alert("Произошла ошибка при оформлении заказа. Пожалуйста, попробуйте позже.");
    }
}

async function submitFeedback(event) {
    event.preventDefault();
    const feedbackData = {
        rating: document.getElementById('rating').value,
        comments: document.getElementById('comments').value,
    };

    try {
        const response = await fetch('/api/feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(feedbackData)
        });

        if (response.ok) {
            alert('Ваш отзыв успешно отправлен!');
            document.getElementById('feedback-form').reset();
        } else {
            const errorData = await response.json();
            alert(`Ошибка: ${errorData.error}`);
        }
    } catch (error) {
        alert("Произошла ошибка при отправке отзыва. Пожалуйста, попробуйте позже.");
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const feedbackForm = document.getElementById('feedback-form');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', submitFeedback);
    }
});

if (window.location.pathname === '/index.html' || window.location.pathname === '/') {
    loadPizzaMenu();
} else {
    loadPizzaDetails();
}
