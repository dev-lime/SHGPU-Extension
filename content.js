// Ждем, пока документ будет готов
document.addEventListener('DOMContentLoaded', function () {
	console.log("Document is ready.");

	// Находим все элементы li на странице
	const navItems = document.querySelectorAll('.nav-item');
	console.log(`Found ${navItems.length} nav items.`);

	// Проходим по каждому элементу
	navItems.forEach(function (item) {
		// Проверяем, содержит ли текст "ЭИОС 1.0"
		if (item.textContent.includes('ЭИОС 1.0')) {
			// Удаляем элемент, если он найден
			item.remove();
		}
	});

	// Пример: упрощение навигации
	navItems.forEach(item => {
		item.style.margin = '0 10px';
	});

	// Пример: добавление логотипа в шапку
	const header = document.querySelector('#page-header');
	if (header) {
		const customLogo = document.createElement('div');
		customLogo.innerHTML = '<h2 style="color: #3498db; text-align: center;">Мой кастомный стиль ШГПУ</h2>';
		header.prepend(customLogo);
	}
});
