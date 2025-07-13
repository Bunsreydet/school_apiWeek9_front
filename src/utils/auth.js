import { jwtDecode } from 'jwt-decode';

export function isAuthenticated() {
    // Implement your authentication logic here
    const token = localStorage.getItem('accessToken');
    if (!token) {
        return null;
    }
    try {
        const decoded = jwtDecode(token);
        return decoded;
    } catch (err) {
        console.error("Error decoding token:", err);
        return null;
    }
}

export function setToken(token) {
    // implement your logic to set the token
    localStorage.setItem('accessToken', token);
}

export function logout() {
    // implement your logic to remove the token
    localStorage.removeItem('accessToken');
}