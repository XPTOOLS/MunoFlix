import { getDatabase } from './mongodb';
import { ObjectId } from 'mongodb';

const COLLECTION_NAME = 'comments';

export const CommentService = {
  // Add new comment - AUTO APPROVE ALL
  addComment: async (commentData) => {
    try {
      const db = await getDatabase();
      const collection = db.collection(COLLECTION_NAME);
      
      const comment = {
        ...commentData,
        createdAt: new Date(),
        updatedAt: new Date(),
        likes: 0,
        dislikes: 0,
        isApproved: true, // AUTO APPROVE ALL COMMENTS
        reactions: {}
      };
      
      const result = await collection.insertOne(comment);
      
      // Return the complete comment with id
      return {
        ...comment,
        _id: result.insertedId,
        id: result.insertedId.toString()
      };
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  },

  // Get comments for a movie - only show approved
  getComments: async (movieId, page = 1, limit = 50) => {
    try {
      const db = await getDatabase();
      const collection = db.collection(COLLECTION_NAME);
      
      const query = { 
        movieId: String(movieId),
        isApproved: true // Only get approved comments
      };
      
      const total = await collection.countDocuments(query);
      const movieComments = await collection
        .find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .toArray();

      // Convert for frontend
      const comments = movieComments.map(comment => ({
        ...comment,
        id: comment._id.toString(),
        createdAt: comment.createdAt.toISOString()
      }));

      return {
        comments,
        total,
        page,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      console.error('Error getting comments:', error);
      throw error;
    }
  },

  // Like/Dislike comment
  reactToComment: async (commentId, userId, type) => {
    try {
      const db = await getDatabase();
      const collection = db.collection(COLLECTION_NAME);
      
      let objectId;
      try {
        objectId = new ObjectId(commentId);
      } catch (error) {
        console.error('Invalid comment ID:', commentId);
        return null;
      }

      const comment = await collection.findOne({ _id: objectId });
      if (!comment) {
        console.error('Comment not found:', commentId);
        return null;
      }

      const previousReaction = comment.reactions?.[userId];
      const updateDoc = { $set: { updatedAt: new Date() } };
      
      let likesChange = 0;
      let dislikesChange = 0;

      // Remove previous reaction
      if (previousReaction === 'like') {
        likesChange = -1;
      } else if (previousReaction === 'dislike') {
        dislikesChange = -1;
      }

      // Add new reaction if different from previous
      if (type && previousReaction !== type) {
        updateDoc.$set[`reactions.${userId}`] = type;
        if (type === 'like') {
          likesChange += 1;
        } else if (type === 'dislike') {
          dislikesChange += 1;
        }
      } else if (type && previousReaction === type) {
        // Remove reaction if same button clicked
        updateDoc.$unset = { [`reactions.${userId}`]: "" };
      }

      // Add increment operations if needed
      if (likesChange !== 0 || dislikesChange !== 0) {
        updateDoc.$inc = {};
        if (likesChange !== 0) updateDoc.$inc.likes = likesChange;
        if (dislikesChange !== 0) updateDoc.$inc.dislikes = dislikesChange;
      }

      const result = await collection.findOneAndUpdate(
        { _id: objectId },
        updateDoc,
        { returnDocument: 'after' }
      );

      if (!result) {
        return null;
      }

      return {
        ...result,
        id: result._id.toString(),
        createdAt: result.createdAt.toISOString()
      };
    } catch (error) {
      console.error('Error reacting to comment:', error);
      throw error;
    }
  },
};