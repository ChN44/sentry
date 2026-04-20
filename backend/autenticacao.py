import smtplib
import random
import os
from email.message import EmailMessage
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

# Importação dos schemas que criaste na pasta 'schemas'
from schemas.auth import LoginRequest, VerificarRequest

# 1. Configuração de Ambiente
load_dotenv() # Carrega as variáveis do .env

app = FastAPI()

# 2. Configuração do CORS (Permite a comunicação com o React)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Armazenamento Temporário (Dicionário em memória)
# Formato esperado: {"email@teste.com": "1234"}
armazenamento_codigos = {}

def enviar_email_servidor(email_destino, codigo):
    
    # Colocando as credenciais diretamente (Apenas para teste!)
    seu_email = "sentryequipesuporte@gmail.com"
    sua_senha_de_app = "kzpqgxlsfledjbmu"

    msg = EmailMessage()
    msg.set_content(f"Seu codigo de verificacao é : {codigo}")
    msg['Subject'] = 'Codigo de Acesso - Sistema Sentry'
    msg['From'] = seu_email
    msg['To'] = email_destino

    try:
        # Tenta conectar ao Gmail e enviar a mensagem
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
            smtp.login(seu_email, sua_senha_de_app)
            smtp.send_message(msg)
        return True
    except Exception as e:
        print(f"Erro técnico no envio: {e}")
        return False

# --- ROTAS DA API ---

@app.post("/api/enviar-codigo")
async def api_enviar(request: LoginRequest):
    
    codigo = str(random.randint(1000, 9999)) 
    
    envio_sucesso = enviar_email_servidor(request.email, codigo)
    
    if envio_sucesso:
    
        armazenamento_codigos[request.email] = codigo
        print(f"Código {codigo} guardado para {request.email}")
        return {"status": "sucesso", "mensagem": "Código enviado com sucesso!"}
    
    raise HTTPException(status_code=500, detail="Falha ao enviar e-mail. Verifique o servidor.")
#verificar o código
@app.post("/api/verificar-codigo")
async def api_verificar(request: VerificarRequest):
    
    codigo_guardado = armazenamento_codigos.get(request.email)
    if codigo_guardado and request.codigo == codigo_guardado:
        del armazenamento_codigos[request.email]
        return {"status": "sucesso", "mensagem": "Login realizado com sucesso!"}
    
    # Se o código estiver errado ou não existir
    raise HTTPException(status_code=400, detail="Código incorreto ou expirado.")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)