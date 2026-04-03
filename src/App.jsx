import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Users, User, Edit2, Save, X, Star, Menu } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';
import MoodBubble from './components/MoodBubble';
import HeartSaveButton from './components/HeartSaveButton';
import PostCreator from './components/PostCreator';
import Comments from './components/Comments';
import LoginSignup from './components/LoginSignup';
import { supabase } from './lib/supabase';

function App() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('post');
  const [savedPosts, setSavedPosts] = useState([]);
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPost, setSavingPost] = useState(false);
  const [profile, setProfile] = useState({
    username: '',
    display_name: '',
    bio: '',
    avatar_url: '',
    background_url: ''
  });
  const [authReady, setAuthReady] = useState(false);
  const [posts, setPosts] = useState([]);
  const [editingProfile, setEditingProfile] = useState({
    username: '',
    display_name: '',
    bio: ''
  });
  const [friends, setFriends] = useState([]);
  const [expandedComments, setExpandedComments] = useState({});
  const backgroundInputRef = useRef(null);

  // Background SVG for night cityscape
  const backgroundSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080"><defs><linearGradient id="sky" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#1a0b2e"/><stop offset="50%" stop-color="#4a0e4e"/><stop offset="100%" stop-color="#2d1b4e"/></linearGradient><filter id="glow"><feGaussianBlur stdDeviation="2.5" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="100%" height="100%" fill="url(#sky)"/><circle cx="100" cy="80" r="2" fill="white" filter="url(#glow)"/><circle cx="300" cy="150" r="1.5" fill="#ff69b4" filter="url(#glow)"/><circle cx="500" cy="50" r="2" fill="white" filter="url(#glow)"/><circle cx="700" cy="120" r="1.5" fill="#ff69b4" filter="url(#glow)"/><circle cx="900" cy="90" r="2" fill="white" filter="url(#glow)"/><circle cx="1100" cy="200" r="1.5" fill="#ff69b4" filter="url(#glow)"/><circle cx="1300" cy="70" r="2" fill="white" filter="url(#glow)"/><circle cx="1500" cy="180" r="1.5" fill="#ff69b4" filter="url(#glow)"/><circle cx="1700" cy="100" r="2" fill="white" filter="url(#glow)"/><circle cx="200" cy="300" r="1.5" fill="#ff69b4" filter="url(#glow)"/><circle cx="400" cy="250" r="2" fill="white" filter="url(#glow)"/><circle cx="600" cy="350" r="1.5" fill="#ff69b4" filter="url(#glow)"/><circle cx="800" cy="280" r="2" fill="white" filter="url(#glow)"/><circle cx="1000" cy="320" r="1.5" fill="#ff69b4" filter="url(#glow)"/><circle cx="1200" cy="260" r="2" fill="white" filter="url(#glow)"/><circle cx="1400" cy="340" r="1.5" fill="#ff69b4" filter="url(#glow)"/><circle cx="1600" cy="290" r="2" fill="white" filter="url(#glow)"/><circle cx="1800" cy="230" r="1.5" fill="#ff69b4" filter="url(#glow)"/><circle cx="150" cy="500" r="2" fill="white" filter="url(#glow)"/><circle cx="350" cy="550" r="1.5" fill="#ff69b4" filter="url(#glow)"/><circle cx="550" cy="480" r="2" fill="white" filter="url(#glow)"/><circle cx="750" cy="600" r="1.5" fill="#ff69b4" filter="url(#glow)"/><circle cx="950" cy="520" r="2" fill="white" filter="url(#glow)"/><circle cx="1150" cy="580" r="1.5" fill="#ff69b4" filter="url(#glow)"/><circle cx="1350" cy="490" r="2" fill="white" filter="url(#glow)"/><circle cx="1550" cy="620" r="1.5" fill="#ff69b4" filter="url(#glow)"/><circle cx="1750" cy="540" r="2" fill="white" filter="url(#glow)"/><circle cx="250" cy="700" r="1.5" fill="#ff69b4" filter="url(#glow)"/><circle cx="450" cy="750" r="2" fill="white" filter="url(#glow)"/><circle cx="650" cy="680" r="1.5" fill="#ff69b4" filter="url(#glow)"/><circle cx="850" cy="720" r="2" fill="white" filter="url(#glow)"/><circle cx="1050" cy="770" r="1.5" fill="#ff69b4" filter="url(#glow)"/><circle cx="1250" cy="700" r="2" fill="white" filter="url(#glow)"/><circle cx="1450" cy="760" r="1.5" fill="#ff69b4" filter="url(#glow)"/><circle cx="1650" cy="730" r="2" fill="white" filter="url(#glow)"/><circle cx="1850" cy="790" r="1.5" fill="#ff69b4" filter="url(#glow)"/><rect x="0" y="700" width="150" height="380" fill="#0a0a0a"/><rect x="160" y="650" width="100" height="430" fill="#0f0f0f"/><rect x="280" y="720" width="120" height="360" fill="#0a0a0a"/><rect x="420" y="680" width="80" height="400" fill="#111111"/><rect x="520" y="750" width="150" height="330" fill="#0a0a0a"/><rect x="690" y="700" width="100" height="380" fill="#0f0f0f"/><rect x="810" y="670" width="130" height="410" fill="#111111"/><rect x="960" y="720" width="90" height="360" fill="#0a0a0a"/><rect x="1070" y="690" width="120" height="390" fill="#0f0f0f"/><rect x="1210" y="750" width="100" height="330" fill="#111111"/><rect x="1330" y="710" width="140" height="370" fill="#0a0a0a"/><rect x="1490" y="680" width="110" height="400" fill="#0f0f0f"/><rect x="1620" y="740" width="130" height="340" fill="#111111"/><rect x="1770" y="700" width="150" height="380" fill="#0a0a0a"/><rect x="20" y="720" width="20" height="30" fill="#ffeb3b" opacity="0.8"/><rect x="60" y="720" width="20" height="30" fill="#ffeb3b" opacity="0.8"/><rect x="100" y="720" width="20" height="30" fill="#ffeb3b" opacity="0.8"/><rect x="20" y="770" width="20" height="30" fill="#ffeb3b" opacity="0.8"/><rect x="60" y="770" width="20" height="30" fill="#ffeb3b" opacity="0.8"/><rect x="100" y="770" width="20" height="30" fill="#ffeb3b" opacity="0.8"/><rect x="20" y="820" width="20" height="30" fill="#ffeb3b" opacity="0.8"/><rect x="60" y="820" width="20" height="30" fill="#ffeb3b" opacity="0.8"/><rect x="100" y="820" width="20" height="30" fill="#ffeb3b" opacity="0.8"/><rect x="180" y="660" width="15" height="25" fill="#ffeb3b" opacity="0.8"/><rect x="210" y="660" width="15" height="25" fill="#ffeb3b" opacity="0.8"/><rect x="240" y="660" width="15" height="25" fill="#ffeb3b" opacity="0.8"/><rect x="180" y="710" width="15" height="25" fill="#ffeb3b" opacity="0.8"/><rect x="210" y="710" width="15" height="25" fill="#ffeb3b" opacity="0.8"/><rect x="240" y="710" width="15" height="25" fill="#ffeb3b" opacity="0.8"/><rect x="180" y="760" width="15" height="25" fill="#ffeb3b" opacity="0.8"/><rect x="210" y="760" width="15" height="25" fill="#ffeb3b" opacity="0.8"/><rect x="240" y="760" width="15" height="25" fill="#ffeb3b" opacity="0.8"/><rect x="300" y="740" width="20" height="30" fill="#ffeb3b" opacity="0.8"/><rect x="350" y="740" width="20" height="30" fill="#ffeb3b" opacity="0.8"/><rect x="400" y="740" width="20" height="30" fill="#ffeb3b" opacity="0.8"/><rect x="300" y="790" width="20" height="30" fill="#ffeb3b" opacity="0.8"/><rect x="350" y="790" width="20" height="30" fill="#ffeb3b" opacity="0.8"/><rect x="400" y="790" width="20" height="30" fill="#ffeb3b" opacity="0.8"/><rect x="540" y="760" width="20" height="30" fill="#ffeb3b" opacity="0.8"/><rect x="590" y="760" width="20" height="30" fill="#ffeb3b" opacity="0.8"/><rect x="640" y="760" width="20" height="30" fill="#ffeb3b" opacity="0.8"/><rect x="540" y="810" width="20" height="30" fill="#ffeb3b" opacity="0.8"/><rect x="590" y="810" width="20" height="30" fill="#ffeb3b" opacity="0.8"/><rect x="640" y="810" width="20" height="30" fill="#ffeb3b" opacity="0.8"/><rect x="700" y="720" width="15" height="25" fill="#ffeb3b" opacity="0.8"/><rect x="735" y="720" width="15" height="25" fill="#ffeb3b" opacity="0.8"/><rect x="770" y="720" width="15" height="25" fill="#ffeb3b" opacity="0.8"/><rect x="700" y="770" width="15" height="25" fill="#ffeb3b" opacity="0.8"/><rect x="735" y="770" width="15" height="25" fill="#ffeb3b" opacity="0.8"/><rect x="770" y="770" width="15" height="25" fill="#ffeb3b" opacity="0.8"/><rect x="820" y="720" width="15" height="25" fill="#ffeb3b" opacity="0.8"/><rect x="855" y="720" width="15" height="25" fill="#ffeb3b" opacity="0.8"/><rect x="890" y="720" width="15" height="25" fill="#ffeb3b" opacity="0.8"/><rect x="820" y="770" width="15" height="25" fill="#ffeb3b" opacity="0.8"/><rect x="855" y="770" width="15" height="25" fill="#ffeb3b" opacity="0.8"/><rect x="890" y="770" width="15" height="25" fill="#ffeb3b" opacity="0.8"/><rect x="980" y="740" width="20" height="30" fill="#ffeb3b" opacity="0.8"/><rect x="1030" y="740" width="20" height="30" fill="#ffeb3b" opacity="0.8"/><rect x="1080" y="740" width="20" height="30" fill="#ffeb3b" opacity="0.8"/><rect x="980" y="790" width="20" height="30" fill="#ffeb3b" opacity="0.8"/><rect x="1030" y="790" width="20" height="30" fill="#ffeb3b" opacity="0.8"/><rect x="1080" y="790" width="20" height="30" fill="#ffeb3b" opacity="0.8"/><rect x="1140" y="700" width="15" height="25" fill="#ffeb3b" opacity="0.8"/><rect x="1175" y="700" width="15" height="25" fill="#ffeb3b" opacity="0.8"/><rect x="1210" y="700" width="15" height="25" fill="#ffeb3b" opacity="0.8"/><rect x="1140" y="750" width="15" height="25" fill="#ffeb3b" opacity="0.8"/><rect x="1175" y="750" width="15" height="25" fill="#ffeb3b" opacity="0.8"/><rect x="1210" y="750" width="15" height="25" fill="#ffeb3b" opacity="0.8"/><rect x="1340" y="730" width="20" height="30" fill="#ffeb3b" opacity="0.8"/><rect x="1390" y="730" width="20" height="30" fill="#ffeb3b" opacity="0.8"/><rect x="1440" y="730" width="20" height="30" fill="#ffeb3b" opacity="0.8"/><rect x="1340" y="780" width="20" height="30" fill="#ffeb3b" opacity="0.8"/><rect x="1390" y="780" width="20" height="30" fill="#ffeb3b" opacity="0.8"/><rect x="1440" y="780" width="20" height="30" fill="#ffeb3b" opacity="0.8"/><rect x="1500" y="700" width="15" height="25" fill="#ffeb3b" opacity="0.8"/><rect x="1535" y="700" width="15" height="25" fill="#ffeb3b" opacity="0.8"/><rect x="1570" y="700" width="15" height="25" fill="#ffeb3b" opacity="0.8"/><rect x="1500" y="750" width="15" height="25" fill="#ffeb3b" opacity="0.8"/><rect x="1535" y="750" width="15" height="25" fill="#ffeb3b" opacity="0.8"/><rect x="1570" y="750" width="15" height="25" fill="#ffeb3b" opacity="0.8"/><rect x="1630" y="760" width="20" height="30" fill="#ffeb3b" opacity="0.8"/><rect x="1680" y="760" width="20" height="30" fill="#ffeb3b" opacity="0.8"/><rect x="1730" y="760" width="20" height="30" fill="#ffeb3b" opacity="0.8"/><rect x="1630" y="810" width="20" height="30" fill="#ffeb3b" opacity="0.8"/><rect x="1680" y="810" width="20" height="30" fill="#ffeb3b" opacity="0.8"/><rect x="1730" y="810" width="20" height="30" fill="#ffeb3b" opacity="0.8"/><rect x="1780" y="720" width="15" height="25" fill="#ffeb3b" opacity="0.8"/><rect x="1815" y="720" width="15" height="25" fill="#ffeb3b" opacity="0.8"/><rect x="1850" y="720" width="15" height="25" fill="#ffeb3b" opacity="0.8"/><rect x="1780" y="770" width="15" height="25" fill="#ffeb3b" opacity="0.8"/><rect x="1815" y="770" width="15" height="25" fill="#ffeb3b" opacity="0.8"/><rect x="1850" y="770" width="15" height="25" fill="#ffeb3b" opacity="0.8"/></svg>`;
  const backgroundImage = `url("data:image/svg+xml,${encodeURIComponent(backgroundSvg)}")`;

  // Floating sparkles - increased count and brightness
  const sparkles = useMemo(() => {
    return Array.from({ length: 50 }, (_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 15 + 5,
      delay: Math.random() * 5,
      duration: Math.random() * 3 + 2,
      color: Math.random() > 0.5 ? 'white' : '#ff69b4'
    }));
  }, []);

  const fetchProfile = async () => {
    console.log("=== fetchProfile called ===");
    
    // Wait for auth to be ready
    if (!authReady) {
      console.log("Auth not ready yet, waiting...");
      return;
    }
    
    // Get current user from Supabase auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error("No user authenticated, cannot fetch profile", authError);
      return;
    }
    
    console.log("User ID from getUser():", user.id);
    
    try {
      const { data, error, status } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      console.log("Profile query status:", status);
      console.log("Profile query error:", error);
      console.log("Profile query data:", data);

      if (error) {
        console.error("Error fetching profile:", error);
        if (error.code === 'PGRST116') {
          console.warn("No profile record exists for this user. They may need to sign up or update their profile.");
        }
        return;
      }

      if (data) {
        console.log("✅ Profile data received successfully:", data);
        setProfile(data);
        setEditingProfile({
          username: data.username || '',
          display_name: data.display_name || '',
          bio: data.bio || ''
        });
        // Save to localStorage as backup
        localStorage.setItem('profile_backup', JSON.stringify(data));
        console.log("Profile loaded successfully");
        console.log("Profile state updated");
      } else {
        console.warn("No profile data found (empty response)");
      }
    } catch (err) {
      console.error("Exception in fetchProfile:", err);
    }
    console.log("=== fetchProfile completed ===");
  };

  const fetchPosts = async () => {
    // Get current authenticated user
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
    if (authError || !authUser) {
      console.error("No authenticated user for fetchPosts");
      return;
    }

    // Get accepted friendships
    const { data: friendships } = await supabase
      .from('friendships')
      .select('friend_id')
      .eq('user_id', authUser.id)
      .eq('status', 'accepted');

    const friendIds = friendships?.map(f => f.friend_id) || [];

    // Also include own posts
    const allUserIds = [...friendIds, authUser.id];

    // Get posts from self and accepted friends, ordered by creation (newest first)
    const { data: postsData, error } = await supabase
      .from('posts')
      .select(`
        *,
        profiles (
          username,
          display_name,
          avatar_url
        )
      `)
      .in('user_id', allUserIds)
      .order('created_at', { ascending: false });

    if (postsData) {
      setPosts(postsData);
    }
  };

  const fetchFriends = async () => {
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
    if (authError || !authUser) {
      console.error("No authenticated user for fetchFriends");
      return;
    }

    const { data } = await supabase
      .from('friendships')
      .select(`
        friend_id,
        profiles (
          username,
          display_name,
          avatar_url,
          status
        )
      `)
      .eq('user_id', authUser.id)
      .eq('status', 'accepted');

    if (data) {
      setFriends(data);
    }
  };

  // Check localStorage for profile backup on mount
  useEffect(() => {
    const backup = localStorage.getItem('profile_backup');
    if (backup) {
      try {
        const savedProfile = JSON.parse(backup);
        console.log("Found profile in localStorage:", savedProfile);
        setProfile(savedProfile);
        setEditingProfile({
          username: savedProfile.username || '',
          display_name: savedProfile.display_name || '',
          bio: savedProfile.bio || ''
        });
      } catch (e) {
        console.error("Failed to parse localStorage profile:", e);
      }
    }
  }, []);

  // Set auth ready flag when user from context is available
  useEffect(() => {
    if (user !== undefined) {
      setAuthReady(true);
    }
  }, [user]);

  // Fetch user profile and related data when user changes
  useEffect(() => {
    console.log("=== useEffect triggered ===");
    console.log("User object in useEffect:", user);
    console.log("User ID in useEffect:", user?.id);
    console.log("Auth ready:", authReady);
    
    if (user?.id && authReady) {
      console.log("User exists and auth ready, calling fetchProfile...");
      fetchProfile();
      fetchPosts();
      fetchFriends();
    } else {
      console.log("No user or auth not ready, skipping data fetch");
    }
  }, [user?.id, authReady]);

  const handleProfileUpdate = async (e) => {
    if (e) e.preventDefault();
    console.log("=== handleProfileUpdate called ===");
    console.log("Saving profile...", editingProfile);
    setSavingProfile(true);
    
    try {
      // First, verify we have an authenticated user
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !authUser) {
        console.error("Authentication error:", authError);
        console.error("Auth error details:", authError?.details, authError?.code);
        alert("Not authenticated! Please sign in again.");
        setSavingProfile(false);
        return;
      }
      
      console.log("Authenticated user ID:", authUser.id);
      console.log("Auth user email:", authUser.email);
      
      // Prepare the profile data
      const profileData = {
        id: authUser.id,
        username: editingProfile.username,
        display_name: editingProfile.display_name,
        bio: editingProfile.bio,
        updated_at: new Date().toISOString()
      };
      
      console.log("Upserting profile data:", profileData);
      
      // Use upsert to handle both insert and update
      const { data, error } = await supabase
        .from('profiles')
        .upsert(profileData, { onConflict: 'id' })
        .select();

      console.log("Upsert response - data:", data);
      console.log("Upsert response - error:", error);
      
      if (error) {
        console.error("❌ Profile save failed:", error);
        console.error("Error code:", error.code);
        console.error("Error details:", error.details);
        console.error("Error hint:", error.hint);
        alert("Failed to save profile!\n\nError: " + error.message + "\n\nCode: " + error.code + "\n\nCheck console for details.");
        throw error;
      } else {
        console.log("✅ Profile saved successfully:", data);
        alert("Profile Saved!");
        const updatedProfile = {
          ...profile,
          ...editingProfile,
          id: authUser.id
        };
        setProfile(updatedProfile);
        // Save to localStorage as backup
        localStorage.setItem('profile_backup', JSON.stringify(updatedProfile));
        setShowProfileEdit(false);
      }
    } catch (err) {
      console.error("Profile save error (catch):", err);
      console.error("Error stack:", err.stack);
      alert("An unexpected error occurred while saving: " + (err.message || String(err)));
    } finally {
      setSavingProfile(false);
      console.log("=== handleProfileUpdate completed ===");
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      // Get authenticated user
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      if (authError || !authUser) {
        alert("Not authenticated! Please sign in again.");
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${authUser.id}-${Date.now()}.${fileExt}`;

      console.log("Uploading avatar to:", fileName);
      
      // Upload to avatars bucket
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        alert("Failed to upload avatar: " + uploadError.message);
        return;
      }

      console.log("Upload successful, getting public URL...");
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      console.log("Public URL:", publicUrl);

      // Update profile with avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', authUser.id);

      if (updateError) {
        console.error("Profile update error:", updateError);
        alert("Failed to update profile with avatar: " + updateError.message);
        return;
      }

      console.log("Profile updated with avatar URL");
      
      // Update local state immediately
      setProfile({ ...profile, avatar_url: publicUrl });
      
      // Update localStorage backup
      const updatedProfile = { ...profile, avatar_url: publicUrl };
      localStorage.setItem('profile_backup', JSON.stringify(updatedProfile));
      
      alert("Avatar uploaded successfully!");
    } catch (err) {
      console.error("Avatar upload exception:", err);
      alert("An unexpected error occurred while uploading avatar: " + err.message);
    }
  };

  const handleBackgroundUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      // Get authenticated user
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      if (authError || !authUser) {
        alert("Not authenticated! Please sign in again.");
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `background-${authUser.id}-${Date.now()}.${fileExt}`;

      console.log("Uploading background to:", fileName);
      
      // Upload to backgrounds bucket
      const { error: uploadError } = await supabase.storage
        .from('backgrounds')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        console.error("Background upload error:", uploadError);
        alert("Failed to upload background: " + uploadError.message);
        return;
      }

      console.log("Background upload successful, getting public URL...");
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('backgrounds')
        .getPublicUrl(fileName);

      console.log("Public URL:", publicUrl);

      // Update profile with background URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ background_url: publicUrl })
        .eq('id', authUser.id);

      if (updateError) {
        console.error("Profile update error:", updateError);
        alert("Failed to update profile with background: " + updateError.message);
        return;
      }

      console.log("Profile updated with background URL");
      
      // Update local state immediately
      setProfile({ ...profile, background_url: publicUrl });
      
      // Update localStorage backup
      const updatedProfile = { ...profile, background_url: publicUrl };
      localStorage.setItem('profile_backup', JSON.stringify(updatedProfile));
      
      alert("Background uploaded successfully!");
    } catch (err) {
      console.error("Background upload exception:", err);
      alert("An unexpected error occurred while uploading background: " + err.message);
    }
  };

  const handleCreatePost = async (postData) => {
    const { content, mood, imageFile, videoFile } = postData;

    // Get current user explicitly
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (!user) { 
      alert('Error: You must be logged in to post. User ID not found.'); 
      return; 
    }

    // Set saving state to prevent duplicates
    setSavingPost(true);

    try {
      // Upload image if provided
      let imageUrl = null;
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `post-${user.id}-${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('posts')
          .upload(fileName, imageFile, {
            cacheControl: '3600',
            upsert: true
          });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('posts')
          .getPublicUrl(fileName);
        
        imageUrl = publicUrl;
      }

      // Upload video if provided
      let videoUrl = null;
      if (videoFile) {
        const fileExt = videoFile.name.split('.').pop();
        const fileName = `post-${user.id}-${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('posts')
          .upload(fileName, videoFile, {
            cacheControl: '3600',
            upsert: true
          });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('posts')
          .getPublicUrl(fileName);
        
        videoUrl = publicUrl;
      }

      // Insert post with explicit field mapping
      const { error } = await supabase
        .from('posts')
        .insert({
          content: content,
          mood: mood,
          image_url: imageUrl,
          user_id: user.id
        });

      if (error) throw error;

      // Clear form state by calling the parent's reset (PostCreator handles this)
      // Refresh the posts list
      await fetchPosts();
      
    } catch (err) {
      console.error("Error creating post:", err);
      alert("Failed to create post: " + err.message);
    } finally {
      setSavingPost(false);
    }
  };

  const toggleSave = async (postId) => {
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
    if (authError || !authUser) {
      alert("Not authenticated!");
      return;
    }

    const { data: existing } = await supabase
      .from('saved_posts')
      .select('*')
      .eq('user_id', authUser.id)
      .eq('post_id', postId)
      .single();

    if (existing) {
      await supabase
        .from('saved_posts')
        .delete()
        .eq('user_id', authUser.id)
        .eq('post_id', postId);
      setSavedPosts(prev => prev.filter(id => id !== postId));
    } else {
      await supabase
        .from('saved_posts')
        .insert({ user_id: authUser.id, post_id: postId });
      setSavedPosts(prev => [...prev, postId]);
    }
  };

  const downloadPost = async (post) => {
    if (post.image_url) {
      const link = document.createElement('a');
      link.href = post.image_url;
      link.download = `she-wolf-post-${post.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (post.video_url) {
      const link = document.createElement('a');
      link.href = post.video_url;
      link.download = `she-wolf-post-${post.id}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const sidebarButtons = [
    { id: 'post', label: 'Post', icon: Camera, emoji: '📸' },
    { id: 'friends', label: 'Friends', icon: Users, emoji: '🌺' },
    { id: 'profile', label: 'Profile', icon: User, emoji: '💗' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-200 via-purple-100 to-pink-300">
        <div className="text-4xl" style={{ fontFamily: "'Cherry Bomb One', cursive" }}>Loading... ✨</div>
      </div>
    );
  }

  if (!user) {
    return <LoginSignup />;
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Sparkly Pink & Purple Cityscape Background */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: backgroundImage,
          backgroundAttachment: 'fixed'
        }}
      />
      {/* Pink overlay for readability */}
      <div className="fixed inset-0 z-0 bg-pink-100/40" />

      {/* Decorative sparkles */}
      <div className="fixed inset-0 z-0 opacity-30" style={{
        backgroundImage: `
          url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0 L35 25 L60 30 L35 35 L30 60 L25 35 L0 30 L25 25 Z' fill='%23fff' fill-opacity='0.3'/%3E%3C/svg%3E")
        `,
        backgroundSize: '60px 60px'
      }} />
      {/* Floating sparkles */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {sparkles.map(sparkle => (
          <span
            key={sparkle.id}
            className="absolute animate-float"
            style={{
              top: `${sparkle.top}%`,
              left: `${sparkle.left}%`,
              fontSize: `${sparkle.size * 1.5}px`,
              animationDelay: `${sparkle.delay}s`,
              animationDuration: `${sparkle.duration}s`,
              color: sparkle.color,
              opacity: 0.9,
              filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.8)) drop-shadow(0 0 8px rgba(255,105,180,0.6))'
            }}
          >
            ✦
          </span>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex min-h-screen">
        {/* Mobile Hamburger Menu Button */}
        <div className="lg:hidden fixed top-4 right-4 z-50">
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="p-3 bg-white/90 backdrop-blur-md rounded-full border-4 border-pink-300 shadow-lg hover:shadow-xl transition-all"
            style={{ boxShadow: '0 0 10px #ff69b4' }}
          >
            <Menu size={28} className="text-pink-600" />
          </button>
        </div>

        {/* Mobile Slide-out Menu */}
        <AnimatePresence>
          {showMobileMenu && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                onClick={() => setShowMobileMenu(false)}
              />
              {/* Menu Panel */}
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed top-0 left-0 h-full w-80 bg-lavender/90 backdrop-blur-md z-50 lg:hidden flex flex-col items-center gap-6 p-6 pt-20"
                style={{ backgroundColor: 'rgba(230, 230, 250, 0.95)' }}
              >
                {/* Logo */}
                <div className="mb-4">
                  <div className="w-20 h-20 rounded-full border-4 border-pink-500 shadow-lg flex items-center justify-center" style={{
                    boxShadow: '0 0 10px #ff69b4, 0 0 20px #ff69b4, 0 0 30px #ff69b4, 0 0 40px #ff69b4'
                  }}>
                    <span className="text-3xl">🐺</span>
                  </div>
                </div>

                {/* Navigation Buttons */}
                {sidebarButtons.map((btn) => {
                  const Icon = btn.icon;
                  const isActive = activeTab === btn.id;
                  return (
                    <motion.button
                      key={btn.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setActiveTab(btn.id);
                        setShowMobileMenu(false);
                      }}
                      className={`w-full py-4 px-6 rounded-full font-bold text-lg transition-all border-4 ${
                        isActive
                          ? 'bg-gradient-to-r from-pink-300 to-pink-400 border-white shadow-lg scale-105'
                          : 'bg-white/60 border-pink-200 hover:bg-pink-100'
                      }`}
                      style={{
                        boxShadow: '0 4px 15px rgba(236, 72, 153, 0.2)',
                        fontFamily: "'Cherry Bomb One', cursive"
                      }}
                    >
                      <div className="flex items-center justify-center gap-3">
                        <Icon size={24} />
                        <span>{btn.emoji} {btn.label}</span>
                      </div>
                    </motion.button>
                  );
                })}
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Desktop Sidebar */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="hidden lg:flex flex-col items-center gap-6 p-6 w-64 bg-white/80 backdrop-blur-md border-r-4 border-white shadow-xl"
        >
          {/* Logo */}
          <div className="mb-8">
            <div className="w-24 h-24 rounded-full border-4 border-pink-500 shadow-lg flex items-center justify-center" style={{
              boxShadow: '0 0 10px #ff69b4, 0 0 20px #ff69b4, 0 0 30px #ff69b4, 0 0 40px #ff69b4'
            }}>
              <span className="text-4xl">🐺</span>
            </div>
          </div>

          {/* Navigation Buttons */}
          {sidebarButtons.map((btn) => {
            const Icon = btn.icon;
            const isActive = activeTab === btn.id;
            return (
              <motion.button
                key={btn.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(btn.id)}
                className={`w-full py-4 px-6 rounded-full font-bold text-lg transition-all border-4 ${
                  isActive
                    ? 'bg-gradient-to-r from-pink-300 to-pink-400 border-white shadow-lg scale-105'
                    : 'bg-white/60 border-pink-200 hover:bg-pink-100'
                }`}
                style={{
                  boxShadow: '0 4px 15px rgba(236, 72, 153, 0.2)',
                  fontFamily: "'Cherry Bomb One', cursive"
                }}
              >
                <div className="flex items-center justify-center gap-3">
                  <Icon size={24} />
                  <span>{btn.emoji} {btn.label}</span>
                </div>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Content Area */}
        <div className="flex-1 p-8 overflow-y-auto">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-4xl mx-auto relative"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-5xl md:text-6xl text-pink-600 mb-2 drop-shadow-md neon-text" style={{ fontFamily: "'Cherry Bomb One', cursive" }}>
                She-Wolf Pack
              </h1>
              <p className="text-2xl text-pink-700">Our own private place to embarrass ourselves🤣</p>
            </div>

            {/* Tab Content */}
            {activeTab === 'post' && (
              <div className="space-y-6">
                {/* Post Creator */}
                <PostCreator onSubmit={handleCreatePost} currentUser={profile} savingPost={savingPost} />

                {/* Posts Feed */}
                {posts.map((post) => (
                  <MoodBubble key={post.id} className="mb-6">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-full border-4 border-pink-500 shadow-lg overflow-hidden" style={{
                        boxShadow: '0 0 10px #ff69b4, 0 0 20px #ff69b4, 0 0 30px #ff69b4, 0 0 40px #ff69b4'
                      }}>
                        {post.profiles?.avatar_url ? (
                          <img src={post.profiles.avatar_url} alt={post.profiles.display_name || post.profiles.username} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-pink-200 flex items-center justify-center text-2xl">👧</div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h3 className="text-xl font-bold text-pink-600">
                              {post.profiles?.display_name || post.profiles?.username || 'Anonymous'}
                            </h3>
                            {post.mood && (
                              <span className="text-sm text-pink-500">{post.mood}</span>
                            )}
                          </div>
                          <HeartSaveButton
                            isSaved={savedPosts.includes(post.id)}
                            onToggle={() => toggleSave(post.id)}
                            onDownload={downloadPost}
                            size="small"
                            post={post}
                          />
                        </div>
                        <p className="text-gray-700 text-lg mb-3">{post.content}</p>

                        {/* Media Display */}
                        {post.image_url && (
                          <img src={post.image_url} alt="Post" className="w-full rounded-2xl border-4 border-pink-200 mb-3" />
                        )}
                        {post.video_url && (
                          <video src={post.video_url} controls className="w-full rounded-2xl border-4 border-pink-200 mb-3" />
                        )}

                        <p className="text-sm text-gray-400 mb-3">
                          {new Date(post.created_at).toLocaleDateString()}
                        </p>

                        {/* Comments Section Toggle */}
                        <button
                          onClick={() => setExpandedComments(prev => ({ ...prev, [post.id]: !prev[post.id] }))}
                          className="text-pink-600 font-bold text-sm hover:underline"
                        >
                          {expandedComments[post.id] ? 'Hide Comments' : `Show Comments`}
                        </button>

                        {/* Comments */}
                        {expandedComments[post.id] && <Comments postId={post.id} />}
                      </div>
                    </div>
                  </MoodBubble>
                ))}
              </div>
            )}

            {activeTab === 'friends' && (
              <div className="space-y-4">
                {/* Header */}
                <div className="text-center mb-6">
                  <h2 className="text-5xl text-pink-600 mb-4 neon-text" style={{ fontFamily: "'Cherry Bomb One', cursive" }}>Friends</h2>
                  
                  {/* Search Bar */}
                  <div className="max-w-xl mx-auto">
                    <input
                      type="text"
                      placeholder="Search for friends..."
                      className="w-full p-4 rounded-full border-4 border-pink-300 bg-white/80 focus:outline-none focus:ring-4 focus:ring-pink-300 text-pink-700"
                      style={{ fontFamily: "'Cherry Bomb One', cursive" }}
                    />
                  </div>
                </div>

                {/* Existing Friends Section */}
                <div className="max-w-2xl mx-auto">
                  <h3 className="text-2xl font-bold text-pink-600 mb-4" style={{ fontFamily: "'Cherry Bomb One', cursive" }}>Existing Friends</h3>
                  
                  {friends.length === 0 ? (
                    <MoodBubble className="text-center py-8 border-4 border-pink-300">
                      <p className="text-xl text-pink-600">No friends yet! Start connecting to build your pack 🌺</p>
                    </MoodBubble>
                  ) : (
                    <div className="space-y-4">
                      {friends.map((friend) => (
                        <MoodBubble key={friend.friend_id} className="flex items-center gap-4 border-4 border-pink-300">
                          <div className="w-24 h-24 rounded-full border-4 border-pink-500 shadow-lg overflow-hidden" style={{
                            boxShadow: '0 0 10px #ff69b4, 0 0 20px #ff69b4, 0 0 30px #ff69b4, 0 0 40px #ff69b4'
                          }}>
                            {friend.profiles?.avatar_url ? (
                              <img src={friend.profiles.avatar_url} alt={friend.profiles.display_name || friend.profiles.username} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full bg-pink-200 flex items-center justify-center text-2xl">👧</div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-pink-600">
                              {friend.profiles?.display_name || friend.profiles?.username}
                            </h3>
                            <p className="text-pink-500">@{friend.profiles?.username}</p>
                          </div>
                          {friend.profiles?.status && (
                            <div className="flex items-center gap-2 bg-yellow-100 border-4 border-yellow-300 px-4 py-2 rounded-full">
                              <img src="/assets/image_7.png" alt="Gold Star" className="w-6 h-6" />
                              <span className="text-yellow-800 font-bold">{friend.profiles.status}</span>
                            </div>
                          )}
                        </MoodBubble>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="max-w-2xl mx-auto">
                {showProfileEdit ? (
                  <MoodBubble>
                    <form className="space-y-6">
                      <div className="flex items-center gap-6">
                        <div className="relative">
                          <div className="w-32 h-32 rounded-full border-4 border-pink-500 shadow-lg overflow-hidden" style={{
                            boxShadow: '0 0 10px #ff69b4, 0 0 20px #ff69b4, 0 0 30px #ff69b4, 0 0 40px #ff69b4'
                          }}>
                            {profile.avatar_url ? (
                              <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full bg-pink-200 flex items-center justify-center text-5xl">👧</div>
                            )}
                          </div>
                          <label className="absolute bottom-0 right-0 bg-pink-400 text-white p-2 rounded-full cursor-pointer border-4 border-white shadow-lg">
                            <Camera size={20} />
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleAvatarUpload}
                              className="hidden"
                            />
                          </label>
                        </div>
                        <div className="flex-1 space-y-4">
                          <div>
                            <label className="block text-pink-600 font-bold mb-1">Username</label>
                            <input
                              type="text"
                              value={editingProfile.username}
                              onChange={(e) => setEditingProfile({ ...editingProfile, username: e.target.value })}
                              className="w-full p-3 rounded-xl border-4 border-pink-200 bg-white/50 focus:outline-none focus:ring-4 focus:ring-pink-300"
                              style={{ fontFamily: "'Cherry Bomb One', cursive" }}
                            />
                          </div>
                          <div>
                            <label className="block text-pink-600 font-bold mb-1">Display Name</label>
                            <input
                              type="text"
                              value={editingProfile.display_name}
                              onChange={(e) => setEditingProfile({ ...editingProfile, display_name: e.target.value })}
                              className="w-full p-3 rounded-xl border-4 border-pink-200 bg-white/50 focus:outline-none focus:ring-4 focus:ring-pink-300"
                              style={{ fontFamily: "'Cherry Bomb One', cursive" }}
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-pink-600 font-bold mb-1">Bio</label>
                        <textarea
                          value={editingProfile.bio}
                          onChange={(e) => setEditingProfile({ ...editingProfile, bio: e.target.value })}
                          className="w-full p-3 rounded-xl border-4 border-pink-200 bg-white/50 resize-none focus:outline-none focus:ring-4 focus:ring-pink-300"
                          rows={3}
                          style={{ fontFamily: "'Cherry Bomb One', cursive" }}
                        />
                      </div>
                      <div className="flex gap-3 justify-end">
                        <button
                          type="button"
                          onClick={() => setShowProfileEdit(false)}
                          className="px-6 py-2 bg-gray-300 text-gray-700 rounded-full font-bold border-4 border-white shadow-lg hover:shadow-xl transition-shadow"
                        >
                          <X size={20} className="inline mr-2" /> Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleProfileUpdate}
                          disabled={savingProfile}
                          className={`px-6 py-2 rounded-full font-bold border-4 border-white shadow-lg hover:shadow-xl transition-shadow ${
                            savingProfile
                              ? 'bg-gray-400 text-white cursor-not-allowed'
                              : 'bg-gradient-to-r from-pink-400 to-pink-500 text-white'
                          }`}
                        >
                          <Save size={20} className="inline mr-2" />
                          {savingProfile ? 'Saving...' : 'Save'}
                        </button>
                      </div>
                    </form>
                  </MoodBubble>
                ) : (
                  <div className="text-center">
                    {profile.background_url && (
                      <div 
                        className="w-full h-48 rounded-t-3xl bg-cover bg-center mb-6"
                        style={{ backgroundImage: `url(${profile.background_url})` }}
                      />
                    )}
                    <div className="flex justify-center mb-8">
                    <div className="w-32 h-32 rounded-full border-4 border-pink-500 shadow-lg overflow-hidden" style={{
                      boxShadow: '0 0 10px #ff69b4, 0 0 20px #ff69b4, 0 0 30px #ff69b4, 0 0 40px #ff69b4'
                    }}>
                      {profile.avatar_url ? (
                        <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-pink-200 flex items-center justify-center text-5xl">👧</div>
                      )}
                    </div>
                    </div>
                    <h2 className="text-4xl text-pink-600 mb-2" style={{ fontFamily: "'Cherry Bomb One', cursive" }}>
                      {profile.display_name || profile.username || 'My Profile'}
                    </h2>
                    <p className="text-xl text-pink-700 mb-4">@{profile.username}</p>
                    <p className="text-lg text-gray-700 mb-6">{profile.bio || 'No bio yet... add one!'}</p>
                    <div className="flex gap-3 justify-center">
                      <button
                        onClick={() => setShowProfileEdit(true)}
                        className="px-8 py-3 bg-gradient-to-r from-pink-400 to-pink-500 text-white rounded-full font-bold border-4 border-white shadow-lg hover:shadow-xl transition-shadow"
                      >
                        <Edit2 size={20} className="inline mr-2" /> Edit Profile
                      </button>
                      <input
                        ref={backgroundInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleBackgroundUpload}
                        className="hidden"
                      />
                      <button
                        onClick={() => backgroundInputRef.current?.click()}
                        className="px-8 py-3 bg-gradient-to-r from-purple-400 to-purple-500 text-white rounded-full font-bold border-4 border-white shadow-lg hover:shadow-xl transition-shadow"
                      >
                        <Camera size={20} className="inline mr-2" /> Customize Background
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Signature */}
      <div
        className="fixed bottom-4 right-4 text-xl font-bold"
        style={{ 
          color: '#701a75',
          fontFamily: "'Cherry Bomb One', cursive",
          textShadow: '0 0 3px #a855f7, 0 0 6px #a855f7, 0 0 9px #a855f7',
          filter: 'drop-shadow(0 0 2px #a855f7) drop-shadow(0 0 4px #a855f7) drop-shadow(0 0 6px #a855f7)'
        }}
      >
        made by Malena
      </div>
    </div>
  );
}

export default App;