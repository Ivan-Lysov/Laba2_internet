const allIngredients = {
    olives: 50,        // Маслины
    cheese: 70,        // Дополнительный сыр
    mushrooms: 60,     // Грибы
    bacon: 80,         // Бекон
    corn: 40,          // Кукуруза
    onions: 30,        // Лук
    ham: 100,          // Ветчина
    pineapple: 90,     // Ананас
    pepperoni: 110,    // Пепперони
    spicySauce: 130,   // Острый соус
    parmigiano: 90,    // Пармезан
    gorgonzola: 100,   // Горгонзола
    emmental: 80,      // Эмменталь
};

// Пиццы с их ингредиентами
const pizzas = {
    margherita: {
        title: "Маргарита",
        image: "../images/margherita.jpg",  // Убедитесь, что путь правильный
        description: "Томатный соус, моцарелла, базилик.",
        basePrice: 500,
        ingredients: [
            'olives',
            'gorgonzola',
            'onions',
            'spicySauce',
            'ham'
        ]
    },
    pepperoni: {
        title: "Пепперони",
        image: "../images/pepperoni.jpg",
        description: "Пепперони, томатный соус, моцарелла.",
        basePrice: 600,
        ingredients: [
            'olives',
            'mushrooms',
            'bacon',
            'ham',
            'emmental'
        ]
    },
    beefStroganoff: {
        title: "Бефстроганов",
        image: "../images/befstroganov.jpg",  // Убедитесь, что путь правильный//Говядина, соус Бефстроганов,грибы,лук
        description: "Говядина, соус Бефстроганов,грибы,лук",
        basePrice: 800,
        ingredients: [
            'olives',
            'cheese',
            'mushrooms',
            'bacon',
            'corn',
            'onions'
        ]
    },
    vegetarian: {
        title: "Вегетарианская",
        image: "../images/veggie.jpg",
        description: "Томатный соус, моцарелла, паприка, грибы, оливки.",
        basePrice: 550,
        ingredients: [
            'cheese',
            'corn',
            'onions',
            'pineapple'
        ]
    },
    hawaiian: {
        title: "Гавайская",
        image: "../images/hawaiian.jpg",
        description: "Ветчина, ананас, моцарелла, томатный соус.",
        basePrice: 650,
        ingredients: [
            'olives',
            'corn',
            'bacon',
            'parmigiano'
        ]
    },
    quatroFormaggi: {
        title: "Кватро Формаджи",
        image: "../images/quattro_formaggi.jpg",
        description: "Моцарелла, пармезан, горгонзола, эмменталь.",
        basePrice: 750,
        ingredients: [
            'mushrooms',
            'onions',
            'bacon',
            'pepperoni'
        ]
    },
    marine: {
        title: "Морская",
        image: "../images/seafood.jpg",
        description: "Морепродукты, моцарелла, томатный соус.",
        basePrice: 850,
        ingredients: [
            'olives',
            'onions',
            'corn',
            'spicySauce'
        ]
    },
};

// Получаем ID пиццы из URL
const pizzaId = window.location.pathname.split('/').pop().split('.').shift(); 
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

// Функция для подсчета стоимости пиццы с выбранными дополнительными ингредиентами
// Функция для подсчета стоимости пиццы с выбранными дополнительными ингредиентами
const ingredientCheckboxes = document.querySelectorAll('input[type="checkbox"]');
const totalPriceElement = document.getElementById('total-price');

// Обновляем цену, учитывая выбранные ингредиенты
function updatePrice() {
    let totalPrice = pizza.basePrice; // Начальная цена пиццы

    // Перебираем все чекбоксы для дополнительных ингредиентов
    ingredientCheckboxes.forEach(checkbox => {
        if (checkbox.checked) {
            const ingredientId = checkbox.id;  // Получаем id выбранного ингредиента
            // Находим стоимость ингредиента из allIngredients
            const ingredientPrice = allIngredients[ingredientId];
            totalPrice += ingredientPrice;  // Добавляем стоимость ингредиента к общей стоимости
        }
    });

    totalPriceElement.textContent = `${totalPrice} ₽`; // Отображаем итоговую цену
}

// Добавляем обработчики событий для каждого чекбокса
ingredientCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', updatePrice);
});

// Инициализируем итоговую цену при загрузке страницы
updatePrice();
