const DB = {
    buscar: (chave) => JSON.parse(localStorage.getItem(chave)) || [],
    
    salvar: (chave, dado) => {
        try {
            const lista = DB.buscar(chave);
            lista.push(dado);
            localStorage.setItem(chave, JSON.stringify(lista));
            return true;
        } catch (e) {
            if (e.name === 'QuotaExceededError') {
                console.error('Limite de armazenamento atingido!');
            }
            return false;
        }
    }
};

function carregarMenu() {
    const menuHTML = `
    <nav class="navbar navbar-expand-lg navbar-dark bg-cinema fixed-top">
        <div class="container">
            <a class="navbar-brand text-neon-cyan" href="index.html">Vosso Cinema</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <div class="navbar-nav ms-auto">
                    <a class="nav-link" href="index.html">Inicio</a>
                    <a class="nav-link" href="cadastro-filmes.html">Filmes</a>
                    <a class="nav-link" href="cadastro-salas.html">Salas</a>
                    <a class="nav-link" href="cadastro-sessoes.html">Sessoes</a>
                    <a class="nav-link" href="sessoes.html">Listagem</a>
                    <a class="nav-link" href="venda-ingressos.html">Vendas</a>
                </div>
            </div>
        </div>
    </nav>`;
    
    document.body.insertAdjacentHTML('afterbegin', menuHTML);
}

window.addEventListener('load', carregarMenu);
