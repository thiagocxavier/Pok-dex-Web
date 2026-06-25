const historico = [];

/* CARREGA O HISTÓRICO SALVO */

const historicoSalvo =
    JSON.parse(
        localStorage.getItem("historicoPokemon")
    );

if(historicoSalvo){
    historico.push(...historicoSalvo);
}

/* ENTER PARA BUSCAR */

document
.getElementById("pokemonInput")
.addEventListener("keypress", function(event){

    if(event.key === "Enter"){
        buscarPokemon();
    }

});

/* BUSCA POKÉMON */

async function buscarPokemon(){

    const pokemon = document
        .getElementById("pokemonInput")
        .value
        .toLowerCase()
        .trim();

    const resultado =
        document.getElementById("resultado");

    if(!pokemon){

        resultado.innerHTML = `
            <p class="erro">
                Digite um Pokémon.
            </p>
        `;

        return;
    }

    resultado.innerHTML = `
        <div class="loading">
            Carregando Pokémon...
        </div>
    `;

    try{

        const resposta = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${pokemon}`
        );

        if(!resposta.ok){
            throw new Error();
        }

        const dados = await resposta.json();

        adicionarHistorico(dados.name);

        resultado.innerHTML = `

            <h2>${dados.name.toUpperCase()}</h2>

            <img
            src="${dados.sprites.other["official-artwork"].front_default}"
            alt="${dados.name}">

            <div class="info">

                <p>
                    <strong>Nº:</strong>
                    #${dados.id}
                </p>

                <p>
                    <strong>Tipo:</strong>
                    ${dados.types
                        .map(tipo => tipo.type.name)
                        .join(", ")}
                </p>

                <p>
                    <strong>Altura:</strong>
                    ${dados.height}
                </p>

                <p>
                    <strong>Peso:</strong>
                    ${dados.weight}
                </p>

                <p>
                    <strong>Habilidades:</strong>
                    ${dados.abilities
                        .map(h => h.ability.name)
                        .join(", ")}
                </p>

                <h3>Estatísticas</h3>

                ${dados.stats.map(stat => `

                    <div class="stat">

                        <span>
                            ${stat.stat.name}: ${stat.base_stat}
                        </span>

                        <div class="barra">
                            <div
                                class="preenchimento"
                                style="width:${Math.min(stat.base_stat,100)}%">
                            </div>
                        </div>

                    </div>

                `).join("")}

            </div>
        `;

    }catch(error){

        resultado.innerHTML = `
            <p class="erro">
                Pokémon não encontrado!
            </p>
        `;
    }
}

/* ADICIONA HISTÓRICO */

function adicionarHistorico(nome){

    if(!historico.includes(nome)){

        historico.unshift(nome);

        if(historico.length > 5){
            historico.pop();
        }

        localStorage.setItem(
            "historicoPokemon",
            JSON.stringify(historico)
        );

        atualizarHistorico();
    }
}

/* ATUALIZA HISTÓRICO */

function atualizarHistorico(){

    const lista =
        document.getElementById("historico");

    lista.innerHTML = "";

    if(historico.length === 0){

        lista.innerHTML = `
            <li>
                Nenhuma pesquisa realizada.
            </li>
        `;

        return;
    }

    historico.forEach(nome => {

        const item =
            document.createElement("li");

        item.textContent = nome;

        item.addEventListener("click", () => {

            document.getElementById(
                "pokemonInput"
            ).value = nome;

            buscarPokemon();

        });

        lista.appendChild(item);

    });

}

/* LIMPA HISTÓRICO */

function limparHistorico(){

    const confirmar = confirm(
        "Deseja realmente limpar o histórico?"
    );

    if(confirmar){

        historico.length = 0;

        localStorage.removeItem(
            "historicoPokemon"
        );

        atualizarHistorico();
    }

}

/* POKÉMON ALEATÓRIO */

function pokemonAleatorio(){

    const numero =
        Math.floor(Math.random() * 1025) + 1;

    document.getElementById(
        "pokemonInput"
    ).value = numero;

    buscarPokemon();
}

/* INICIALIZA HISTÓRICO */

atualizarHistorico();