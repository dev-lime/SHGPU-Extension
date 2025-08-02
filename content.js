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
			log(`Section deleted: "${title.textContent.trim()}"`);
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

	log(`Replacements have been made: ${replacementsCount}`);
}

function removeDrawerToggle() {
	const drawerToggle = document.querySelector('div[data-region="drawer-toggle"]');
	drawerToggle?.remove();
	log(drawerToggle ? 'The button was successfully deleted' : 'The drawer-toggle element was not found');
}

function rebuildHeader() {
	const header = document.querySelector('#page-header .card');
	if (!header) return;

	const fpwonderbox = document.querySelector('.fpwonderbox');
	fpwonderbox?.remove();

	// Подкатовка
	const id = "page-header";
	const body = '<div class="card-body ">';
	const bodyEnd = `<div id="course-header">
                        
                    </div>`;
	const headerbkg = '<div class="headerbkg">';
	const imageConst = '//edu.shspu.ru/pluginfile.php/';
	const imageDefault = "https://edu.shspu.ru/theme/image.php/fordson/core/1732519865/u/f1";
	const origenalHTML = document.getElementById(id).innerHTML;
	let avatarHTML = '';

	// Задний фон
	const positionHeaderbkg = origenalHTML.indexOf(headerbkg);
	const positionHeaderbkgEnd = origenalHTML.indexOf('</div>', positionHeaderbkg + 1);
	const customHTML2 = origenalHTML.substring(positionHeaderbkg, positionHeaderbkgEnd);
	const positionImageBackground = customHTML2.indexOf(imageConst);
	const positionImageBackgroundEnd = customHTML2.indexOf(')', positionImageBackground + 1);
	const imageBackgroundURL = customHTML2.substring(positionImageBackground, positionImageBackgroundEnd - 1);

	// Информация в теле
	const positionBody = origenalHTML.indexOf(body);
	const positionBodyEnd = origenalHTML.indexOf(bodyEnd, positionBody + 1);
	const customHTML = origenalHTML.substring(positionBody, positionBodyEnd);

	// Проверка аватарки
	let positionSRC = customHTML.indexOf(imageConst);
	if (positionSRC == -1)
		positionSRC = customHTML.indexOf(imageDefault);
	const positionSRCEnd = customHTML.indexOf('"', positionSRC + 1);
	const imageURL = customHTML.substring(positionSRC, positionSRCEnd);

	if (positionSRC != -1) {
		// Аватарка и ссылка на профиль
		const positionHref = customHTML.indexOf('https://edu.shspu.ru/user/profile.php?id=');
		const positionHrefEnd = customHTML.indexOf('"', positionHref + 1);
		const hrefURL = customHTML.substring(positionHref, positionHrefEnd);

		avatarHTML = `
		<div class="user-profile">
			<a href = "${hrefURL}" class="user-avatar">
				<img src="${imageURL}" alt="Аватар"
					width="80" height="80">
			</a>
		</div>
		`;
	}
	else {
		// Название предмета
		const name = customHTML + '</div></div>';
		avatarHTML = name;
	}

	header.innerHTML = `
    <div class="header-background"
        style="background-image: url('${imageBackgroundURL}')">
    </div>
    <div class="header-content">
        <div class="header-top">
            ${positionSRC != -1 ? avatarHTML : ''}
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
			${positionSRC == -1 ? avatarHTML : ''}
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
            max-flex-grow: 1;
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
			transform: translateY(-3px);
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

function getFullQuestionText(questionElement) {
	let fullText = '';

	const qtextElement = questionElement.querySelector('.qtext');
	if (qtextElement) {
		fullText += qtextElement.textContent.trim() + '\n';
	}

	const answerElements = questionElement.querySelectorAll('.answer div.r0, .answer div.r1');
	answerElements.forEach((answer, index) => {
		const answerText = answer.textContent.trim();
		fullText += `${index + 1}. ${answerText}\n`;
	});

	return fullText.trim();
}

async function queryOpenAI(questionText, apiKey) {
	try {
		const prompt = `Это вопрос из теста с вариантами ответов. Проанализируй вопрос и варианты ответов, и предложи наиболее вероятные правильные ответы с кратким объяснением. Если вопрос предполагает развернутый ответ, сформулируй его.\n\n${questionText}`;

		const response = await fetch('https://api.openai.com/v1/chat/completions', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${apiKey}`
			},
			body: JSON.stringify({
				model: "gpt-3.5-turbo",
				messages: [{
					role: "user",
					content: prompt
				}],
				temperature: 0.7,
				max_tokens: 1000
			})
		});

		if (!response.ok) {
			throw new Error(`Ошибка API: ${response.status}`);
		}

		const data = await response.json();
		return data.choices[0]?.message?.content || "Не удалось получить ответ от нейросети.";
	} catch (error) {
		console.error("Ошибка запроса к OpenAI:", error);
		return `Ошибка при запросе к нейросети: ${error.message}`;
	}
}

