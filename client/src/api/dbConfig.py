import pyodbc

# Configuración de conexión
config = {
    'user': 'sa',  # Cambia esto por tu usuario de SQL Server
    'password': 'Edel1ewy',  # Cambia esto por tu contraseña
    'server': 'PXGWL8442',  # Cambia esto por tu servidor (o '127.0.0.1' para local)
    'port': 1433,  # Puerto por defecto
    'database': 'INVENTARIOS',  # Cambia esto por tu base de datos
    'instance': 'VERITRAX',  # Cambia esto si es necesario
    'trusted_connection': 'yes',  # Usar autenticación de Windows
    'encrypt': 'no',  # Usar encriptación
    'trust_server_certificate': 'yes'  # Permitir certificados no verificados
    
}

# Función para establecer la conexión a la base de datos
def connect_to_database():
    try:
        connection_string = (
            f"DRIVER={{SQL Server}};"
            f"SERVER={config['server']}\\{config['instance']},{config['port']};"
            f"DATABASE={config['database']};"
            f"UID={config['user']};"
            f"PWD={config['password']};"
            f"Encrypt={config['encrypt']};"
            f"TrustServerCertificate={config['trust_server_certificate']};"
            f"Trusted_Connection={config['trusted_connection']};"
        )
        
        # Conectar a la base de datos
        conn = pyodbc.connect(connection_string)
        print("Conexión exitosa a la base de datos")
        return conn
    
    except pyodbc.Error as err:
        print("Error de conexión a la base de datos", err)
        exit(1)  # Termina el proceso si no se puede conectar

# Uso de la conexión
if __name__ == '__main__':
    conn = connect_to_database()
    # Aquí puedes ejecutar tus consultas usando `conn`

