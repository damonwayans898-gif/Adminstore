/**
 * principal.js - Gerenciador Principal de Animações e Comunicação
 * Transições, notificações, modal tour
 */

class ApplicationManager {
    constructor() {
        this.currentUser = null;
        this.isFirstVisit = !localStorage.getItem('adminstore_visited');
        this.init();
    }

    init() {
        console.log('✅ ApplicationManager inicializado');
        this.checkUserSession();
        this.setupGlobalEventListeners();
        this.setupPageTransitions();
        this.setupScrollAnimations();
        
        if (this.isFirstVisit) {
            this.showTourModal();
            localStorage.setItem('adminstore_visited', 'true');
        }
    }

    checkUserSession() {
        const token = localStorage.getItem('adminstore_token');
        const userData = localStorage.getItem('adminstore_user');

        if (token && userData) {
            this.currentUser = JSON.parse(userData);
            console.log('✅ Sessão ativa:', this.currentUser.email);
            this.updateUserInterface();
        }
    }

    updateUserInterface() {
        // Atualizar nome do utilizador em interface
        const userDisplays = document.querySelectorAll('[data-user-email]');
        userDisplays.forEach(el => {
            if (this.currentUser) {
                el.textContent = this.currentUser.email.split('@')[0];
            }
        });

        // Mostrar botão de logout
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.style.display = 'block';
        }
    }

    setupGlobalEventListeners() {
        // Logout
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }

        // Modais globais
        const modals = document.querySelectorAll('[data-modal]');
        modals.forEach(modal => {
            const closeBtn = modal.querySelector('[data-close-modal]');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => this.closeModal(modal));
            }

            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal);
                }
            });
        });

        // Tooltips
        this.initTooltips();

        // Keyboard shortcuts
        this.setupKeyboardShortcuts();
    }

    setupPageTransitions() {
        // Fade in ao carregar
        const mainContent = document.querySelector('main') || document.body;
        mainContent.style.opacity = '0';
        mainContent.style.transition = 'opacity 0.5s ease-in';

        window.addEventListener('load', () => {
            setTimeout(() => {
                mainContent.style.opacity = '1';
            }, 100);
        });

        // Fade out ao sair
        const links = document.querySelectorAll('a[href^="/"]');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                if (!link.target) {
                    e.preventDefault();
                    const href = link.href;
                    
                    mainContent.style.opacity = '0';
                    setTimeout(() => {
                        window.location.href = href;
                    }, 300);
                }
            });
        });
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observar elementos com classe 'fade-on-scroll'
        document.querySelectorAll('[data-animate]').forEach(el => {
            observer.observe(el);
        });
    }

    initTooltips() {
        const tooltips = document.querySelectorAll('[data-tooltip]');
        tooltips.forEach(el => {
            el.addEventListener('mouseenter', () => this.showTooltip(el));
            el.addEventListener('mouseleave', () => this.hideTooltip(el));
        });
    }

    showTooltip(element) {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = element.getAttribute('data-tooltip');
        tooltip.style.cssText = `
            position: absolute;
            background: #1a1a2e;
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 12px;
            white-space: nowrap;
            z-index: 1000;
            pointer-events: none;
            animation: slideUp 0.2s ease;
        `;

        document.body.appendChild(tooltip);

        const rect = element.getBoundingClientRect();
        tooltip.style.left = (rect.left + rect.width / 2 - tooltip.offsetWidth / 2) + 'px';
        tooltip.style.top = (rect.top - tooltip.offsetHeight - 8) + 'px';

        element._tooltip = tooltip;
    }

    hideTooltip(element) {
        if (element._tooltip) {
            element._tooltip.remove();
            element._tooltip = null;
        }
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Cmd/Ctrl + L para logout
            if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
                e.preventDefault();
                this.logout();
            }

            // Cmd/Ctrl + K para buscar
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                const searchInput = document.getElementById('searchInput');
                if (searchInput) searchInput.focus();
            }
        });
    }

    showTourModal() {
        const modal = document.createElement('div');
        modal.className = 'tour-modal';
        modal.innerHTML = `
            <div class="tour-content">
                <button class="tour-close" onclick="this.parentElement.parentElement.remove()">×</button>
                <div class="tour-step" data-step="1">
                    <div class="tour-icon">👋</div>
                    <h2>Bem-vindo ao AdminStore!</h2>
                    <p>Sistema profissional de gestão de loja com vendas, pagamentos e muito mais.</p>
                    <div class="tour-buttons">
                        <button class="btn-secondary" onclick="tourManager.skipTour()">Pular</button>
                        <button class="btn-primary" onclick="tourManager.nextStep()">Próximo</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        window.tourManager = new TourManager(modal);
    }

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('show');
            modal.style.animation = 'slideUp 0.3s ease';
        }
    }

    closeModal(modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }

    logout() {
        if (confirm('Tem a certeza que deseja sair?')) {
            localStorage.removeItem('adminstore_token');
            localStorage.removeItem('adminstore_user');
            
            const mainContent = document.querySelector('main') || document.body;
            mainContent.style.opacity = '0';
            
            setTimeout(() => {
                window.location.href = '/index.html';
            }, 300);
        }
    }

    showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">
                    ${type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️'}
                </span>
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('hide');
            setTimeout(() => notification.remove(), 300);
        }, duration);
    }
}

/**
 * TourManager - Gerenciador do Tour Inicial
 */
class TourManager {
    constructor(modal) {
        this.modal = modal;
        this.currentStep = 1;
        this.totalSteps = 4;
        this.steps = [
            {
                title: '👋 Bem-vindo ao AdminStore!',
                description: 'Sistema profissional de gestão de loja com vendas, pagamentos e muito mais.',
                image: '🏪'
            },
            {
                title: '🛒 Sistema POS Completo',
                description: 'Gerencie vendas com carrinho, múltiplos métodos de pagamento e recibos profissionais.',
                image: '💳'
            },
            {
                title: '📱 Scanner QR Integrado',
                description: 'Leia códigos de barras e QR automaticamente com a câmera do seu dispositivo.',
                image: '📷'
            },
            {
                title: '🚀 Pronto para Começar!',
                description: 'Faça login ou registre-se para começar a usar. Acesse https://docs.adminstore para mais.',
                image: '✨'
            }
        ];
    }

    nextStep() {
        if (this.currentStep < this.totalSteps) {
            this.currentStep++;
            this.updateStep();
        } else {
            this.closeTour();
        }
    }

    skipTour() {
        this.modal.remove();
    }

    closeTour() {
        this.modal.classList.add('fade-out');
        setTimeout(() => this.modal.remove(), 300);
    }

    updateStep() {
        const step = this.steps[this.currentStep - 1];
        const stepContent = this.modal.querySelector('.tour-step');
        
        stepContent.innerHTML = `
            <button class="tour-close" onclick="tourManager.closeTour()">×</button>
            <div class="tour-icon">${step.image}</div>
            <h2>${step.title}</h2>
            <p>${step.description}</p>
            <div class="tour-progress">
                ${Array(this.totalSteps).fill(0).map((_, i) => 
                    `<div class="progress-dot ${i < this.currentStep ? 'active' : ''}"></div>`
                ).join('')}
            </div>
            <div class="tour-buttons">
                <button class="btn-secondary" onclick="tourManager.skipTour()">Pular</button>
                <button class="btn-primary" onclick="tourManager.nextStep()">
                    ${this.currentStep === this.totalSteps ? 'Começar' : 'Próximo'}
                </button>
            </div>
        `;

        stepContent.style.animation = 'slideUp 0.3s ease';
    }
}

/**
 * Utilitários Globais
 */
window.AppUtils = {
    formatMoney(value) {
        return new Intl.NumberFormat('pt-PT', {
            style: 'currency',
            currency: 'MZN'
        }).format(value);
    },

    formatDate(date) {
        return new Intl.DateTimeFormat('pt-PT', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(date));
    },

    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            window.appManager?.showNotification('Copiado para clipboard!', 'success', 2000);
        });
    },

    debounce(func, delay) {
        let timeoutId;
        return function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    },

    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.appManager = new ApplicationManager();
});
