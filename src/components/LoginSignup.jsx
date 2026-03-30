import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const LoginSignup = () => {
  const { signIn, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) throw error;
      } else {
        if (!username.trim()) {
          throw new Error('Username is required');
        }
        const { error } = await signUp(email, password, username);
        if (error) throw error;
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-300 via-purple-200 to-pink-400 p-4">
      {/* Sparkle background */}
      <div className="fixed inset-0 opacity-20" style={{
        backgroundImage: `
          url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0 L35 25 L60 30 L35 35 L30 60 L25 35 L0 30 L25 25 Z' fill='%23fff' fill-opacity='0.5'/%3E%3C/svg%3E")
        `,
        backgroundSize: '60px 60px'
      }} />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-32 h-32 rounded-full border-4 border-pink-500 shadow-lg flex items-center justify-center" style={{
            boxShadow: '0 0 10px #ff69b4, 0 0 20px #ff69b4, 0 0 30px #ff69b4, 0 0 40px #ff69b4'
          }}>
            <span className="text-5xl">🐺</span>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-5xl text-pink-600 mb-2" style={{ fontFamily: "'Cherry Bomb One', cursive" }}>
            She-Wolf Pack
          </h1>
          <p className="text-xl text-pink-700">✨Log-in to stay updated on our shenanigans.✨</p>
        </div>

        {/* Auth Card */}
        <div
          className="bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-2xl border-4 border-pink-200"
          style={{ boxShadow: '0 10px 40px rgba(236, 72, 153, 0.3)' }}
        >
          <h2 className="text-3xl text-pink-600 text-center mb-6" style={{ fontFamily: "'Cherry Bomb One', cursive" }}>
            {isLogin ? 'Welcome Back! 💖' : 'Join the Pack! 🌺'}
          </h2>

          {error && (
            <div className="bg-pink-100 border-4 border-pink-300 text-pink-800 px-4 py-3 rounded-full mb-4 text-center font-bold">
              {error.includes('rate limit') || error.includes('security') || error.includes('429') ? (
                <span>🐾 The pack is busy! Try again in a minute 🐾</span>
              ) : (
                error
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label className="block text-pink-600 font-bold mb-2">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-4 rounded-xl border-4 border-pink-200 bg-white/60 focus:outline-none focus:ring-4 focus:ring-pink-300 text-lg"
                  style={{ fontFamily: "'Cherry Bomb One', cursive" }}
                  placeholder="cutie123"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-pink-600 font-bold mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 rounded-xl border-4 border-pink-200 bg-white/60 focus:outline-none focus:ring-4 focus:ring-pink-300 text-lg"
                style={{ fontFamily: "'Cherry Bomb One', cursive" }}
                placeholder="sparkle@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-pink-600 font-bold mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 rounded-xl border-4 border-pink-200 bg-white/60 focus:outline-none focus:ring-4 focus:ring-pink-300 text-lg"
                style={{ fontFamily: "'Cherry Bomb One', cursive" }}
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-pink-400 to-pink-500 text-white rounded-full font-bold text-xl border-4 border-white shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
              style={{ fontFamily: "'Cherry Bomb One', cursive" }}
            >
              {loading ? '✨ Loading...' : isLogin ? 'Sign In 💖' : 'Sign Up 🌺'}
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-pink-600">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                }}
                className="text-pink-800 font-bold underline hover:text-purple-700 transition-colors"
                style={{ fontFamily: "'Cherry Bomb One', cursive" }}
              >
                {isLogin ? 'Sign Up!' : 'Sign In!'}
              </button>
            </p>
          </div>
        </div>

        {/* Footer sparkle */}
        <div className="text-center mt-8 text-4xl">✨💕🌸💖🌺✨</div>
      </motion.div>
    </div>
  );
};

export default LoginSignup;