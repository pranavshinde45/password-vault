const CryptoJS = require('crypto-js');

const deriveKey = (password) => {
  if (!password || password.length === 0) {
    console.warn('Invalid password for key derivation—returning null key'); // Debug
    return null;
  }
  return CryptoJS.PBKDF2(password, 'fixed-salt-for-mvp', {
    keySize: 256 / 32,
    iterations: 1000
  });
};

export const encrypt = (text, password) => {
  if (!text || !password || password.length === 0) return ''; // ✅ Safe fallback
  const key = deriveKey(password);
  if (!key) return ''; // ✅ No crash
  return CryptoJS.AES.encrypt(text, key).toString();
};

export const decrypt = (ciphertext, password) => {
  if (!ciphertext || !password || password.length === 0) return ''; // ✅ Safe fallback
  const key = deriveKey(password);
  if (!key) return ''; // ✅ No crash
  const bytes = CryptoJS.AES.decrypt(ciphertext, key);
  return bytes.toString(CryptoJS.enc.Utf8);
};