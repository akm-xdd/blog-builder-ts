// lib/utils/storage.js
export const getToken = () : string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

export const getUsername = () : string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('username');
};

export const setToken = (token : string ) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('token', token);
};

export const setUsername = (username : string) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('username', username);
};

export const clearAuth = () : void => {
  if (typeof window === 'undefined') return;
  localStorage.clear();
};