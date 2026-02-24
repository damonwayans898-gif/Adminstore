/**
 * cadastro.js - Sistema de Registro Profissional
 * Validação de dados, upload de logo, verificação de código
 */

class RegistrationManager {
    constructor() {
        this.supabaseUrl = 'https://seu-projeto.supabase.co';
        this.supabaseKey = 'sua-chave-publica';
        this.isLoading = false;
        this.verificationCode = null;
        this.verificationTimer = null;
        this.init();
    }

    init() {
        console.log('✅ RegistrationManager inicializado');
        this.setupEventListeners();
        this.setupPasswordStrengthMeter();
    }

    setupEventListeners() {
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }

        // Logo upload
        const logoInput = document.getElementById('logoInput');
        if (logoInput) {
            logoInput.addEventListener('change', (e) => this.handleLogoUpload(e));
        }

        const logoPreviewBtn = document.getElementById('logoPreviewBtn');
        if (logoPreviewBtn) {
            logoPreviewBtn.addEventListener('click', () => {
                logoInput.click();
            });
        }

        // Verificação de código
        const codeInputs = document.querySelectorAll('.code-digit');
        codeInputs.forEach((input, index) => {
            input.addEventListener('input', (e) => this.handleCodeInput(e, index));
            input.addEventListener('keydown', (e) => this.handleCodeKeydown(e, index));
        });

