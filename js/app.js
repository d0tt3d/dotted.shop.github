class WorkshopApp {
    constructor() {
        this.init();
        this.setupImagePreview();
    }

    init() {
        this.renderConfigurations();
        this.renderLua();
        this.setupSearch();
        this.setupLanguageChange();
    }

    renderConfigurations() {
        const neverloseGrid = document.getElementById('neverloseConfigsGrid');
        const fatalityGrid = document.getElementById('fatalityConfigsGrid');
        neverloseGrid.innerHTML = '';
        fatalityGrid.innerHTML = '';

        configurationsData.forEach((item, index) => {
            const card = this.createCard(item, index);
            
            if (item.software.toLowerCase() === 'fatality') {
                fatalityGrid.appendChild(card);
            } else if (item.software.toLowerCase() === 'neverlose') {
                neverloseGrid.appendChild(card);
            }
        });
    }

    renderLua() {
        const neverloseGrid = document.getElementById('neverloseLuaGrid');
        const fatalityGrid = document.getElementById('fatalityLuaGrid');
        const neverloseSection = document.getElementById('neverloseScriptsSection');
        const fatalitySection = document.getElementById('fatalityScriptsSection');
        
        neverloseGrid.innerHTML = '';
        fatalityGrid.innerHTML = '';

        let hasNeverlose = false;
        let hasFatality = false;

        luaData.forEach((item, index) => {
            const card = this.createCard(item, index);
            
            if (item.software.toLowerCase() === 'fatality') {
                fatalityGrid.appendChild(card);
                hasFatality = true;
            } else if (item.software.toLowerCase() === 'neverlose') {
                neverloseGrid.appendChild(card);
                hasNeverlose = true;
            }
        });

        neverloseSection.style.display = hasNeverlose ? 'block' : 'none';
        fatalitySection.style.display = hasFatality ? 'block' : 'none';
    }

    createCard(item, index) {
        const col = document.createElement('div');
        col.className = 'col-md-6 col-lg-4';
        col.style.animationDelay = `${index * 0.1}s`;

        const stars = this.renderStars(item.rating);
        const isFatality = item.software.toLowerCase() === 'fatality';
        
        const cardClass = isFatality ? 'fatality-card' : '';
        const badgeClass = isFatality ? 'fatality-badge' : 'bg-primary';
        const priceClass = isFatality ? 'fatality-price' : '';
        const buttonClass = isFatality ? 'btn-fatality' : 'btn-primary';

        const currentLang = languageManager.currentLanguage;
        const description = typeof item.description === 'object' ? item.description[currentLang] : item.description;
        const features = typeof item.features === 'object' ? item.features[currentLang] : item.features;

        col.innerHTML = `
            <div class="card h-100 ${cardClass}">
                <img src="${item.image}" 
                     class="card-img-top" 
                     alt="${item.name}" 
                     data-item-id="${item.id}"
                     data-item-type="${configurationsData.includes(item) ? 'config' : 'lua'}"
                     onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22200%22%3E%3Crect width=%22400%22 height=%22200%22 fill=%22%235F9BF4%22 opacity=%220.2%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 fill=%22%235F9BF4%22 font-size=%2220%22%3E${item.software}%3C/text%3E%3C/svg%3E'">
                
                <div class="card-body d-flex flex-column">
                    <div class="mb-2">
                        <h5 class="card-title mb-0">${item.name}</h5>
                    </div>
                    
                    <p class="card-text mb-3">${description}</p>
                    
                    <ul class="feature-list mb-3">
                        ${features.map(f => `<li><i class="bi bi-check-circle-fill"></i>${f}</li>`).join('')}
                    </ul>
                    
                    <div class="d-flex justify-content-between align-items-center mb-3 mt-auto">
                        <div class="rating">
                            ${stars}
                        </div>
                        <span class="badge bg-secondary updated-badge">
                            <i class="bi bi-clock me-1"></i>${item.updated}
                        </span>
                    </div>
                    
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="price-tag ${priceClass}">${item.price}</span>
                        <button class="btn ${buttonClass} px-4" onclick="purchase('${item.purchaseUrl}', this)">
                            <i class="bi bi-cart-fill me-2"></i>
                            <span data-translate="purchaseNow">${languageManager.translate('purchaseNow')}</span>
                        </button>
                    </div>
                </div>
            </div>
        `;

        return col;
    }

    renderStars(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            stars += i <= rating 
                ? '<i class="bi bi-star-fill"></i>' 
                : '<i class="bi bi-star"></i>';
        }
        return stars;
    }

    setupSearch() {
        const searchInput = document.getElementById('searchInput');
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            this.filterItems(query);
        });
    }

    filterItems(query) {
        document.querySelectorAll('.card').forEach(card => {
            const text = card.textContent.toLowerCase();
            const col = card.parentElement;
            
            if (text.includes(query)) {
                col.style.display = 'block';
            } else {
                col.style.display = 'none';
            }
        });
    }

    setupLanguageChange() {
        window.addEventListener('languageChanged', () => {
            this.renderConfigurations();
            this.renderLua();
        });
    }

    setupImagePreview() {
        const modal = document.createElement('div');
        modal.className = 'image-preview-modal';
        modal.id = 'imagePreviewModal';
        modal.innerHTML = `
            <div class="preview-content">
                <div class="preview-header">
                    <h5 class="preview-title" id="previewTitle"></h5>
                    <div class="preview-actions">
                        <button class="preview-link-btn" id="previewLinkBtn" title="Go to product">
                            <i class="bi bi-box-arrow-up-right"></i>
                        </button>
                        <button class="preview-close-btn" id="previewCloseBtn" title="Close">
                            <i class="bi bi-x-lg"></i>
                        </button>
                    </div>
                </div>
                <img src="" alt="" class="preview-image" id="previewImage">
                <div class="preview-info">
                    <div class="preview-info-header">
                        <span class="badge preview-software-badge" id="previewBadge"></span>
                        <span class="text-muted small" id="previewUpdated"></span>
                    </div>
                    <p class="preview-description" id="previewDescription"></p>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        const closeBtn = document.getElementById('previewCloseBtn');
        const linkBtn = document.getElementById('previewLinkBtn');

        closeBtn.addEventListener('click', () => this.closePreview());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closePreview();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                this.closePreview();
            }
        });

        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('card-img-top')) {
                const itemId = parseInt(e.target.dataset.itemId);
                const itemType = e.target.dataset.itemType;
                this.openPreview(itemId, itemType);
            }
        });
    }

    openPreview(itemId, itemType) {
        const dataSource = itemType === 'config' ? configurationsData : luaData;
        const item = dataSource.find(i => i.id === itemId);
        
        if (!item) return;

        const modal = document.getElementById('imagePreviewModal');
        const previewImage = document.getElementById('previewImage');
        const previewTitle = document.getElementById('previewTitle');
        const previewBadge = document.getElementById('previewBadge');
        const previewDescription = document.getElementById('previewDescription');
        const previewUpdated = document.getElementById('previewUpdated');
        const linkBtn = document.getElementById('previewLinkBtn');

        const isFatality = item.software.toLowerCase() === 'fatality';
        const currentLang = languageManager.currentLanguage;
        const description = typeof item.description === 'object' ? item.description[currentLang] : item.description;

        previewImage.src = item.image;
        previewImage.alt = item.name;
        previewTitle.textContent = item.name;
        previewBadge.textContent = item.software;
        previewBadge.className = `badge preview-software-badge ${isFatality ? 'fatality-badge' : 'bg-primary'}`;
        previewDescription.textContent = description;
        previewUpdated.innerHTML = `<i class="bi bi-clock me-1"></i>${item.updated}`;
        
        linkBtn.className = `preview-link-btn ${isFatality ? 'fatality' : ''}`;
        linkBtn.onclick = () => {
            window.location.href = item.purchaseUrl;
        };

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closePreview() {
        const modal = document.getElementById('imagePreviewModal');
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function purchase(url, button) {
    const originalHTML = button.innerHTML;
    button.disabled = true;
    button.innerHTML = `
        <span class="spinner-border spinner-border-sm me-2" role="status"></span>
        <span>${languageManager.translate('redirecting')}</span>
    `;

    setTimeout(() => {
        window.location.href = url;
    }, 800);
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        new WorkshopApp();
    }, 100);
});
