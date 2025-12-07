from pydantic import BaseModel
from datetime import datetime
from auth.schemas import UserResponse

class PostBase(BaseModel):
    title: str

class PostCreate(PostBase):
    pass

class PostResponse(PostBase):
    id: int
    image_url: str
    user_id: int
    created_at: datetime
    user: UserResponse

    class Config:
        from_attributes = True
