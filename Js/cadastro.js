document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const passwordMatchError = document.getElementById('passwordMatchError');
    const strengthBar = document.querySelector('.strength-bar');
    const passwordHint = document.getElementById('passwordHint');

    // Verificar força da senha em tempo real
    passwordInput.addEventListener('input', () => {
        const password = passwordInput.value;
        const strength = checkPasswordStrength(password);

        strengthBar.className = 'strength-bar';
        strengthBar.classList.add(`strength-${strength.level}`);
        passwordHint.textContent = strength.hint;
    });

    // Validar confirmação de senha
    confirmPasswordInput.addEventListener('input', () => {
        if (passwordInput.value !== confirmPasswordInput.value) {
            passwordMatchError.textContent = "As senhas não coincidem!";
            passwordMatchError.style.display = "block";
        } else {
            passwordMatchError.style.display = "none";
        }
    });

    // Cadastrar usuário
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        // Validações
        if (password !== confirmPassword) {
            passwordMatchError.style.display = "block";
            return;
        }

        if (password.length < 8) {
            alert("A senha deve ter pelo menos 8 caracteres!");
            return;
        }

        // Salvar no LocalStorage
        const users = JSON.parse(localStorage.getItem('users')) || [];

        if (users.some(user => user.email === email)) {
            alert("Este e-mail já está cadastrado!");
            return;
        }

        users.push({ name, email, password });
        localStorage.setItem('users', JSON.stringify(users));

        alert("Cadastro realizado com sucesso!");
        window.location.href = "../Login.html";
    });

    // Verificar força da senha
    function checkPasswordStrength(password) {
        const hasLetters = /[a-zA-Z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        const length = password.length;

        if (length < 8) return { level: 'weak', hint: 'Senha fraca' };
        if (length >= 8 && hasLetters && hasNumbers) {
            return hasSpecial
                ? { level: 'strong', hint: 'Senha forte' }
                : { level: 'medium', hint: 'Senha média' };
        }
        return { level: 'weak', hint: 'Adicione números e letras' };
    }
});
