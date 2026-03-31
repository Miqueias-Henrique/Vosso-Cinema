class VossoCinema {
    constructor() {
        this.init();
    }

    init() {
        this.carregarDados();
        this.bindEvents();
        this.configurarDatas();
    }

    // CARREGAR DADOS DO LOCALSTORAGE
    carregarDados() {
        this.filmes = JSON.parse(localStorage.getItem('filmes')) || [];
        this.salas = JSON.parse(localStorage.getItem('salas')) || [];
        this.sessoes = JSON.parse(localStorage.getItem('sessoes')) || [];
        this.ingressos = JSON.parse(localStorage.getItem('ingressos')) || [];
    }

    // CONFIGURAR DATAS
    configurarDatas() {
        const dataInputs = document.querySelectorAll('input[type="date"], input[type="datetime-local"]');
        dataInputs.forEach(input => {
            input.min = new Date().toISOString().split('T')[0];
            if (input.type === 'datetime-local') {
                input.min = new Date().toISOString().slice(0, 16);
            }
        });
    }

    // MOSTRAR ALERTAS VISUAIS
    mostrarAlerta(mensagem, tipo = 'success', container = '.card-body') {
        const alerta = document.createElement('div');
        alerta.className = `alert alert-${tipo} alert-dismissible fade show mb-3`;
        alerta.innerHTML = `
            <i class="me-2">${this.getIcone(tipo)}</i>${mensagem}
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="alert"></button>
        `;
        
        const target = document.querySelector(container);
        target.insertBefore(alerta, target.firstChild);
        
        setTimeout(() => alerta.remove(), 5000);
    }

    getIcone(tipo) {
        const icones = {
            success: '✅',
            danger: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        return icones[tipo] || 'ℹ️';
    }

    // SALVAR DADOS
    salvarDados(chave, dados) {
        try {
            localStorage.setItem(chave, JSON.stringify(dados));
            return true;
        } catch (e) {
            this.mostrarAlerta('Erro ao salvar no armazenamento!', 'danger');
            return false;
        }
    }

    // CARREGAR SELECTS DINAMICAMENTE
    carregarSelectFilmes(selectId) {
        const select = document.getElementById(selectId);
        if (!select) return;

        select.innerHTML = '<option value="">Carregando filmes...</option>';
        
        if (this.filmes.length === 0) {
            select.innerHTML = '<option value="">Nenhum filme cadastrado</option>';
            return;
        }

        select.innerHTML = '<option value="">Selecione um filme...</option>';
        this.filmes.forEach(filme => {
            const option = new Option(filme.titulo, filme.id);
            select.appendChild(option);
        });
    }

    carregarSelectSalas(selectId) {
        const select = document.getElementById(selectId);
        if (!select) return;

        select.innerHTML = '<option value="">Carregando salas...</option>';
        
        if (this.salas.length === 0) {
            select.innerHTML = '<option value="">Nenhuma sala cadastrada</option>';
            return;
        }

        select.innerHTML = '<option value="">Selecione uma sala...</option>';
        this.salas.forEach(sala => {
            const option = new Option(`${sala.nome} (${sala.capacidade} lugares)`, sala.id);
            select.appendChild(option);
        });
    }

    carregarSelectSessoes(selectId) {
        const select = document.getElementById(selectId);
        if (!select) return;

        select.innerHTML = '<option value="">Carregando sessões...</option>';
        
        if (this.sessoes.length === 0) {
            select.innerHTML = '<option value="">Nenhuma sessão cadastrada</option>';
            return;
        }

        select.innerHTML = '<option value="">Selecione uma sessão...</option>';
        this.sessoes.forEach(sessao => {
            const filme = this.filmes.find(f => f.id === sessao.filmeId);
            const sala = this.salas.find(s => s.id === sessao.salaId);
            if (filme && sala) {
                const option = new Option(
                    `${filme.titulo} | ${sala.nome} | ${new Date(sessao.dataHora).toLocaleString('pt-BR')}`,
                    sessao.id
                );
                select.appendChild(option);
            }
        });
    }

    // CADASTROS
    cadastrarFilme(dadosForm) {
        const filme = {
            id: Date.now(),
            ...dadosForm
        };
        this.filmes.push(filme);
        return this.salvarDados('filmes', this.filmes);
    }

    cadastrarSala(dadosForm) {
        const sala = {
            id: Date.now(),
            ...dadosForm
        };
        this.salas.push(sala);
        return this.salvarDados('salas', this.salas);
    }

    cadastrarSessao(dadosForm) {
        const sessao = {
            id: Date.now(),
            ...dadosForm
        };
        this.sessoes.push(sessao);
        return this.salvarDados('sessoes', this.sessoes);
    }

    venderIngresso(dadosForm) {
        const ingresso = {
            id: Date.now(),
            ...dadosForm,
            dataVenda: new Date().toISOString()
        };
        this.ingressos.push(ingresso);
        return this.salvarDados('ingressos', this.ingressos);
    }

    // LISTAGEM
    listarSalas(containerId) {
        const container = document.getElementById(containerId);
        if (!container || this.salas.length === 0) {
            container.innerHTML = '<p class="text-muted">Nenhuma sala cadastrada.</p>';
            return;
        }

        container.innerHTML = this.salas.map(sala => `
            <div class="list-group-item d-flex justify-content-between align-items-center">
                <div>
                    <strong>${sala.nome}</strong> 
                    <span class="badge bg-primary ms-2">${sala.capacidade} lugares</span>
                    <br><small class="text-muted">${sala.tipo}</small>
                </div>
                <button class="btn btn-sm btn-danger" onclick="cinema.removerItem('salas', ${sala.id}, () => cinema.listarSalas('${containerId}'))">
                    Remover
                </button>
            </div>
        `).join('');
    }

    listarSessoes(containerId) {
        const container = document.getElementById(containerId);
        if (!container || this.sessoes.length === 0) {
            container.innerHTML = '<p class="text-muted">Nenhuma sessão cadastrada.</p>';
            return;
        }

        container.innerHTML = this.sessoes.slice(-6).reverse().map(sessao => {
            const filme = this.filmes.find(f => f.id === sessao.filmeId);
            const sala = this.salas.find(s => s.id === sessao.salaId);
            return `
                <div class="col-md-6 col-lg-4 mb-3">
                    <div class="card h-100 sessao-card">
                        <div class="card-body">
                            <h6 class="card-title">${filme?.titulo || 'Filme não encontrado'}</h6>
                            <p class="card-text small">
                                <strong>Sala:</strong> ${sala?.nome || 'N/D'}<br>
                                <strong>${new Date(sessao.dataHora).toLocaleString('pt-BR')}</strong><br>
                                <strong>R$ ${sessao.preco.toFixed(2)}</strong> | ${sessao.idioma}
                            </p>
                            <button class="btn btn-sm btn-danger w-100" onclick="cinema.removerItem('sessoes', ${sessao.id}, () => cinema.listarSessoes('${containerId}'))">
                                Remover
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    listarSessoesDisponiveis(containerId) {
        const container = document.getElementById(containerId);
        if (!container || this.sessoes.length === 0) {
            container.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-warning text-center">
                        <h4> Nenhuma sessão disponível</h4>
                        <p>Cadastre sessões primeiro!</p>
                    </div>
                </div>
            `;
            return;
        }

        container.innerHTML = this.sessoes.map(sessao => {
            const filme = this.filmes.find(f => f.id === sessao.filmeId);
            const sala = this.salas.find(s => s.id === sessao.salaId);
            const vendidos = this.ingressos.filter(i => i.sessaoId === sessao.id).length;
            
            if (filme && sala) {
                const lotado = vendidos >= sala.capacidade;
                return `
                    <div class="col-md-6 col-lg-4 mb-4">
                        <div class="card h-100 sessao-card ${lotado ? 'sessao-lotado' : ''}">
                            <div class="card-body">
                                <h5 class="card-title text-primary">${filme.titulo}</h5>
                                <div class="mb-2">
                                    <span class="badge bg-secondary">${sala.nome}</span>
                                    <span class="badge bg-info">${sessao.idioma}</span>
                                </div>
                                <p class="mb-2">
                                    <strong>📅 ${new Date(sessao.dataHora).toLocaleString('pt-BR')}</strong><br>
                                    <strong>💰 R$ ${sessao.preco.toFixed(2)}</strong>
                                </p>
                                <div class="progress mb-3" style="height: 8px;">
                                    <div class="progress-bar" style="width: ${(vendidos/sala.capacidade)*100}%"></div>
                                </div>
                                <div class="d-flex justify-content-between">
                                    <span class="badge ${lotado ? 'bg-danger' : 'bg-success'}">
                                        ${lotado ? '🏁 LOTADO' : `${vendidos}/${sala.capacidade}`}
                                    </span>
                                    ${lotado ? '' : `<a href="venda-ingressos.html" class="btn btn-success btn-sm">Comprar</a>`}
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }
            return '';
        }).join('').replace('<div></div>', `
            <div class="col-12">
                <div class="alert alert-info text-center">
                    Cadastre filmes, salas e sessões para ver aqui!
                </div>
            </div>
        `);
    }

    // REMOVER ITEM
    removerItem(chave, id, callback) {
        if (confirm('Tem certeza que deseja remover?')) {
            this[chave] = this[chave].filter(item => item.id !== id);
            this.salvarDados(chave, this[chave]);
            if (callback) callback();
            this.mostrarAlerta('Item removido com sucesso!', 'success');
        }
    }

    // MÁSCARA CPF
    mascaraCPF(inputId) {
        const input = document.getElementById(inputId);
        if (!input) return;

        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            e.target.value = value;
        });
    }

    // EVENTOS GLOBAIS
    bindEvents() {
        // Máscara CPF
        if (document.getElementById('cpf')) {
            this.mascaraCPF('cpf');
        }

        // Detalhes sessão na venda
        const selectSessao = document.getElementById('sessao');
        if (selectSessao) {
            selectSessao.addEventListener('change', (e) => {
                const sessaoId = parseInt(e.target.value);
                if (sessaoId) {
                    const sessao = this.sessoes.find(s => s.id === sessaoId);
                    const filme = this.filmes.find(f => f.id === sessao.filmeId);
                    const sala = this.salas.find(s => s.id === sessao.salaId);
                    
                    if (sessao && filme && sala) {
                        document.getElementById('infoSessao').style.display = 'block';
                        document.getElementById('infoSessao').innerHTML = `
                            <strong>Sessão:</strong> ${filme.titulo} (${sala.nome})<br>
                            ${new Date(sessao.dataHora).toLocaleString('pt-BR')} | R$ ${sessao.preco}
                        `;
                    }
                }
            });
        }
    }
}

// INICIALIZAR
const cinema = new SeuCine();

// EXPORTAR PARA USE NAS PÁGINAS
window.cinema = cinema;