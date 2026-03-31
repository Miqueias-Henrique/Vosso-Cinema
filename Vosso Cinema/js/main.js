// Funções Utilitárias para o LocalStorage conforme o Tutorial
const DB = {
    // Recupera dados convertendo de string para objeto JSON
    buscar: (chave) => {
        const dados = localStorage.getItem(chave);
        return dados ? JSON.parse(dados) : [];
    },
    
    // Salva dados convertendo objeto para string JSON
    salvar: (chave, dado) => {
        try {
            const lista = DB.buscar(chave);
            lista.push(dado);
            localStorage.setItem(chave, JSON.stringify(lista));
            return true;
        } catch (e) {
            // Tratamento de erro para limite de armazenamento atingido
            if (e.name === 'QuotaExceededError') {
                console.error('Limite de armazenamento atingido!');
                alert('Erro: Não há mais espaço no navegador para salvar dados.');
            }
            return false;
        }
    }
};

/**
 * Menu de Navegação Dinâmico e Uniforme
 * Aplica as classes neon definidas no seu style.css
 */
function carregarMenu() {
    const menuHTML = `
    <nav class="navbar navbar-expand-lg navbar-dark bg-cinema fixed-top">
        <div class="container">
            <a class="navbar-brand text-neon-cyan" href="index.html"> Vosso Cinema</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <div class="navbar-nav ms-auto">
                    <a class="nav-link" href="index.html">Início</a>
                    <a class="nav-link" href="cadastro-filmes.html">Filmes</a>
                    <a class="nav-link" href="cadastro-salas.html">Salas</a>
                    <a class="nav-link" href="cadastro-sessoes.html">Sessões</a>
                    <a class="nav-link" href="sessoes.html">Listagem</a>
                    <a class="nav-link" href="venda-ingressos.html">Vendas</a>
                </div>
            </div>
        </div>
    </nav>`;
    
    // Insere o menu no topo do body conforme exigência de navegabilidade
    document.body.insertAdjacentHTML('afterbegin', menuHTML);
}

// Executa o carregamento do menu automaticamente ao carregar a página
window.addEventListener('load', carregarMenu);