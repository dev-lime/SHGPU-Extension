// Проверяем, находимся ли мы на странице входа ШГПУ
if (window.location.href.includes('edu.shspu.ru/login/index.php')) {
    // Получаем сохраненные данные из хранилища
    chrome.storage.sync.get(['shgpuUsername', 'shgpuPassword', 'autoLogin'], function (data) {
        const username = data.shgpuUsername;
        const password = data.shgpuPassword;
        const autoLogin = data.autoLogin || false;

        // Если есть сохраненные данные
        if (username && password) {
            // Заполняем поля формы
            const usernameField = document.getElementById('username');
            const passwordField = document.getElementById('password');
            const rememberCheckbox = document.getElementById('rememberusername');
            const loginButton = document.getElementById('loginbtn');

            if (usernameField) usernameField.value = username;
            if (passwordField) passwordField.value = password;
            if (rememberCheckbox) rememberCheckbox.checked = true;

            // Если включен автовход, нажимаем кнопку
            if (autoLogin && loginButton) {
                //setTimeout(() => {
                    loginButton.click();
                //}, 500); // Небольшая задержка для надежности
            }
        }
    });
}