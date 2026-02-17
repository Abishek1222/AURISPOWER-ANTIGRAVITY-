from pydantic import BaseModel
from typing import Optional
from enum import Enum

class UserRole(str, Enum):
    OWNER = "owner"
    MANAGER = "manager"
    ELECTRICIAN = "electrician"
    FLOOR_ENGINEER = "floor_engineer"
    SITE_ENGINEER = "site_engineer"

class UserBase(BaseModel):
    username: str
    email: Optional[str] = None
    role: UserRole

class UserCreate(UserBase):
    password: str

class UserInDB(UserBase):
    hashed_password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
    role: Optional[str] = None
