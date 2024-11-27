document.querySelectorAll('.pizza-item').forEach(item => {
    item.addEventListener('click', (event) => {
        window.location.href = "margarita.html"; // Переход на страницу рецепта
    });
});
