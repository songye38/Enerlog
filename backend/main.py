from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.database import engine
from app.db.models import Base
#from app.db.seed_preset_tags import seed_preset_tags
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers.users import router as users_router
from app.routers.activity import router as activity_router
#from app.routers.energy import router as energy_router



app = FastAPI()
Base.metadata.create_all(bind=engine)
#seed_preset_tags()

app = FastAPI(root_path="", title="My API")

# 허용할 origin 목록
origins = [
    "https://localhost:5173",  # 개발용
     "https://www.enerlog.kr",  # 배포용 메인 도메인
    # "https://pomopopo.com",      # 배포용 www 없는 도메인
    # "https://pomopopo-git-feature-auth-songyes-projects-cb766be0.vercel.app",  # Vercel 테스트용
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,          # 정확히 허용할 도메인만 넣음
    allow_credentials=True,         # 쿠키/토큰 인증용
    allow_methods=["*"],            # 모든 메서드 허용
    allow_headers=["*"],            # 모든 헤더 허용
)


app.include_router(users_router)
app.include_router(activity_router)
#app.include_router(energy_router)