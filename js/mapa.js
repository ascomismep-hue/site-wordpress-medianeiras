document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("container-svg");

    // Carrega o arquivo SVG externo
    fetch('mapas/pernambuco.svg')
        .then(response => response.text())
        .then(data => {
            container.innerHTML = data;
            
            // Adiciona interação aos elementos do SVG (ex: cidades com ID)
            const cidades = container.querySelectorAll('path');
            cidades.forEach(cidade => {
                cidade.addEventListener('click', (e) => {
                    alert('Detalhes da cidade: ' + e.target.id);
                });
            });
        })
        .catch(err => console.error("Erro ao carregar mapa:", err));
});
