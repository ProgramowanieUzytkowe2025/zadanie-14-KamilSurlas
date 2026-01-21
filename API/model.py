from sqlalchemy import Column, Integer, Unicode, Boolean
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class Miasto(Base):
    __tablename__ = 'miasta'

    id = Column(Integer, primary_key=True)
    nazwa = Column(Unicode(100), nullable=False)
    ludnosc = Column(Integer)
    czy_lotnisko = Column(Boolean, default=False) 

    def __repr__(self):
        return f"Miasto:\nnazwa: {self.nazwa}\nludnosc: {self.ludnosc}\nlotnisko: {self.czy_lotnisko}\n\n"