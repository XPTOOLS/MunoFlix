"use client"
import { useState, useEffect } from 'react';
import { FaThumbsUp, FaThumbsDown, FaUser, FaCheckCircle, FaClock } from "react-icons/fa6";

const Comment = ({ comment, onUpdate }) => {
  const [userReaction, setUserReaction] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localLikes, setLocalLikes] = useState(comment.likes || 0);
  const [localDislikes, setLocalDislikes] = useState(comment.dislikes || 0);

  // Initialize user reaction
  useEffect(() => {
    // In a real app, you'd fetch the user's reaction from the API
    // For now, we'll assume no reaction initially
    setUserReaction(null);
    setLocalLikes(comment.likes || 0);
    setLocalDislikes(comment.dislikes || 0);
  }, [comment]);

  const handleReaction = async (type) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const newReaction = userReaction === type ? null : type;
      
      // Optimistic update
      setUserReaction(newReaction);
      
      if (type === 'like') {
        if (userReaction === 'like') {
          setLocalLikes(prev => prev - 1);
        } else if (userReaction === 'dislike') {
          setLocalLikes(prev => prev + 1);
          setLocalDislikes(prev => prev - 1);
        } else {
          setLocalLikes(prev => prev + 1);
        }
      } else if (type === 'dislike') {
        if (userReaction === 'dislike') {
          setLocalDislikes(prev => prev - 1);
        } else if (userReaction === 'like') {
          setLocalDislikes(prev => prev + 1);
          setLocalLikes(prev => prev - 1);
        } else {
          setLocalDislikes(prev => prev + 1);
        }
      }

      // Call API to save reaction
      const response = await fetch(`/api/comments/${comment.id}/react`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: newReaction }),
      });

      if (!response.ok) {
        throw new Error('Failed to save reaction');
      }

      const updatedComment = await response.json();
      
      // Update with actual server data
      setLocalLikes(updatedComment.likes);
      setLocalDislikes(updatedComment.dislikes);
      
      onUpdate(); // Refresh comments if needed
    } catch (error) {
      console.error('Failed to react to comment:', error);
      // Revert optimistic update on error
      setUserReaction(userReaction); // Revert to previous state
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-[#2a2d3e] border border-[#39374b] rounded-lg p-4 hover:border-[#6c5dd3] transition-colors">
      {/* Comment Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="relative">
            <img
              src={comment.userAvatar}
              alt={comment.author}
              className="w-10 h-10 rounded-full border-2 border-[#6c5dd3]"
            />
            {!comment.isGuest && (
              <FaCheckCircle className="absolute -bottom-1 -right-1 text-blue-400 text-xs bg-[#2a2d3e] rounded-full" />
            )}
          </div>
          
          {/* Author Info */}
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">
                {comment.author}
              </span>
              {comment.isGuest ? (
                <span className="text-xs bg-[#6c5dd3] text-white px-2 py-1 rounded-full flex items-center gap-1">
                  <FaUser className="text-xs" />
                  Guest
                </span>
              ) : (
                <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-full flex items-center gap-1">
                  <FaCheckCircle className="text-xs" />
                  User
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-[#8884b8]">
              <FaClock className="text-xs" />
              <span>{formatTimeAgo(comment.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Comment Content */}
      <div className="mb-4">
        <p className="text-white leading-relaxed whitespace-pre-wrap">
          {comment.content}
        </p>
      </div>

      {/* Comment Actions */}
      <div className="flex items-center gap-4 pt-3 border-t border-[#39374b]">
        <button
          onClick={() => handleReaction('like')}
          disabled={isSubmitting}
          className={`flex items-center gap-2 px-3 py-1 rounded-md transition-colors ${
            userReaction === 'like' 
              ? 'bg-green-900/30 text-green-400 border border-green-800' 
              : 'bg-[#242735] text-[#8884b8] hover:bg-[#2a2d3e] hover:text-white'
          }`}
        >
          <FaThumbsUp className={userReaction === 'like' ? 'text-green-400' : ''} />
          <span>{localLikes}</span>
        </button>

        <button
          onClick={() => handleReaction('dislike')}
          disabled={isSubmitting}
          className={`flex items-center gap-2 px-3 py-1 rounded-md transition-colors ${
            userReaction === 'dislike' 
              ? 'bg-red-900/30 text-red-400 border border-red-800' 
              : 'bg-[#242735] text-[#8884b8] hover:bg-[#2a2d3e] hover:text-white'
          }`}
        >
          <FaThumbsDown className={userReaction === 'dislike' ? 'text-red-400' : ''} />
          <span>{localDislikes}</span>
        </button>
      </div>
    </div>
  );
};

export default Comment;