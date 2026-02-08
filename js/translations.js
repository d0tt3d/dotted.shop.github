const translations = {
    en: {
        configurations: 'Configurations',
        lua: 'Lua',
        searchWorkshop: 'Search workshop...',
        purchaseNow: 'Purchase Now',
        redirecting: 'Redirecting...',
        updated: 'Updated',
        flagClass: 'flag-icon-en',
        neverlose: 'Neverlose',
        fatality: 'Fatality'
    },
    ru: {
        configurations: 'Конфигурации',
        lua: 'Lua',
        searchWorkshop: 'Поиск в мастерской...',
        purchaseNow: 'Купить',
        redirecting: 'Перенаправление...',
        updated: 'Обновлено',
        flagClass: 'flag-icon-ru',
        neverlose: 'Neverlose',
        fatality: 'Fatality'
    }
};

class LanguageManager {
    constructor() {
        this.currentLanguage = localStorage.getItem('language') || 'en';
        this.init();
    }

    init() {
        this.updateLanguageDisplay();
        this.applyTranslations();
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.querySelectorAll('.dropdown-item[data-lang]').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const lang = item.dataset.lang;
                this.setLanguage(lang);
            });
        });
    }

    setLanguage(lang) {
        this.currentLanguage = lang;
        localStorage.setItem('language', lang);
        this.updateLanguageDisplay();
        this.applyTranslations();
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
    }

    updateLanguageDisplay() {
        const flagElement = document.getElementById('currentLangFlag');
        const langElement = document.getElementById('currentLang');
        
        if (flagElement) {
            flagElement.className = 'flag-icon me-2';
            flagElement.classList.add(translations[this.currentLanguage].flagClass);
        }
        if (langElement) {
            langElement.textContent = this.currentLanguage.toUpperCase();
        }
    }

    applyTranslations() {
        const trans = translations[this.currentLanguage];
        
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            if (trans[key]) {
                element.textContent = trans[key];
            }
        });

        document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
            const key = element.getAttribute('data-translate-placeholder');
            if (trans[key]) {
                element.placeholder = trans[key];
            }
        });
    }

    translate(key) {
        return translations[this.currentLanguage][key] || key;
    }
}

let languageManager;
document.addEventListener('DOMContentLoaded', () => {
    languageManager = new LanguageManager();
});
