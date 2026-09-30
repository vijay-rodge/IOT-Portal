import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api, setAccessToken } from '../services/api';

export const OAuthCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { refreshUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const completeOAuth = async () => {
      if (token) {
        setAccessToken(token);
        await refreshUser();
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/login?error=Google_authentication_failed', { replace: true });
      }
    };

    completeOAuth();
  }, [token]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
      <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
        Completing Google authentication...
      </p>
    </div>
  );
};
