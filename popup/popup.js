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
            chrome.storage.sync.set({ theme: theme });
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
            chrome.storage.sync.set({ searchEngines: searchEngines });
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

    // Обработчик изменения API ключа
    const aiApiKeyInput = document.getElementById('ai-api-key');
    if (aiApiKeyInput) {
        aiApiKeyInput.addEventListener('input', enableSaveButton);
    }

    // Сохранение всех настроек
    if (saveSettingsButton) {
        saveSettingsButton.addEventListener('click', function () {
            const username = usernameInput?.value;
            const password = passwordInput?.value;
            const autoLogin = autoLoginCheckbox?.checked;
            const delayLogin = delayLoginCheckbox?.checked;

            const searchEngines = Array.from(document.querySelectorAll('.search-checkbox:checked'))
                .map(cb => cb.value);
            const aiApiKey = document.getElementById('ai-api-key')?.value;

            const activeThemeOption = document.querySelector('.theme-option.active');
            const theme = activeThemeOption?.dataset.theme;

            chrome.storage.sync.set({
                shgpuUsername: username,
                shgpuPassword: password,
                autoLogin: autoLogin,
                delayLogin: delayLogin,
                searchEngines: searchEngines,
                theme: theme,
                aiApiKey: aiApiKey
            }, function () {
                // Показывает "Настройки сохранены" временно
                saveSettingsButton.classList.add('saved');
                setTimeout(() => {
                    saveSettingsButton.classList.remove('saved');
                }, 2000);
                saveSettingsButton.disabled = true;

                setTimeout(() => {
                    saveText.style.display = 'inline';
                    savedText.style.display = 'none';
                }, 2000);
            });
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
        'aiApiKey'
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
            });
        }

        // Auto login
        if (data.shgpuUsername && usernameInput) usernameInput.value = data.shgpuUsername;
        if (data.shgpuPassword && passwordInput) passwordInput.value = data.shgpuPassword;
        if (data.autoLogin && autoLoginCheckbox) autoLoginCheckbox.checked = data.autoLogin;
        if (data.delayLogin && delayLoginCheckbox) delayLoginCheckbox.checked = data.delayLogin;

        // API key
        if (data.aiApiKey && document.getElementById('ai-api-key')) {
            document.getElementById('ai-api-key').value = data.aiApiKey;
        }
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
});