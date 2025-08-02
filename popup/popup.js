document.addEventListener('DOMContentLoaded', function () {
    // Tab switching
    const tabs = document.querySelectorAll('.tab-button');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(`${tab.dataset.tab}-tab`).classList.add('active');
        });
    });

    // Main buttons
    document.getElementById('eios-button')?.addEventListener('click', function () {
        chrome.tabs.create({ url: 'https://edu.shspu.ru/my' });
    });

    document.getElementById('lms-button')?.addEventListener('click', function () {
        chrome.tabs.create({ url: 'https://shgpu-lms.web.app' });
    });

    // Theme selection
    const themeOptions = document.querySelectorAll('.theme-option');
    themeOptions.forEach(option => {
        option.addEventListener('click', function () {
            const theme = this.dataset.theme;
            saveSettings({ theme });
            applyTheme(theme);

            themeOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            enableSaveButton();
        });
    });

    // Search engine checkboxes
    const searchCheckboxes = document.querySelectorAll('.search-checkbox');
    searchCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            const searchEngines = Array.from(document.querySelectorAll('.search-checkbox:checked'))
                .map(cb => cb.value);
            saveSettings({ searchEngines });
            toggleApiKeyFields(this);
            enableSaveButton();
        });
    });

    // Элементы автовхода
    const usernameInput = document.getElementById('shgpu-username');
    const passwordInput = document.getElementById('shgpu-password');
    const autoLoginCheckbox = document.getElementById('auto-login');
    const delayLoginCheckbox = document.getElementById('delay-login');
    const saveSettingsButton = document.getElementById('save-settings');
    const loginStatus = document.getElementById('login-status');
    const saveText = document.getElementById('save-text');
    const savedText = document.getElementById('saved-text');

    // Обработчики изменений для полей входа
    if (usernameInput && passwordInput && autoLoginCheckbox && delayLoginCheckbox) {
        [usernameInput, passwordInput].forEach(input => {
            input.addEventListener('input', enableSaveButton);
        });

        autoLoginCheckbox.addEventListener('change', enableSaveButton);
        delayLoginCheckbox.addEventListener('change', enableSaveButton);
    }

    // Обработчики изменения API ключей
    const chatgptApiKeyInput = document.getElementById('chatgpt-api-key');
    const geminiApiKeyInput = document.getElementById('gemini-api-key');

    if (chatgptApiKeyInput) {
        chatgptApiKeyInput.addEventListener('input', enableSaveButton);
    }

    if (geminiApiKeyInput) {
        geminiApiKeyInput.addEventListener('input', enableSaveButton);
    }

    // Сохранение всех настроек
    if (saveSettingsButton) {
        saveSettingsButton.addEventListener('click', function () {
            const settings = {
                shgpuUsername: usernameInput?.value,
                shgpuPassword: passwordInput?.value,
                autoLogin: autoLoginCheckbox?.checked,
                delayLogin: delayLoginCheckbox?.checked,
                chatgptApiKey: chatgptApiKeyInput?.value,
                geminiApiKey: geminiApiKeyInput?.value,
                searchEngines: Array.from(document.querySelectorAll('.search-checkbox:checked'))
                    .map(cb => cb.value),
                theme: document.querySelector('.theme-option.active')?.dataset.theme
            };

            saveSettings(settings, showSaveConfirmation);
        });
    }

    // Загрузка сохраненных данных
    chrome.storage.sync.get([
        'theme',
        'accentColor',
        'searchEngines',
        'shgpuUsername',
        'shgpuPassword',
        'autoLogin',
        'delayLogin',
        'chatgptApiKey',
        'geminiApiKey'
    ], function (data) {
        // Theme
        if (data.theme) {
            applyTheme(data.theme);
            document.querySelector(`.theme-option[data-theme="${data.theme}"]`)?.classList.add('active');
        }

        // Search engines
        if (data.searchEngines) {
            searchCheckboxes.forEach(checkbox => {
                checkbox.checked = data.searchEngines.includes(checkbox.value);
                if (checkbox.checked && (checkbox.value === 'chatgpt' || checkbox.value === 'gemini')) {
                    toggleApiKeyFields(checkbox, true);
                }
            });
        }

        // Auto login
        if (data.shgpuUsername && usernameInput) usernameInput.value = data.shgpuUsername;
        if (data.shgpuPassword && passwordInput) passwordInput.value = data.shgpuPassword;
        if (data.autoLogin && autoLoginCheckbox) autoLoginCheckbox.checked = data.autoLogin;
        if (data.delayLogin && delayLoginCheckbox) delayLoginCheckbox.checked = data.delayLogin;

        // API ключи
        if (data.chatgptApiKey && chatgptApiKeyInput) chatgptApiKeyInput.value = data.chatgptApiKey;
        if (data.geminiApiKey && geminiApiKeyInput) geminiApiKeyInput.value = data.geminiApiKey;
    });

    // Функция включения кнопки сохранения
    function enableSaveButton() {
        if (saveSettingsButton) {
            saveSettingsButton.disabled = false;
        }
    }

    // Apply theme function
    function applyTheme(theme) {
        if (theme === 'system') {
            // Проверяем системные настройки
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                document.body.classList.add('dark-theme');
            } else {
                document.body.classList.remove('dark-theme');
            }
        } else if (theme === 'dark') {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
    }

    // Функция показа статуса
    function showLoginStatus(message, type) {
        if (!loginStatus) return;

        loginStatus.textContent = message;
        loginStatus.className = 'status-message ' + type;
        loginStatus.style.display = 'block';

        setTimeout(() => {
            loginStatus.style.display = 'none';
        }, 3000);
    }

    // Обработчик изменения системной темы
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            chrome.storage.sync.get(['theme'], function (data) {
                if (data.theme === 'system') {
                    applyTheme('system');
                }
            });
        });
    }

    // Функция для переключения полей API ключей
    function toggleApiKeyFields(checkbox, init = false) {
        const optionId = checkbox.value + '-option';
        const parentOption = document.getElementById(optionId);

        if (checkbox.value === 'chatgpt' || checkbox.value === 'gemini') {
            if (checkbox.checked) {
                parentOption.classList.add('expanded');
            } else {
                parentOption.classList.remove('expanded');
            }

            if (!init) {
                const apiKeyInput = parentOption.querySelector('.api-key-input');
                if (apiKeyInput) {
                    saveSettings({ [checkbox.value + 'ApiKey']: checkbox.checked ? apiKeyInput.value : '' });
                }
            }
        }
    }

    // Универсальная функция сохранения настроек
    function saveSettings(settings, callback) {
        chrome.storage.sync.set(settings, function () {
            if (typeof callback === 'function') {
                callback();
            }
        });
    }

    // Функция показа подтверждения сохранения
    function showSaveConfirmation() {
        if (!saveSettingsButton) return;

        saveSettingsButton.classList.add('saved');
        setTimeout(() => {
            saveSettingsButton.classList.remove('saved');
        }, 2000);
        saveSettingsButton.disabled = true;

        setTimeout(() => {
            if (saveText) saveText.style.display = 'inline';
            if (savedText) savedText.style.display = 'none';
        }, 2000);
    }
});
