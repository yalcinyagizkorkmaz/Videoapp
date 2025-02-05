import logging
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer,OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from pydantic import BaseModel,validator
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base, SessionLocal, init_db
from models import User  # models.py'den import ediyoruz
from typing import List,Optional
from starlette.middleware.base import BaseHTTPMiddleware

import os





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
    userEmail: str

    @validator('userEmail')
    def email_validator(cls, v):
        if '@' not in v:
            raise ValueError("Geçerli bir email adresi giriniz")
        return v

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()



   



# Register User Endpoint

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

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


    

@app.post("/users/login", response_model=Token)
async def login_for_access_token(
    user_data: UserLogin,  # OAuth2PasswordRequestForm yerine kendi modelimizi kullanıyoruz
    db: Session = Depends(get_db)
):
    # Kullanıcıyı sadece username ve email ile kontrol et
    user = db.query(User).filter(
        (User.username == user_data.username) & (User.user_email == user_data.userEmail)
    ).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Kullanıcı adı veya email hatalı",
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











 