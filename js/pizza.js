const pizzas = {
    margherita: {
        title: "Маргарита",
        image: "../images/margherita.jpg",  // Убедитесь, что путь правильный
        description: "Томатный соус, моцарелла, базилик.",
        basePrice: 500,
        ingredients: {
            olives: 50,        // Маслины
            cheese: 70,        // Дополнительный сыр
            mushrooms: 60,     // Грибы
            bacon: 80,         // Бекон
            corn: 40,          // Кукуруза
            onions: 30         // Лук
        }
    },
    pepperoni: {
        title: "Пепперони",
        image: "../images/pepperoni.jpg",  // Убедитесь, что путь правильный
        description: "Пепперони, томатный соус, моцарелла.",
        basePrice: 550,
        ingredients: {
            olives: 50,
            cheese: 70,
            mushrooms: 60,
            bacon: 80,
            corn: 40,
            onions: 30
        }
    }
};

const pizzaId = window.location.pathname.split('/').pop().split('.').shift(); // например, "margherita"
console.log("ID пиццы из URL:", pizzaId);

const pizza = pizzas[pizzaId]; // Получаем данные для этой пиццы

if (pizza) {
    document.getElementById("pizza-title").textContent = pizza.title;
    document.getElementById("pizza-image").src = pizza.image;  // Путь до картинки
    document.getElementById("pizza-price").textContent = `Цена: ${pizza.basePrice} ₽`;
    document.getElementById("pizza-description").textContent = pizza.description;
} else {
    console.log("Пицца не найдена");
}

const ingredientCheckboxes = document.querySelectorAll('input[type="checkbox"]');
const totalPriceElement = document.getElementById('total-price');

function updatePrice() {
    let totalPrice = pizza.basePrice;

    ingredientCheckboxes.forEach(checkbox => {
        if (checkbox.checked) {
            const ingredientId = checkbox.id;
            const ingredientPrice = pizza.ingredients[ingredientId];
            totalPrice += ingredientPrice;
        }
    });

    totalPriceElement.textContent = `${totalPrice} ₽`;
}

// Добавляем обработчики событий для каждого чекбокса
ingredientCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', updatePrice);
});

// Инициализируем итоговую цену при загрузке страницы
updatePrice();
