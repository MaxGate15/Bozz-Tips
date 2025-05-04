// utils/auth.js
export const saveToken = (token) => localStorage.setItem('token', token);
export const getToken = () => localStorage.getItem('token');
export const removeToken = () => localStorage.removeItem('token');

export const saveEmail = (email) => localStorage.setItem('email', email);
export const getEmail = () => localStorage.getItem('email');
export const removeEmail = () => localStorage.removeItem('email');

export const isAuthenticated = () => !!getToken();
export const saveIsAuthenticated = (isAuthenticated) => localStorage.setItem('isAuthenticated', isAuthenticated);
export const removeIsAuthenticated = () => localStorage.removeItem('isAuthenticated');



