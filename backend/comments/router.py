from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from core.database import get_db
from auth.router import get_current_user
from auth.models import User
from comments.models import Comment
from comments.schemas import CommentCreate, CommentResponse
from posts.models import Post

router = APIRouter(prefix="/comments", tags=["comments"])

@router.post("/{post_id}", response_model=CommentResponse)
async def create_comment(
    post_id: int, 
    comment_data: CommentCreate, 
    current_user: User = Depends(get_current_user), 
    db: AsyncSession = Depends(get_db)
):
    post_result = await db.execute(select(Post).filter(Post.id == post_id))
    post = post_result.scalars().first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    new_comment = Comment(
        text=comment_data.text,
        user_id=current_user.id,
        post_id=post_id
    )
    db.add(new_comment)
    await db.commit()
    await db.refresh(new_comment)
    
    
    # Manually populate user for response since we have it
    new_comment.user = current_user
    return new_comment

@router.get("/{post_id}", response_model=List[CommentResponse])
async def get_comments(post_id: int, db: AsyncSession = Depends(get_db)):
    # usage of selectinload to get user relationship for author email
    result = await db.execute(
        select(Comment)
        .where(Comment.post_id == post_id)
        .options(selectinload(Comment.user))
        .order_by(Comment.created_at.asc())
    )
    comments = result.scalars().all()
    
    
    return comments
