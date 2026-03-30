import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Camera, Video, Heart, X } from 'lucide-react';

const PostCreator = ({ onSubmit, currentUser }) => {
  const [feelings, setFeelings] = useState('');
  const [selectedMood, setSelectedMood] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const moods = [
    { icon: '😊', label: 'Happy' },
    { icon: '😭', label: 'Sad' },
    { icon: '😡', label: 'Angry' },
    { icon: '😱', label: 'Excited' },
    { icon: '🥰', label: 'Love' },
    { icon: '😴', label: 'Tired' },
    { icon: '🤔', label: 'Thoughtful' },
    { icon: '🌟', label: 'Sparkly' }
  ];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
    }
  };

  const clearMedia = () => {
    setImageFile(null);
    setVideoFile(null);
    setImagePreview(null);
    setVideoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (videoInputRef.current) videoInputRef.current.value = '';
  };

  const handleSubmit = async () => {
    if (!feelings.trim() && !imageFile && !videoFile) return;

    const postData = {
      content: feelings,
      mood: selectedMood,
      image_url: imagePreview,
      video_url: videoPreview
    };

    await onSubmit(postData);
    setFeelings('');
    setSelectedMood('');
    clearMedia();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div
        className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-3xl p-6 border-4 border-pink-200 shadow-xl"
        style={{
          boxShadow: '0 10px 40px rgba(236, 72, 153, 0.2)',
          backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(255,255,255,0.4) 0%, transparent 20%), radial-gradient(circle at 90% 80%, rgba(255,255,255,0.3) 0%, transparent 20%)'
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-4 mb-4">
          <div className="w-24 h-24 rounded-full border-4 border-pink-500 shadow-lg overflow-hidden" style={{
            boxShadow: '0 0 10px #ff69b4, 0 0 20px #ff69b4, 0 0 30px #ff69b4, 0 0 40px #ff69b4'
          }}>
            {currentUser?.avatar_url ? (
              <img src={currentUser.avatar_url} alt="You" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-pink-200 flex items-center justify-center text-2xl">👧</div>
            )}
          </div>
          <div className="flex-1">
            <div className="text-2xl font-bold text-pink-600 mb-1 neon-text" style={{ fontFamily: "'Cherry Bomb One', cursive" }}>
              Update the pack
            </div>
          </div>
          <button
            onClick={() => {/* close or clear */}}
            className="p-2 bg-white/60 rounded-full border-4 border-pink-200 hover:bg-pink-100"
          >
            <X size={20} className="text-pink-600" />
          </button>
        </div>

        {/* Feelings Input */}
        <div className="mb-4">
          <label className="block text-pink-600 font-bold mb-2">Text Box</label>
          <textarea
            value={feelings}
            onChange={(e) => setFeelings(e.target.value)}
            placeholder="Text Box"
            className="w-full p-4 rounded-2xl border-4 border-pink-200 bg-white/70 resize-none focus:outline-none focus:ring-4 focus:ring-pink-300"
            rows={3}
            style={{ fontFamily: "'Cherry Bomb One', cursive" }}
          />
        </div>

        {/* Mood Input */}
        <div className="mb-4">
          <label className="block text-pink-600 font-bold mb-2">Your Mood 🌈</label>
          <input
            type="text"
            value={selectedMood}
            onChange={(e) => setSelectedMood(e.target.value)}
            placeholder="e.g. Feeling Villainous, Sparkly, etc."
            className="w-full p-4 rounded-2xl border-4 border-pink-200 bg-white/70 resize-none focus:outline-none focus:ring-4 focus:ring-pink-300"
            style={{ fontFamily: "'Cherry Bomb One', cursive" }}
          />
        </div>

        {/* Media Upload */}
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 py-3 bg-white/60 border-4 border-pink-200 rounded-full font-bold text-pink-600 hover:bg-pink-100 transition-all flex items-center justify-center gap-2"
            style={{ fontFamily: "'Cherry Bomb One', cursive" }}
          >
            <Camera size={24} />
            {imagePreview ? 'Change Image' : 'Attach Image 📸'}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />

          <button
            onClick={() => videoInputRef.current?.click()}
            className="flex-1 py-3 bg-white/60 border-4 border-pink-200 rounded-full font-bold text-pink-600 hover:bg-pink-100 transition-all flex items-center justify-center gap-2"
            style={{ fontFamily: "'Cherry Bomb One', cursive" }}
          >
            <Video size={24} />
            {videoPreview ? 'Change Video' : 'Attach Video 🎥'}
          </button>
          <input
            ref={videoInputRef}
            type="file"
            accept="video/*"
            onChange={handleVideoUpload}
            className="hidden"
          />
        </div>

        {/* Preview */}
        {(imagePreview || videoPreview) && (
          <div className="mb-4 relative">
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="w-full h-64 object-cover rounded-2xl border-4 border-pink-200" />
            )}
            {videoPreview && (
              <video src={videoPreview} controls className="w-full h-64 object-cover rounded-2xl border-4 border-pink-200" />
            )}
            <button
              onClick={clearMedia}
              className="absolute top-2 right-2 p-2 bg-red-400 text-white rounded-full border-4 border-white shadow-lg hover:bg-red-500"
            >
              <X size={20} />
            </button>
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!feelings.trim() && !imageFile && !videoFile}
          className="w-full py-4 bg-gradient-to-r from-pink-400 to-pink-500 text-white rounded-full font-bold text-xl border-4 border-white shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          style={{ fontFamily: "'Cherry Bomb One', cursive" }}
        >
          <Heart fill="white" stroke="white" size={28} />
          Post to the Pack 🌸
        </button>
      </div>
    </motion.div>
  );
};

export default PostCreator;