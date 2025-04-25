document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const editBtn = document.getElementById('editProfileBtn');
    const saveBtn = document.getElementById('saveProfileBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const avatarInput = document.getElementById('avatarInput');
    const profileAvatar = document.getElementById('profileAvatar');
    const loginLink = document.querySelector('a[href="../Login.html"]');
    
    // Verificar se o usuário está logado
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userData = JSON.parse(localStorage.getItem('userData')) || null;
    
    // Se não estiver logado, redirecionar para login
    if (!isLoggedIn || !userData) {
        // Mostrar mensagem antes de redirecionar
        alert('Você precisa estar logado para acessar esta página.');
        window.location.href = '../Login.html';
        return;
    }
    
    // Se estiver logado, carregar os dados
    loadUserData(userData);
    
    // Event Listeners
    if (editBtn) editBtn.addEventListener('click', enableEditMode);
    if (saveBtn) saveBtn.addEventListener('click', saveProfile);
    if (logoutBtn) logoutBtn.addEventListener('click', logout);
    if (avatarInput) avatarInput.addEventListener('change', handleAvatarUpload);
    
    // Atualizar link de login no menu para perfil
    if (loginLink) {
        loginLink.textContent = 'Meu Perfil';
        loginLink.href = 'profile.html';
    }
    
    // Carregar dados do usuário
    function loadUserData(data) {
        // Preencher os dados na página
        document.getElementById('profileUsername').textContent = data.username || 'UsuárioPPGeek';
        document.getElementById('profileName').textContent = data.name || 'Nome do Usuário';
        document.getElementById('profileEmail').textContent = data.email || 'usuario@ppgeek.com';
        document.getElementById('profileBirthdate').textContent = formatDate(data.birthdate) || '01/01/1990';
        document.getElementById('joinDate').textContent = formatDate(data.joinDate) || formatDate(new Date());
        
        // Avatar
        if (data.avatar) {
            profileAvatar.src = data.avatar;
        } else {
            profileAvatar.src = '../images/default-avatar.png';
        }
        
        // Preferências
        if (document.getElementById('themePreference')) {
            document.getElementById('themePreference').value = data.theme || 'dark';
        }
        if (document.getElementById('notificationsToggle')) {
            document.getElementById('notificationsToggle').checked = data.notifications !== false;
        }
        
        // Estatísticas
        if (data.stats) {
            document.getElementById('commentsCount').textContent = data.stats.comments || 0;
            document.getElementById('postsCount').textContent = data.stats.posts || 0;
            document.getElementById('likesCount').textContent = data.stats.likes || 0;
        }
        
        // Atividades
        const activityList = document.getElementById('recentActivity');
        if (activityList) {
            activityList.innerHTML = ''; // Limpar lista
            
            const activities = data.activity || ["Você acessou seu perfil"];
            activities.forEach(activity => {
                const li = document.createElement('li');
                li.textContent = activity;
                activityList.appendChild(li);
            });
        }
    }
    
    // Habilitar modo de edição
    function enableEditMode() {
        document.body.classList.add('edit-mode');
        editBtn.style.display = 'none';
        saveBtn.style.display = 'block';
        
        // Transformar campos em editáveis
        const nameValue = document.getElementById('profileName');
        const emailValue = document.getElementById('profileEmail');
        const birthdateValue = document.getElementById('profileBirthdate');
        
        nameValue.innerHTML = `<input type="text" value="${nameValue.textContent}" id="editName" class="profile-input">`;
        emailValue.innerHTML = `<input type="email" value="${emailValue.textContent}" id="editEmail" class="profile-input">`;
        
        // Converter data para formato input date (YYYY-MM-DD)
        const dateParts = birthdateValue.textContent.split('/');
        const formattedDate = dateParts.length === 3 
            ? `${dateParts[2]}-${dateParts[1].padStart(2, '0')}-${dateParts[0].padStart(2, '0')}`
            : '1990-01-01';
        
        birthdateValue.innerHTML = `<input type="date" value="${formattedDate}" id="editBirthdate" class="profile-input">`;
    }
    
    // Salvar perfil
    function saveProfile() {
        // Obter valores editados
        const newName = document.getElementById('editName').value;
        const newEmail = document.getElementById('editEmail').value;
        const newBirthdate = document.getElementById('editBirthdate').value;
        const newTheme = document.getElementById('themePreference').value;
        const newNotifications = document.getElementById('notificationsToggle').checked;
        
        // Validar campos
        if (!newName || !newEmail) {
            alert('Nome e email são obrigatórios!');
            return;
        }
        
        // Atualizar exibição
        document.getElementById('profileName').textContent = newName;
        document.getElementById('profileEmail').textContent = newEmail;
        document.getElementById('profileBirthdate').textContent = formatDate(newBirthdate);
        
        // Sair do modo de edição
        document.body.classList.remove('edit-mode');
        editBtn.style.display = 'block';
        saveBtn.style.display = 'none';
        
        // Atualizar dados no localStorage
        const updatedUserData = {
            ...userData,
            name: newName,
            email: newEmail,
            birthdate: newBirthdate,
            theme: newTheme,
            notifications: newNotifications,
            activity: [
                `Você atualizou seu perfil em ${new Date().toLocaleDateString()}`,
                ...(userData.activity || [])
            ].slice(0, 5) // Manter apenas as 5 atividades mais recentes
        };
        
        localStorage.setItem('userData', JSON.stringify(updatedUserData));
        
        // Aplicar preferências
        applyPreferences(newTheme);
        
        // Recarregar dados
        loadUserData(updatedUserData);
        
        // Feedback visual
        const feedback = document.createElement('div');
        feedback.textContent = 'Perfil atualizado com sucesso!';
        feedback.style.color = '#2ecc71';
        feedback.style.marginTop = '10px';
        feedback.style.textAlign = 'center';
        
        const actions = document.querySelector('.profile-actions');
        if (actions) {
            actions.appendChild(feedback);
            setTimeout(() => feedback.remove(), 3000);
        }
    }
    
    // Aplicar preferências do usuário
    function applyPreferences(theme) {
        // Implementar mudança de tema se necessário
        document.documentElement.setAttribute('data-theme', theme);
        
        // Salvar preferência
        localStorage.setItem('themePreference', theme);
    }
    
    // Upload de avatar
    function handleAvatarUpload(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        // Verificar se é uma imagem
        if (!file.type.match('image.*')) {
            alert('Por favor, selecione um arquivo de imagem.');
            return;
        }
        
        // Verificar tamanho do arquivo (máximo 2MB)
        if (file.size > 2 * 1024 * 1024) {
            alert('A imagem deve ter no máximo 2MB.');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(event) {
            profileAvatar.src = event.target.result;
            
            // Atualizar dados no localStorage
            const updatedUserData = {
                ...userData,
                avatar: event.target.result,
                activity: [
                    `Você alterou sua foto de perfil em ${new Date().toLocaleDateString()}`,
                    ...(userData.activity || [])
                ].slice(0, 5)
            };
            
            localStorage.setItem('userData', JSON.stringify(updatedUserData));
            
            // Feedback visual
            profileAvatar.classList.add('avatar-updated');
            setTimeout(() => profileAvatar.classList.remove('avatar-updated'), 1000);
        };
        
        reader.onerror = function() {
            alert('Ocorreu um erro ao ler a imagem.');
        };
        
        reader.readAsDataURL(file);
    }
    
    // Logout
    function logout() {
        if (confirm('Tem certeza que deseja sair?')) {
            localStorage.removeItem('isLoggedIn');
            
            // Redirecionar para login com flag para mostrar mensagem
            window.location.href = '../Login.html?logout=true';
        }
    }
    
    // Funções auxiliares
    function formatDate(dateString) {
        if (!dateString) return 'Não informado';
        
        try {
            // Tentar converter para Date (suporta vários formatos)
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                // Se for inválido, tentar parsear formato brasileiro
                const parts = dateString.split('/');
                if (parts.length === 3) {
                    return dateString; // Já está no formato brasileiro
                }
                return 'Data inválida';
            }
            
            return date.toLocaleDateString('pt-BR');
        } catch (e) {
            console.error('Erro ao formatar data:', e);
            return 'Data inválida';
        }
    }
});