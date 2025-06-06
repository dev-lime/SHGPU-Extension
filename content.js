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
	const imageBackgroundURL = customHTML2.substring(positionImageBackground, positionImageBackgroundEnd-1);

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
	
	if (positionSRC != -1)
	{
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
	else
	{
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

	// Текст вопроса
	const qtextElement = questionElement.querySelector('.qtext');
	if (qtextElement) {
		fullText += qtextElement.textContent.trim() + '\n';
	}

	// Варианты ответов
	const answerElements = questionElement.querySelectorAll('.answer div.r0, .answer div.r1');
	answerElements.forEach((answer, index) => {
		const answerText = answer.textContent.trim();
		fullText += `${answerText}\n`;
	});

	return fullText.trim();
}

function createSearchModal(questionText) {
	// Оверлей
	const overlay = document.createElement('div');
	overlay.style.position = 'fixed';
	overlay.style.top = '0';
	overlay.style.left = '0';
	overlay.style.right = '0';
	overlay.style.bottom = '0';
	overlay.style.backgroundColor = 'rgba(0,0,0,0.1)';
	overlay.style.zIndex = '10000';
	overlay.style.display = 'flex';
	overlay.style.justifyContent = 'center';
	overlay.style.alignItems = 'center';

	// Закрытие при клике вне окна
	overlay.addEventListener('click', (e) => {
		if (e.target === overlay) {
			document.body.removeChild(overlay);
		}
	});

	// Окно
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

	// Контентная область
	const content = document.createElement('div');
	content.style.flex = '1';
	content.style.display = 'flex';
	content.style.flexDirection = 'column';
	content.style.overflow = 'hidden';

	const contentArea = document.createElement('div');
	contentArea.style.flex = '1';
	contentArea.style.overflow = 'auto';
	contentArea.style.padding = '16px';


	showAiResponse(questionText, contentArea);

	content.appendChild(contentArea);
	modal.appendChild(content);
	overlay.appendChild(modal);
	document.body.appendChild(overlay);
}

function showAiResponse(questionText, container) {
	container.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 16px;">
            <div style="background: #e3f2fd; padding: 16px; border-radius: 6px;">
                <h4 style="margin-top: 0; color: #0d47a1;">Ответ нейросети:</h4>
                <div id="ai-response" style="line-height: 1.5;">
                    <div style="display: flex; justify-content: center; padding: 20px;">
                        <div class="spinner"></div>
                    </div>
                </div>
            </div>
            <div style="font-size: 12px; color: #666; text-align: center;">
                Ответ генерируется с помощью AI. Только для справки.
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

	// Имитирует работу нейросети (здесь должен быть API-запрос)
	setTimeout(() => {
		document.getElementById('ai-response').innerHTML = `
            <p>На основании анализа вопроса, возможные ответы могут быть следующими:</p>
            <ul style="margin-top: 8px; padding-left: 20px;">
               ${questionText.split('\n').slice(1).filter(t => t.trim()).map(t => `<li>${t}</li>`).join('')}
            </ul>
		`;
	}, 2000);
}

function showSearchFrame(url, questionText, container) {
	container.innerHTML = `
        <div style="height: 100%; display: flex; flex-direction: column;">
            <iframe 
                src="${url}${encodeURIComponent(questionText)}" 
                style="flex: 1; border: none; border-radius: 4px;"
                sandbox="allow-scripts allow-same-origin allow-popups"
            ></iframe>
        </div>
    `;
}

function addSearch() {
	const questions = document.querySelectorAll('.que.multichoice, .que.truefalse, .que.shortanswer, .que.essay');

	questions.forEach(question => {
		const questionText = getFullQuestionText(question);

		const buttonsContainer = document.createElement('div');
		buttonsContainer.style.margin = '15px 0';
		buttonsContainer.style.display = 'flex';
		buttonsContainer.style.gap = '10px';
		buttonsContainer.style.alignItems = 'center';

		// Стиль для кнопок
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

		// Кнопка для открытия окна
		const modalButton = document.createElement('button');
		modalButton.textContent = 'AI';
		modalButton.style.cssText = buttonStyle;
		modalButton.addEventListener('mouseenter', () => {
			modalButton.style.cssText = buttonStyle + hoverStyle;
		});
		modalButton.addEventListener('mouseleave', () => {
			modalButton.style.cssText = buttonStyle;
		});
		modalButton.addEventListener('click', (e) => {
			e.preventDefault();
			createSearchModal(questionText);
		});

		// Кнопка для поиска в Google
		const googleButton = document.createElement('button');
		googleButton.textContent = 'Google';
		googleButton.style.cssText = buttonStyle;
		googleButton.addEventListener('mouseenter', () => {
			googleButton.style.cssText = buttonStyle + hoverStyle;
		});
		googleButton.addEventListener('mouseleave', () => {
			googleButton.style.cssText = buttonStyle;
		});
		googleButton.addEventListener('click', (e) => {
			e.preventDefault();
			window.open(`https://www.google.com/search?q=${encodeURIComponent(questionText)}`, '_blank');
		});

		// Кнопка для поиска в Яндекс
		const yandexButton = document.createElement('button');
		yandexButton.textContent = 'Яндекс';
		yandexButton.style.cssText = buttonStyle;
		yandexButton.addEventListener('mouseenter', () => {
			yandexButton.style.cssText = buttonStyle + hoverStyle;
		});
		yandexButton.addEventListener('mouseleave', () => {
			yandexButton.style.cssText = buttonStyle;
		});
		yandexButton.addEventListener('click', (e) => {
			e.preventDefault();
			window.open(`https://yandex.ru/search/?text=${encodeURIComponent(questionText)}`, '_blank');
		});

		buttonsContainer.appendChild(modalButton);
		buttonsContainer.appendChild(googleButton);
		buttonsContainer.appendChild(yandexButton);

		const questionContent = question.querySelector('.content');
		if (questionContent) {
			questionContent.appendChild(buttonsContainer);
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
