from fastapi import APIRouter, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi import Depends
from pydantic import BaseModel, EmailStr
from app.models.user import User
from app.core.security import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/api/auth", tags=["auth"])

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: str  # "seeker" | "recruiter"

@router.post("/register", status_code=201)
async def register(body: RegisterRequest):
    if await User.find_one(User.email == body.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    if body.role not in ("seeker", "recruiter"):
        raise HTTPException(status_code=400, detail="Role must be 'seeker' or 'recruiter'")
    user = User(
        email=body.email,
        hashed_password=hash_password(body.password),
        full_name=body.full_name,
        role=body.role,
    )
    await user.insert()
    return {"id": str(user.id), "email": user.email, "role": user.role}

@router.post("/login")
async def login(form: OAuth2PasswordRequestForm = Depends()):
    user = await User.find_one(User.email == form.username)
    if not user or not verify_password(form.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    token = create_access_token({"sub": str(user.id), "role": user.role})
    return {"access_token": token, "token_type": "bearer", "role": user.role, "full_name": user.full_name}
