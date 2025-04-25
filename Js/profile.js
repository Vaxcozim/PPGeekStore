document.addEventListener('DOMContentLoaded', function() {
    // Verificar se o usuário está logado
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userData = JSON.parse(localStorage.getItem('userData')) || null;
    
    if (!isLoggedIn || !userData) {
        // Redirecionar para login se não estiver logado
        window.location.href = 'Login.html';
        return;
    }
    
    // Elementos do DOM
    const editBtn = document.getElementById('editProfileBtn');
    const saveBtn = document.getElementById('saveProfileBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const avatarInput = document.getElementById('avatarInput');
    const profileAvatar = document.getElementById('profileAvatar');
    
    // Carregar dados do usuário
    loadUserData(userData);
    
    // Event Listeners
    editBtn.addEventListener('click', () => enableEditMode(userData));
    saveBtn.addEventListener('click', () => saveProfile(userData));
    logoutBtn.addEventListener('click', logout);
    avatarInput.addEventListener('change', handleAvatarUpload);
    
    // Função para carregar dados do usuário
    function loadUserData(data) {
        document.getElementById('profileUsername').textContent = data.username || 'UsuárioPPGeek';
        document.getElementById('profileName').textContent = data.name || 'Nome do Usuário';
        document.getElementById('profileEmail').textContent = data.email || 'usuario@ppgeek.com';
        document.getElementById('profileBirthdate').textContent = formatDate(data.birthdate) || '01/01/1990';
        document.getElementById('joinDate').textContent = formatDate(data.joinDate) || formatDate(new Date());
        
        // Avatar
        if (data.avatar) {
            profileAvatar.src = data.avatar;
        } else {
            profileAvatar.src = 'images/default-avatar.png';
        }
        
        // Preferências
        document.getElementById('themePreference').value = data.theme || 'dark';
        document.getElementById('notificationsToggle').checked = data.notifications !== false;
        
        // Estatísticas
        document.getElementById('commentsCount').textContent = data.stats?.comments || 0;
        document.getElementById('postsCount').textContent = data.stats?.posts || 0;
        document.getElementById('likesCount').textContent = data.stats?.likes || 0;
        
        // Atividades
        const activityList = document.getElementById('recentActivity');
        if (activityList) {
            activityList.innerHTML = '';
            const activities = data.activity || ["Você acessou seu perfil"];
            activities.forEach(activity => {
                const li = document.createElement('li');
                li.textContent = activity;
                activityList.appendChild(li);
            });
        }
    }
    
    // Habilitar modo de edição
    function enableEditMode(user) {
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
    function saveProfile(user) {
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
        
        // Atualizar objeto do usuário
        const updatedUser = {
            ...user,
            name: newName,
            email: newEmail,
            birthdate: newBirthdate,
            theme: newTheme,
            notifications: newNotifications,
            activity: [
                `Perfil atualizado em ${new Date().toLocaleDateString('pt-BR')}`,
                ...(user.activity || [])
            ].slice(0, 5)
        };
        
        // Salvar no localStorage
        localStorage.setItem('userData', JSON.stringify(updatedUser));
        
        // Sair do modo de edição e recarregar dados
        document.body.classList.remove('edit-mode');
        editBtn.style.display = 'block';
        saveBtn.style.display = 'none';
        loadUserData(updatedUser);
        
        // Feedback visual
        showFeedback('Perfil atualizado com sucesso!', 'success');
    }
    
    // Upload de avatar
    function handleAvatarUpload(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        // Verificar se é uma imagem
        if (!file.type.match('image.*')) {
            showFeedback('Por favor, selecione um arquivo de imagem.', 'error');
            return;
        }
        
        // Verificar tamanho (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            showFeedback('A imagem deve ter no máximo 2MB.', 'error');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(event) {
            profileAvatar.src = event.target.result;
            
            // Atualizar localStorage
            const userData = JSON.parse(localStorage.getItem('userData'));
            userData.avatar = event.target.result;
            userData.activity = [
                `Foto de perfil alterada em ${new Date().toLocaleDateString('pt-BR')}`,
                ...(userData.activity || [])
            ].slice(0, 5);
            
            localStorage.setItem('userData', JSON.stringify(userData));
            
            // Feedback visual
            showFeedback('Avatar atualizado com sucesso!', 'success');
        };
        
        reader.readAsDataURL(file);
    }
    
    // Logout
    function logout() {
        if (confirm('Tem certeza que deseja sair?')) {
            localStorage.removeItem('isLoggedIn');
            window.location.href = 'Login.html';
        }
    }
    
    // Função auxiliar para formatar data
    function formatDate(dateString) {
        if (!dateString) return 'Não informado';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('pt-BR');
        } catch (e) {
            return dateString; // Retorna o original se não puder converter
        }
    }
    
    // Mostrar feedback visual
    function showFeedback(message, type) {
        const feedback = document.createElement('div');
        feedback.textContent = message;
        feedback.style.padding = '10px';
        feedback.style.margin = '10px 0';
        feedback.style.borderRadius = '4px';
        feedback.style.textAlign = 'center';
        feedback.style.color = type === 'success' ? '#2ecc71' : '#e74c3c';
        feedback.style.backgroundColor = type === 'success' 
            ? 'rgba(46, 204, 113, 0.2)' 
            : 'rgba(231, 76, 60, 0.2)';
        
        const actions = document.querySelector('.profile-actions');
        if (actions) {
            // Remove feedback anterior se existir
            const oldFeedback = actions.querySelector('.feedback-message');
            if (oldFeedback) oldFeedback.remove();
            
            feedback.classList.add('feedback-message');
            actions.appendChild(feedback);
            
            // Remove após 3 segundos
            setTimeout(() => {
                feedback.style.opacity = '0';
                setTimeout(() => feedback.remove(), 300);
            }, 3000);
        }
    }
});

