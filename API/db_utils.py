from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from model import Miasto 

CONN_STRING = "mssql+pyodbc://@(localdb)\\MSSQLLocalDB/polska?driver=ODBC+Driver+17+for+SQL+Server&trusted_connection=yes"
ENGINE = create_engine(CONN_STRING)

def init_table():
    new_data = [
        Miasto(nazwa="Warszawa", ludnosc=1860281, czy_lotnisko=True),
        Miasto(nazwa="Kraków", ludnosc=800653, czy_lotnisko=True),
        Miasto(nazwa="Gdańsk", ludnosc=470907, czy_lotnisko=True),
        Miasto(nazwa="Wrocław", ludnosc=641928, czy_lotnisko=True),
        Miasto(nazwa="Zakopane", ludnosc=27000, czy_lotnisko=False),
        Miasto(nazwa="Sopot", ludnosc=36000, czy_lotnisko=False) 
    ]

    with Session(ENGINE) as session:
        try:
            session.add_all(new_data)
            session.commit()
            print("Data added successfully")
        except Exception as e:
            print(f"Error: {e}")
            session.rollback()

def print_records():
    with Session(ENGINE) as session:
        miasta = session.query(Miasto).all()
        for m in miasta:
            print(m)

if __name__ == "__main__":
    init_table()
    print_records()