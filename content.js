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

/*
// Пример: упрощение навигации
navItems.forEach(item => {
	item.style.margin = '0 10px';
});

// Пример: добавление логотипа в шапку
const header = document.querySelector('#page-header');
if (header) {
	const customLogo = document.createElement('div');
	customLogo.innerHTML = '<h2 style="color: #1c8b78; text-align: center;">ЭИОС ШГПУ 2.1</h2>';
	header.prepend(customLogo);
}*/

const TITLES_TO_REMOVE = [
	"Личные файлы",
	"Календарь",
	"Специальные возможности",
	"Предстоящие события",
	"Шкала времени",
	"Последние действия",
	"Социальные мероприятия",
	"Поиск по форумам"
];

const cards = document.querySelectorAll('.card-body.p-3');
console.log(`Found ${cards.length} cards items.`);

cards.forEach(title => {
	const shouldRemove = TITLES_TO_REMOVE.some(text =>
		title.textContent.trim().includes(text)
	);

	if (shouldRemove) {
		const section = title.closest('section.block');
		if (section) {
			section.remove();
			console.log(`Удалена секция: "${title.textContent.trim()}"`);
		}
	}
});

console.log("Замена текста 'ЭИОС ШГПУ 2.0' на 'ЭИОС ШГПУ 2.1'...");

// Ищем все текстовые узлы на странице
const walker = document.createTreeWalker(
	document.body,
	NodeFilter.SHOW_TEXT,
	null,
	false
);

let node;
let replacementsCount = 0;

while (node = walker.nextNode()) {
	if (node.nodeValue.includes('ЭИОС ШГПУ 2.0')) {
		node.nodeValue = node.nodeValue.replace(/ЭИОС ШГПУ 2\.0/g, 'ЭИОС ШГПУ 2.1');
		replacementsCount++;
	}
}

console.log(`Произведено замен: ${replacementsCount}`);

// Находим элемент, который нужно заменить
const drawerToggle = document.querySelector('div[data-region="drawer-toggle"]');

if (drawerToggle) {
	// Создаём новую кнопку
	const newButton = document.createElement('div');
	newButton.className = 'd-inline-block mr-3';
	newButton.innerHTML = `
      <button type="button" class="btn nav-link float-sm-left mr-1 btn-primary" 
              id="extension-button" title="SHGPU LMS">
        <i class="icon fa fa-cube fa-fw" aria-hidden="true"></i>
        <span class="sr-only">SHGPU LMS</span>
      </button>
    `;

	// Заменяем старую кнопку на новую
	drawerToggle.replaceWith(newButton);

	// Добавляем обработчик клика
	document.getElementById('extension-button').addEventListener('click', function () {
		window.open('https://shgpu-lms.web.app', '_blank');
	});

	console.log('Кнопка расширения успешно добавлена');
} else {
	console.log('Элемент drawer-toggle не найден');
}
