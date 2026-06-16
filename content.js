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

	const headerContainer = document.getElementById('page-header');
	if (!headerContainer) return;
	const originalHTML = headerContainer.innerHTML;

	// Подкатовка
	const id = "page-header";
	const body = '<div class="card-body ">';
	const bodyEnd = `<div id="course-header">
						
                    </div>`;
	const headerbkg = '<div class="headerbkg">';
	const imageConst = '//edu.shspu.ru/pluginfile.php/';
	const imageDefault = "https://edu.shspu.ru/theme/image.php/fordson/core/1732519865/u/f1";

	// Задний фон
	const positionHeaderbkg = originalHTML.indexOf(headerbkg);
	const positionHeaderbkgEnd = originalHTML.indexOf('</div>', positionHeaderbkg + 1);
	const customHTML2 = originalHTML.substring(positionHeaderbkg, positionHeaderbkgEnd);
	const positionImageBackground = customHTML2.indexOf(imageConst);
	const positionImageBackgroundEnd = customHTML2.indexOf(')', positionImageBackground + 1);
	const imageBackgroundURL = customHTML2.substring(positionImageBackground, positionImageBackgroundEnd - 1);

	// Информация в теле
	const positionBody = originalHTML.indexOf(body);
	const positionBodyEnd = originalHTML.indexOf(bodyEnd, positionBody + 1);
	const customHTML = originalHTML.substring(positionBody, positionBodyEnd);

	// Проверка аватарки
	let positionSRC = customHTML.indexOf(imageConst);
	if (positionSRC == -1)
		positionSRC = customHTML.indexOf(imageDefault);
	const positionSRCEnd = customHTML.indexOf('"', positionSRC + 1);
	const imageURL = customHTML.substring(positionSRC, positionSRCEnd);

	// Простое формирование ссылки на оценки
	let gradesUrl = '/grade/report/overview/index.php';
	let isCoursePage = false;
	let courseId = null;

	// Проверяем, находимся ли мы на странице курса
	const currentUrl = window.location.href;
	if (currentUrl.includes('/course/view.php?id=')) {
		// Заменяем часть URL для получения ссылки на оценки
		gradesUrl = currentUrl.replace('/course/view.php', '/grade/report/user/index.php');
		isCoursePage = true;
	}
	// Дополнительная проверка: если на странице с другим префиксом, но есть id курса
	/*else {
		const match = currentUrl.match(/id=(\d+)/);
		if (match) {
			const courseId = match[1];
			gradesUrl = `/grade/report/user/index.php?id=${courseId}`;
			isCoursePage = true;
		}
	}*/

	let avatarHTML = '';
	let userAvatarFound = false;

	// Способ 1: Ищем в оригинальном HTML изображение пользователя
	const avatarMatch = originalHTML.match(/user\/icon[^"']*\.(?:jpg|jpeg|png|gif|webp)[^"']*/i);
	if (avatarMatch) {
		const avatarUrl = `https://edu.shspu.ru/pluginfile.php/${avatarMatch[0]}`;
		// Ищем ссылку на профиль
		const profileMatch = originalHTML.match(/user\/profile\.php\?id=\d+/);
		if (profileMatch) {
			const profileUrl = `https://edu.shspu.ru/${profileMatch[0]}`;
			avatarHTML = `
                <div class="user-profile">
                    <a href="${profileUrl}" class="user-avatar">
                        <img src="${avatarUrl}" alt="Аватар" width="80" height="80">
                    </a>
                </div>
            `;
			userAvatarFound = true;
		}
	}

	// Способ 2: Если не нашли, ищем по другим признакам
	if (!userAvatarFound) {
		// Ищем любую ссылку с пользовательским аватаром
		const userImgMatch = originalHTML.match(/src="([^"]*user[^"]*icon[^"]*)"/i);
		if (userImgMatch) {
			const avatarUrl = userImgMatch[1];
			// Ищем ссылку на профиль
			const profileHrefMatch = originalHTML.match(/href="([^"]*profile\.php\?id=\d+[^"]*)"/i);
			if (profileHrefMatch) {
				avatarHTML = `
                    <div class="user-profile">
                        <a href="${profileHrefMatch[1]}" class="user-avatar">
                            <img src="${avatarUrl}" alt="Аватар" width="80" height="80">
                        </a>
                    </div>
                `;
				userAvatarFound = true;
			}
		}
	}

	// Способ 3: Если это страница курса (без аватарки пользователя)
	if (!userAvatarFound && isCoursePage) {
		// Ищем название курса
		const courseNameMatch = originalHTML.match(/<h1[^>]*>([^<]+)<\/h1>/);
		if (courseNameMatch) {
			const courseName = courseNameMatch[1].trim();
			avatarHTML = `
                <div class="course-title">
                    <h1>${courseName}</h1>
                </div>
            `;
		} else {
			// Ищем любой заголовок курса
			const headingMatch = originalHTML.match(/<div[^>]*class="[^"]*card-body[^"]*"[^>]*>([^<]+)<\/div>/);
			if (headingMatch) {
				avatarHTML = `
                    <div class="course-title">
                        <h2>${headingMatch[1].trim()}</h2>
                    </div>
                `;
			}
		}
	}

	// Ищем фоновое изображение
	let backgroundImage = '';

	// Ищем div с headerbkg или customimage
	const headerBkgMatch = originalHTML.match(/<div[^>]*headerbkg[^>]*>([\s\S]*?)<\/div>/i);
	if (headerBkgMatch) {
		const headerBkgContent = headerBkgMatch[1];
		// Ищем background-image в стилях
		const bgStyleMatch = headerBkgContent.match(/background-image:\s*url\([^)]+\)/i);
		if (bgStyleMatch) {
			// Извлекаем URL из background-image
			const urlMatch = bgStyleMatch[0].match(/url\(([^)]+)\)/i);
			if (urlMatch) {
				// Очищаем URL от кавычек и HTML-сущностей
				backgroundImage = urlMatch[1]
					.replace(/^["'`]|["'`]$/g, '') // Убираем кавычки в начале и конце
					.replace(/&quot;/g, '') // Убираем HTML-сущности
					.replace(/"/g, '') // Убираем двойные кавычки
					.replace(/'/g, ''); // Убираем одинарные кавычки
			}
		}
	}

	// Если не нашли, ищем по-другому
	if (!backgroundImage) {
		// Ищем любую ссылку на pluginfile в контексте фона
		const pluginFileMatch = originalHTML.match(/\/\/edu\.shspu\.ru\/pluginfile\.php\/\d+\/theme_fordson\/headerdefaultimage\/[^"']+/i);
		if (pluginFileMatch) {
			backgroundImage = pluginFileMatch[0];
		}
	}

	// Если всё еще нет фона, используем дефолтный
	if (!backgroundImage) {
		backgroundImage = '//edu.shspu.ru/pluginfile.php/1/theme_fordson/headerdefaultimage/1758004895/shspu.jpg';
	}

	header.innerHTML = `
		<div class="header-background" style="background-image: url('${backgroundImage}')"></div>
		<div class="header-content">
			<div class="header-top">
				${userAvatarFound ? avatarHTML : ''}
				<div class="quick-access-cards">
					<a href="${gradesUrl}" class="access-card" title="${isCoursePage ? 'Оценки текущего курса' : 'Общие оценки'}">
						<div class="card-icon">
							<i class="fa fa-bar-chart"></i>
						</div>
						<span class="card-title">${isCoursePage ? 'Оценки курса' : 'Оценки'}</span>
					</a>
					
					<a href="https://shgpu-lms.web.app" class="access-card" title="SHGPU-LMS">
						<div class="card-icon">
							<i class="fa fa-cube"></i>
						</div>
						<span class="card-title">LMS</span>
					</a>
				</div>
				${!userAvatarFound && avatarHTML ? avatarHTML : ''}
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

// Функции для работы с API
async function queryChatGPT(questionText, apiKey) {
	try {
		const prompt = `Это вопрос из теста с вариантами ответов. Проанализируй вопрос и варианты ответов, и предложи наиболее вероятные правильные ответы с кратким объяснением.\n\n${questionText}`;

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
		return data.choices[0]?.message?.content || "Не удалось получить ответ от ChatGPT.";
	} catch (error) {
		console.error("Ошибка запроса к OpenAI:", error);
		return `Ошибка при запросе к ChatGPT: ${error.message}`;
	}
}

async function queryGemini(questionText, apiKey) {
	try {
		const prompt = `Проанализируй вопрос теста и варианты ответов, выдели наиболее вероятные правильные ответы с кратким объяснением:\n\n${questionText}`;

		const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				contents: [{
					parts: [{
						text: prompt
					}]
				}]
			})
		});

		if (!response.ok) {
			throw new Error(`Ошибка API: ${response.status}`);
		}

		const data = await response.json();
		return data.candidates?.[0]?.content?.parts?.[0]?.text || "Не удалось получить ответ от Gemini.";
	} catch (error) {
		console.error("Ошибка запроса к Gemini:", error);
		return `Ошибка при запросе к Gemini: ${error.message}`;
	}
}

// Модальное окно с выбором AI
function createAIModal(questionText, engine) {
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
	title.textContent = `Поиск ответа с помощью ${engine === 'gemini' ? 'Google Gemini' : 'ChatGPT'}`;
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
	const strong = document.createElement('strong');
	strong.textContent = 'Вопрос:';
	questionPreview.appendChild(strong);
	questionPreview.appendChild(document.createElement('br'));
	questionPreview.appendChild(document.createTextNode(questionText.split('\n')[0]));

	const contentArea = document.createElement('div');
	contentArea.style.flex = '1';
	contentArea.style.overflow = 'auto';
	contentArea.style.padding = '16px';

	modal.appendChild(header);
	modal.appendChild(questionPreview);
	content.appendChild(contentArea);
	modal.appendChild(content);
	overlay.appendChild(modal);
	document.body.appendChild(overlay);

	showAIResponse(questionText, contentArea, engine);
}

async function showAIResponse(questionText, container, engine) {
	container.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 16px;">
            <div style="background: #f5f5f5; padding: 16px; border-radius: 6px;">
                <h4 style="margin-top: 0; color: #333;">Ответ ${engine === 'gemini' ? 'Gemini' : 'ChatGPT'}:</h4>
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
            border-top: 4px solid ${engine === 'gemini' ? '#4285F4' : '#10a37f'};
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
		const data = await new Promise(resolve => {
			chrome.storage.local.get([`${engine}ApiKey`], resolve);
		});

		const apiKey = data[`${engine}ApiKey`];
		if (!apiKey) {
			document.getElementById('ai-response').innerHTML = `
                <p style="color: #d32f2f;">API ключ для ${engine === 'gemini' ? 'Gemini' : 'ChatGPT'} не найден.</p>
                <p>Пожалуйста, введите ваш ${engine === 'gemini' ? 'Google Gemini' : 'OpenAI'} API ключ в настройках расширения.</p>
            `;
			return;
		}

		const response = engine === 'gemini'
			? await queryGemini(questionText, apiKey)
			: await queryChatGPT(questionText, apiKey);

		document.getElementById('ai-response').innerHTML = `
            <div style="white-space: pre-wrap;">${response}</div>
            <div style="margin-top: 20px; font-size: 12px; color: #666; border-top: 1px solid #eee; padding-top: 10px;">
                Ответ сгенерирован с помощью ${engine === 'gemini' ? 'Google Gemini API' : 'OpenAI API'}. Только для справочных целей.
            </div>
        `;
	} catch (error) {
		document.getElementById('ai-response').innerHTML = `
            <p style="color: #d32f2f;">Ошибка при запросе к ${engine === 'gemini' ? 'Gemini' : 'ChatGPT'}:</p>
            <p>${error.message}</p>
            <p>Проверьте ваш API ключ и подключение к интернету.</p>
        `;
	}
}

async function addSearch() {
	const questions = document.querySelectorAll('.que.multichoice, .que.truefalse, .que.shortanswer, .que.essay');

	const [syncData, localData] = await Promise.all([
		new Promise(r => chrome.storage.sync.get(['searchEngines'], r)),
		new Promise(r => chrome.storage.local.get(['chatgptApiKey', 'geminiApiKey'], r))
	]);
	const data = { ...syncData, ...localData };
	let enabledEngines = data.searchEngines || ['google'];

	if (enabledEngines.includes('chatgpt') && !data.chatgptApiKey) {
		enabledEngines = enabledEngines.filter(engine => engine !== 'chatgpt');
	}
	if (enabledEngines.includes('gemini') && !data.geminiApiKey) {
		enabledEngines = enabledEngines.filter(engine => engine !== 'gemini');
	}

	questions.forEach(question => {
		const existingButtons = question.querySelectorAll('.search-buttons-container');
		existingButtons.forEach(container => container.remove());

		const questionText = getFullQuestionText(question);
		const buttonsContainer = document.createElement('div');
		buttonsContainer.className = 'search-buttons-container';
		buttonsContainer.style.margin = '15px 0';
		buttonsContainer.style.display = 'flex';
		buttonsContainer.style.gap = '10px';
		buttonsContainer.style.alignItems = 'center';
		buttonsContainer.style.flexWrap = 'wrap';

		// Стили для кнопок
		const baseButtonStyle = `
                padding: 8px 16px;
                border-radius: 8px;
                font-size: 14px;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                user-select: none;
                border: none;
                display: flex;
                align-items: center;
                gap: 6px;
            `;

		const hoverStyle = `
                transform: translateY(-1px);
                box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
            `;

		// Создаем кнопки
		if (enabledEngines.includes('chatgpt')) {
			const chatGPTButton = createSearchButton(
				'ChatGPT',
				baseButtonStyle,
				hoverStyle,
				() => createAIModal(questionText, 'chatgpt')
			);
			buttonsContainer.appendChild(chatGPTButton);
		}

		if (enabledEngines.includes('gemini')) {
			const geminiButton = createSearchButton(
				'Gemini',
				baseButtonStyle,
				hoverStyle,
				() => createAIModal(questionText, 'gemini')
			);
			buttonsContainer.appendChild(geminiButton);
		}

		if (enabledEngines.includes('google')) {
			const googleButton = createSearchButton(
				'G',
				baseButtonStyle,
				hoverStyle,
				() => window.open(`https://www.google.com/search?q=${encodeURIComponent(questionText)}`, '_blank')
			);
			buttonsContainer.appendChild(googleButton);
		}

		if (enabledEngines.includes('yandex')) {
			const yandexButton = createSearchButton(
				'Я',
				baseButtonStyle,
				hoverStyle,
				() => window.open(`https://yandex.ru/search/?text=${encodeURIComponent(questionText)}`, '_blank')
			);
			buttonsContainer.appendChild(yandexButton);
		}

		const questionContent = question.querySelector('.content');
		if (questionContent && buttonsContainer.children.length > 0) {
			questionContent.appendChild(buttonsContainer);
		}
	});
};

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



