import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("❌ DATABASE_URL is missing in .env file")

# Create Database Engine
# pool_size and max_overflow help handle multiple connections during simulation
engine = create_engine(DATABASE_URL, pool_size=10, max_overflow=20)

# Create SessionLocal class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()

def get_db():
    """Dependency function to get a DB session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()