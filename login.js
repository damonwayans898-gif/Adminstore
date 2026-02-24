/**
 * login.js - Sistema de Autenticação Profissional
 * Validação, requisições API, animações de loading
 */

class AuthenticationManager {
    constructor() {
        this.supabaseUrl = 'https://seu-projeto.supabase.co';
        this.supabaseKey = 'sua-chave-publica';
        this.isLoading = false;
        this.init();
    }

    init() {
        console.log('✅ AuthenticationManager inicializado');
        this.setupEventListeners();
        this.checkExistingSession();
    }

    setupEventListeners() {
        // Form Login
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Toggle entre Login e Registro
        const toggleButtons = document.querySelectorAll('[data-toggle-auth]');
        toggleButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleAuthForms();
            });
        });

        // Enter key para submeter
        const inputs = document.querySelectorAll('input[type="email"], input[type="password"]');
        inputs.forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const form = e.target.closest('form');
                    if (form) form.dispatchEvent(new Event('submit'));
                }
            });
        });

        // Real-time validation
        this.setupRealtimeValidation();
    }

    setupRealtimeValidation() {
        const emailInputs = document.querySelectorAll('input[type="email"]');
        const passwordInputs = document.querySelectorAll('input[type="password"]');
        const phoneInput = document.getElementById('loginPhone');

        emailInputs.forEach(input => {
            input.addEventListener('blur', () => this.validateEmail(input));
            input.addEventListener('change', () => this.validateEmail(input));
        });

        passwordInputs.forEach(input => {
            input.addEventListener('input', () => this.validatePassword(input));
        });

        if (phoneInput) {
            phoneInput.addEventListener('input', () => this.formatPhoneNumber(phoneInput));
        }
    }

    validateEmail(input) {
        const email = input.value.trim();
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        
        if (email) {
            input.classList.toggle('error', !isValid);
            input.classList.toggle('success', isValid);
        } else {
            input.classList.remove('error', 'success');
        }

        return isValid;
    }

    validatePassword(input) {
        const password = input.value;
        const isValid = password.length >= 6;
        
        if (password) {
            input.classList.toggle('weak', password.length < 6);
            input.classList.toggle('medium', password.length >= 6 && password.length < 10);
            input.classList.toggle('strong', password.length >= 10);
        }

        return isValid;
    }

    formatPhoneNumber(input) {
        let value = input.value.replace(/\D/g, '');
        if (value.length > 12) value = value.slice(0, 12);
        
        if (value.length > 0) {
            if (value.length <= 3) {
                input.value = value;
            } else if (value.length <= 7) {
                input.value = `+258 ${value.slice(0, 2)} ${value.slice(2)}`;
            } else {
                input.value = `+258 ${value.slice(0, 2)} ${value.slice(2, 7)} ${value.slice(7)}`;
            }
        }
    }

    toggleAuthForms() {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        const authTitle = document.getElementById('authTitle');

        if (loginForm && registerForm) {
            loginForm.classList.toggle('hidden');
            registerForm.classList.toggle('hidden');
            
            authTitle.textContent = loginForm.classList.contains('hidden') ? 
                'Criar Conta' : 'Fazer Login';

            // Limpar campos
            loginForm.reset();
            registerForm.reset();
        }
    }

    showLoadingAnimation(element) {
        const originalContent = element.innerHTML;
        element.innerHTML = `
            <span class="spinner-small"></span>
            <span>Processando...</span>
        `;
        element.disabled = true;
        return originalContent;
    }

    hideLoadingAnimation(element, originalContent) {
        element.innerHTML = originalContent;
        element.disabled = false;
    }

    showAlert(message, type = 'info') {
        const alertId = `alert-${Date.now()}`;
        const alertHTML = `
            <div class="alert alert-${type} fade-in" id="${alertId}">
                <div class="alert-content">
                    <span class="alert-icon">
                        ${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}
                    </span>
                    <span class="alert-message">${message}</span>
                    <button class="alert-close" onclick="this.parentElement.parentElement.remove()">×</button>
                </div>
            </div>
        `;

        const container = document.getElementById('alertContainer') || 
                         document.createElement('div');
        container.id = 'alertContainer';
        container.insertAdjacentHTML('beforeend', alertHTML);

        if (!document.body.contains(container)) {
            document.body.prepend(container);
        }

        setTimeout(() => {
            const alert = document.getElementById(alertId);
            if (alert) {
                alert.classList.add('fade-out');
                setTimeout(() => alert.remove(), 300);
            }
        }, 4000);
    }

    async handleLogin(e) {
        e.preventDefault();

        if (this.isLoading) return;
        this.isLoading = true;

        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalContent = this.showLoadingAnimation(submitBtn);

        try {
            // Validar campos
            if (!email || !password) {
                throw new Error('Preencha todos os campos');
            }

            if (!this.validateEmail({ value: email, classList: { toggle: () => {} } })) {
                throw new Error('Email inválido');
            }

            if (password.length < 6) {
                throw new Error('Senha muito curta');
            }

            // Simular requisição API
            await this.simulateApiCall(500);

            // Salvar token (simulado)
            const mockToken = this.generateToken();
            localStorage.setItem('adminstore_token', mockToken);
            localStorage.setItem('adminstore_user', JSON.stringify({
                email: email,
                loginTime: new Date().toISOString()
            }));

            this.showAlert(`Bem-vindo, ${email.split('@')[0]}!`, 'success');

            // Redirecionar após animação
            setTimeout(() => {
                window.location.href = '/painel.html';
            }, 1000);

        } catch (error) {
            this.showAlert(error.message || 'Erro ao fazer login', 'error');
            console.error('Login error:', error);
        } finally {
            this.hideLoadingAnimation(submitBtn, originalContent);
            this.isLoading = false;
        }
    }

    async simulateApiCall(ms = 1000) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    generateToken() {
        return 'token_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    checkExistingSession() {
        const token = localStorage.getItem('adminstore_token');
        if (token && window.location.pathname === '/index.html') {
            console.log('✅ Sessão ativa encontrada');
            // Redirecionar para dashboard
            setTimeout(() => {
                window.location.href = '/painel.html';
            }, 500);
        }
    }

    logout() {
        localStorage.removeItem('adminstore_token');
        localStorage.removeItem('adminstore_user');
        window.location.href = '/index.html';
    }
}

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.authManager = new AuthenticationManager();
});