// Если сейчас страница входа ШГПУ
if (window.location.href.includes('edu.shspu.ru/login/index.php')) {
	chrome.storage.local.get(['shgpuUsername', 'shgpuPassword', 'autoLogin'], function (data) {
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

function makeCardsClickable() {
	const cards = document.querySelectorAll('.dashboard-card[data-course-id]');

	cards.forEach(card => {
		// Проверяем, не обработали ли мы уже эту карточку
		if (card.classList.contains('full-clickable')) {
			return;
		}

		const courseId = card.getAttribute('data-course-id');
		const courseLink = card.querySelector('a[href*="course/view.php"]');

		if (courseLink && courseId) {
			// Добавляет стили для карточки
			card.style.cursor = 'pointer';
			card.style.position = 'relative';
			card.classList.add('full-clickable');

			// Создаем прозрачный overlay для клика
			let overlay = card.querySelector('.card-click-overlay');
			if (!overlay) {
				overlay = document.createElement('a');
				overlay.href = courseLink.href;
				overlay.className = 'card-click-overlay';
				overlay.style.position = 'absolute';
				overlay.style.top = '0';
				overlay.style.left = '0';
				overlay.style.width = '100%';
				overlay.style.height = '100%';
				overlay.style.zIndex = '1';
				overlay.style.opacity = '0';
				overlay.style.cursor = 'pointer';
				card.appendChild(overlay);
			}

			// Поднимаем z-index для контента, чтобы он был поверх overlay
			const cardBody = card.querySelector('.card-body');
			const cardFooter = card.querySelector('.card-footer');

			if (cardBody) cardBody.style.position = 'relative';
			if (cardBody) cardBody.style.zIndex = '2';
			if (cardFooter) cardFooter.style.position = 'relative';
			if (cardFooter) cardFooter.style.zIndex = '2';

			// Обработчик клика на саму карточку
			card.addEventListener('click', function (e) {
				// Игнорируем клики по элементам управления (меню, кнопки и т.д.)
				if (e.target.closest('.dropdown') ||
					e.target.closest('.coursemenubtn') ||
					e.target.closest('button') ||
					e.target.closest('[data-action]')) {
					return;
				}

				// Если клик не на существующей ссылке, переходим на курс
				if (!e.target.closest('a') || e.target.closest('.card-click-overlay')) {
					window.location.href = courseLink.href;
				}
			});
		}
	});
}

// Запускает при загрузке страницы
document.addEventListener('DOMContentLoaded', makeCardsClickable);

// Отслеживает динамические изменения (для Ajax-подгрузки)
const observer = new MutationObserver(function (mutations) {
	mutations.forEach(function (mutation) {
		if (mutation.addedNodes.length) {
			makeCardsClickable();
		}
	});
});

observer.observe(document.body, {
	childList: true,
	subtree: true
});

// Функция применения темы
function applyTheme() {
	// Получает настройки темы из storage
	chrome.storage.sync.get(['theme'], function (data) {
		const theme = data.theme || 'light';
		const isDark = shouldApplyDarkTheme(theme);

		if (isDark) {
			document.body.classList.add('dark-theme');
		} else {
			document.body.classList.remove('dark-theme');
		}

		// Применяет дополнительные стили для темной темы
		applyDarkThemeStyles(isDark);
	});
}

// Определяет, нужно ли применять темную тему
function shouldApplyDarkTheme(theme) {
	if (theme === 'system') {
		return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
	}
	return theme === 'dark';
}

// Применяет дополнительные стили для темной темы
function applyDarkThemeStyles(isDark) {
	const styleId = 'dark-theme-styles';
	let styleElement = document.getElementById(styleId);

	if (isDark) {
		if (!styleElement) {
			styleElement = document.createElement('style');
			styleElement.id = styleId;
			document.head.appendChild(styleElement);
		}
		// Стили будут применены через CSS
	} else if (styleElement) {
		styleElement.remove();
	}
}

// Слушает изменения системной темы
if (window.matchMedia) {
	window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
		chrome.storage.sync.get(['theme'], function (data) {
			if (data.theme === 'system') {
				applyTheme();
			}
		});
	});
}

// Слушает изменения настроек расширения
chrome.storage.onChanged.addListener(function (changes, namespace) {
	if (namespace === 'sync') {
		if (changes.theme) {
			applyTheme();
		}
		if (changes.searchEngines) {
			addSearch();
		}
	}
	if (namespace === 'local') {
		if (changes.chatgptApiKey || changes.geminiApiKey) {
			addSearch();
		}
	}
});

// Обработчик сообщений от popup
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	if (request.action === 'themeChanged') {
		applyTheme();
	}
});

function init() {
	applyTheme();
	rebuildHeader();
	replaceText();
	removeNavItems();
	removeCards();
	removeDrawerToggle();
	addSearch();
}

init();
