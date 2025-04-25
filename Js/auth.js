document.addEventListener('DOMContentLoaded', function() {
    // Elementos do formulário de login
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginError = document.getElementById('loginError');

    // Inicializa usuários padrão se não existirem
    initializeDefaultUsers();

    // Evento de submit do formulário
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin();
        });
    }

    // Função para inicializar usuários
    function initializeDefaultUsers() {
        if (!localStorage.getItem('users')) {
            const defaultUsers = [
                {
                    email: "admin@ppgeek.com",
                    password: "Admin123",
                    name: "Administrador"
                }
            ];
            localStorage.setItem('users', JSON.stringify(defaultUsers));
        }
    }

    // Função principal de login
    function handleLogin() {
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const users = JSON.parse(localStorage.getItem('users')) || [];

        // Validações básicas
        if (!email || !password) {
            showError("Preencha todos os campos!");
            return;
        }

        // Verifica credenciais
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            loginSuccess(user);
        } else {
            showError("E-mail ou senha incorretos!");
        }
    }

    // Login bem-sucedido
    function loginSuccess(user) {
        // Salva sessão
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        
        // Feedback visual
        if (loginError) loginError.style.display = 'none';
        emailInput.style.borderColor = '';
        passwordInput.style.borderColor = '';

        // Redirecionamento (ajuste o caminho conforme sua estrutura)
        window.location.href = '../index.html';
    }

    // Exibe mensagens de erro
    function showError(message) {
        if (loginError) {
            loginError.textContent = message;
            loginError.style.display = 'block';
        }
        
        // Destaca campos inválidos
        emailInput.style.borderColor = '#ff6b6b';
        passwordInput.style.borderColor = '#ff6b6b';
        
        // Remove o destaque após 3 segundos
        setTimeout(() => {
            if (loginError) loginError.style.display = 'none';
            emailInput.style.borderColor = '';
            passwordInput.style.borderColor = '';
        }, 3000);
    }

    // Verifica se já está logado
    if (sessionStorage.getItem('currentUser')) {
        window.location.href = '../index.html';
    }

    // ========== RECUPERAÇÃO DE SENHA ========== //
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    const forgotPasswordModal = document.getElementById('forgotPasswordModal');
    const closeModal = document.querySelector('.close-modal');
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    const recoveryMessage = document.getElementById('recoveryMessage');

    // Abrir modal
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            if (forgotPasswordModal) forgotPasswordModal.style.display = 'flex';
        });
    }

    // Fechar modal
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            if (forgotPasswordModal) forgotPasswordModal.style.display = 'none';
            if (recoveryMessage) recoveryMessage.style.display = 'none';
        });
    }

    // Enviar recuperação
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('recoveryEmail').value.trim();
            const users = JSON.parse(localStorage.getItem('users')) || [];

            if (!email) {
                if (recoveryMessage) {
                    recoveryMessage.textContent = "Digite um e-mail válido";
                    recoveryMessage.style.color = "#ff6b6b";
                    recoveryMessage.style.display = 'block';
                }
                return;
            }

            const userExists = users.some(user => user.email === email);

            if (userExists) {
                handlePasswordRecovery(email);
            } else {
                if (recoveryMessage) {
                    recoveryMessage.textContent = "E-mail não cadastrado!";
                    recoveryMessage.style.color = "#ff6b6b";
                    recoveryMessage.style.display = 'block';
                }
            }
        });
    }

    function handlePasswordRecovery(email) {
        // Simula envio de e-mail (em produção, integre com Firebase/SendGrid)
        if (recoveryMessage) {
            recoveryMessage.innerHTML = `
                <span style="color: #92f2ff">
                    Instruções enviadas para ${email} (simulado)
                </span>
                <br><small>Verifique sua caixa de entrada</small>
            `;
            recoveryMessage.style.display = 'block';
        }

        // Gera token de recuperação (válido por 1 hora)
        const token = {
            email: email,
            expires: Date.now() + 3600000
        };
        localStorage.setItem('resetToken', JSON.stringify(token));

        // Limpa e fecha após 5 segundos
        setTimeout(() => {
            if (forgotPasswordForm) forgotPasswordForm.reset();
            if (forgotPasswordModal) forgotPasswordModal.style.display = 'none';
            if (recoveryMessage) recoveryMessage.style.display = 'none';
        }, 5000);
    }

    // Fechar modal ao clicar fora
    window.addEventListener('click', function(e) {
        if (e.target === forgotPasswordModal) {
            forgotPasswordModal.style.display = 'none';
        }
    });
});