#models.py
from sqlalchemy import Column, Integer, String, Enum, DateTime, func, ForeignKey, JSON
from sqlalchemy.orm import relationship
from db import Base 
import enum

class UserRole(str, enum.Enum):
    user = "user"
    guardian = "guardian"
    doctor = "doctor"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    password_hash = Column(String, nullable=False)
    role = Column(Enum(UserRole), nullable=False, default=UserRole.user)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # relationship to link users to their surveys
    surveys = relationship("SurveyResult", back_populates="owner")

class SurveyResult(Base):
    __tablename__ = "surveys_results" 

    id = Column(Integer, primary_key=True, index=True)
    score = Column(Integer, nullable=False)
    interpretation = Column(String, nullable=True)
    
    # Use JSON to store the list of answers
    answers = Column(JSON, nullable=True) 
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Foreign Key to link to the users table
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Add this relationship back to the User
    owner = relationship("User", back_populates="surveys")