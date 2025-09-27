'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../components/AuthContext';
import { useRouter } from 'next/navigation';
import LoginForm from '../../components/LoginForm';
import SignupForm from '../../components/SignupForm';
import { BookOpen, Sparkles } from 'lucide-react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !isLoading) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-2xl mr-4">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Book Heaven
              </h1>
              <p className="text-sm text-gray-500">Calm reads, boundless stories</p>
            </div>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Your Gateway to{' '}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Infinite Stories
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Join thousands of readers discovering new worlds through our carefully curated collection of books. 
            Sign up to start your reading journey today.
          </p>
          
          <div className="flex items-center justify-center lg:justify-start space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <Sparkles className="w-4 h-4 text-blue-500 mr-2" />
              <span>Unlimited Access</span>
            </div>
            <div className="flex items-center">
              <Sparkles className="w-4 h-4 text-blue-500 mr-2" />
              <span>Audio Narration</span>
            </div>
            <div className="flex items-center">
              <Sparkles className="w-4 h-4 text-blue-500 mr-2" />
              <span>Offline Reading</span>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Forms */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 lg:p-10">
          {isLogin ? (
            <LoginForm onSwitchToSignup={() => setIsLogin(false)} />
          ) : (
            <SignupForm onSwitchToLogin={() => setIsLogin(true)} />
          )}
        </div>
      </div>
    </div>
  );
}
