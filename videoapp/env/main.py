import logging
from fastapi import FastAPI, HTTPException, Depends, status, UploadFile, File, Form
from fastapi.security import OAuth2PasswordBearer,OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from pydantic import BaseModel,validator
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base, SessionLocal, init_db
from models import User, Video  # models.py'den import ediyoruz
from typing import List,Optional
from starlette.middleware.base import BaseHTTPMiddleware

import os
import uvicorn





# Configure logging
logging.basicConfig(level=logging.DEBUG)

# Uygulama başlatılırken veritabanını yeniden oluştur
try:
    # False yaparak tabloların silinmesini engelliyoruz
    init_db(force_drop_create=False)  # Sadece tablolar yoksa oluşturur
except Exception as e:
    logging.error(f"Veritabanı başlatma hatası: {str(e)}")
    raise

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)


# Logging middleware
class LoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        logging.info(f"Request path: {request.url.path} Method: {request.method}")
        response = await call_next(request)
        logging.info(f"Response status: {response.status_code}")
        return response

app.add_middleware(LoggingMiddleware)




# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# User models
class UserCreate(BaseModel):
    username: str
    userEmail: str  # Bu isim frontend'den gelen veri ile eşleşmeli
    userpassword: str

    @validator('username')
    def username_validator(cls, v):
        if len(v) < 3:
            raise ValueError("Kullanıcı adı en az 3 karakter olmalıdır")
        return v

    @validator('userEmail')
    def email_validator(cls, v):
        if '@' not in v:
            raise ValueError("Geçerli bir email adresi giriniz")
        return v

    @validator('userpassword')
    def password_validator(cls, v):
        if len(v) < 6:
            raise ValueError("Şifre en az 6 karakter olmalıdır")
        return v

class UserLogin(BaseModel):
    username: str
    userpassword: str

    @validator('userpassword')
    def password_validator(cls, v):
        if len(v) < 6:
            raise ValueError("Şifre en az 6 karakter olmalıdır")
        return v

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()



   



# Register User Endpoint

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Geçersiz kimlik bilgileri",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    
    user = db.query(User).filter(User.username == token_data.username).first()
    if user is None:
        raise credentials_exception
    return user

@app.get("/")
def read_root():
    return {"message": "Welcome to the VideoApp API!"}

@app.post("/users/register", status_code=status.HTTP_201_CREATED)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    try:
        logging.info(f"Yeni kullanıcı kaydı deneniyor: {user.username}")
        
        # E-posta kontrolü
        existing_email = db.query(User).filter(User.user_email == user.userEmail).first()
        if existing_email:
            logging.warning(f"E-posta adresi zaten mevcut: {user.userEmail}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Bu e-posta adresi zaten kullanılıyor"
            )
        
        # Kullanıcı adı kontrolü
        existing_user = db.query(User).filter(User.username == user.username).first()
        if existing_user:
            logging.warning(f"Kullanıcı adı zaten mevcut: {user.username}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Bu kullanıcı adı zaten kullanılıyor"
            )
        
        # Şifreyi hashle
        hashed_password = pwd_context.hash(user.userpassword)
        
        # Yeni kullanıcı oluştur
        new_user = User(
            username=user.username,
            user_email=user.userEmail,  # userEmail -> user_email eşleştirmesi
            userpassword=hashed_password
        )
        
        # Debug log ekleyelim
        logging.debug(f"Oluşturulan kullanıcı: {new_user.__dict__}")
        
        # Veritabanına kaydet
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        logging.info(f"Yeni kullanıcı başarıyla oluşturuldu: {user.username}")
        
        return {
            "message": "Kullanıcı başarıyla oluşturuldu",
            "user": {
                "user_id": new_user.user_id,
                "username": new_user.username,
                "user_email": new_user.user_email
            }
        }
        
    except Exception as e:
        db.rollback()
        logging.error(f"Hata: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Beklenmeyen bir hata oluştu: {str(e)}"
        )
    

    
# JWT ayarları
SECRET_KEY = "your-secret-key-here"  # Güvenli bir secret key kullanın
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Token modeli
class Token(BaseModel):
    access_token: str
    token_type: str

