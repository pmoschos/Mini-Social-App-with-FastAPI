from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func

from core.database import get_db
from auth.router import get_current_user
from auth.models import User
from likes.models import Like
from posts.models import Post

router = APIRouter(prefix="/likes", tags=["likes"])

@router.post("/{post_id}")
async def toggle_like(post_id: int, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    # Check if post exists
    post_result = await db.execute(select(Post).filter(Post.id == post_id))
    post = post_result.scalars().first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    # Check validation
    result = await db.execute(select(Like).filter(Like.user_id == current_user.id, Like.post_id == post_id))
    existing_like = result.scalars().first()

    if existing_like:
        await db.delete(existing_like)
        liked = False
    else:
        new_like = Like(user_id=current_user.id, post_id=post_id)
        db.add(new_like)
        liked = True
    
    await db.commit()
    
    # Get count
    count_result = await db.execute(select(func.count(Like.post_id)).filter(Like.post_id == post_id))
    count = count_result.scalar()
    
    return {"liked": liked, "count": count}

@router.get("/{post_id}/count")
async def get_like_count(post_id: int, db: AsyncSession = Depends(get_db)):
    count_result = await db.execute(select(func.count(Like.post_id)).filter(Like.post_id == post_id))
    count = count_result.scalar()
    return {"count": count}
