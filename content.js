// Конфигурация
const CONFIG = {
	DEBUG: false,
	TITLES_TO_REMOVE: [
		"Личные файлы",
		"Календарь",
		"Специальные возможности",
		"Предстоящие события",
		"Шкала времени",
		"Последние действия",
		"Социальные мероприятия",
		"Поиск по форумам"
	],
	TEXT_REPLACEMENTS: {
		'ЭИОС 1.0': { action: 'remove' },
		'ЭИОС ШГПУ 2.0': { replaceWith: 'ЭИОС ШГПУ 2.1' }
	}
};

// Утилиты
const log = (...args) => CONFIG.DEBUG && console.log(...args);

// Основные функции
function removeNavItems() {
	const navItems = document.querySelectorAll('.nav-item');
	log(`Found ${navItems.length} nav items.`);

	navItems.forEach(item => {
		if (item.textContent.includes('ЭИОС 1.0')) {
			item.remove();
		}
	});
}

function removeCards() {
	const cards = document.querySelectorAll('.card-body.p-3');
	log(`Found ${cards.length} cards items.`);

	cards.forEach(title => {
		const shouldRemove = CONFIG.TITLES_TO_REMOVE.some(text =>
			title.textContent.trim().includes(text)
		);

		if (shouldRemove) {
			const section = title.closest('section.block');
			section?.remove();
			log(`Удалена секция: "${title.textContent.trim()}"`);
		}
	});
}

function replaceText() {
	let replacementsCount = 0;

	Object.entries(CONFIG.TEXT_REPLACEMENTS).forEach(([search, config]) => {
		if (config.replaceWith) {
			const walker = document.createTreeWalker(
				document.body,
				NodeFilter.SHOW_TEXT,
				null,
				false
			);

			let node;
			while ((node = walker.nextNode())) {
				if (node.nodeValue.includes(search)) {
					node.nodeValue = node.nodeValue.replace(new RegExp(search, 'g'), config.replaceWith);
					replacementsCount++;
				}
			}
		}
	});

	log(`Произведено замен: ${replacementsCount}`);
}

function removeDrawerToggle() {
	const drawerToggle = document.querySelector('div[data-region="drawer-toggle"]');
	drawerToggle?.remove();
	log(drawerToggle ? 'Кнопка успешно удалена' : 'Элемент drawer-toggle не найден');
}

function rebuildHeader() {
	const header = document.querySelector('#page-header .card');
	if (!header) return;

	header.innerHTML = `
    <div class="header-background"
        style="background-image: url('//edu.shspu.ru/pluginfile.php/1/theme_fordson/headerdefaultimage/1732519865/shspu.jpg')">
    </div>
    <div class="header-content">
        <div class="header-top">
            <div class="user-profile">
                <a href="https://edu.shspu.ru/user/profile.php?id=11707" class="user-avatar">
                    <img src="https://edu.shspu.ru/pluginfile.php/81101/user/icon/fordson/f1?rev=3406996" alt="Аватар"
                        width="80" height="80">
                </a>
            </div>

            <div class="header-controls">
                <div class="user-actions">
                    <a href="https://edu.shspu.ru/message/index.php?id=11707" class="btn-message">
                        <i class="icon-message"></i>
                        <span>Сообщение</span>
                    </a>
                    <button id="extension-button" class="btn-extension">
                        <i class="icon-extension"></i>
                        <span>Расширение</span>
                    </button>
                    <form method="post" action="https://edu.shspu.ru/my/index.php" class="page-settings">
                        <input type="hidden" name="edit" value="1">
                        <input type="hidden" name="sesskey" value="5geBWmB97W">
                        <button type="submit" class="btn-settings">
                            <i class="icon-settings"></i>
                            <span>Настройки</span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <style>
        .header-background {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-size: cover;
            background-position: center;
            opacity: 0.7;
            z-index: 0;
        }
        .header-content {
            position: relative;
            z-index: 1;
            padding: 20px;
            color: #fff;
            background: rgba(0, 0, 0, 0.5);
            border-radius: 10px;
        }
        .header-top {
            display: flex;
            justify-content: flex-start;
            align-items: center;
        }
        .user-profile {
            display: flex;
            align-items: center;
            gap: 15px;
        }
        .user-avatar {
            border-radius: 50%;
            overflow: hidden;
            border: 3px solid #fff;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        }
        .user-actions {
            display: flex;
            gap: 10px;
            margin-left: 15px;
        }
        .btn-message,
        .btn-extension,
        .btn-settings {
            display: flex;
            align-items: center;
            gap: 5px;
            padding: 8px 15px;
            border-radius: 20px;
            border: none;
            cursor: pointer;
            transition: all 0.3s ease;
            height: 40px;
            min-width: 120px;
            background: rgba(255, 255, 255, 0.15);
            color: #fff;
        }
        .btn-message:hover,
        .btn-extension:hover,
        .btn-settings:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }
        .icon-message:before { content: "💬"; }
        .icon-extension:before { content: "🧩"; }
        .icon-settings:before { content: "⚙️"; }
    </style>
    `;

	document.getElementById('extension-button')?.addEventListener('click', () => {
		window.open('https://github.com/dev-lime/SHGPU-Extension', '_blank');
	});

	log('Шапка сайта успешно переверстана');
}

// Инициализация
function init() {
	log("Document is ready.");

	removeNavItems();
	removeCards();
	replaceText();
	removeDrawerToggle();
	rebuildHeader();
}

// Запуск
/*if (document.readyState === 'complete') {
	init();
} else {
	document.addEventListener('DOMContentLoaded', init);
}*/
init();
