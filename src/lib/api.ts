const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';

function getToken() {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('token') || '';
}

export async function apiGet(path: string, auth = false) {
  return fetch(API_URL + path, {
    headers: auth ? { Authorization: `Bearer ${getToken()}` } : {}
  }).then(r => r.json());
}

export async function apiPost(path: string, data?: any, auth = false) {
  return fetch(API_URL + path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(auth ? { Authorization: `Bearer ${getToken()}` } : {})
    },
    body: data ? JSON.stringify(data) : undefined,
  }).then(r => r.json());
}

export async function apiPut(path: string, data?: any, auth = false) {
  return fetch(API_URL + path, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(auth ? { Authorization: `Bearer ${getToken()}` } : {})
    },
    body: data ? JSON.stringify(data) : undefined,
  }).then(r => r.json());
}

export async function apiDelete(path: string, auth = false) {
  return fetch(API_URL + path, {
    method: 'DELETE',
    headers: auth ? { Authorization: `Bearer ${getToken()}` } : {},
  }).then(r => r.json());
}
