// Navegação por teclas
document.addEventListener('DOMContentLoaded', function () {
    // Mapeamento de teclas
    const keyMap = {
        '1': 'index.html',
        '2': 'noticias.html',
        '3': 'analises.html',
        '4': 'sobre.html',
        '4.1': 'equipe.html',
        '4.2': 'imprensa.html'
    };

    // Controle por teclado
    document.addEventListener('keydown', function (e) {
        if (keyMap[e.key]) {
            window.location.href = keyMap[e.key];
        }
    });

    // Ativa link atual
    const currentPage = window.location.pathname.split('/').pop();
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
})