function createSearchModal(questionText) {
	const overlay = document.createElement('div');
	overlay.style.position = 'fixed';
	overlay.style.top = '0';
	overlay.style.left = '0';
	overlay.style.right = '0';
	overlay.style.bottom = '0';
	overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
	overlay.style.zIndex = '10000';
	overlay.style.display = 'flex';
	overlay.style.justifyContent = 'center';
	overlay.style.alignItems = 'center';

	overlay.addEventListener('click', (e) => {
		if (e.target === overlay) {
			document.body.removeChild(overlay);
		}
	});

	const modal = document.createElement('div');
	modal.style.width = '80%';
	modal.style.maxWidth = '900px';
	modal.style.height = '80%';
	modal.style.backgroundColor = 'white';
	modal.style.borderRadius = '8px';
	modal.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)';
	modal.style.display = 'flex';
	modal.style.flexDirection = 'column';
	modal.style.overflow = 'hidden';

	const header = document.createElement('div');
	header.style.padding = '16px';
	header.style.borderBottom = '1px solid #eee';
	header.style.display = 'flex';
	header.style.justifyContent = 'space-between';
	header.style.alignItems = 'center';

	const title = document.createElement('h3');
	title.textContent = 'Поиск ответа с помощью AI';
	title.style.margin = '0';
	title.style.fontSize = '18px';

	const closeButton = document.createElement('button');
	closeButton.textContent = '×';
	closeButton.style.background = 'none';
	closeButton.style.border = 'none';
	closeButton.style.fontSize = '24px';
	closeButton.style.cursor = 'pointer';
	closeButton.style.padding = '0 10px';
	closeButton.addEventListener('click', () => {
		document.body.removeChild(overlay);
	});

	header.appendChild(title);
	header.appendChild(closeButton);

	const content = document.createElement('div');
	content.style.flex = '1';
	content.style.display = 'flex';
	content.style.flexDirection = 'column';
	content.style.overflow = 'hidden';

	const questionPreview = document.createElement('div');
	questionPreview.style.padding = '16px';
	questionPreview.style.borderBottom = '1px solid #eee';
	questionPreview.style.backgroundColor = '#f9f9f9';
	questionPreview.innerHTML = `<strong>Вопрос:</strong><br>${questionText.split('\n')[0]}`;

	const contentArea = document.createElement('div');
	contentArea.style.flex = '1';
	contentArea.style.overflow = 'auto';
	contentArea.style.padding = '16px';

	header.appendChild(closeButton);
	modal.appendChild(header);
	modal.appendChild(questionPreview);
	content.appendChild(contentArea);
	modal.appendChild(content);
	overlay.appendChild(modal);
	document.body.appendChild(overlay);

	showAiResponse(questionText, contentArea);
}

async function showAiResponse(questionText, container) {
	container.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 16px;">
            <div style="background: #f5f5f5; padding: 16px; border-radius: 6px;">
                <h4 style="margin-top: 0; color: #333;">Ответ нейросети:</h4>
                <div id="ai-response" style="line-height: 1.5;">
                    <div style="display: flex; justify-content: center; padding: 20px;">
                        <div class="spinner"></div>
                    </div>
                </div>
            </div>
        </div>
    `;

	const spinnerStyle = document.createElement('style');
	spinnerStyle.textContent = `
        .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #f3f3f3;
            border-top: 4px solid #3498db;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
	container.appendChild(spinnerStyle);

	try {
		// Получаем API ключ из хранилища
		const data = await new Promise(resolve => {
			chrome.storage.sync.get(['aiApiKey'], resolve);
		});

		if (!data.aiApiKey) {
			document.getElementById('ai-response').innerHTML = `
                <p style="color: #d32f2f;">API ключ не найден. Пожалуйста, введите ваш OpenAI API ключ в настройках расширения.</p>
                <p>Вы можете получить ключ на <a href="https://platform.openai.com/api-keys" target="_blank" style="color: #4a90e2;">platform.openai.com/api-keys</a></p>
            `;
			return;
		}

		const response = await queryOpenAI(questionText, data.aiApiKey);
		document.getElementById('ai-response').innerHTML = `
            <div style="white-space: pre-wrap;">${response}</div>
            <div style="margin-top: 20px; font-size: 12px; color: #666; border-top: 1px solid #eee; padding-top: 10px;">
                Ответ сгенерирован с помощью OpenAI API. Только для справочных целей.
            </div>
        `;
	} catch (error) {
		document.getElementById('ai-response').innerHTML = `
            <p style="color: #d32f2f;">Ошибка при запросе к нейросети:</p>
            <p>${error.message}</p>
            <p>Проверьте ваш API ключ и подключение к интернету.</p>
        `;
	}
}

