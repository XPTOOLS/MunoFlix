"use client"
import { useState } from 'react';
import { FaUser, FaEnvelope, FaPaperPlane } from "react-icons/fa6";

const CommentForm = ({ movieId, onCommentAdded }) => {
  const [formData, setFormData] = useState({
    author: '',
    email: '',
    content: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    if (!formData.content.trim()) {
      setError('Please enter a comment');
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          movieId,
          content: formData.content,
          author: formData.author || 'Anonymous',
          email: formData.email || '',
          isGuest: true
        }),
      });

      const data = await response.json();

      if (response.ok) {
        onCommentAdded(data);
        setFormData({ author: '', email: '', content: '' });
        setError('');
      } else {
        setError(data.error || 'Failed to post comment');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Guest Info Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <FaUser className="absolute left-3 top-3 text-[#8884b8]" />
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              placeholder="Your name (optional)"
              className="w-full pl-10 pr-4 py-2 bg-[#2a2d3e] border border-[#39374b] rounded-md text-white placeholder-[#8884b8] focus:outline-none focus:border-[#6c5dd3]"
            />
          </div>
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-3 text-[#8884b8]" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email (optional)"
              className="w-full pl-10 pr-4 py-2 bg-[#2a2d3e] border border-[#39374b] rounded-md text-white placeholder-[#8884b8] focus:outline-none focus:border-[#6c5dd3]"
            />
          </div>
        </div>

        {/* Comment Textarea */}
        <div>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Share your thoughts about this movie..."
            rows="4"
            className="w-full px-4 py-3 bg-[#2a2d3e] border border-[#39374b] rounded-md text-white placeholder-[#8884b8] focus:outline-none focus:border-[#6c5dd3] resize-none"
            required
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-red-400 text-sm bg-red-900/20 border border-red-800 rounded-md p-3">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-[#8884b8]">
            Commenting as {formData.author || 'Anonymous'} (Guest)
          </span>
          <button
            type="submit"
            disabled={submitting || !formData.content.trim()}
            className="flex items-center gap-2 px-6 py-2 bg-[#6c5dd3] hover:bg-[#5b4bc4] disabled:bg-[#4a3aa3] disabled:cursor-not-allowed text-white rounded-md transition-colors"
          >
            <FaPaperPlane />
            {submitting ? 'Posting...' : 'Post Comment'}
          </button>
        </div>
      </form>

      {/* Guest Comment Notice */}
      <div className="text-xs text-[#8884b8] bg-[#2a2d3e] p-3 rounded-md">
        <strong>💡 Guest Commenting:</strong> You can comment without signing in. Your name will be displayed as "{formData.author || 'Anonymous'}".
      </div>
    </div>
  );
};

export default CommentForm;