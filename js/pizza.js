async function loadJSON(url) {
    const response = await fetch(url);
    return response.json();
}

// This function loads the pizza menu (index page)
// Функция загрузки меню пиццы
async function loadPizzaMenu() {
    const pizzas = await loadJSON('../db/pizzas.json'); // Загрузка данных о пиццах

    const pizzaContainer = document.getElementById('pizza-container');
    
    pizzas.forEach(pizza => {
        const pizzaElement = document.createElement('div'); // Создаем новый элемент для каждой пиццы
        pizzaElement.classList.add('pizza-item');
        pizzaElement.innerHTML = `
            <a href="pages/${pizza.id}.html?id=${pizza.id}">
                <img src="${pizza.image}" alt="${pizza.title}" class="pizza-image">
                <h3>${pizza.title}</h3>
                <p>${pizza.description}</p>
                <p>Цена: ${pizza.basePrice} ₽</p>
            </a>
        `;
        pizzaContainer.appendChild(pizzaElement); // Добавляем элемент в контейнер
    });
}

// Функция загрузки деталей пиццы
async function loadPizzaDetails() {
    const pizzas = await loadJSON('../db/pizzas.json'); // Загружаем все пиццы
    const ingredientPrices = await loadJSON('../db/ingredients.json'); // Загружаем цены на ингредиенты

    // Получаем ID пиццы из URL
    const urlParams = new URLSearchParams(window.location.search);
    const pizzaId = urlParams.get('id'); // Пример: 'pepperoni'

    console.log('Pizza ID from URL:', pizzaId);  // Лог для отладки

    // Находим пиццу по её ID
    const pizza = pizzas.find(p => p.id === pizzaId);

    // Проверяем, нашли ли пиццу
    if (!pizza) {
        console.error("Pizza not found!");
        alert("Пицца не найдена!");
        return;
    }

    // Заполняем данные пиццы на странице
    document.getElementById('pizza-title').innerText = pizza.title;
    document.getElementById('pizza-description').innerText = pizza.description;
    document.getElementById('pizza-image').src = pizza.image;
    document.getElementById('pizza-price').innerText = `${pizza.basePrice} ₽`;

    // Заполняем начальную цену
    let totalPrice = pizza.basePrice;
    document.getElementById('total-price').innerText = totalPrice;

    // Создаем список ингредиентов
    const ingredientsContainer = document.querySelector('.ingredients');
    pizza.ingredients.forEach(ingredientId => {
        const ingredientOption = document.createElement('div');
        ingredientOption.classList.add('ingredient-option');
        const ingredientPrice = ingredientPrices[ingredientId] || 0; // Цена ингредиента или 0 по умолчанию
        ingredientOption.innerHTML = `
            <input type="checkbox" id="${ingredientId}" class="ingredient-checkbox"> 
            ${ingredientId.charAt(0).toUpperCase() + ingredientId.slice(1)} 
            (${ingredientPrice} ₽)
        `;
        ingredientsContainer.appendChild(ingredientOption);

        // Добавляем обработчик для изменения цены
        document.getElementById(ingredientId).addEventListener('change', function () {
            totalPrice = this.checked ? totalPrice + ingredientPrice : totalPrice - ingredientPrice;
            document.getElementById('total-price').innerText = totalPrice;
        });
    });
}



// Decide what page to load based on URL
if (window.location.pathname === '/index.html' || window.location.pathname === '/') {
    loadPizzaMenu();
} else {
    loadPizzaDetails();
}
