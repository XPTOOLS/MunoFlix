"use client"
import { useState } from 'react';
import Comment from './Comment';
import { FaSort, FaFilter } from "react-icons/fa6";

const CommentList = ({ comments, onUpdate }) => {
  const [sortBy, setSortBy] = useState('newest');
  const [filter, setFilter] = useState('all');

  const sortedAndFilteredComments = comments
    .filter(comment => {
      if (filter === 'guest') return comment.isGuest;
      if (filter === 'user') return !comment.isGuest;
      return true; // 'all'
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortBy === 'oldest') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else if (sortBy === 'likes') {
        return b.likes - a.likes;
      }
      return 0;
    });

  return (
    <div className="space-y-4">
      {/* Sorting and Filtering Options */}
      <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
        <div className="text-lg font-semibold text-white">
          {sortedAndFilteredComments.length} {sortedAndFilteredComments.length === 1 ? 'Comment' : 'Comments'}
        </div>
        
        <div className="flex flex-wrap gap-3">
          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-[#2a2d3e] border border-[#39374b] text-white px-4 py-2 pr-8 rounded-md focus:outline-none focus:border-[#6c5dd3] text-sm"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="likes">Most Liked</option>
            </select>
            <FaSort className="absolute right-2 top-3 text-[#8884b8] pointer-events-none" />
          </div>

          {/* Filter Dropdown */}
          <div className="relative">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="appearance-none bg-[#2a2d3e] border border-[#39374b] text-white px-4 py-2 pr-8 rounded-md focus:outline-none focus:border-[#6c5dd3] text-sm"
            >
              <option value="all">All Comments</option>
              <option value="guest">Guest Comments</option>
              <option value="user">User Comments</option>
            </select>
            <FaFilter className="absolute right-2 top-3 text-[#8884b8] pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Comments */}
      <div className="space-y-4">
        {sortedAndFilteredComments.map((comment) => (
          <Comment 
            key={comment.id} 
            comment={comment} 
            onUpdate={onUpdate}
          />
        ))}
      </div>

      {/* No Comments Message */}
      {sortedAndFilteredComments.length === 0 && (
        <div className="text-center py-12 text-[#8884b8] bg-[#2a2d3e] rounded-lg border border-[#39374b]">
          <div className="text-4xl mb-3">💬</div>
          <p className="text-lg">No comments found</p>
          <p className="text-sm mt-1">Try changing your filter settings</p>
        </div>
      )}
    </div>
  );
};

export default CommentList;