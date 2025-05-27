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

function getCurrentSesskey() {
	return document.querySelector('input[name="sesskey"]')?.value || '';
}

function rebuildHeader() {
	const header = document.querySelector('#page-header .card');
	if (!header) return;

	const fpwonderbox = document.querySelector('.fpwonderbox');
	fpwonderbox?.remove();

	const sesskey = getCurrentSesskey();

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

            <div class="quick-access-cards">
                <a href="/grade/report/overview/index.php" class="access-card" title="Оценки">
                    <div class="card-icon">
                        <i class="fa fa-bar-chart"></i>
                    </div>
                    <span class="card-title">Оценки</span>
                </a>
                
                <a href="https://shgpu-lms.web.app" class="access-card" title="SHGPU-LMS">
                    <div class="card-icon">
                        <i class="fa fa-cube"></i>
                    </div>
                    <span class="card-title">LMS</span>
                </a>
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
            border-radius: 10px;
        }

        .header-top {
            display: flex;
            align-items: center;
            gap: 30px;
        }

        .user-profile {
            display: flex;
            align-items: center;
        }

        .user-avatar {
            border-radius: 50%;
            overflow: hidden;
            border: 3px solid #fff;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        }

        .quick-access-cards {
            display: flex;
            gap: 15px;
            flex-grow: 1;
        }

        .access-card,
        .access-card-form button {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 100px;
            height: 100px;
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(5px);
            border-radius: 12px;
            padding: 10px;
            text-decoration: none;
            color: white;
            transition: all 0.3s ease;
            border: 1px solid rgba(255, 255, 255, 0.1);
            cursor: pointer;
            border: none;
            font-family: inherit;
            font-size: inherit;
        }

        .access-card:hover,
        .access-card-form button:hover {
            background: rgba(255, 255, 255, 0.25);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }

        .card-icon {
            font-size: 24px;
            margin-bottom: 8px;
        }

        .card-title {
            font-size: 14px;
            text-align: center;
            font-weight: 500;
        }

        .access-card-form {
            display: contents;
        }
    </style>
    `;

	log('The site header has been successfully flipped');
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