function addSearch() {
	const questions = document.querySelectorAll('.que.multichoice, .que.truefalse, .que.shortanswer, .que.essay');

	// Получаем настройки поисковых систем из хранилища
	chrome.storage.sync.get(['searchEngines'], function (data) {
		const enabledEngines = data.searchEngines || ['ai', 'google', 'yandex']; // По умолчанию все включены

		questions.forEach(question => {
			// Удаляем предыдущие контейнеры с кнопками, если они есть
			const existingButtons = question.querySelectorAll('.search-buttons-container');
			existingButtons.forEach(container => container.remove());

			const questionText = getFullQuestionText(question);
			const buttonsContainer = document.createElement('div');
			buttonsContainer.className = 'search-buttons-container'; // Добавляем класс для идентификации
			buttonsContainer.style.margin = '15px 0';
			buttonsContainer.style.display = 'flex';
			buttonsContainer.style.gap = '10px';
			buttonsContainer.style.alignItems = 'center';

			const buttonStyle = `
                padding: 8px 16px;
                background: rgba(255, 255, 255, 0.2);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.3);
                border-radius: 8px;
                color: #333;
                font-size: 14px;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                user-select: none;
            `;

			const hoverStyle = `
                background: rgba(255, 255, 255, 0.3);
                transform: translateY(-1px);
                box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
            `;

			if (enabledEngines.includes('ai')) {
				const modalButton = createSearchButton('AI', buttonStyle, hoverStyle, () => {
					createSearchModal(questionText);
				});
				buttonsContainer.appendChild(modalButton);
			}

			if (enabledEngines.includes('google')) {
				const googleButton = createSearchButton('Google', buttonStyle, hoverStyle, () => {
					window.open(`https://www.google.com/search?q=${encodeURIComponent(questionText)}`, '_blank');
				});
				buttonsContainer.appendChild(googleButton);
			}

			if (enabledEngines.includes('yandex')) {
				const yandexButton = createSearchButton('Яндекс', buttonStyle, hoverStyle, () => {
					window.open(`https://yandex.ru/search/?text=${encodeURIComponent(questionText)}`, '_blank');
				});
				buttonsContainer.appendChild(yandexButton);
			}

			const questionContent = question.querySelector('.content');
			if (questionContent && buttonsContainer.children.length > 0) {
				questionContent.appendChild(buttonsContainer);
			}
		});
	});
}

// Вспомогательная функция для создания кнопок
function createSearchButton(text, style, hoverStyle, onClick) {
	const button = document.createElement('button');
	button.textContent = text;
	button.style.cssText = style;

	button.addEventListener('mouseenter', () => {
		button.style.cssText = style + hoverStyle;
	});

	button.addEventListener('mouseleave', () => {
		button.style.cssText = style;
	});

	button.addEventListener('click', (e) => {
		e.preventDefault();
		onClick();
	});

	return button;
}

// Слушаем изменения в хранилище
chrome.storage.onChanged.addListener(function (changes, namespace) {
	if (changes.searchEngines) {
		// Пересоздаем кнопки поиска при изменении настроек
		addSearch();
	}
});

// Если сейчас страница входа ШГПУ
if (window.location.href.includes('edu.shspu.ru/login/index.php')) {
	chrome.storage.sync.get(['shgpuUsername', 'shgpuPassword', 'autoLogin'], function (data) {
		const username = data.shgpuUsername;
		const password = data.shgpuPassword;
		const autoLogin = data.autoLogin || false;

		if (username && password) {
			const usernameField = document.getElementById('username');
			const passwordField = document.getElementById('password');
			const rememberCheckbox = document.getElementById('rememberusername');
			const loginButton = document.getElementById('loginbtn');

			if (usernameField) usernameField.value = username;
			if (passwordField) passwordField.value = password;
			if (rememberCheckbox) rememberCheckbox.checked = true;

			if (autoLogin && loginButton) {
				setTimeout(() => {
					loginButton.click();
				}, 500);
			}
		}
	});
}

function init() {
	removeNavItems();
	removeCards();
	replaceText();
	removeDrawerToggle();
	rebuildHeader();
	addSearch();
}

init();
