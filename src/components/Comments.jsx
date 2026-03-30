import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const Comments = ({ postId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    const { data } = await supabase
      .from('comments')
      .select(`
        *,
        profiles (
          username,
          display_name,
          avatar_url
        )
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (data) setComments(data);
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const { error } = await supabase
      .from('comments')
      .insert({
        post_id: postId,
        user_id: user.id,
        content: newComment,
        parent_id: null
      });

    if (!error) {
      setNewComment('');
      fetchComments();
    }
  };

  const handleAddReply = async (parentId) => {
    if (!replyText.trim()) return;

    const { error } = await supabase
      .from('comments')
      .insert({
        post_id: postId,
        user_id: user.id,
        content: replyText,
        parent_id: parentId
      });

    if (!error) {
      setReplyText('');
      setReplyingTo(null);
      fetchComments();
    }
  };

  const renderComment = (comment) => {
    const isReply = comment.parent_id;
    const isMyComment = comment.user_id === user.id;

    return (
      <motion.div
        key={comment.id}
        initial={{ opacity: 0, x: isReply ? -20 : 0 }}
        animate={{ opacity: 1, x: 0 }}
        className={`flex gap-3 ${isReply ? 'ml-12 mt-3' : 'mb-4'}`}
      >
        <div className={`${isReply ? 'w-12 h-12' : 'w-16 h-16'} rounded-full border-4 border-pink-500 shadow-lg overflow-hidden`} style={{
          boxShadow: '0 0 10px #ff69b4, 0 0 20px #ff69b4, 0 0 30px #ff69b4, 0 0 40px #ff69b4'
        }}>
          {comment.profiles?.avatar_url ? (
            <img src={comment.profiles.avatar_url} alt={comment.profiles.display_name || comment.profiles.username} className="w-full h-full object-cover" />
          ) : (
            <div className={`w-full h-full bg-pink-200 flex items-center justify-center ${isReply ? 'text-lg' : 'text-2xl'}`}>👧</div>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-pink-600" style={{ fontFamily: "'Cherry Bomb One', cursive" }}>
              {comment.profiles?.display_name || comment.profiles?.username || 'Anonymous'}
            </span>
            {isReply && <span className="text-pink-400 text-sm">replied</span>}
          </div>
          <p className="text-gray-700 mb-2">{comment.content}</p>
          <div className="flex items-center gap-4 text-sm text-pink-600">
            <span>{new Date(comment.created_at).toLocaleDateString()}</span>
            {!isReply && (
              <button
                onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                className="font-bold hover:underline"
              >
                Reply
              </button>
            )}
          </div>

          {/* Reply Input */}
          {replyingTo === comment.id && (
            <div className="mt-3 flex gap-2">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                className="flex-1 p-2 rounded-xl border-4 border-pink-200 bg-white/50 text-sm"
                style={{ fontFamily: "'Cherry Bomb One', cursive" }}
              />
              <button
                onClick={() => handleAddReply(comment.id)}
                disabled={!replyText.trim()}
                className="px-4 py-2 bg-pink-400 text-white rounded-full font-bold border-4 border-white shadow disabled:opacity-50"
              >
                Send
              </button>
            </div>
          )}

          {/* Nested Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-3 space-y-3">
              {comment.replies.map((reply) => renderComment({ ...reply, parent_id: comment.id }))}
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="mt-6 pt-6 border-t-4 border-pink-200">
      <h3 className="text-2xl font-bold text-pink-600 mb-4" style={{ fontFamily: "'Cherry Bomb One', cursive" }}>
        Comments ({comments.length})
      </h3>

      {/* Add Comment */}
      <form onSubmit={handleAddComment} className="flex gap-3 mb-6">
        <div className={`w-12 h-12 rounded-full border-4 border-pink-500 shadow-lg overflow-hidden`} style={{
          boxShadow: '0 0 10px #ff69b4, 0 0 20px #ff69b4, 0 0 30px #ff69b4, 0 0 40px #ff69b4'
        }}>
          {user?.avatar_url ? (
            <img src={user.avatar_url} alt="You" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-pink-200 flex items-center justify-center text-xl">👧</div>
          )}
        </div>
        <div className="flex-1">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-full p-3 rounded-xl border-4 border-pink-200 bg-white/50"
            style={{ fontFamily: "'Cherry Bomb One', cursive" }}
          />
        </div>
        <button
          type="submit"
          disabled={!newComment.trim()}
          className="px-6 py-2 bg-pink-400 text-white rounded-full font-bold border-4 border-white shadow disabled:opacity-50"
        >
          Post
        </button>
      </form>

      {/* Comments List */}
      <div>
        {comments
          .filter(c => !c.parent_id)
          .map(comment => renderComment(comment))}
      </div>
    </div>
  );
};

export default Comments;