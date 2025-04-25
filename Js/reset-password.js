document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email'); // Pega o e-mail da URL

    document.getElementById('resetEmail').value = email;

    document.getElementById('resetPasswordForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const newPassword = document.getElementById('newPassword').value;
        const users = JSON.parse(localStorage.getItem('users'));

        // Atualiza a senha
        const updatedUsers = users.map(user =>
            user.email === email ? { ...user, password: newPassword } : user
        );

        localStorage.setItem('users', JSON.stringify(updatedUsers));
        alert("Senha redefinida com sucesso!");
        window.location.href = "login.html";
    });
});

if (newPassword.length < 8) {
    alert("A senha deve ter pelo menos 8 caracteres!");
    return;
}

// Em reset-password.js
const token = JSON.parse(localStorage.getItem('resetToken'));
if (!token || token.expires < Date.now()) {
alert("Link expirado! Solicite um novo.");
window.location.href = "login.html";
}