// main.js (Lógica de busca e renderização)

document.addEventListener('DOMContentLoaded', () => {
    // Exibe a mensagem de boas-vindas
    const userName = localStorage.getItem('userName');
    const welcomeHeading = document.querySelector('h1');
    if (welcomeHeading && userName) {
        welcomeHeading.textContent = `Olá, ${userName}! Seu Painel Financeiro`;
    } else if (welcomeHeading) {
        welcomeHeading.textContent = 'Bem-vindo ao Painel Financeiro!';
    }
    
    // Inicia a busca pelos dados protegidos
    buscarUsuarios();
});

async function buscarUsuarios() {
    // 1. Pega o token salvo após o login
    const token = localStorage.getItem('authToken');

    if (!token) {
        console.error("Token de autenticação não encontrado. Redirecionando.");
        // Se não houver token, força o retorno para a tela de login
        window.location.href = 'index.html'; 
        return;
    }

    try {
        // 2. Faz a requisição para a rota protegida, INCLUINDO O TOKEN
        const response = await fetch('http://localhost:3000/usuarios', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // O header Authorization é OBRIGATÓRIO para rotas protegidas
                'Authorization': `Bearer ${token}` 
            }
        });

        if (response.ok) {
            const usuarios = await response.json();
            console.log("Dados de usuários recebidos com sucesso:", usuarios);
            
            // 3. CHAMA A FUNÇÃO DE RENDERIZAÇÃO
            renderizarUsuarios(usuarios);
            
        } else if (response.status === 401 || response.status === 403) {
            // Token inválido ou expirado
            alert("Sessão expirada. Faça login novamente.");
            localStorage.removeItem('authToken'); // Limpa o token inválido
            window.location.href = 'index.html'; // Redireciona
        } else {
            // Outros erros
            const errorData = await response.json();
            console.error("Erro ao buscar usuários:", errorData.message);
        }
    } catch (error) {
        console.error("Erro de rede:", error);
        alert('Falha na conexão com o servidor.');
    }
}

function renderizarUsuarios(usuarios) {
    const body = document.querySelector('body');
    // Cria um container para os dados
    const dataContainer = document.createElement('div');
    dataContainer.style.marginTop = '20px';
    
    let listaHTML = '<h2>Usuários Encontrados (Protegido)</h2><ul>';
    
    usuarios.forEach(user => {
        // Exibe os dados retornados pelo backend
        listaHTML += `<li>ID: ${user.id_usuario.substring(0, 8)}... | Nome: ${user.nome_completo} | Email: ${user.email}</li>`;
    });
    
    listaHTML += '</ul>';
    
    dataContainer.innerHTML = listaHTML;
    body.appendChild(dataContainer);
}