import os
import shutil
import uuid
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt

from core.database import get_db
from core.config import settings
from core.security import get_password_hash, verify_password, create_access_token
from auth.models import User
from auth.schemas import UserCreate, UserLogin, Token, UserResponse, TokenData

router = APIRouter(prefix="/auth", tags=["auth"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except JWTError:
        raise credentials_exception
    
    result = await db.execute(select(User).filter(User.email == token_data.email))
    user = result.scalars().first()
    if user is None:
        raise credentials_exception
    return user

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user: UserCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).filter(User.email == user.email))
    existing_user = result.scalars().first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Check username if provided
    if user.username:
        result = await db.execute(select(User).filter(User.username == user.username))
        if result.scalars().first():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already taken"
            )

    hashed_password = get_password_hash(user.password)
    new_user = User(
        email=user.email, 
        password_hash=hashed_password,
        username=user.username
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return new_user

@router.put("/me", response_model=UserResponse)
async def update_profile(
    username: Optional[str] = Form(None),
    profile_picture: UploadFile = File(None),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if username:
        # Check uniqueness if changing
        if username != current_user.username:
            result = await db.execute(select(User).filter(User.username == username))
            if result.scalars().first():
                 raise HTTPException(status_code=400, detail="Username already taken")
            current_user.username = username
            
    if profile_picture:
        UPLOAD_DIR = "uploads"
        if not os.path.exists(UPLOAD_DIR):
            os.makedirs(UPLOAD_DIR)
            
        file_extension = profile_picture.filename.split(".")[-1]
        filename = f"pfp_{uuid.uuid4()}.{file_extension}"
        file_path = os.path.join(UPLOAD_DIR, filename)
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(profile_picture.file, buffer)
            
        current_user.profile_picture_url = f"/uploads/{filename}"
        
    db.add(current_user)
    await db.commit()
    await db.refresh(current_user)
    return current_user

@router.post("/login", response_model=Token)
async def login(user_credentials: UserLogin, db: AsyncSession = Depends(get_db)):
    # Note: Traditionally OAuth2 uses form-data, but here we use JSON body as per requirement specific descriptions (Login using email+password)
    # If standard OAuth2 form desired, we'd use OAuth2PasswordRequestForm. Sticking to JSON body for simplicity with frontend as requested.
    result = await db.execute(select(User).filter(User.email == user_credentials.email))
    user = result.scalars().first()
    
    if not user or not verify_password(user_credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}
