document.getElementById('formFilme').addEventListener('submit', function(e) {
    e.preventDefault();

    // Captura os dados do formulário
    const novoFilme = {
        titulo: document.getElementById('titulo').value,
        genero: document.getElementById('genero').value,
        descricao: document.getElementById('descricao').value,
        classificacao: document.getElementById('classificacao').value,
        duracao: document.getElementById('duracao').value,
        estreia: document.getElementById('estreia').value
    };

    // Busca o que já existe no localStorage ou cria um array vazio
    const filmes = JSON.parse(localStorage.getItem('filmes')) || [];

    // Adiciona o novo filme e salva de volta como string
    filmes.push(novoFilme);
    localStorage.setItem('filmes', JSON.stringify(filmes));

    alert("Filme salvo com sucesso!");
    this.reset(); // Limpa o formulário
});