        // País seleção
        const countrySelect = document.getElementById('registerCountry');
        if (countrySelect) {
            countrySelect.addEventListener('change', (e) => this.updateCountryFlag(e));
        }
    }

    setupPasswordStrengthMeter() {
        const passwordInput = document.getElementById('registerPassword');
        if (passwordInput) {
            passwordInput.addEventListener('input', () => this.updatePasswordStrength(passwordInput));
        }
    }

    updatePasswordStrength(input) {
        const password = input.value;
        const meter = document.getElementById('passwordStrengthMeter');
        if (!meter) return;

        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^a-zA-Z0-9]/.test(password)) strength++;

        const labels = ['Muito fraca', 'Fraca', 'Média', 'Forte', 'Muito forte'];
        const colors = ['#e74c3c', '#f39c12', '#f1c40f', '#27ae60', '#16c784'];

        meter.style.width = (strength / 5) * 100 + '%';
        meter.style.backgroundColor = colors[Math.min(strength - 1, 4)] || '#ccc';
        
        const label = document.getElementById('passwordStrengthLabel');
        if (label) {
            label.textContent = labels[Math.min(strength - 1, 4)] || 'Muito fraca';
            label.style.color = colors[Math.min(strength - 1, 4)] || '#ccc';
        }
    }

    handleLogoUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        // Validar tipo
        if (!file.type.startsWith('image/')) {
            this.showAlert('Selecione uma imagem válida', 'error');
            return;
        }

        // Validar tamanho (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            this.showAlert('Imagem muito grande (máx. 2MB)', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const preview = document.getElementById('logoPreview');
            const img = document.createElement('img');
            img.src = event.target.result;
            img.style.maxWidth = '100%';
            img.style.maxHeight = '100%';
            
            preview.innerHTML = '';
            preview.appendChild(img);

            // Adicionar animação
            preview.classList.add('image-loaded');
            this.showAlert('Logo carregada com sucesso! ✅', 'success');
        };

        reader.readAsDataURL(file);
    }

    updateCountryFlag(e) {
        const country = e.target.value;
        const flagMap = {
            'MZ': '🇲🇿',
            'AO': '🇦🇴',
            'ZA': '🇿🇦',
            'PT': '🇵🇹',
            'BR': '🇧🇷'
        };

        const flagDisplay = document.getElementById('countryFlag');
        if (flagDisplay) {
            flagDisplay.textContent = flagMap[country] || '🌍';
        }
    }

    handleCodeInput(e, index) {
        const input = e.target;
        const codeInputs = document.querySelectorAll('.code-digit');

        if (input.value.length === 1 && index < codeInputs.length - 1) {
            codeInputs[index + 1].focus();
        }

        // Validar se todos os dígitos foram preenchidos
        const code = Array.from(codeInputs).map(inp => inp.value).join('');
        if (code.length === 6) {
            this.verifyCodeAutomatically(code);
        }
    }

    handleCodeKeydown(e, index) {
        const codeInputs = document.querySelectorAll('.code-digit');

        if (e.key === 'Backspace' && !e.target.value && index > 0) {
            codeInputs[index - 1].focus();
        }

        if (e.key === 'Enter') {
            const code = Array.from(codeInputs).map(inp => inp.value).join('');
            if (code.length === 6) {
                this.verifyCode();
            }
        }
    }

    async handleRegister(e) {
        e.preventDefault();

        if (this.isLoading) return;
        this.isLoading = true;

        const storeName = document.getElementById('storeName').value.trim();
        const email = document.getElementById('registerEmail').value.trim();
        const password = document.getElementById('registerPassword').value;
        const passwordConfirm = document.getElementById('registerPasswordConfirm').value;
        const country = document.getElementById('registerCountry').value;
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalContent = this.showLoadingAnimation(submitBtn);

        try {
            // Validações
            if (!storeName || !email || !password || !country) {
                throw new Error('Preencha todos os campos obrigatórios');
            }

            if (storeName.length < 3) {
                throw new Error('Nome da loja deve ter pelo menos 3 caracteres');
            }

            if (!this.isValidEmail(email)) {
                throw new Error('Email inválido');
            }

            if (password.length < 6) {
                throw new Error('Senha deve ter pelo menos 6 caracteres');
            }

            if (password !== passwordConfirm) {
                throw new Error('Senhas não coincidem');
            }

            // Simular requisição API
            await this.simulateApiCall(800);

            // Gerar código de verificação
            this.verificationCode = Math.random().toString().slice(2, 8);
            console.log('📧 Código de verificação:', this.verificationCode);

            // Salvar dados temporariamente
            sessionStorage.setItem('registrationData', JSON.stringify({
                storeName,
                email,
                password,
                country,
                timestamp: Date.now()
            }));

            this.showAlert('✅ Email verificado! Insira o código enviado.', 'success');

            // Mostrar modal de verificação
            this.showVerificationModal(email);

        } catch (error) {
            this.showAlert(error.message || 'Erro ao registrar', 'error');
            console.error('Registration error:', error);
        } finally {
            this.hideLoadingAnimation(submitBtn, originalContent);
            this.isLoading = false;
        }
    }

    showVerificationModal(email) {
        const modal = document.getElementById('verificationModal');
        if (modal) {
            const emailDisplay = document.getElementById('verificationEmail');
            if (emailDisplay) {
                emailDisplay.textContent = email;
            }

            modal.classList.add('show');
            this.startCodeTimer();

            // Focar no primeiro input
            const firstCodeInput = document.querySelector('.code-digit');
            if (firstCodeInput) {
                firstCodeInput.focus();
            }
        }
    }

    hideVerificationModal() {
        const modal = document.getElementById('verificationModal');
        if (modal) {
            modal.classList.remove('show');
            this.clearCodeTimer();
        }
    }

    startCodeTimer() {
        let timeLeft = 300; // 5 minutos
        const timerEl = document.getElementById('codeTimer');

        this.clearCodeTimer();
        this.verificationTimer = setInterval(() => {
            timeLeft--;

            if (timerEl) {
                const minutes = Math.floor(timeLeft / 60);
                const seconds = timeLeft % 60;
                timerEl.textContent = `⏱️ ${minutes}:${seconds.toString().padStart(2, '0')}`;
            }

            if (timeLeft <= 0) {
                this.clearCodeTimer();
                this.hideVerificationModal();
                this.showAlert('Código expirado. Tente registar novamente.', 'error');
            }
        }, 1000);
    }

    clearCodeTimer() {
        if (this.verificationTimer) {
            clearInterval(this.verificationTimer);
            this.verificationTimer = null;
        }
    }

    async verifyCodeAutomatically(code) {
        if (code === this.verificationCode) {
            await this.verifyCode();
        }
    }

    async verifyCode() {
        const codeInputs = document.querySelectorAll('.code-digit');
        const code = Array.from(codeInputs).map(inp => inp.value).join('');

        if (code.length !== 6) {
            this.showAlert('Insira o código completo', 'error');
            return;
        }

        if (code !== this.verificationCode) {
            this.showAlert('Código inválido', 'error');
            codeInputs.forEach(inp => {
                inp.classList.add('error');
                setTimeout(() => inp.classList.remove('error'), 600);
            });
            return;
        }

        try {
            const registrationData = JSON.parse(sessionStorage.getItem('registrationData'));
            
            // Simular salvamento
            await this.simulateApiCall(600);

            this.showAlert('✅ Registro bem-sucedido! Redirecionando...', 'success');
            
            // Limpar dados temporários
            sessionStorage.removeItem('registrationData');
            this.clearCodeTimer();

            // Redirecionar para login
            setTimeout(() => {
                window.location.href = '/index.html';
            }, 1500);

        } catch (error) {
            this.showAlert('Erro ao verificar código', 'error');
        }
    }

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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

    async simulateApiCall(ms = 1000) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.registrationManager = new RegistrationManager();
});
