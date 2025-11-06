document.addEventListener('DOMContentLoaded', () => {

  // --- 1. LÓGICA DE AUTENTICAÇÃO REAL ---
  const loginForm = document.querySelector('form');
  
  // Seleciona os campos de input pelo type (ou ID, se preferir)
  const emailInput = document.querySelector('input[type="email"]');
  const passwordInput = document.querySelector('input[type="password"]');

  if (loginForm) {
      loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = emailInput ? emailInput.value : '';
        const password = passwordInput ? passwordInput.value : '';

        if (!email || !password) {
            alert('Por favor, preencha e-mail e senha.');
            return;
        }

        try {
            // Requisição POST para o backend
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                // SUCESSO: SALVA O TOKEN E O NOME
                localStorage.setItem('authToken', data.token); 
                localStorage.setItem('userName', data.user.nome); 
                
                alert(`Login realizado com sucesso! Bem-vindo(a), ${data.user.nome}!`);
                window.location.href = 'main.html';
            } else {
                // FALHA: Erro de autenticação
                alert(data.message || 'Erro de autenticação. Tente novamente.');
                if (passwordInput) passwordInput.value = ''; 
            }

        } catch (error) {
            console.error('Erro na comunicação com o servidor:', error);
            alert('Não foi possível conectar ao servidor. Verifique se o backend está rodando.');
        }
      });
  }

  // --- 2. LÓGICA PARA O EFEITO DE LUZ NO BOTÃO (Mantida) ---
  const loginButton = document.querySelector('.btn');

  if (loginButton) {
      loginButton.addEventListener('mousemove', (event) => {
        const rect = event.target.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        event.target.style.setProperty('--mouse-x', `${x}px`);
        event.target.style.setProperty('--mouse-y', `${y}px`);
      });
  }
});