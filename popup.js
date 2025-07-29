document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('eios-button').addEventListener('click', function() {
        chrome.tabs.create({ url: 'https://edu.shspu.ru/my' });
    });

    document.getElementById('lms-button').addEventListener('click', function() {
        chrome.tabs.create({ url: 'https://shgpu-lms.web.app' });
    });
});