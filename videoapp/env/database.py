import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from typing import Generator

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

DATABASE_URL = "postgresql://postgres:yyk15793@localhost:5432/VideoApp"

# Veritabanını yeniden oluşturmak için force_drop_create parametresi ekliyoruz
def init_db(force_drop_create: bool = False):
    try:
        engine = create_engine(DATABASE_URL, echo=True)
        if force_drop_create:
            Base.metadata.drop_all(bind=engine)
        Base.metadata.create_all(bind=engine)
        logger.info("Veritabanı tabloları başarıyla oluşturuldu")
    except Exception as e:
        logger.error(f"Veritabanı oluşturma hatası: {str(e)}")
        raise

engine = create_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db() -> Generator:
    db = SessionLocal()
    try:
        logger.info("Veritabanı oturumu başlatıldı")
        yield db
    finally:
        logger.info("Veritabanı oturumu kapatıldı")
        db.close()