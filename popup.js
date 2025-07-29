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
    document.getElementById('eios-button').addEventListener('click', function () {
        chrome.tabs.create({ url: 'https://edu.shspu.ru/my' });
    });

    document.getElementById('lms-button').addEventListener('click', function () {
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
        });
    });

    // Accent color picker
    const colorPicker = document.getElementById('accent-color');
    colorPicker.addEventListener('input', function () {
        const color = this.value;
        updateAccentColor(color);
        chrome.storage.sync.set({ accentColor: color });
    });

    // Color presets
    const colorPresets = document.querySelectorAll('.color-preset');
    colorPresets.forEach(preset => {
        preset.addEventListener('click', function () {
            const color = getComputedStyle(this).getPropertyValue('--color');
            colorPicker.value = color;
            updateAccentColor(color);
            chrome.storage.sync.set({ accentColor: color });
        });
    });

    // Dropdown for search engines
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    dropdownToggle.addEventListener('click', function (e) {
        e.stopPropagation();
        document.querySelector('.dropdown').classList.toggle('active');
    });

    // Keep dropdown open when clicking inside
    const dropdownMenu = document.querySelector('.dropdown-menu');
    dropdownMenu.addEventListener('click', function (e) {
        e.stopPropagation();
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function () {
        document.querySelector('.dropdown').classList.remove('active');
    });

    // Search engine checkboxes
    const searchCheckboxes = document.querySelectorAll('.search-checkbox');
    searchCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            const searchEngines = Array.from(document.querySelectorAll('.search-checkbox:checked'))
                .map(cb => cb.value);
            chrome.storage.sync.set({ searchEngines: searchEngines });
        });
    });

    // Load saved settings
    chrome.storage.sync.get(['theme', 'accentColor', 'searchEngines'], function (data) {
        // Theme
        if (data.theme) {
            applyTheme(data.theme);
            document.querySelector(`.theme-option[data-theme="${data.theme}"]`).classList.add('active');
        }

        // Accent color
        if (data.accentColor) {
            colorPicker.value = data.accentColor;
            updateAccentColor(data.accentColor);
        }

        // Search engines
        if (data.searchEngines) {
            searchCheckboxes.forEach(checkbox => {
                checkbox.checked = data.searchEngines.includes(checkbox.value);
            });
        }
    });

    // Apply theme function
    function applyTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
    }

    // Update accent color
    function updateAccentColor(color) {
        document.documentElement.style.setProperty('--accent-color', color);
    }
});