# Token veri modeli
class TokenData(BaseModel):
    username: str | None = None

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def authenticate_user(db: Session, username: str, password: str):
    user = db.query(User).filter(User.username == username).first()
    if not user:
        return False
    if not verify_password(password, user.userpassword):
        return False
    return user


    

@app.post("/users/login", response_model=Token)
async def login_for_access_token(
    user_data: UserLogin,
    db: Session = Depends(get_db)
):
    # Kullanıcıyı username ve password ile kontrol et
    user = db.query(User).filter(User.username == user_data.username).first()
    
    if not user or not verify_password(user_data.userpassword, user.userpassword):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Kullanıcı adı veya şifre hatalı",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

# Sağlık kontrolü endpoint'i ekleyelim
@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Video şeması için Pydantic modeller
class VideoBase(BaseModel):
    video_title: str
    video_prompt: str

class VideoCreate(VideoBase):
    pass

class VideoResponse(VideoBase):
    video_id: int
    video_thumbnail: str
    video_video: str
    user_id: int

    class Config:
        from_attributes = True

# Tüm videoları getir
@app.get("/videos/", response_model=List[VideoResponse])
async def get_videos(
    skip: int = 0, 
    limit: int = 10,
    db: Session = Depends(get_db)
):
    try:
        videos = db.query(Video).offset(skip).limit(limit).all()
        return videos
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Videolar getirilirken hata oluştu: {str(e)}"
        )

# Belirli bir videoyu getir
@app.get("/videos/{video_id}", response_model=VideoResponse)
async def get_video(video_id: int, db: Session = Depends(get_db)):
    try:
        video = db.query(Video).filter(Video.video_id == video_id).first()
        if not video:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Video bulunamadı"
            )
        return video
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Video getirilirken hata oluştu: {str(e)}"
        )

# Yeni video yükle
@app.post("/videos/", response_model=VideoResponse)
async def create_video(
    video_title: str = Form(...),
    video_prompt: str = Form(...),
    video_file: UploadFile = File(...),
    thumbnail_file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        # Dosya yolları oluştur
        video_path = f"uploads/videos/{video_file.filename}"
        thumbnail_path = f"uploads/thumbnails/{thumbnail_file.filename}"

        # Uploads klasörünü oluştur
        os.makedirs("uploads/videos", exist_ok=True)
        os.makedirs("uploads/thumbnails", exist_ok=True)

        # Dosyaları kaydet
        with open(video_path, "wb") as buffer:
            content = await video_file.read()
            buffer.write(content)

        with open(thumbnail_path, "wb") as buffer:
            content = await thumbnail_file.read()
            buffer.write(content)

        # Video nesnesini oluştur
        db_video = Video(
            video_title=video_title,
            video_prompt=video_prompt,
            video_video=video_path,
            video_thumbnail=thumbnail_path,
            user_id=current_user.user_id
        )

        # Veritabanına kaydet
        db.add(db_video)
        db.commit()
        db.refresh(db_video)

        return db_video

    except Exception as e:
        # Hata durumunda yüklenen dosyaları temizle
        if 'video_path' in locals():
            os.remove(video_path)
        if 'thumbnail_path' in locals():
            os.remove(thumbnail_path)
        
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Video yüklenirken hata oluştu: {str(e)}"
        )

# Video sil
@app.delete("/videos/{video_id}")
async def delete_video(
    video_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        # Videoyu bul
        video = db.query(Video).filter(Video.video_id == video_id).first()
        
        if not video:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Video bulunamadı"
            )

        # Kullanıcının video sahibi olduğunu kontrol et
        if video.user_id != current_user.user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Bu videoyu silme yetkiniz yok"
            )

        # Dosyaları sil
        try:
            if os.path.exists(video.video_video):
                os.remove(video.video_video)
            if os.path.exists(video.video_thumbnail):
                os.remove(video.video_thumbnail)
        except Exception as e:
            print(f"Dosya silme hatası: {str(e)}")

        # Veritabanından sil
        db.delete(video)
        db.commit()

        return {"message": "Video başarıyla silindi"}

    except HTTPException as he:
        raise he
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Video silinirken hata oluştu: {str(e)}"
        )

# Kullanıcının videolarını getir

    

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",  # Tüm IP'lerden erişime izin ver
        port=8000,
        reload=True
    )











 