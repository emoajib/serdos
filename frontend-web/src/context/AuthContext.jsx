import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Vetted by AI - Manual Review Required by Senior Engineer/Manager
 *
 * Risk Assessment:
 * - Token is stored in localStorage (XSS risk). For high-security environments,
 *   use httpOnly cookies with Sanctum stateful auth instead.
 * - Stale tokens are automatically cleared on 401 response from /me.
 *
 * Technical Assumptions:
 * - Backend runs on same origin (via Vite proxy or Laravel public/).
 * - Sanctum returns user role in both login and /me responses.
 */

const AuthContext = createContext(null);

const API_BASE = '/api/v1';

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [token,   setToken]   = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(!!localStorage.getItem('token')); // verify on mount
  const navigate = useNavigate();

  /**
   * Verify stored token by calling /me on mount.
   * Clears stale tokens automatically.
   */
  const verifyToken = useCallback(async (storedToken) => {
    try {
      const response = await fetch(`${API_BASE}/me`, {
        headers: {
          'Authorization': `Bearer ${storedToken}`,
          'Accept':        'application/json',
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData.user); // ✅ FIX: Ambil objek user di dalam response
      } else {
        // Token expired or invalid (401) — clean up local session
        console.warn('AUTH_SESSION_INVALID:', response.status);
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      }
    } catch (err) {
      console.error('AUTH_VERIFY_NETWORK_ERROR:', err);
      // Keep token for retry on next activity, but don't set user
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token && !user) {
      verifyToken(token);
    } else {
      setLoading(false);
    }
  }, [token, user, verifyToken]);

  /**
   * Authenticate user against the backend and persist Sanctum token.
   */
  const login = async (email, password, captchaId, captchaAnswer) => {
    try {
      const response = await fetch(`${API_BASE}/login`, {
        method:  'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept':       'application/json',
        },
        body: JSON.stringify({ email, password, captcha_id: captchaId, captcha_answer: parseInt(captchaAnswer) }),
      });

      const data = await response.json();

      if (response.ok) {
        const token = data.access_token; // ✅ FIX: Gunakan access_token dari Laravel
        localStorage.setItem('token', token);
        setToken(token);
        setUser(data.user);
        return { success: true, user_type: data.user.user_type }; // ✅ FIX: Gunakan user_type
      }

      return { success: false, message: data.message || 'Login gagal.' };
    } catch {
      return { success: false, message: 'Tidak dapat terhubung ke server. Coba lagi.' };
    }
  };

  /**
   * Fetch a new CAPTCHA challenge from the backend.
   */
  const getCaptcha = async () => {
    try {
      const response = await fetch(`${API_BASE}/captcha`, {
        headers: {
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        return await response.json();
      }

      throw new Error('Failed to fetch CAPTCHA');
    } catch {
      return null;
    }
  };

  /**
   * Revoke token on backend then clear local state.
   */
  const logout = async () => {
    try {
      if (token) {
        await fetch(`${API_BASE}/logout`, {
          method:  'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept':        'application/json',
          },
        });
      }
    } catch {
      // Silently fail — local cleanup always runs
    } finally {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      navigate('/login');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        getCaptcha,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

