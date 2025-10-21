from pydantic import BaseModel, EmailStr, constr # Import constr
from enum import Enum
from typing import Optional, List  
from datetime import datetime      

# Enum for roles
class UserRole(str, Enum):
    user = "user"
    guardian = "guardian"
    doctor = "doctor"

# Base user (common fields)
class UserBase(BaseModel):
    name: str
    email: EmailStr

# Schema for registration
class UserCreate(UserBase):
    # The fix is here: validating the password length
    password: constr(max_length=72)
    role: UserRole = UserRole.user

# Schema for login
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# Response schema
class UserResponse(UserBase):
    id: int
    role: UserRole

    class Config:
        # Using the correct attribute for Pydantic v2
        from_attributes = True

# Schema for submitting a survey
class PHQ9Submit(BaseModel):
    answers: List[int]
    score: int
    interpretation: str

# Schema for returning a survey result from the API
class SurveyResultResponse(PHQ9Submit):
    id: int
    created_at: datetime
    owner_id: int

    class Config:
        from_attributes = True # for orm_mode