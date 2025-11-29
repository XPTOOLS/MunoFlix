"use client"
import CommentSection from '@/components/Comments/CommentSection';

const Comments = ({ MovieId, title }) => {
  return (
    <CommentSection 
      movieId={MovieId} 
      movieTitle={title}
    />
  );
}

export default Comments;