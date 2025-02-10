from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base



class User(Base):
    __tablename__ = 'users'
    
    user_id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    user_email = Column(String(100), unique=True, index=True, nullable=False)
    userpassword = Column(String(100), nullable=False)
    
    # Video ilişkisi
    videos = relationship("Video", back_populates="user")


class Video(Base):
    __tablename__ = 'videos'

    video_id = Column(Integer, primary_key=True, index=True)
    video_title = Column(String(100), nullable=False)
    video_thumbnail = Column(String(100), nullable=False)
    video_prompt = Column(String(100), nullable=False)
    video_video = Column(String(100), nullable=False)
    user_id = Column(Integer, ForeignKey('users.user_id'))  # Kullanıcı ilişkisi için

    # User ile ilişki
    user = relationship("User", back_populates="videos")
    
    

