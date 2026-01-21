import time
from fastapi import FastAPI, HTTPException, status, Body
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from model import Miasto

CONN_STRING = "mssql+pyodbc://@(localdb)\\MSSQLLocalDB/polska?driver=ODBC+Driver+17+for+SQL+Server&trusted_connection=yes"
ENGINE = create_engine(CONN_STRING)
SESSION = sessionmaker(bind=ENGINE, autocommit=False, autoflush=False, expire_on_commit=False)

app = FastAPI(title="API Bez DTO")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/miasta/", status_code=status.HTTP_201_CREATED)
def create_city(miasto: dict = Body(...)):
    with SESSION() as session:
        nowe_miasto = Miasto(
            nazwa=miasto["nazwa"],
            ludnosc=miasto["ludnosc"],
            czy_lotnisko=miasto["czy_lotnisko"]
        )

        time.sleep(3)  # Symulacja długotrwałej operacji (Zadanie 9)

        if (nowe_miasto.ludnosc < 0):
            raise HTTPException(status_code=400, detail="Ludność nie może być ujemna!")

        session.add(nowe_miasto)
        session.commit()
        session.refresh(nowe_miasto)
        return nowe_miasto.id

@app.get("/miasta/")
def get_all_cities(czy_lotnisko: str = "all"):
    with SESSION() as session:
        query = session.query(Miasto)
        
        if czy_lotnisko == "true":
            query = query.filter(Miasto.czy_lotnisko == True)
        elif czy_lotnisko == "false":
            query = query.filter(Miasto.czy_lotnisko == False)
            
        return query.all()

@app.get("/miasta/{miasto_id}")
def get_city(miasto_id):
    with SESSION() as session:
        miasto = session.query(Miasto).filter(Miasto.id == miasto_id).first()
        if not miasto:
            raise HTTPException(status_code=404, detail="City was not found")
        return miasto

@app.put("/miasta/{miasto_id}")
def zaktualizuj_miasto(miasto_id, miasto: dict = Body(...)):
    with SESSION() as session:
        to_update = session.query(Miasto).filter(Miasto.id == miasto_id).first()
        
        if not to_update:
            raise HTTPException(status_code=404, detail="City was not found")
        
        if miasto["ludnosc"] < 0:
            raise HTTPException(status_code=400, detail="Ludność nie może być ujemna!")

        to_update.nazwa = miasto["nazwa"]
        to_update.ludnosc = miasto["ludnosc"]
        to_update.czy_lotnisko = miasto["czy_lotnisko"]
        
        session.commit()
        session.refresh(to_update)
        return to_update

@app.delete("/miasta/{miasto_id}", status_code=status.HTTP_204_NO_CONTENT)
def usun_miasto(miasto_id):
    with SESSION() as session:
        miasto = session.query(Miasto).filter(Miasto.id == miasto_id).first()
        
        if not miasto:
            raise HTTPException(status_code=404, detail="City was not found")

        # Walidacja tylko dla celów testowych (zadanie 8)
        if not miasto.czy_lotnisko:
            raise HTTPException(status_code=400, detail="Nie można usunąć miasta bez lotniska!")
        
        session.delete(miasto)
        session.commit()
        return None