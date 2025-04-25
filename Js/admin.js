document.addEventListener('DOMContentLoaded', () => {
    const adminLogin = document.getElementById('adminLogin');
    const adminPanel = document.getElementById('adminPanel');
    const usersTableBody = document.getElementById('usersTableBody');
    const emptyMessage = document.getElementById('emptyMessage');
    const logoutBtn = document.getElementById('logoutBtn');
    const adminAuthForm = document.getElementById('adminAuthForm');

    // Senha do admin (em produção, use Firebase Auth)
    const ADMIN_PASSWORD = "PPg33kç"; // Troque isso!

    // Verificar autenticação
    if (!localStorage.getItem('adminAuthenticated')) {
        adminLogin.style.display = 'flex';
        adminPanel.style.display = 'none';
    } else {
        loadUsers();
    }

    // Login Admin
    adminAuthForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const password = document.getElementById('adminPassword').value;

        if (password === ADMIN_PASSWORD) {
            localStorage.setItem('adminAuthenticated', 'true');
            adminLogin.style.display = 'none';
            adminPanel.style.display = 'block';
            loadUsers();
        } else {
            alert('Senha incorreta!');
        }
    });

    // Logout
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('adminAuthenticated');
        window.location.reload();
    });

    // Carregar usuários
    function loadUsers() {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        usersTableBody.innerHTML = '';

        if (users.length === 0) {
            emptyMessage.style.display = 'block';
            return;
        }

        emptyMessage.style.display = 'none';
        users.forEach((user, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${new Date().toLocaleDateString()}</td>
            <td>
            <button class="action-btn delete-btn" data-index="${index}">Excluir</button>
            </td>
        `;
            usersTableBody.appendChild(row);
        });

        // Adicionar eventos aos botões
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                deleteUser(index);
            });
        });
    }

    // Excluir usuário
    function deleteUser(index) {
        if (!confirm('Tem certeza que deseja excluir este usuário?')) return;

        const users = JSON.parse(localStorage.getItem('users'));
        users.splice(index, 1);
        localStorage.setItem('users', JSON.stringify(users));
        loadUsers();
    }
});