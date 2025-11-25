"use client"
import { useState, useEffect } from 'react';
import CommentForm from './CommentForm';
import CommentList from './CommentList';
import { FaComment, FaUsers } from "react-icons/fa6";

const CommentSection = ({ movieId, movieTitle }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/comments?movieId=${movieId}`);
      const data = await response.json();
      
      if (response.ok) {
        setComments(data.comments || []);
      }
    } catch (err) {
      console.error('Error loading comments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (movieId) {
      fetchComments();
    }
  }, [movieId]);

  const handleNewComment = (newComment) => {
    setComments(prev => [newComment, ...prev]);
  };

  return (
    <div id="comment" className="text-white bg-[#242735] border-[1px] border-[#39374b] relative rounded-md pb-4 w-full h-max">
      {/* Header */}
      <div className="py-2 px-3 flex justify-between items-center border-b border-[#39374b]">
        <div className="flex items-center gap-3">
          <div className="text-[#ffffffd3] text-[18px] font-medium font-['poppins'] flex items-center gap-2">
            <FaComment className="text-[#6c5dd3]" />
            Comments ({comments.length})
          </div>
        </div>
        <div className="text-sm text-[#8884b8] flex items-center gap-1">
          <FaUsers className="text-xs" />
          <span>Guest comments enabled</span>
        </div>
      </div>

      {/* Comment Form */}
      <div className="p-4 border-b border-[#39374b]">
        <CommentForm 
          movieId={movieId} 
          onCommentAdded={handleNewComment}
        />
      </div>

      {/* Comments List */}
      <div className="p-4">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6c5dd3]"></div>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-[#8884b8]">
            <FaComment className="text-4xl mx-auto mb-3 opacity-50" />
            <p>No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          <CommentList 
            comments={comments} 
            onUpdate={fetchComments}
          />
        )}
      </div>
    </div>
  );
};

export default CommentSection;