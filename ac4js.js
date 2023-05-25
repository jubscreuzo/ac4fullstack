from flask import Flask, request, jsonify
import sqlite3

app = Flask(__name__)
DATABASE = 'database.db'


def criar_tabela():
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute("CREATE TABLE IF NOT EXISTS usuarios (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT, email TEXT)")
    conn.commit()
    conn.close()


@app.route('/usuarios', methods=['GET'])
def obter_usuarios():
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM usuarios")
    rows = cursor.fetchall()
    usuarios = [{'id': row[0], 'nome': row[1], 'email': row[2]} for row in rows]
    conn.close()
    return jsonify(usuarios)


@app.route('/usuarios', methods=['POST'])
def adicionar_usuario():
    nome = request.json.get('nome')
    email = request.json.get('email')

    if not nome or not email:
        return jsonify({'erro': 'Nome e email são campos obrigatórios.'}), 400

    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute("INSERT INTO usuarios (nome, email) VALUES (?, ?)", (nome, email))
    conn.commit()
    id_usuario = cursor.lastrowid
    conn.close()

    return jsonify({'id': id_usuario, 'nome': nome, 'email': email}), 201


if __name__ == '__main__':
    criar_tabela()
    app.run()
