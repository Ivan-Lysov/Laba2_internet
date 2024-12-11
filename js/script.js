document.getElementById("order-form").addEventListener("submit", function (event) {
    event.preventDefault(); // Предотвращаем стандартное поведение формы

    // Проверяем, что все поля заполнены
    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const address = document.getElementById("address").value;

    if (!name || !phone || !address) {
        alert("Пожалуйста, заполните все поля!");
        return;
    }

    // Перенаправляем пользователя на страницу feedback.html
    window.location.href = "./feedback.html";
});

