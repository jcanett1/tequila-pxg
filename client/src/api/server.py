from flask import Flask, request, jsonify
from flask_cors import CORS  # Importa CORS
import pyodbc


app = Flask(__name__)

# Configuración de la base de datos
db_config = {
    'server': 'PXGWL8442',
    'database': 'INVENTARIOS',
    'username': 'sa',
    'password': 'Edel1ewy',
    'driver': '{ODBC Driver 17 for SQL Server}',
}

# Función para conectar a la base de datos
def connect_to_database():
    try:
        connection_str = (
            f"DRIVER={db_config['driver']};"
            f"SERVER={db_config['server']};"
            f"DATABASE={db_config['database']};"
            f"UID={db_config['Username']};"
            f"PWD={db_config['Password']};"
        )
        conn = pyodbc.connect(connection_str)
        return conn
    except Exception as e:
        print(f'Error de conexión a la base de datos: {e}')
        return None

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('Username')
    password = data.get('Password')

    conn = connect_to_database()
    cursor = conn.cursor()
    
    # Consulta para verificar usuario y contraseña
    cursor.execute("SELECT * FROM Users WHERE Username = ? AND Password = ?", (username, password))
    user = cursor.fetchone()

    if user:
        # Si se encuentra el usuario, puedes devolver un token o un mensaje de éxito
        return jsonify({"message": "Login successful", "user_id": user[0]}), 200
    else:
        return jsonify({"message": "Invalid credentials"}), 401

if __name__ == '__main__':
    app.run(debug=True)