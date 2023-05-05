Puzzle App
Esta é uma aplicação web que permite ao jogador jogar um jogo de puzzle e ganhar créditos para recarregar seu celular. 
O jogo foi criado utilizando o framework Flask, banco de dados MySQL que armazena todas as 
informações relevantes do jogo. A lógica do jogo foi desenvolvida em Python.

Funcionamento
O jogador deve escolher uma operadora de telefonia e o valor da recarga que deseja ganhar. Caso vença o jogo, 
ele receberá um código para recarregar seu celular com o valor escolhido e a operadora correspondente. 
Todas as informações do jogo são armazenadas no banco de dados, incluindo o tempo de conclusão do jogo, 
se o jogador ganhou ou perdeu, e o número de movimentos realizados.

Tecnologias Utilizadas
A aplicação utiliza HTML para a estruturação da página, CSS e bootstrap para a estilização e javascript para manipulação 
de eventos, além do Python para a lógica do jogo. A conexão com o banco de dados é feita utilizando o Flask. Além disso, 
a aplicação gera gráficos estatísticos a partir dos dados armazenados no banco de dados utilizando tecnologias Python.

Como Rodar
Para rodar a aplicação, é necessário instalar o Flask e o banco de dados MySQL. É possível fazer isso através dos 
seguintes comandos no terminal:
pip install flask 'enter'
sudo apt-get install mysql-server 'enter'

o 'enter' indica que apos escrever o comando deve clicar a tecla 'enter'

Após a instalação, é necessário ter o banco de dados. O banco de daddos está disponivel no Amazon Cloud.
Baixe a base de dados, e atraves do xampp, importe e connecte-o

Por fim, é necessário rodar o servidor Flask utilizando o seguinte comando:
venv\Scripts\activate.bat 'enter'
cd app 'enter'
set flask_app=views.py 'enter'
flask run 'enter'

o 'enter' indica que apos escrever o comando deve clicar a tecla 'enter'
o ultimo comando 'flask run' vai forncer o endereco pelo qual sera possivel rodar a aplicao em algum navegador


Autores
Antonio Marques