import mysql.connector

def obter_conexao():
    # Configurar as credenciais de acesso ao banco de dados
    config = {
        'user': 'root',
        'password': '',
        'host': 'localhost',
        'database': 'puzzle'
    }

    # Conectar ao banco de dados
    try:
        conexao = mysql.connector.connect(**config)
        return conexao
    except mysql.connector.Error as erro:
        print(f'Erro ao conectar ao banco de dados: {erro}')
        return None
