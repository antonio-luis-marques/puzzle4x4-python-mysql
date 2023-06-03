# Puzzle de numeros (1-15)

**AVISO: Este projecto é apenas para fins de estudo e avaliacção de empregadores. Se você deseja utilizar este código 
em seus próprios projectos, por favor mencione o autor original.**

Este é o Readme do Jogo dos 15, um jogo web desenvolvido com JavaScript, HTML, CSS Bootstrap, Flask e MySQL. 
O jogo consiste em organizar os números de 1 a 15 em uma matriz quadrada de forma crescente, movendo os números 
em células adjacentes vazias.

# Tecnologias Utilizadas
JavaScript
HTML
CSS Bootstrap
Flask (Python)
MySQL

## Funcionalidades
- Organização dos números de 1 a 15 em ordem crescente.
- Escolha de uma operadora de telefonia móvel.
- Escolha de um valor de recarga.
- Registro de estatísticas dos jogadores, incluindo tempo de conclusão, número de movimentos e resultado.
- Recompensa ao jogador com uma recarga no valor escolhido após vencer o jogo.
- Visualização de estatísticas, incluindo vitórias, derrotas, número médio de movimentos e tempo médio de conclusão.

## Para executar o jogo em sua máquina local, é necessário ter instalado:
- Python (versão 3.6 ou superior)
- Flask
- MySQL
- Bibliotecas Python necessárias: descritas no ficheiro requirements.txt na raiz

## Configuração do Banco de Dados
O jogo utiliza o MySQL como banco de dados. Antes de executar o jogo, é necessário configurar o acesso ao banco de dados. Siga as instruções abaixo:
- Crie um banco de dados MySQL.
- Abra o arquivo views.py e localize a seguinte linha de código:
      app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://be8f3a65652976:0f351cfe@us-cdbr-east-06.cleardb.net/heroku_2f8f7a4ca871bb8'

- Altere a string de conexão com o banco de dados de acordo com as configurações do seu ambiente.

## Executando o Jogo
- Clone este repositório para o seu ambiente local.
- Navegue até a pasta do projecto.
- Active o ambiente virtual executando o seguinte comando
      venv\Scripts\activate
- Instale as dependências necessárias executando o seguinte comando:
      pip install -r requirements.txt
- Navegue até a pasta com ficheiro python principal (views.py) executando o seguinte comando:
      cd app
- Inicie o servidor executando o seguinte comando
      set flask_app=views.py
- Execute o comando 'flask db migrate' para criar as migrações
- Aplique as migrações usando o comando 'flask db upgrade'
- Execute o aplicativo com o seguinte comando
      flask run

## Imagens
Aqui estão algumas capturas de tela do puzzle em acção:
![Tela 1](capture/Capture1.JPG)
*Tela Inicial*

![Tela 2](capture/Capture2.JPG)
*Apresentação da tela quando o jogador perde*

![Tela 3](capture/Capture3.JPG)
*Apresentação da tela quando o jogador Vence*

![Tela 4](capture/capture4.JPG)
*Tela que apresenta estatisticas do jogo*
