
/**
 * Shared Compatible Encryption Utility
 */

const KEY = 'frenix-v2-gateway-secure-payload';

export function encrypt(text: string): string {
    const data = encodeURIComponent(text);
    let result = '';
    for (let i = 0; i < data.length; i++) {
        result += String.fromCharCode(data.charCodeAt(i) ^ KEY.charCodeAt(i % KEY.length));
    }
    return btoa(result);
}

export function decrypt(encoded: string): string {
    try {
        const decoded = atob(encoded);
        let result = '';
        for (let i = 0; i < decoded.length; i++) {
            result += String.fromCharCode(decoded.charCodeAt(i) ^ KEY.charCodeAt(i % KEY.length));
        }
        return decodeURIComponent(result);
    } catch (e) {
        return encoded;
    }
}
