
# 이 파일은 사용자 인증과 관련된 CRUD 작업을 수행하는 모듈입니다.
# 사용자 생성, 조회, 비밀번호 해시화 및 검증 기능을 포함합니다.
# 이 모듈은 FastAPI와 SQLAlchemy를 사용하여 데이터베이스와 상호작용합니다.


from sqlalchemy.orm import Session
from app.db.models import User,UserSettings
from passlib.context import CryptContext
from app.db import models
from app.db.models import User

#pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
pwd_context = CryptContext(
    schemes=["argon2"],  # bcrypt 대신 argon2
    deprecated="auto"
)


# 비밀번호 해시 함수
def get_password_hash(password: str):
    return pwd_context.hash(password)

# -----------------------------------------
# 사용자 생성하면서 유저 통계 정보도 함께 기본으로 세팅
# -----------------------------------------
def create_user(db: Session, email: str, password: str | None, name: str):
    hashed_pw = get_password_hash(password) if password else None

    # 1️⃣ 유저 생성
    db_user = User(email=email, hashed_password=hashed_pw, nickname=name)
    db.add(db_user)
    db.commit()       # user.id 확보
    db.refresh(db_user)

    # 2️⃣ 기본 UserSettings 생성 (여기서 user.id 사용 가능)
    settings = UserSettings(
        user_id=db_user.id,
        max_recommendations=5   # 기본값
    )
    db.add(settings)
    db.commit()        # settings 저장
    db.refresh(settings)

    # 3️⃣ 유저 반환
    return db_user



# -----------------------
# email 정보로 사용자 정보 조회
# -----------------------
def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


# -----------------------
# 비밀번호 검증 함수
# -----------------------
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)