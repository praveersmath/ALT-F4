"""Auth router: register, login, me endpoints."""
import datetime as dt
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.contracts.db_models import User
from app.contracts.schemas import (
    ApiResponse,
    LoginRequest,
    Meta,
    RegisterRequest,
    Token,
    UserPublic,
)
from app.core.db import get_db
from app.modules.auth.auth_service import (
    create_access_token,
    get_current_user,
    hash_password,
    user_to_public,
    verify_password,
)

router = APIRouter(prefix="/auth", tags=["auth"])


def make_meta(notes: list[str] | None = None) -> Meta:
    return Meta(
        data_source="live",
        generated_at=dt.datetime.now(dt.timezone.utc),
        notes=notes or ["Auth Module"],
    )


@router.post("/register", response_model=ApiResponse[UserPublic], status_code=status.HTTP_201_CREATED)
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == req.email.lower()).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email already exists",
        )

    user = User(
        name=req.name,
        email=req.email.lower(),
        password_hash=hash_password(req.password),
        role=req.role,
        district=req.district,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    return ApiResponse(
        data=user_to_public(user),
        meta=make_meta(["User registered successfully"]),
    )


@router.post("/login", response_model=ApiResponse[Token])
def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email.lower()).first()
    if not user or not verify_password(req.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    token = create_access_token(user.id, user.email, user.role)
    return ApiResponse(
        data=Token(access_token=token),
        meta=make_meta(["Login successful"]),
    )


@router.get("/me", response_model=ApiResponse[UserPublic])
def me(current_user: User = Depends(get_current_user)):
    return ApiResponse(
        data=user_to_public(current_user),
        meta=make_meta(["Current authenticated user"]),
    )
