import smtplib
import random
import os
import mysql.connector
from email.message import EmailMessage
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# --- MODELOS DE DADOS ---
class CadastroRequest(BaseModel):
    nome: str
    email: str
    cpf: str
    avatar_index: int

class LoginRequest(BaseModel):
    email: str

class VerificarRequest(BaseModel):
    email: str
    codigo: str

load_dotenv()
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dicionário temporário para guardar os códigos (chave: email, valor: código)
armazenamento_codigos = {}

def get_db_connection():
    return mysql.connector.connect(
        host="localhost", 
        user="root",
        password="",
        database="SENTRY"
    )

def verificar_usuario_existe(email: str):
    db = get_db_connection()
    cursor = db.cursor()
    cursor.execute("SELECT EMAIL FROM USUARIO WHERE EMAIL = %s", (email,))
    usuario = cursor.fetchone()
    cursor.close()
    db.close()
    return usuario is not None

def cadastrar_novo_usuario(dados: CadastroRequest):
    db = get_db_connection()
    cursor = db.cursor()
    try:
        cursor.execute("SELECT CPF FROM USUARIO WHERE EMAIL = %s OR CPF = %s", (dados.email, dados.cpf))
        if cursor.fetchone():
            return False, "E-mail ou CPF já cadastrados."

        sql = "INSERT INTO USUARIO (CPF, EMAIL, NOME, AVATAR) VALUES (%s, %s, %s, %s)"
        valores = (dados.cpf, dados.email, dados.nome, dados.avatar_index)
        
        cursor.execute(sql, valores)
        db.commit()
        return True, "Usuário cadastrado com sucesso!"
    except Exception as e:
        print(f"Erro ao inserir no banco: {e}")
        return False, f"Erro no banco: {str(e)}"
    finally:
        cursor.close()
        db.close()

def enviar_email_servidor(email_destino, codigo):
    seu_email = "sentryequipesuporte@gmail.com"
    sua_senha_de_app = "kzpqgxlsfledjbmu"

    msg = EmailMessage()
    msg.set_content(f"Seu código de verificação é: {codigo}")
    msg['Subject'] = 'Código de Acesso - Sistema Sentry'
    msg['From'] = seu_email
    msg['To'] = email_destino

    try:
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
            smtp.login(seu_email, sua_senha_de_app)
            smtp.send_message(msg)
        return True
    except Exception as e:
        print(f"Erro técnico no envio: {e}")
        return False

@app.post("/api/enviar-codigo")
async def api_enviar(request: LoginRequest):
    if not verificar_usuario_existe(request.email):
        return {"status": "redirecionar", "url": "/cadastro", "mensagem": "Usuário não encontrado."}

    codigo = str(random.randint(1000, 9999)) 
    envio_sucesso = enviar_email_servidor(request.email, codigo)
    
    if envio_sucesso:
        armazenamento_codigos[request.email] = codigo
        return {"status": "sucesso", "mensagem": "Código enviado com sucesso!"}
    
    raise HTTPException(status_code=500, detail="Falha ao enviar e-mail.")

@app.post("/api/usuarios")
async def api_cadastrar(request: CadastroRequest):
    sucesso, mensagem = cadastrar_novo_usuario(request)
    if sucesso:
        return {"status": "sucesso", "mensagem": mensagem}
    raise HTTPException(status_code=400, detail=mensagem)

@app.post("/api/verificar-codigo")
async def api_verificar(request: VerificarRequest):
    codigo_guardado = armazenamento_codigos.get(request.email)
    if codigo_guardado and request.codigo == codigo_guardado:
        del armazenamento_codigos[request.email]
        return {"status": "sucesso", "mensagem": "Login realizado com sucesso!"}
    raise HTTPException(status_code=400, detail="Código incorreto ou expirado.")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
