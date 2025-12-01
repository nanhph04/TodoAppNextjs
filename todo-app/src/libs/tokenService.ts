// src/libs/tokenService.ts

export function getAccessToken(): string {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('accessToken') || '';
    }
    return '';
}

export function setAccessToken(token: string) {
    if (typeof window !== 'undefined') {
        if (token) {
            localStorage.setItem('accessToken', token);
        } else {
            localStorage.removeItem('accessToken');
        }
    }
}

export function removeAccessToken() {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
    }
}
