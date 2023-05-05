from flask import Flask, render_template, request, jsonify
import random
from db.conexao import obter_conexao
import matplotlib.pyplot as plt
import pandas as pd
import io
import base64

app = Flask(__name__)
# Obtem uma conexao com o banco de dados
db = obter_conexao()

@app.route('/estatisticas')
def estatisticas():
    # Query SQL para recuperar todos os dados da tabela estatistica
    query = "SELECT * FROM estatistica"

    # Lendo dados da tabela e armazenando em um DataFrame do pandas
    df = pd.read_sql(query, con=db)

    # Verificando se o DataFrame está vazio
    if df.empty:
        return render_template('estatisticas.html', error='Não há dados estatísticos.')

    # Agrupando os dados por operadora e contando o número de vitórias e derrotas
    grouped = df.groupby(['operadora', 'ganhou']).size().unstack()

    if "resultado" in df.columns:
        # Definindo as legendas de acordo com o valor da coluna "resultado"
        legend_labels = ['Perdeu', 'Ganhou'] if 'perdeu' in df['resultado'].values else ['Ganhou', 'Perdeu']
    else:
        # Caso a coluna "resultado" não exista, definindo as legendas padrão
        legend_labels = ['Perdeu', 'Ganhou']
    # legend_labels = ['Perdeu', 'Ganhou'] if all(df['ganhou'] == False) else ['Ganhou', 'Perdeu']

    # Gerando gráfico de barras
    ax = grouped.plot(kind='bar', stacked=True, figsize=(10,12))

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

    # Agrupando os dados por operadora, valor da recarga e tempo, e selecionando o menor tempo de conclusão para cada grupo
    tempo_recorde = df.groupby(['operadora', 'valor'])['tempo_jogo'].min()

    # Gerando gráfico de barras para tempo recorde
    ax_tempo_recorde = tempo_recorde.plot(kind='bar', figsize=(10,12))
    ax_tempo_recorde.set_title('Tempo recorde por operadora e valor de recarga')
    ax_tempo_recorde.set_xlabel('Operadora e valor de recarga')
    ax_tempo_recorde.set_ylabel('Tempo (segundos)')

    # Convertendo o gráfico para imagem base64
    img_tempo_recorde = io.BytesIO()
    fig_tempo_recorde = ax_tempo_recorde.get_figure()
    fig_tempo_recorde.savefig(img_tempo_recorde, format='png')
    img_tempo_recorde.seek(0)
    img_tempo_recorde_base64 = base64.b64encode(img_tempo_recorde.getvalue()).decode()

    # Query SQL para recuperar os registros de tempo por operadora
    query_tempo = "SELECT operadora, AVG(tempo_jogo) as tempo_medio FROM estatistica GROUP BY operadora"

    # Lendo dados da tabela e armazenando em um DataFrame do pandas
    df_tempo = pd.read_sql(query_tempo, con=db)

    # Gerando gráfico de barras para registros de tempo
    ax_tempo = df_tempo.plot(kind='bar', x='operadora', y='tempo_medio', figsize=(10,12))
    ax_tempo.set_title('Tempo médio por operadora')
    ax_tempo.set_xlabel('Operadora')
    ax_tempo.set_ylabel('Tempo médio (segundos)')

    # Convertendo o gráfico para imagem base64
    img_tempo = io.BytesIO()
    fig_tempo = ax_tempo.get_figure()
    fig_tempo.savefig(img_tempo, format='png')
    img_tempo.seek(0)
    img_tempo_base64 = base64.b64encode(img_tempo.getvalue()).decode()

    # Renderizando a página com a imagem do gráfico
    return render_template('estatisticas.html', img_data=img_base64, img_data_tempo=img_tempo_base64, img_data_tempo_recorde=img_tempo_recorde_base64)


# Função para inserir uma nova entrada na tabela de estatísticas
def inserir_estatistica(ganhou, movimentos, operadora, valor, tempo_jogo, resultado):
    cursor = db.cursor()
    cursor.execute("INSERT INTO estatistica (ganhou, movimentos, operadora, valor, tempo_jogo, resultado) VALUES (%s, %s, %s, %s, %s, %s)", (ganhou, int(movimentos), operadora, int(valor), int(tempo_jogo), resultado))
    db.commit()

# @app.route('/recargas-disponiveis/<operadora>/<valor>')
def recargas_disponiveis(operadora, valor):
    # Busca uma recarga disponível para a operadora e valor especificados
    cursor = db.cursor()
    cursor.execute("SELECT * FROM recargas WHERE usada = FALSE AND operadora = %s AND valor = %s LIMIT 1", (operadora, valor))
    recarga = cursor.fetchone()

    if recarga is None:
        # Se não houver recarga disponível, retorne uma mensagem de erro
        return "Infelizmente Não há recargas disponíveis para essa operadora e valor."

    # Atualiza o registro da recarga para marcar como usada
    cursor.execute("UPDATE recargas SET usada = TRUE WHERE id = %s", (recarga['id'],))
    db.commit()

    # Renderiza o código da recarga
    codigo = recarga['codigo']
    return  codigo


# Rota para processar a jogada do usuário
@app.route('/jogada', methods=['POST'])
def jogada():
    # Obter os dados da jogada do usuário
    dados = request.get_json()
    movimentos = dados['movimentos']
    ganhou = dados['ganhou']
    operadora = dados['operadora']
    valor = dados['valor']
    tempo_jogo = dados['tempo']
    resultado = 'ganhou' if ganhou else 'perdeu'

    # Inserir uma nova entrada na tabela de estatísticas apenas se o jogador ganhou ou perdeu
    if ganhou:
        inserir_estatistica(ganhou, movimentos, operadora, valor, tempo_jogo, resultado)
        codigo = recargas_disponiveis(operadora, valor)
        return codigo

    if not ganhou:
        inserir_estatistica(ganhou, movimentos, operadora, valor, tempo_jogo, resultado)

def operadora():
    operadora = ['Movitel','TMcel','Vodacom']
    vetor = []
    for i in operadora:
        upper = i.upper()
        vetor.append(upper)
    return vetor
def valor_recarga():
    valor = [50]
    return valor

@app.route('/tempo_movimentos', methods=['GET'])
def obter_tempo_e_movimentos():
    tempo = 150
    movimentos = 0
    return jsonify({'tempo': tempo, 'movimentos': movimentos})

# def obter_tempo_e_movimentos():
#     tempo = 150
#     movimentos = 0
#     return {'tempo': tempo, 'movimentos': movimentos}

def gerar_numeros(nivel):
    if nivel == "facil":
        numeros = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,0]
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
    nivel = request.args.get('nivel', default='facil')  # Recebe o parâmetro de nível selecionado, com valor padrão 'facil'
    numeros = gerar_numeros(nivel)
    operadoras = operadora()
    valor = valor_recarga()
    return render_template('home.html', numeros=numeros, operadoras=operadoras, valor=valor)
if __name__ == '__main__':
    app.run(debug=True)