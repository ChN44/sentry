from pydantic import BaseModel

class LoginRequest(BaseModel):
    email: str

class VerificarRequest(BaseModel):
    email: str
    codigo: str