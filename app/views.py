from datetime import datetime

from flask import Flask, render_template, request, jsonify
import random
import mysql.connector
import matplotlib.pyplot as plt
import pandas as pd
import io
import base64
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

# app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:@localhost/puzzle'
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://be8f3a65652976:0f351cfe@us-cdbr-east-06.cleardb.net/heroku_2f8f7a4ca871bb8'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
migrate = Migrate(app, db)

# Definição do modelo da tabela Estatistica
class Estatistica(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    ganhou = db.Column(db.Boolean)
    movimentos = db.Column(db.Integer)
    operadora = db.Column(db.String(50))
    valor = db.Column(db.Integer)
    tempo_jogo = db.Column(db.Integer)
    resultado = db.Column(db.String(50))
    data_ganho = db.Column(db.Date, default=datetime.utcnow().date())

class Recarga(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    operadora = db.Column(db.String(50))
    valor = db.Column(db.Integer)
    usada = db.Column(db.Boolean)
    codigo = db.Column(db.String(50))
    data_ganho = db.Column(db.Date)  # Novo atributo para a data de ganho


# Rota para exibir as estatísticas
@app.route('/estatisticas')
def estatisticas():
    # Consulta SQL para recuperar todos os dados da tabela Estatistica
    query = "SELECT * FROM estatistica"

    # Lendo dados da tabela e armazenando em um DataFrame do pandas
    df = pd.read_sql(query, con=db.engine)

    # Verificando se o DataFrame está vazio
    if df.empty:
        return render_template('estatisticas.html', error='Não há dados estatísticos.')

    # Agrupando os dados por operadora e contando o número de vitórias e derrotas
    grouped = df.groupby(['operadora', 'ganhou']).size().unstack()

    # Definindo as legendas de acordo com o valor da coluna "resultado"
    if "resultado" in df.columns:
        legend_labels = ['Perdeu', 'Ganhou'] if 'perdeu' in df['resultado'].values else ['Ganhou', 'Perdeu']
    else:
        legend_labels = ['Perdeu', 'Ganhou']

    # Gerando gráfico de barras
    ax = grouped.plot(kind='bar', stacked=True, figsize=(10, 12))

    # Adicionando legendas e título
    ax.set_title('Vitórias e derrotas por operadora')
    ax.set_xlabel('Operadora')
    ax.set_ylabel('Número de jogadores')
    ax.legend(legend_labels)

    # Convertendo o gráfico para imagem base64
    img = io.BytesIO()
    fig = ax.get_figure()
    fig.savefig(img, format='png')
    img.seek(0)
    img_base64 = base64.b64encode(img.getvalue()).decode()

    # Agrupando os dados por operadora, valor da recarga e tempo, e selecionando o menor tempo de conclusão para cada grupo (apenas para jogadores que ganharam)
    tempo_recorde = df[df['ganhou'] == 1].groupby(['operadora', 'valor'])['tempo_jogo'].min()

    # Gerando gráfico de barras para tempo recorde (apenas para jogadores que ganharam)
    ax_tempo_recorde = tempo_recorde.unstack().plot(kind='bar', figsize=(10, 12), stacked=True)
    ax_tempo_recorde.set_title('Tempo recorde por operadora e valor de recarga (vitórias)')
    ax_tempo_recorde.set_xlabel('Operadora e valor de recarga')
    ax_tempo_recorde.set_ylabel('Tempo (segundos)')

    # Convertendo o gráfico para imagem base64
    img_tempo_recorde = io.BytesIO()
    fig_tempo_recorde = ax_tempo_recorde.get_figure()
    fig_tempo_recorde.savefig(img_tempo_recorde, format='png')
    img_tempo_recorde.seek(0)
    img_tempo_recorde_base64 = base64.b64encode(img_tempo_recorde.getvalue()).decode()

    # Consulta SQL para recuperar os registros de tempo por operadora apenas para jogadores que ganharam
    query_tempo = "SELECT operadora, AVG(tempo_jogo) as tempo_medio FROM estatistica WHERE ganhou = 1 GROUP BY operadora"

    # Lendo dados da tabela e armazenando em um DataFrame do pandas
    df_tempo = pd.read_sql(query_tempo, con=db.engine)

    # Gerando gráfico de barras para registros de tempo (apenas para jogadores que ganharam)
    ax_tempo = df_tempo.plot(kind='bar', x='operadora', y='tempo_medio', figsize=(10, 12))
    ax_tempo.set_title('Tempo médio por operadora (vitórias)')
    ax_tempo.set_xlabel('Operadora')
    ax_tempo.set_ylabel('Tempo médio (segundos)')

    # Convertendo o gráfico para imagem base64
    img_tempo = io.BytesIO()
    fig_tempo = ax_tempo.get_figure()
    fig_tempo.savefig(img_tempo, format='png')
    img_tempo.seek(0)
    img_tempo_base64 = base64.b64encode(img_tempo.getvalue()).decode()

    # Renderizando a pagina com as imagens dos graficos
    return render_template('estatisticas.html', img_data=img_base64, img_data_tempo=img_tempo_base64, img_data_tempo_recorde=img_tempo_recorde_base64)

# Função para inserir uma nova entrada na tabela de estatísticas
def inserir_estatistica(ganhou, movimentos, operadora, valor, tempo_jogo, resultado):
    estatistica = Estatistica(ganhou=ganhou, movimentos=movimentos, operadora=operadora, valor=valor,
                             tempo_jogo=tempo_jogo, resultado=resultado)
    db.session.add(estatistica)
    db.session.commit()

# Rota para obter recargas disponiveis
@app.route('/recargas-disponiveis/<operadora>/<valor>')
def recargas_disponiveis(operadora, valor):
    # Consulta uma recarga disponível para a operadora e valor especificados
    recarga = Recarga.query.filter_by(usada=False, operadora=operadora, valor=valor).first()

    if recarga is None:
        # Se não houver recarga disponível, retorna uma mensagem de erro
        return "Infelizmente não há recargas disponíveis para essa operadora e valor."

    # Actualiza o registro da recarga para marca-la como usada
    recarga.usada = True
    db.session.commit()

    # Retorna o código da recarga
    codigo = recarga.codigo
    return codigo

# Rota para processar a jogada do usuário
@app.route('/jogada', methods=['POST'])
def jogada():
    # Obtém os dados da jogada do usuário
    dados = request.get_json()
    movimentos = dados['movimentos']
    ganhou = dados['ganhou']
    operadora = dados['operadora']
    valor = dados['valor']
    tempo_jogo = dados['tempo']
    resultado = 'ganhou' if ganhou else 'perdeu'

    # Insere uma nova entrada na tabela de estatísticas apenas se o jogador ganhou ou perdeu
    if ganhou:
        inserir_estatistica(ganhou, movimentos, operadora, valor, tempo_jogo, resultado)
        codigo = recargas_disponiveis(operadora, valor)
        return codigo

    if not ganhou:
        inserir_estatistica(ganhou, movimentos, operadora, valor, tempo_jogo, resultado)

def obter_operadoras():
    operadoras = ['Movitel', 'TMcel', 'Vodacom']
    vetor = []
    for operadora in operadoras:
        upper = operadora.upper()
        vetor.append(upper)
    return vetor


def obter_valores_recarga():
    valores = [50]
    return valores


@app.route('/tempo_movimentos', methods=['GET'])
def obter_tempo_e_movimentos():
    tempo = 250
    movimentos = 0
    return jsonify({'tempo': tempo, 'movimentos': movimentos})


def gerar_numeros(nivel):
    if nivel == "facil":
        numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0]
        random.shuffle(numeros)
        matriz = []
        for i in range(4):
            for j in range(4):
                index = i * 4 + j
                valor = numeros[index]
                botao = {
                    "valor": valor,
                    "linha": i,
                    "coluna": j,
                }
                matriz.append(botao)
        return matriz


@app.route('/')
def home():
    nivel = request.args.get('nivel', default='facil')  # Recebe o parametro de nivel selecionado, com valor padrão 'facil'
    numeros = gerar_numeros(nivel)
    operadoras = obter_operadoras()
    valores = obter_valores_recarga()
    return render_template('home.html', numeros=numeros, operadoras=operadoras, valores=valores)

if __name__ == '__main__':
    app.run(debug=True)
