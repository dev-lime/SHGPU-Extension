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
	"Шкала времени"
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
