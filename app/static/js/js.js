    // Obter todos os botões do jogo
//    var dados = {{ obter_tempo_e_movimentos() | tojson }};
    const botoes = document.querySelectorAll('.puzzle button span');
    var estadoDoJogo = "parado"; // Inicialmente, o jogo está parado
//    let tempoRestante = dados.tempo;
//    let contadorMovimentos = dados.movimentos; // contador de movimentos

    let tempoRestante, contadorMovimentos;

    fetch('/tempo_movimentos')
      .then(response => response.json())
      .then(data => {
        tempoRestante = data.tempo;
        contadorMovimentos = data.movimentos;
        // outras operações que usam as variáveis tempoRestante e contadorMovimentos
      });

    let intervalo; // armazena o ID do intervalo
    const botaoIniciar = document.querySelector('.menu button');

    // Adicionar evento de clique em cada botão
    let jogoIniciado = false;
    perder = document.querySelector('.perder');
    ganhar = document.querySelector('.ganhar');
    fim = document.querySelector('.fim');

    botoes.forEach(botao => {
        botao.addEventListener('click', () => {

            if (!jogoIniciado) {
                return;
            }
            // Obter a linha e coluna do botão clicado
            const linha = parseInt(botao.dataset.linha);
            const coluna = parseInt(botao.dataset.coluna);

            // Verificar se o botão vazio está na mesma linha ou coluna que o botão clicado
            const adjacentes = [
              { linha: -1, coluna: 0 }, // cima
              { linha: 1, coluna: 0 },  // baixo
              { linha: 0, coluna: -1 }, // esquerda
              { linha: 0, coluna: 1 }   // direita
            ];

            // Verificar se o botão vazio está em uma posição adjacente ao botão clicado
            let botaoVazio;
            for (const adjacente of adjacentes) {
              const linhaAdjacente = linha + adjacente.linha;
              const colunaAdjacente = coluna + adjacente.coluna;
              const botaoAdjacente = document.querySelector(`[data-linha="${linhaAdjacente}"][data-coluna="${colunaAdjacente}"]`);
              if (botaoAdjacente && botaoAdjacente.innerHTML === '') {
                botaoVazio = botaoAdjacente;
                break;
              }
            }

            // Se houver um botão vazio adjacente, mover o botão clicado para o espaço vazio
            if (botaoVazio) {
              botaoVazio.innerHTML = botao.innerHTML;
              botao.innerHTML = '';
              contadorMovimentos++; // atualizar o contador de movimentos
              document.querySelector('.menu span').textContent = `move: ${contadorMovimentos}`; // atualizar o texto do span

              // Verificar se o jogo foi concluído
              let jogoConcluido = true;
              let numeroEsperado = 1;
              botoes.forEach(botao => {
                if (botao.innerHTML !== '' && parseInt(botao.innerHTML) !== numeroEsperado) {
                  jogoConcluido = false;
                }
                numeroEsperado++;
              });

                //verificar se o jogador ganhou
              if (jogoConcluido) {
                jogada(true);
                clearInterval(intervalo); // parar o temporizador
                ganhar.classList.remove('d-none');
                ganhar.classList.add('d-flex');
                fim.classList.remove('d-none');
                fim.classList.add('d-flex');

//                const operadora = document.querySelector('.select-operadora').value;
//                const valor = document.querySelector('.select-valor').value;
//                const url = '/recargas-disponiveis/${operadora}/${valor}';
//                fetch(url)
//                    .then(response => response.text())
//                    .then(data => {
//                        document.querySelector('#codigo').textContent = data;
//                    });

              }
            }
        });

    });
    botaoIniciar.addEventListener('click', () => {
       if(estadoDoJogo === 'parado'){
        jogoIniciado = true;
        estadoDoJogo = 'jogando';
        botaoIniciar.innerHTML = 'Restart';
        // Obter o elemento span do tempo
        const tempoSpan = document.querySelector('.menu .time');

        // Definir o tempo inicial em segundos

        // Definir o temporizador para atualizar o tempo a cada segundo
            intervalo = setInterval(() => {
              tempoRestante--;
              tempoSpan.textContent = `time: ${tempoRestante}`;
              if (tempoRestante === 0) {

                 jogada(false);
                clearInterval(intervalo);
                perder.classList.remove('d-none');
                perder.classList.add('d-flex');
                fim.classList.remove('d-none');
                fim.classList.add('d-flex');


              }
            }, 1000);
       }else{
        if(estadoDoJogo === 'jogando'){
           window.location.reload();
        }
       }
    });

    const okPerder = document.querySelector('.perder button');
    okPerder.addEventListener('click', ()=>{
        window.location.reload();
    });
    const okGanhar = document.querySelector('.ganhar button');
    okGanhar.addEventListener('click', ()=>{
        window.location.reload();
    });


//    function getVal(estado){
//        const operadora = 'Movitel';
//        const valor = 50;
//        const tempo_jogo = 150; // subtrair o tempo de espera antes do jogo iniciar
//        const movimentos = 40
//        const dados = {
//            movimentos: movimentos,
//            ganhou: estado,
//            operadora: operadora,
//            valor: valor,
//            tempo: tempo_jogo
//        }
//        fetch('/jogada', {
//            method: 'POST',
//            headers: {
//                'Content-Type': 'application/json'
//            },
//            body: JSON.stringify(dados)
//        });
//    }


    function atualizarCodigo(codigo) {
      document.querySelector("#codigo").innerText = codigo;
    }

    function jogada(estado) {
      const operadora = document.querySelector('.select-operadora').value;
      const valor = document.querySelector('.select-valor').value;
      const tempo_jogo = 250-tempoRestante; // subtrair o tempo de espera antes do jogo iniciar
      const movimentos = contadorMovimentos;
      const dados = {
        movimentos: movimentos,
        ganhou: estado,
        operadora: operadora,
        valor: valor,
        tempo: tempo_jogo
      };

      fetch('/jogada', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dados)
      })
      .then(response => response.text())
      .then(codigo => atualizarCodigo(codigo))
      .catch(error => {
        console.error(error);
        alert("Ocorreu um erro ao realizar a jogada. Por favor, tente novamente mais tarde.");
      });
    }
