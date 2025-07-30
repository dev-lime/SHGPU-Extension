document.addEventListener('DOMContentLoaded', function () {
    // Загружаем сохраненные данные
    chrome.storage.sync.get(['shgpuUsername', 'shgpuPassword', 'autoLogin'], function (data) {
        document.getElementById('username').value = data.shgpuUsername || '';
        document.getElementById('password').value = data.shgpuPassword || '';
        document.getElementById('autoLogin').checked = data.autoLogin || false;
    });

    // Обработчик кнопки сохранения
    document.getElementById('saveBtn').addEventListener('click', function () {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const autoLogin = document.getElementById('autoLogin').checked;

        // Сохраняем данные
        chrome.storage.sync.set({
            shgpuUsername: username,
            shgpuPassword: password,
            autoLogin: autoLogin
        }, function () {
            // Показываем сообщение об успешном сохранении
            const status = document.getElementById('status');
            status.textContent = 'Настройки сохранены!';
            status.className = 'status success';
            status.style.display = 'block';

            setTimeout(function () {
                status.style.display = 'none';
            }, 3000);
        });
    });
});