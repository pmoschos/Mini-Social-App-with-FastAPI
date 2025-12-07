from pydantic import BaseModel
from datetime import datetime

from auth.schemas import UserResponse

class CommentCreate(BaseModel):
    text: str

class CommentResponse(BaseModel):
    id: int
    text: str
    user_id: int
    post_id: int
    created_at: datetime
    user: UserResponse

    class Config:
        from_attributes = True
