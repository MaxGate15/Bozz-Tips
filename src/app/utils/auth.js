// utils/auth.js

export const saveToken = (token) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
  }
};

export function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

export const removeToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
  }
};

export const saveUsername = (username) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('username', username);
  }
};

export const getUsername = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('username');
};

export const removeUsername = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('username');
  }
};

export function isAuthenticated() {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('token');
}

export const saveIsAuthenticated = (isAuthenticated) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('isAuthenticated', isAuthenticated);
  }
};

export const removeIsAuthenticated = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('isAuthenticated');
  }
};



