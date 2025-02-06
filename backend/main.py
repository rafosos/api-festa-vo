import pandas as p
from fastapi import FastAPI, Response
from fastapi.responses import FileResponse
import json
import uvicorn
from enum import Enum
from pydantic import BaseModel

class Status_Presenca(Enum):
    NAO_RESPONDIDO = "NAO_RESPONDIDO"
    TALVEZ = "TALVEZ"
    NEGADO = "NEGADO"
    CONFIRMADO = "CONFIRMADO"

app = FastAPI()

filepath = './convidados.xlsx'
df = p.read_excel(filepath, index_col="nome")

class Convidado(BaseModel):
    nome: str
    convite: bool
    status: Status_Presenca

@app.get('/planilha')
def get_file():
    return FileResponse("./convidados.xlsx")

@app.post("/")
def novo_convidado(convidado: Convidado):
    global df 
    df_convidado_novo = p.DataFrame.from_dict({
        "nome": [convidado.nome],
        "convite": [convidado.convite],
        "status": [convidado.status.value]
        }, orient="columns").set_index('nome')
    df = p.concat([df, df_convidado_novo])
    try:
        df.to_excel(filepath)
    except Exception as err:
        print(err)
    return convidado

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/convidados")
def read_all():
    return Response(df.reset_index().to_json(orient="records"), media_type="application/json")

@app.get("/stats")
def stats():    
    return json.dumps({
        "status": df["status"].value_counts().to_dict(),
        "convites": df["convite"].value_counts().to_dict(),
        "total": len(df.index)
        })

@app.get("/convidado/{nome}")
def read_one(nome: str):
    try:
        convidado = df.loc[nome]
        convidado = convidado.to_dict()
        convidado["nome"] = nome
        return json.dumps(convidado)
    except Exception as err:
        print(err)
        return {"erro": f"Convidado {nome} não encontrado!" }

@app.patch("/convidado-presenca/{nome}/{status}")
def presenca_convidado(nome: str, status: Status_Presenca):
    df.loc[nome, 'confirmado'] = status.value
    try:
        df_write = df.reset_index()
        df_write.to_excel(filepath)
    except Exception as err:
        print(err)
        return {"erro": f"Não foi possivel realizar a alteração!"}
    return status

@app.put("/{nomeOriginal}")
def presenca_convidado(nomeOriginal: str, convidado: Convidado):
    df.loc[nomeOriginal, "status"] = convidado.status.value
    df.loc[nomeOriginal, "convite"] = convidado.convite
    df.rename(index={nomeOriginal: convidado.nome}, inplace=True)
    try:
        df.to_excel(filepath)
        return True 
    except Exception as err:
        print(err)
        return err

@app.delete("/{nome}")
def remover_convidado(nome: str):
    try:
        df.drop(index=nome, inplace=True)
        df.to_excel(filepath)
    except Exception as err:
        print(err)
        return {"erro": "Não foi possivel remover o convidado!"}
    return True

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)