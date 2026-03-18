import os
from sqlalchemy import create_engine, MetaData
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user_hospede:pass_hospede@db:5433/hotel_db")

metadata = MetaData(schema="schema_hospede")

engine = create_engine(DATABASE_URL,connect_args={"options": "-csearch_path=schema_hospede"})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base(metadata=metadata)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()